import streamDeck, { action, KeyDownEvent, SingletonAction, WillAppearEvent } from "@elgato/streamdeck";
import { NotionService } from "../services/notion-service";


@action({ UUID: "com.ikana.fluidy-task-manager.task-fetcher" })
export class TaskFetcher extends SingletonAction<FetcherSettings> {

	private notionService = new NotionService();

	private TaskList : Array<TaskData> = [];

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

		database_response.forEach((element: any) => {

			let aTask: TaskData = {
				name: element.properties.Name.title[0].plain_text
			};

			streamDeck.logger.info(`Name : ${element.properties.Name.title[0].plain_text}`);
			streamDeck.logger.info(`Responsable : `);
			element.properties.Responsable.people.forEach((person: any) => {
				
				if (aTask.responsable == null)
					aTask.responsable = [];
				aTask.responsable.push({
					id: person.id,
					name: person.name,
					email: person.person.email
				});
				
				streamDeck.logger.info(`id          : ${person.id}`);
				streamDeck.logger.info(`name        : ${person.name}`);
				streamDeck.logger.info(`email       : ${person.person.email}`);
			});
			streamDeck.logger.info(`_`);
		});

		
		// streamDeck.logger.info();
	}
}

type ResponsableTask = {
	id: string;
	name: string;
	email: string;
};

type TaskData = {
	name?: string;
	responsable?: Array<ResponsableTask>;
};

type FetcherSettings = {
	isError: boolean;
	notionApiKey : string;
};
