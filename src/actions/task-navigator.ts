import streamDeck, { action, KeyDownEvent, SingletonAction, WillAppearEvent } from "@elgato/streamdeck";
import { TaskFetcher } from "./task-fetcher";



@action({ UUID: "com.ikana.fluidy-task-manager.task-navigator" })
export class TaskNavigator extends SingletonAction<NavigatorSettings> {

    override onWillAppear(ev: WillAppearEvent<NavigatorSettings>): void | Promise<void> {
        return ev.action.setTitle(`Nav`);
    }

    override async onKeyDown(ev: KeyDownEvent<NavigatorSettings>): Promise<void> {

        const fetcher = TaskFetcher.getInstance();
        if (fetcher)
            fetcher.NextTaskOnAllDisplays();
        else
            streamDeck.logger.error("No TaskFetcher found");
    }
}


type NavigatorSettings = {

};
