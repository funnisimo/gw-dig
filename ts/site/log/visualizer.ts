// import * as GWU from 'gw-utils/index';
// import * as GWM from 'gw-map';
// import { BuildData, BuildStep } from '../blueprint';
// import { Site } from '../site';
// import { Room } from '../types';
// import { Logger } from './logger';

// export class Visualizer implements Logger {
//     dest: GWU.canvas.Buffer;
//     io: GWU.io.Loop;

//     constructor(
//         dest: GWU.canvas.BaseCanvas | GWU.canvas.Buffer,
//         io?: GWU.io.Loop
//     ) {
//         this.dest = dest instanceof GWU.canvas.BaseCanvas ? dest.buffer : dest;
//         this.io = io || GWU.loop;
//     }

//     async onDigFirstRoom(site: Site): Promise<any> {
//         site.drawInto(this.dest);
//         this.dest.drawText(0, 0, 'First Room', 'yellow');
//         this.dest.render();
//         await this.io.nextKeyPress();
//     }

//     async onRoomCandidate(room: Room, roomSite: Site): Promise<any> {
//         roomSite.drawInto(this.dest);
//         this.dest.drawText(0, 0, 'Room Candidate', 'yellow');
//         if (room.doors) {
//             room.doors.forEach((loc) => {
//                 if (!loc || loc[0] < 0) return;
//                 this.dest.drawSprite(
//                     loc[0],
//                     loc[1],
//                     GWM.tile.tiles.DOOR.sprite
//                 );
//             });
//         }
//         if (room.hall && room.hall.doors) {
//             room.hall.doors.forEach((loc) => {
//                 if (!loc || loc[0] < 0) return;
//                 this.dest.drawSprite(
//                     loc[0],
//                     loc[1],
//                     GWM.tile.tiles.DOOR.sprite
//                 );
//             });
//         }
//         this.dest.render();
//         await this.io.nextKeyPress();
//     }
//     async onRoomFailed(
//         _site: Site,
//         _room: Room,
//         _roomSite: Site,
//         error: string
//     ): Promise<any> {
//         this.dest.drawText(0, 0, error, 'red');
//         this.dest.render();
//         await this.io.nextKeyPress();
//     }
//     async onRoomSuccess(site: Site, room: Room): Promise<any> {
//         site.drawInto(this.dest);
//         this.dest.drawText(0, 0, 'Room: ' + room.toString(), 'yellow');
//         this.dest.render();
//         await this.io.nextKeyPress();
//     }

//     async onLoopsAdded(_site: Site): Promise<any> {}
//     async onLakesAdded(_site: Site): Promise<any> {}
//     async onBridgesAdded(_site: Site): Promise<any> {}
//     async onStairsAdded(_site: Site): Promise<any> {}

//     async onBuildError(_error: string): Promise<any> {}
//     async onBlueprintPick(
//         _data: BuildData,
//         _flags: number,
//         _depth: number
//     ): Promise<any> {}
//     async onBlueprintCandidates(_data: BuildData): Promise<any> {}
//     async onBlueprintStart(
//         _data: BuildData,
//         _adoptedItem: GWM.item.Item | null
//     ): Promise<any> {}
//     async onBlueprintInterior(_data: BuildData): Promise<any> {}
//     async onBlueprintFail(_data: BuildData, _error: string): Promise<any> {}
//     async onBlueprintSuccess(_data: BuildData): Promise<any> {}
//     async onStepStart(
//         _data: BuildData,
//         _step: BuildStep,
//         _item: GWM.item.Item | null
//     // ): Promise<any> {}
//     async onStepCandidates(
//         _data: BuildData,
//         _step: BuildStep,
//         _candidates: GWU.grid.NumGrid,
//         _wantCount: number
//     ): Promise<any> {}
//     async onStepInstanceSuccess(
//         _data: BuildData,
//         _step: BuildStep,
//         _x: number,
//         _y: number
//     ): Promise<any> {}
//     async onStepInstanceFail(
//         _data: BuildData,
//         _step: BuildStep,
//         _x: number,
//         _y: number,
//         _error: string
//     ): Promise<any> {}
//     async onStepSuccess(_data: BuildData, _step: BuildStep): Promise<any> {}
//     async onStepFail(
//         _data: BuildData,
//         _step: BuildStep,
//         _error: string
//     ): Promise<any> {}
// }
