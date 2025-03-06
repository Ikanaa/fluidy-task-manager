import streamDeck, { action, KeyDownEvent, SingletonAction, WillAppearEvent } from "@elgato/streamdeck";
import { TaskFetcher } from "./task-fetcher";



@action({ UUID: "com.ikana.fluidy-task-manager.task-navigator" })
export class TaskNavigator extends SingletonAction<NavigatorSettings> {

    override onWillAppear(ev: WillAppearEvent<NavigatorSettings>): void | Promise<void> {
        return ev.action.setTitle(`Nav`);
    }

    override async onKeyDown(ev: KeyDownEvent<NavigatorSettings>): Promise<void> {


        let fetcher: any;
        streamDeck.actions.forEach((action) => {

            if (action.manifestId == "com.ikana.fluidy-task-manager.task-fetcher")
            {
                // streamDeck.logger.warn(`Testing : ${action.id} with ${ev.action.id}`);
                // streamDeck.logger.warn(action.id != ev.action.id);
                //fetcher = action.;

            }
        });

    }
}


type NavigatorSettings = {

};
