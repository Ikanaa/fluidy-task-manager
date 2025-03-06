import streamDeck, { action, JsonObject, KeyAction, KeyDownEvent, SingletonAction, WillAppearEvent } from "@elgato/streamdeck";
import { NotionService } from "../services/notion-service";


@action({ UUID: "com.ikana.fluidy-task-manager.task-fetcher" })
export class TaskFetcher extends SingletonAction<FetcherSettings> {

	private notionService = new NotionService();

	private TaskList : Array<string> = new Array<string>();
	private TaskHash : Map<string, TaskData> = new Map<string, TaskData>();
	private PublicTaskHash : Map<string, PublicTask> = new Map<string, PublicTask>();
	private ClientSettingsHash : Map<string, ClientSettings> = new Map<string, ClientSettings>();

	private DisplayArray : Array<DisplayWrapper> = new Array<DisplayWrapper>();

	private CLIENT_SETTINGS = "1f8cb586ecd04a9ea05eda6756758fad";
	private TACHE_PUBLIQUE = "b5f5a55597f144bdb11ce8e55aed261e";
	private TACHE_INTERNE = "97ce7b0b2f3d4b58a9956d9ca1475fa2";


	override onWillAppear(ev: WillAppearEvent<FetcherSettings>): void | Promise<void> {

		ev.payload.settings.isError = false;

		// Ensure that there is only one TaskFetcher enabled.
		streamDeck.actions.forEach((action) => {

			if (action.manifestId == "com.ikana.fluidy-task-manager.task-fetcher")
			{
				// streamDeck.logger.warn(`Testing : ${action.id} with ${ev.action.id}`);
				// streamDeck.logger.warn(action.id != ev.action.id);
				if (action.id != ev.action.id)
				{
					ev.payload.settings.isError = true;
				}
			}
		});

		if (ev.payload.settings.isError)
			return ev.action.setTitle(`ERROR !`);


		return ev.action.setTitle(`Fetch`);
	}

	override async onKeyDown(ev: KeyDownEvent<FetcherSettings>): Promise<void> {
		// // Update the count from the settings.
		// const { settings } = ev.payload;
		// settings.incrementBy ??= 1;
		// settings.count = (settings.count ?? 0) + settings.incrementBy;

		// // Update the current count in the action's settings, and change the title.
		// await ev.action.setSettings(settings);
		// await ev.action.setTitle(`${settings.count}`);

		this.TaskList = new Array<string>();
		this.TaskHash = new Map<string, TaskData>();
		this.PublicTaskHash  = new Map<string, PublicTask>();
		this.ClientSettingsHash  = new Map<string, ClientSettings>();
		this.DisplayArray = new Array<DisplayWrapper>();



		streamDeck.actions.forEach((action) => {
			
			if (action.manifestId == "com.ikana.fluidy-task-manager.task-display" && action.isKey())
			{
				const aDisplayWrapper = {
					trackedIndex: -1,
					display: action
				};
				this.DisplayArray.push(aDisplayWrapper);
			}
		});

		streamDeck.logger.info("DisplayArray : ");
		streamDeck.logger.info(this.DisplayArray.length);

		if (!this.notionService.isInitialized())
		{
			streamDeck.logger.info(`INITIALIZING NOTION`);
			try{
				this.notionService.initialize({ apiKey: ev.payload.settings.notionApiKey });
			}
			catch (error)
			{
				streamDeck.logger.warn(`ERRROR CONNECTING NOTION : ${error}`);
				return;
			}
		}
		
		const database_response = await this.notionService.queryDatabase(this.TACHE_INTERNE);
		const database_response_tache_public = await this.notionService.queryDatabase(this.TACHE_PUBLIQUE);
		const database_response_client_settings = await this.notionService.queryDatabase(this.CLIENT_SETTINGS);

		// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
		// ----------------------------------------------------------------------------------- Client Settings -----------------------------------------------------------------------------------
		// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

		database_response_client_settings.forEach((element: any) => {
			let aClientSettings: ClientSettings = {
				client: element.properties.Client.rich_text[0].plain_text,
				color: element.properties.Couleur.rich_text[0].plain_text
			};

			this.ClientSettingsHash.set(element.id, aClientSettings);
		});

		// -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
		// ----------------------------------------------------------------------------------- Tache Public ------------------------------------------------------------------------------------
		// -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

		database_response_tache_public.forEach((element : any) => {
			let aPublicTask: PublicTask = {
				name: element.properties.Nom.title[0].plain_text,
				idClientSettings: element.properties["Client settings"].relation.length > 0 ? element.properties["Client settings"].relation[0].id : null
			};
			
			this.PublicTaskHash.set(element.id, aPublicTask);
		});

		// -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
		// ----------------------------------------------------------------------------------- Tache Interne -----------------------------------------------------------------------------------
		// -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
		database_response.forEach((element: any) => {

			let aTask: TaskData = {
				name: element.properties.Name.title[0].plain_text,
				idPublicTask: element.properties["Tache publiques"].relation[0].id
			};

			streamDeck.logger.info(`Name : ${element.properties.Name.title[0].plain_text}`);
			// streamDeck.logger.info(`Responsable : `);
			element.properties.Responsable.people.forEach((person: any) => {

				if (aTask.responsable == null)
					aTask.responsable = [];
				aTask.responsable.push({
					id: person.id,
					name: person.name,
					email: person.person.email
				});

				// streamDeck.logger.info(`id          : ${person.id}`);
				// streamDeck.logger.info(`name        : ${person.name}`);
				// streamDeck.logger.info(`email       : ${person.person.email}`);
			});

			// "Tache publiques":{"id":"%5DG%3Er","type":"relation","relation":[{"id":"beaecd2c-7854-4b54-850b-99031f7a63f5"}]

			this.TaskHash.set(element.id, aTask);
			this.TaskList.push(element.id);
			

			// streamDeck.logger.info("task : PublicTask :");
			// const temp = this.PublicTaskHash.get(aTask.idPublicTask);
			// streamDeck.logger.info(temp);
			
			// streamDeck.logger.info("task : ClientSettings :");
			// streamDeck.logger.info(this.ClientSettingsHash.get(temp ? temp.idClientSettings : ""));
			
		});

		
		// streamDeck.logger.info("HASH : ");
		// this.TaskHash.forEach((value, key) => {
		// 	streamDeck.logger.info(`Key : ${key}`);
		// 	streamDeck.logger.info(`Value : ${value}`);
		// });

		// streamDeck.logger.info();

		// -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
		// ----------------------------------------------------------------------------------- Update Display -----------------------------------------------------------------------------------
		// -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

		this.DisplayArray.forEach((element, index) => {
			element.trackedIndex = index;
			element.display.setTitle(this.TaskHash.get(this.TaskList[index])?.name ?? "No Task");
		});
	}
}

type ResponsableTask = {
	id: string;
	name: string;
	email: string;
};

type TaskData = {
	name: string;
	responsable?: Array<ResponsableTask>;
	idPublicTask: string;
};

type PublicTask = {
	name: string;
	idClientSettings: string;
}

type ClientSettings = {
	client?: string;
	color?: string;
};

type DisplayWrapper = {
	trackedIndex: number;
	display: KeyAction;
}

type FetcherSettings = {
	isError: boolean;
	notionApiKey : string;
};
