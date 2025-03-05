import streamDeck, { action, KeyDownEvent, SingletonAction, WillAppearEvent } from "@elgato/streamdeck";


@action({ UUID: "com.ikana.fluidy-task-manager.task-fetcher" })
export class TaskFetcher extends SingletonAction<FetcherSettings> {


	override onWillAppear(ev: WillAppearEvent<FetcherSettings>): void | Promise<void> {

		ev.payload.settings.isError = false;

		// Ensure that there is only one TaskFetcher enabled.
		streamDeck.actions.forEach((action) => {

			if (action.manifestId == "com.ikana.fluidy-task-manager.task-fetcher")
			{
				streamDeck.logger.warn(`Testing : ${action.id} with ${ev.action.id}`);
				streamDeck.logger.warn(action.id != ev.action.id);
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
		

	}
}


type FetcherSettings = {
	isError: boolean;
	notionApiKey : string;
};
