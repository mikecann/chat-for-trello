import { FileHelpers } from "./FileHelpers";

export interface Update {
    date: string;
    version: string;
    notes: string;
}

export class UpdatesLoader {
    loadLatest(): Promise<Update> {
        return new FileHelpers()
            .loadJson<Update[]>("data/updates.json")
            .then(updates => this.loadUpdateNotes(updates[0]));
    }

    load(): Promise<Update[]> {
        return new FileHelpers()
            .loadJson<Update[]>("data/updates.json")
            .then(updates => Promise.all(updates.map(u => this.loadUpdateNotes(u))));
    }

    loadUpdateNotes(update: Update): Promise<Update> {
        return new FileHelpers().load("data/" + update.notes).then(notes => {
            update.notes = notes;
            return update;
        });
    }
}
