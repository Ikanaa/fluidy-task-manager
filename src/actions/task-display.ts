import { action, KeyDownEvent, SingletonAction, WillAppearEvent } from "@elgato/streamdeck";



@action({ UUID: "com.ikana.fluidy-task-manager.task-display" })
export class TaskDisplay extends SingletonAction<DisplaySettings> {

	override onWillAppear(ev: WillAppearEvent<DisplaySettings>): void | Promise<void> {
		return ev.action.setTitle(`No Task`);
	}

	override async onKeyDown(ev: KeyDownEvent<DisplaySettings>): Promise<void> {
		// TODO Select Task.
		// const { settings } = ev.payload;
		
	}
}


type DisplaySettings = {

};
