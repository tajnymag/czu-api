import * as xlsx from 'xlsx';
import { Timetable, TimetableEvent } from '../timetable';
import { getClosestDate, parseCzuDate } from '../czu-fns';
import allRooms from './rooms.cache.json';

class Room {
	id: string;
	name: string;
	events: TimetableEvent[];

	constructor(id: string, name: string, events: TimetableEvent[] = []) {
		this.id = id;
		this.name = name;
		this.events = events;
	}
}

export class RoomSchedule {
	private events: TimetableEvent[];
	private rooms: Map<string, Room>;

	constructor(rooms?: Map<string, Room>) {
		if (rooms) {
			this.rooms = rooms;
		} else {
			this.rooms = new Map<string, Room>();
		}
	}

	static fromHtml(html: string): RoomSchedule {
		const events = Timetable.fromHtml(html).events;
		const rooms = new Map<string, Room>();
		console.log(events);
		for (const timetableEvent of events) {
			if (!rooms.has(timetableEvent.location)) {
				const roomFromCache = allRooms.find(room => room.name === timetableEvent.location);
				rooms.set(timetableEvent.location, new Room(roomFromCache.id, roomFromCache.name) );
			}

			const room = rooms.get(timetableEvent.location);
			room.events.push(timetableEvent);
		}

		return new RoomSchedule(rooms);
	}

	findEmptyRooms() {
		const emptyRooms = [];

		for (const room of allRooms) {
			if (!this.rooms.has(room.name)) {
				emptyRooms.push(room);
			}
		}

		return emptyRooms;
	}
}
