import { action, KeyDownEvent, SingletonAction, WillAppearEvent } from "@elgato/streamdeck";



@action({ UUID: "com.ikana.fluidy-task-manager.task-display" })
export class TaskDisplay extends SingletonAction<DisplaySettings> {

	override onWillAppear(ev: WillAppearEvent<DisplaySettings>): void | Promise<void> {
		return ev.action.setTitle(`No Task`);
	}

	override async onKeyDown(ev: KeyDownEvent<DisplaySettings>): Promise<void> {
		// // Update the count from the settings.
		// const { settings } = ev.payload;
		// settings.incrementBy ??= 1;
		// settings.count = (settings.count ?? 0) + settings.incrementBy;

		// // Update the current count in the action's settings, and change the title.
		// await ev.action.setSettings(settings);
		// await ev.action.setTitle(`${settings.count}`);
		
	}
}


type DisplaySettings = {

};
