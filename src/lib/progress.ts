/**
 * Lesson progress, kept in this browser only (localStorage).
 * Every access is wrapped so private windows or blocked storage just mean
 * "nothing done yet" instead of an error.
 */
const KEY = 'cse-progress';

function load(): Set<string> {
	try {
		const raw = localStorage.getItem(KEY);
		return new Set(raw ? (JSON.parse(raw) as string[]) : []);
	} catch {
		return new Set();
	}
}

function save(done: Set<string>) {
	try {
		localStorage.setItem(KEY, JSON.stringify([...done]));
	} catch {
		/* storage unavailable: progress is not saved */
	}
}

export function isDone(id: string): boolean {
	return load().has(id);
}

export function setDone(id: string, value: boolean) {
	const done = load();
	if (value) done.add(id);
	else done.delete(id);
	save(done);
}

export function countDone(ids: string[]): number {
	const done = load();
	return ids.filter((id) => done.has(id)).length;
}
