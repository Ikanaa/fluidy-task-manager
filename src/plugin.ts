import streamDeck, { LogLevel } from "@elgato/streamdeck";

import { TaskDisplay } from "./actions/task-display";
import { TaskFetcher } from "./actions/task-fetcher";



// We can enable "trace" logging so that all messages between the Stream Deck, and the plugin are recorded. When storing sensitive information
streamDeck.logger.setLevel(LogLevel.TRACE);

// Register the increment action.
streamDeck.actions.registerAction(new TaskDisplay());
streamDeck.actions.registerAction(new TaskFetcher());

// Finally, connect to the Stream Deck.
streamDeck.connect();

