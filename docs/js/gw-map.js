(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('gw-utils')) :
    typeof define === 'function' && define.amd ? define(['exports', 'gw-utils'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.GWM = {}, global.GWU));
})(this, (function (exports, GWU) { 'use strict';

    function _interopNamespace(e) {
        if (e && e.__esModule) return e;
        var n = Object.create(null);
        if (e) {
            Object.keys(e).forEach(function (k) {
                if (k !== 'default') {
                    var d = Object.getOwnPropertyDescriptor(e, k);
                    Object.defineProperty(n, k, d.get ? d : {
                        enumerable: true,
                        get: function () { return e[k]; }
                    });
                }
            });
        }
        n["default"] = e;
        return Object.freeze(n);
    }

    var GWU__namespace = /*#__PURE__*/_interopNamespace(GWU);

    var Depth;
    (function (Depth) {
        Depth[Depth["ALL_LAYERS"] = -1] = "ALL_LAYERS";
        Depth[Depth["GROUND"] = 0] = "GROUND";
        Depth[Depth["SURFACE"] = 1] = "SURFACE";
        Depth[Depth["ITEM"] = 2] = "ITEM";
        Depth[Depth["ACTOR"] = 3] = "ACTOR";
        Depth[Depth["LIQUID"] = 4] = "LIQUID";
        Depth[Depth["GAS"] = 5] = "GAS";
        Depth[Depth["FX"] = 6] = "FX";
        Depth[Depth["UI"] = 7] = "UI";
    })(Depth || (Depth = {}));

    const Fl$7 = GWU__namespace.flag.fl;
    var Entity$1;
    (function (Entity) {
        // L_DYNAMIC = Fl(0), // for movable things like actors or items
        Entity[Entity["L_DESTROYED"] = Fl$7(1)] = "L_DESTROYED";
        Entity[Entity["L_SECRETLY_PASSABLE"] = Fl$7(2)] = "L_SECRETLY_PASSABLE";
        Entity[Entity["L_BLOCKS_MOVE"] = Fl$7(3)] = "L_BLOCKS_MOVE";
        Entity[Entity["L_BLOCKS_VISION"] = Fl$7(4)] = "L_BLOCKS_VISION";
        Entity[Entity["L_BLOCKS_SURFACE"] = Fl$7(6)] = "L_BLOCKS_SURFACE";
        Entity[Entity["L_BLOCKS_LIQUID"] = Fl$7(8)] = "L_BLOCKS_LIQUID";
        Entity[Entity["L_BLOCKS_GAS"] = Fl$7(7)] = "L_BLOCKS_GAS";
        Entity[Entity["L_BLOCKS_ITEMS"] = Fl$7(5)] = "L_BLOCKS_ITEMS";
        Entity[Entity["L_BLOCKS_ACTORS"] = Fl$7(11)] = "L_BLOCKS_ACTORS";
        Entity[Entity["L_BLOCKS_EFFECTS"] = Fl$7(9)] = "L_BLOCKS_EFFECTS";
        Entity[Entity["L_BLOCKS_DIAGONAL"] = Fl$7(10)] = "L_BLOCKS_DIAGONAL";
        Entity[Entity["L_INTERRUPT_WHEN_SEEN"] = Fl$7(12)] = "L_INTERRUPT_WHEN_SEEN";
        Entity[Entity["L_NO_SIDEBAR"] = Fl$7(13)] = "L_NO_SIDEBAR";
        Entity[Entity["L_VISUALLY_DISTINCT"] = Fl$7(14)] = "L_VISUALLY_DISTINCT";
        Entity[Entity["L_BRIGHT_MEMORY"] = Fl$7(15)] = "L_BRIGHT_MEMORY";
        Entity[Entity["L_INVERT_WHEN_HIGHLIGHTED"] = Fl$7(16)] = "L_INVERT_WHEN_HIGHLIGHTED";
        Entity[Entity["L_ON_MAP"] = Fl$7(17)] = "L_ON_MAP";
        Entity[Entity["L_IN_SIDEBAR"] = Fl$7(18)] = "L_IN_SIDEBAR";
        Entity[Entity["L_FORMAL_NAME"] = Fl$7(20)] = "L_FORMAL_NAME";
        Entity[Entity["L_ALWAYS_PLURAL"] = Fl$7(21)] = "L_ALWAYS_PLURAL";
        Entity[Entity["DEFAULT_ACTOR"] = 0] = "DEFAULT_ACTOR";
        Entity[Entity["DEFAULT_ITEM"] = 0] = "DEFAULT_ITEM";
        Entity[Entity["L_BLOCKED_BY_STAIRS"] = Entity.L_BLOCKS_ITEMS |
            Entity.L_BLOCKS_SURFACE |
            Entity.L_BLOCKS_GAS |
            Entity.L_BLOCKS_LIQUID |
            Entity.L_BLOCKS_EFFECTS |
            Entity.L_BLOCKS_ACTORS] = "L_BLOCKED_BY_STAIRS";
        Entity[Entity["L_BLOCKS_SCENT"] = Entity.L_BLOCKS_MOVE | Entity.L_BLOCKS_VISION] = "L_BLOCKS_SCENT";
        Entity[Entity["L_DIVIDES_LEVEL"] = Entity.L_BLOCKS_MOVE] = "L_DIVIDES_LEVEL";
        Entity[Entity["L_WAYPOINT_BLOCKER"] = Entity.L_BLOCKS_MOVE] = "L_WAYPOINT_BLOCKER";
        Entity[Entity["L_WALL_FLAGS"] = Entity.L_BLOCKS_MOVE |
            Entity.L_BLOCKS_VISION |
            Entity.L_BLOCKS_LIQUID |
            Entity.L_BLOCKS_GAS |
            Entity.L_BLOCKS_EFFECTS |
            Entity.L_BLOCKS_DIAGONAL] = "L_WALL_FLAGS";
        Entity[Entity["L_BLOCKS_EVERYTHING"] = Entity.L_WALL_FLAGS |
            Entity.L_BLOCKS_ITEMS |
            Entity.L_BLOCKS_ACTORS |
            Entity.L_BLOCKS_SURFACE] = "L_BLOCKS_EVERYTHING";
    })(Entity$1 || (Entity$1 = {}));

    const Fl$6 = GWU__namespace.flag.fl;
    var Actor$1;
    (function (Actor) {
        Actor[Actor["IS_PLAYER"] = Fl$6(0)] = "IS_PLAYER";
        Actor[Actor["HAS_MEMORY"] = Fl$6(1)] = "HAS_MEMORY";
        Actor[Actor["USES_FOV"] = Fl$6(2)] = "USES_FOV";
        Actor[Actor["STABLE_COST_MAP"] = Fl$6(3)] = "STABLE_COST_MAP";
        Actor[Actor["IS_VISIBLE"] = Fl$6(4)] = "IS_VISIBLE";
        Actor[Actor["WAS_VISIBLE"] = Fl$6(5)] = "WAS_VISIBLE";
        Actor[Actor["DEFAULT"] = 0] = "DEFAULT";
    })(Actor$1 || (Actor$1 = {}));

    var Item$1;
    (function (Item) {
        Item[Item["DEFAULT"] = 0] = "DEFAULT";
    })(Item$1 || (Item$1 = {}));

    const Fl$5 = GWU__namespace.flag.fl;
    ///////////////////////////////////////////////////////
    // TILE
    var Tile$1;
    (function (Tile) {
        Tile[Tile["T_BRIDGE"] = Fl$5(0)] = "T_BRIDGE";
        Tile[Tile["T_AUTO_DESCENT"] = Fl$5(1)] = "T_AUTO_DESCENT";
        Tile[Tile["T_LAVA"] = Fl$5(2)] = "T_LAVA";
        Tile[Tile["T_DEEP_WATER"] = Fl$5(3)] = "T_DEEP_WATER";
        Tile[Tile["T_SHALLOW_WATER"] = Fl$5(4)] = "T_SHALLOW_WATER";
        Tile[Tile["T_IS_FLAMMABLE"] = Fl$5(5)] = "T_IS_FLAMMABLE";
        Tile[Tile["T_SPONTANEOUSLY_IGNITES"] = Fl$5(6)] = "T_SPONTANEOUSLY_IGNITES";
        Tile[Tile["T_IS_FIRE"] = Fl$5(7)] = "T_IS_FIRE";
        Tile[Tile["T_EXTINGUISHES_FIRE"] = Fl$5(8)] = "T_EXTINGUISHES_FIRE";
        Tile[Tile["T_IS_SECRET"] = Fl$5(9)] = "T_IS_SECRET";
        Tile[Tile["T_IS_TRAP"] = Fl$5(10)] = "T_IS_TRAP";
        Tile[Tile["T_SACRED"] = Fl$5(11)] = "T_SACRED";
        Tile[Tile["T_UP_STAIRS"] = Fl$5(12)] = "T_UP_STAIRS";
        Tile[Tile["T_DOWN_STAIRS"] = Fl$5(13)] = "T_DOWN_STAIRS";
        Tile[Tile["T_PORTAL"] = Fl$5(14)] = "T_PORTAL";
        Tile[Tile["T_IS_DOOR"] = Fl$5(15)] = "T_IS_DOOR";
        Tile[Tile["T_ALLOWS_SUBMERGING"] = Fl$5(16)] = "T_ALLOWS_SUBMERGING";
        Tile[Tile["T_ENTANGLES"] = Fl$5(17)] = "T_ENTANGLES";
        Tile[Tile["T_REFLECTS"] = Fl$5(18)] = "T_REFLECTS";
        Tile[Tile["T_STAND_IN_TILE"] = Fl$5(19)] = "T_STAND_IN_TILE";
        Tile[Tile["T_CONNECTS_LEVEL"] = Fl$5(20)] = "T_CONNECTS_LEVEL";
        Tile[Tile["T_BLOCKS_OTHER_LAYERS"] = Fl$5(21)] = "T_BLOCKS_OTHER_LAYERS";
        Tile[Tile["T_LIST_IN_SIDEBAR"] = Fl$5(22)] = "T_LIST_IN_SIDEBAR";
        Tile[Tile["T_HAS_STAIRS"] = Tile.T_UP_STAIRS | Tile.T_DOWN_STAIRS | Tile.T_PORTAL] = "T_HAS_STAIRS";
        Tile[Tile["T_OBSTRUCTS_SCENT"] = Tile.T_AUTO_DESCENT |
            Tile.T_LAVA |
            Tile.T_DEEP_WATER |
            Tile.T_SPONTANEOUSLY_IGNITES |
            Tile.T_HAS_STAIRS] = "T_OBSTRUCTS_SCENT";
        Tile[Tile["T_PATHING_BLOCKER"] = Tile.T_AUTO_DESCENT |
            Tile.T_IS_TRAP |
            Tile.T_LAVA |
            Tile.T_DEEP_WATER |
            Tile.T_IS_FIRE |
            Tile.T_SPONTANEOUSLY_IGNITES |
            Tile.T_ENTANGLES] = "T_PATHING_BLOCKER";
        Tile[Tile["T_LAKE_PATHING_BLOCKER"] = Tile.T_AUTO_DESCENT |
            Tile.T_LAVA |
            Tile.T_DEEP_WATER |
            Tile.T_SPONTANEOUSLY_IGNITES] = "T_LAKE_PATHING_BLOCKER";
        Tile[Tile["T_WAYPOINT_BLOCKER"] = Tile.T_AUTO_DESCENT |
            Tile.T_IS_TRAP |
            Tile.T_LAVA |
            Tile.T_DEEP_WATER |
            Tile.T_SPONTANEOUSLY_IGNITES] = "T_WAYPOINT_BLOCKER";
        Tile[Tile["T_DIVIDES_LEVEL"] = Tile.T_AUTO_DESCENT | Tile.T_IS_TRAP | Tile.T_LAVA | Tile.T_DEEP_WATER] = "T_DIVIDES_LEVEL";
        Tile[Tile["T_MOVES_ITEMS"] = Tile.T_DEEP_WATER | Tile.T_LAVA] = "T_MOVES_ITEMS";
        Tile[Tile["T_CAN_BE_BRIDGED"] = Tile.T_AUTO_DESCENT | Tile.T_LAVA | Tile.T_DEEP_WATER] = "T_CAN_BE_BRIDGED";
        // T_HARMFUL_TERRAIN = T_CAUSES_POISON |
        //   T_IS_FIRE |
        //   T_CAUSES_DAMAGE |
        //   T_CAUSES_PARALYSIS |
        //   T_CAUSES_CONFUSION |
        //   T_CAUSES_EXPLOSIVE_DAMAGE,
        // T_RESPIRATION_IMMUNITIES = T_CAUSES_DAMAGE |
        //   T_CAUSES_CONFUSION |
        //   T_CAUSES_PARALYSIS |
        //   T_CAUSES_NAUSEA,
        Tile[Tile["T_IS_DEEP_LIQUID"] = Tile.T_LAVA | Tile.T_AUTO_DESCENT | Tile.T_DEEP_WATER] = "T_IS_DEEP_LIQUID";
        Tile[Tile["T_ANY_LIQUID"] = Tile.T_IS_DEEP_LIQUID | Tile.T_SHALLOW_WATER] = "T_ANY_LIQUID";
    })(Tile$1 || (Tile$1 = {}));

    const Fl$4 = GWU__namespace.flag.fl;
    ///////////////////////////////////////////////////////
    // TILE MECH
    var TileMech;
    (function (TileMech) {
        // TM_PROMOTES_WITH_KEY = Fl(1), // promotes if the key is present on the tile (in your pack, carried by monster, or lying on the ground)
        // TM_PROMOTES_WITHOUT_KEY = Fl(2), // promotes if the key is NOT present on the tile (in your pack, carried by monster, or lying on the ground)
        // TM_PROMOTES_ON_STEP = Fl(3), // promotes when a creature, player or item is on the tile (whether or not levitating)
        // TM_PROMOTES_ON_ITEM_REMOVE = Fl(4), // promotes when an item is lifted from the tile (primarily for altars)
        // TM_PROMOTES_ON_PLAYER_ENTRY = Fl(5), // promotes when the player enters the tile (whether or not levitating)
        // TM_PROMOTES_ON_SACRIFICE_ENTRY = Fl(6), // promotes when the sacrifice target enters the tile (whether or not levitating)
        // TM_PROMOTES_ON_ELECTRICITY = Fl(7), // promotes when hit by a lightning bolt
        // T_CAUSES_POISON = Fl(18), // any non-levitating creature gets 10 poison
        // T_CAUSES_DAMAGE = Fl(19), // anything on the tile takes max(1-2, 10%) damage per turn
        // T_CAUSES_NAUSEA = Fl(20), // any creature on the tile becomes nauseous
        // T_CAUSES_PARALYSIS = Fl(21), // anything caught on this tile is paralyzed
        // T_CAUSES_CONFUSION = Fl(22), // causes creatures on this tile to become confused
        // T_CAUSES_HEALING = Fl(23), // heals 20% max HP per turn for any player or non-inanimate monsters
        // T_CAUSES_EXPLOSIVE_DAMAGE = Fl(25), // is an explosion; deals higher of 15-20 or 50% damage instantly, but not again for five turns
        TileMech[TileMech["TM_IS_WIRED"] = Fl$4(9)] = "TM_IS_WIRED";
        TileMech[TileMech["TM_IS_CIRCUIT_BREAKER"] = Fl$4(10)] = "TM_IS_CIRCUIT_BREAKER";
        TileMech[TileMech["TM_VANISHES_UPON_PROMOTION"] = Fl$4(15)] = "TM_VANISHES_UPON_PROMOTION";
        TileMech[TileMech["TM_EXPLOSIVE_PROMOTE"] = Fl$4(21)] = "TM_EXPLOSIVE_PROMOTE";
        TileMech[TileMech["TM_SWAP_ENCHANTS_ACTIVATION"] = Fl$4(25)] = "TM_SWAP_ENCHANTS_ACTIVATION";
        // TM_PROMOTES = TM_PROMOTES_WITH_KEY |
        //   TM_PROMOTES_WITHOUT_KEY |
        //   TM_PROMOTES_ON_STEP |
        //   TM_PROMOTES_ON_ITEM_REMOVE |
        //   TM_PROMOTES_ON_SACRIFICE_ENTRY |
        //   TM_PROMOTES_ON_ELECTRICITY |
        //   TM_PROMOTES_ON_PLAYER_ENTRY,
    })(TileMech || (TileMech = {}));

    const Fl$3 = GWU__namespace.flag.fl;
    ///////////////////////////////////////////////////////
    // CELL
    var Cell$1;
    (function (Cell) {
        Cell[Cell["PRESSURE_PLATE_DEPRESSED"] = Fl$3(0)] = "PRESSURE_PLATE_DEPRESSED";
        Cell[Cell["SEARCHED_FROM_HERE"] = Fl$3(1)] = "SEARCHED_FROM_HERE";
        Cell[Cell["KNOWN_TO_BE_SAFE"] = Fl$3(2)] = "KNOWN_TO_BE_SAFE";
        Cell[Cell["CAUGHT_FIRE_THIS_TURN"] = Fl$3(3)] = "CAUGHT_FIRE_THIS_TURN";
        Cell[Cell["EVENT_FIRED_THIS_TURN"] = Fl$3(4)] = "EVENT_FIRED_THIS_TURN";
        Cell[Cell["EVENT_PROTECTED"] = Fl$3(5)] = "EVENT_PROTECTED";
        Cell[Cell["IS_IN_LOOP"] = Fl$3(6)] = "IS_IN_LOOP";
        Cell[Cell["IS_CHOKEPOINT"] = Fl$3(7)] = "IS_CHOKEPOINT";
        Cell[Cell["IS_GATE_SITE"] = Fl$3(8)] = "IS_GATE_SITE";
        Cell[Cell["IS_IN_ROOM_MACHINE"] = Fl$3(9)] = "IS_IN_ROOM_MACHINE";
        Cell[Cell["IS_IN_AREA_MACHINE"] = Fl$3(10)] = "IS_IN_AREA_MACHINE";
        Cell[Cell["IMPREGNABLE"] = Fl$3(11)] = "IMPREGNABLE";
        Cell[Cell["NEEDS_REDRAW"] = Fl$3(13)] = "NEEDS_REDRAW";
        Cell[Cell["STABLE_MEMORY"] = Fl$3(14)] = "STABLE_MEMORY";
        Cell[Cell["STABLE_SNAPSHOT"] = Fl$3(15)] = "STABLE_SNAPSHOT";
        // These are to speed checks
        Cell[Cell["HAS_PLAYER"] = Fl$3(16)] = "HAS_PLAYER";
        Cell[Cell["HAS_ACTOR"] = Fl$3(17)] = "HAS_ACTOR";
        Cell[Cell["HAS_DORMANT_MONSTER"] = Fl$3(18)] = "HAS_DORMANT_MONSTER";
        Cell[Cell["HAS_ITEM"] = Fl$3(19)] = "HAS_ITEM";
        Cell[Cell["HAS_FX"] = Fl$3(20)] = "HAS_FX";
        Cell[Cell["HAS_TICK_EFFECT"] = Fl$3(22)] = "HAS_TICK_EFFECT";
        Cell[Cell["IS_CURSOR"] = Fl$3(23)] = "IS_CURSOR";
        Cell[Cell["IS_HIGHLIGHTED"] = Fl$3(24)] = "IS_HIGHLIGHTED";
        Cell[Cell["IS_WIRED"] = Fl$3(26)] = "IS_WIRED";
        Cell[Cell["IS_CIRCUIT_BREAKER"] = Fl$3(27)] = "IS_CIRCUIT_BREAKER";
        Cell[Cell["IS_POWERED"] = Fl$3(28)] = "IS_POWERED";
        Cell[Cell["COLORS_DANCE"] = Fl$3(30)] = "COLORS_DANCE";
        Cell[Cell["CHANGED"] = Cell.NEEDS_REDRAW] = "CHANGED";
        Cell[Cell["IS_IN_MACHINE"] = Cell.IS_IN_ROOM_MACHINE | Cell.IS_IN_AREA_MACHINE] = "IS_IN_MACHINE";
        Cell[Cell["PERMANENT_CELL_FLAGS"] = Cell.HAS_ITEM |
            Cell.HAS_DORMANT_MONSTER |
            Cell.STABLE_MEMORY |
            Cell.SEARCHED_FROM_HERE |
            Cell.PRESSURE_PLATE_DEPRESSED |
            Cell.KNOWN_TO_BE_SAFE |
            Cell.IS_IN_LOOP |
            Cell.IS_CHOKEPOINT |
            Cell.IS_GATE_SITE |
            Cell.IS_IN_MACHINE |
            Cell.IMPREGNABLE] = "PERMANENT_CELL_FLAGS";
        Cell[Cell["HAS_ANY_ACTOR"] = Cell.HAS_PLAYER | Cell.HAS_ACTOR] = "HAS_ANY_ACTOR";
        Cell[Cell["HAS_ANY_OBJECT"] = Cell.HAS_ITEM | Cell.HAS_ANY_ACTOR] = "HAS_ANY_OBJECT";
        Cell[Cell["CELL_DEFAULT"] = Cell.NEEDS_REDRAW] = "CELL_DEFAULT";
    })(Cell$1 || (Cell$1 = {}));

    const Fl$2 = GWU__namespace.flag.fl;
    ///////////////////////////////////////////////////////
    // MAP
    var Map$1;
    (function (Map) {
        Map[Map["MAP_CHANGED"] = Fl$2(0)] = "MAP_CHANGED";
        Map[Map["MAP_NEEDS_REDRAW"] = Fl$2(1)] = "MAP_NEEDS_REDRAW";
        Map[Map["MAP_ALWAYS_LIT"] = Fl$2(3)] = "MAP_ALWAYS_LIT";
        Map[Map["MAP_SAW_WELCOME"] = Fl$2(4)] = "MAP_SAW_WELCOME";
        Map[Map["MAP_HAS_LIQUID"] = Fl$2(5)] = "MAP_HAS_LIQUID";
        Map[Map["MAP_HAS_GAS"] = Fl$2(6)] = "MAP_HAS_GAS";
        Map[Map["MAP_HAS_FIRE"] = Fl$2(7)] = "MAP_HAS_FIRE";
        Map[Map["MAP_CALC_FOV"] = Fl$2(10)] = "MAP_CALC_FOV";
        Map[Map["MAP_FOV_CHANGED"] = Fl$2(11)] = "MAP_FOV_CHANGED";
        Map[Map["MAP_DANCES"] = Fl$2(12)] = "MAP_DANCES";
        Map[Map["MAP_SIDEBAR_TILES_CHANGED"] = Fl$2(13)] = "MAP_SIDEBAR_TILES_CHANGED";
        Map[Map["MAP_SIDEBAR_CHANGED"] = Fl$2(14)] = "MAP_SIDEBAR_CHANGED";
        Map[Map["MAP_DEFAULT"] = 0] = "MAP_DEFAULT";
    })(Map$1 || (Map$1 = {}));

    const Fl$1 = GWU__namespace.flag.fl;
    ///////////////////////////////////////////////////////
    // TILE EVENT
    var Effect;
    (function (Effect) {
        // E_ALWAYS_FIRE = Fl(10), // Fire even if the cell is marked as having fired this turn
        Effect[Effect["E_NEXT_ALWAYS"] = Fl$1(0)] = "E_NEXT_ALWAYS";
        Effect[Effect["E_NEXT_EVERYWHERE"] = Fl$1(1)] = "E_NEXT_EVERYWHERE";
        Effect[Effect["E_FIRED"] = Fl$1(2)] = "E_FIRED";
        Effect[Effect["E_NO_MARK_FIRED"] = Fl$1(3)] = "E_NO_MARK_FIRED";
        // MUST_REPLACE_LAYER
        // NEEDS_EMPTY_LAYER
        Effect[Effect["E_PROTECTED"] = Fl$1(4)] = "E_PROTECTED";
        // E_NO_REDRAW_CELL = Fl(),
        Effect[Effect["E_TREAT_AS_BLOCKING"] = Fl$1(5)] = "E_TREAT_AS_BLOCKING";
        Effect[Effect["E_PERMIT_BLOCKING"] = Fl$1(6)] = "E_PERMIT_BLOCKING";
        Effect[Effect["E_ABORT_IF_BLOCKS_MAP"] = Fl$1(7)] = "E_ABORT_IF_BLOCKS_MAP";
        Effect[Effect["E_BLOCKED_BY_ITEMS"] = Fl$1(8)] = "E_BLOCKED_BY_ITEMS";
        Effect[Effect["E_BLOCKED_BY_ACTORS"] = Fl$1(9)] = "E_BLOCKED_BY_ACTORS";
        Effect[Effect["E_BLOCKED_BY_OTHER_LAYERS"] = Fl$1(10)] = "E_BLOCKED_BY_OTHER_LAYERS";
        Effect[Effect["E_SUPERPRIORITY"] = Fl$1(11)] = "E_SUPERPRIORITY";
        Effect[Effect["E_IGNORE_FOV"] = Fl$1(12)] = "E_IGNORE_FOV";
        // E_SPREAD_CIRCLE = Fl(13), // Spread in a circle around the spot (using FOV), radius calculated using spread+decrement
        // E_SPREAD_LINE = Fl(14), // Spread in a line in one random direction
        Effect[Effect["E_EVACUATE_CREATURES"] = Fl$1(15)] = "E_EVACUATE_CREATURES";
        Effect[Effect["E_EVACUATE_ITEMS"] = Fl$1(16)] = "E_EVACUATE_ITEMS";
        Effect[Effect["E_BUILD_IN_WALLS"] = Fl$1(17)] = "E_BUILD_IN_WALLS";
        Effect[Effect["E_MUST_TOUCH_WALLS"] = Fl$1(18)] = "E_MUST_TOUCH_WALLS";
        Effect[Effect["E_NO_TOUCH_WALLS"] = Fl$1(19)] = "E_NO_TOUCH_WALLS";
        Effect[Effect["E_CLEAR_GROUND"] = Fl$1(21)] = "E_CLEAR_GROUND";
        Effect[Effect["E_CLEAR_SURFACE"] = Fl$1(22)] = "E_CLEAR_SURFACE";
        Effect[Effect["E_CLEAR_LIQUID"] = Fl$1(23)] = "E_CLEAR_LIQUID";
        Effect[Effect["E_CLEAR_GAS"] = Fl$1(24)] = "E_CLEAR_GAS";
        Effect[Effect["E_CLEAR_TILE"] = Fl$1(25)] = "E_CLEAR_TILE";
        Effect[Effect["E_CLEAR_CELL"] = Effect.E_CLEAR_GROUND |
            Effect.E_CLEAR_SURFACE |
            Effect.E_CLEAR_LIQUID |
            Effect.E_CLEAR_GAS] = "E_CLEAR_CELL";
        Effect[Effect["E_ONLY_IF_EMPTY"] = Effect.E_BLOCKED_BY_ITEMS | Effect.E_BLOCKED_BY_ACTORS] = "E_ONLY_IF_EMPTY";
        // E_NULLIFY_CELL = E_NULL_SURFACE | E_NULL_LIQUID | E_NULL_GAS,
        // These should be effect types
        Effect[Effect["E_ACTIVATE_DORMANT_MONSTER"] = Fl$1(27)] = "E_ACTIVATE_DORMANT_MONSTER";
        Effect[Effect["E_AGGRAVATES_MONSTERS"] = Fl$1(28)] = "E_AGGRAVATES_MONSTERS";
        Effect[Effect["E_RESURRECT_ALLY"] = Fl$1(29)] = "E_RESURRECT_ALLY";
    })(Effect || (Effect = {}));

    const Fl = GWU__namespace.flag.fl;
    var Horde$1;
    (function (Horde) {
        Horde[Horde["HORDE_DIES_ON_LEADER_DEATH"] = Fl(0)] = "HORDE_DIES_ON_LEADER_DEATH";
        Horde[Horde["HORDE_IS_SUMMONED"] = Fl(1)] = "HORDE_IS_SUMMONED";
        Horde[Horde["HORDE_SUMMONED_AT_DISTANCE"] = Fl(2)] = "HORDE_SUMMONED_AT_DISTANCE";
        Horde[Horde["HORDE_NO_PERIODIC_SPAWN"] = Fl(4)] = "HORDE_NO_PERIODIC_SPAWN";
        Horde[Horde["HORDE_ALLIED_WITH_PLAYER"] = Fl(5)] = "HORDE_ALLIED_WITH_PLAYER";
        Horde[Horde["HORDE_NEVER_OOD"] = Fl(15)] = "HORDE_NEVER_OOD";
        // Move all these to tags?
        // HORDE_LEADER_CAPTIVE = Fl(3), // the leader is in chains and the followers are guards
        // HORDE_MACHINE_BOSS = Fl(6), // used in machines for a boss challenge
        // HORDE_MACHINE_WATER_MONSTER = Fl(7), // used in machines where the room floods with shallow water
        // HORDE_MACHINE_CAPTIVE = Fl(8), // powerful captive monsters without any captors
        // HORDE_MACHINE_STATUE = Fl(9), // the kinds of monsters that make sense in a statue
        // HORDE_MACHINE_TURRET = Fl(10), // turrets, for hiding in walls
        // HORDE_MACHINE_MUD = Fl(11), // bog monsters, for hiding in mud
        // HORDE_MACHINE_KENNEL = Fl(12), // monsters that can appear in cages in kennels
        // HORDE_VAMPIRE_FODDER = Fl(13), // monsters that are prone to capture and farming by vampires
        // HORDE_MACHINE_LEGENDARY_ALLY = Fl(14), // legendary allies
        // HORDE_MACHINE_THIEF = Fl(16), // monsters that can be generated in the key thief area machines
        // HORDE_MACHINE_GOBLIN_WARREN = Fl(17), // can spawn in goblin warrens
        // HORDE_SACRIFICE_TARGET = Fl(18), // can be the target of an assassination challenge; leader will get scary light.
        // HORDE_MACHINE_ONLY = HORDE_MACHINE_BOSS |
        //     HORDE_MACHINE_WATER_MONSTER |
        //     HORDE_MACHINE_CAPTIVE |
        //     HORDE_MACHINE_STATUE |
        //     HORDE_MACHINE_TURRET |
        //     HORDE_MACHINE_MUD |
        //     HORDE_MACHINE_KENNEL |
        //     HORDE_VAMPIRE_FODDER |
        //     HORDE_MACHINE_LEGENDARY_ALLY |
        //     HORDE_MACHINE_THIEF |
        //     HORDE_MACHINE_GOBLIN_WARREN |
        //     HORDE_SACRIFICE_TARGET,
    })(Horde$1 || (Horde$1 = {}));

    var index$g = /*#__PURE__*/Object.freeze({
        __proto__: null,
        get Depth () { return Depth; },
        get Entity () { return Entity$1; },
        get Actor () { return Actor$1; },
        get Item () { return Item$1; },
        get Tile () { return Tile$1; },
        get TileMech () { return TileMech; },
        get Cell () { return Cell$1; },
        get Map () { return Map$1; },
        get Effect () { return Effect; },
        get Horde () { return Horde$1; }
    });

    // TODO - Do we need the machine?
    class KeyInfo {
        constructor(x, y, disposable) {
            this.x = x;
            this.y = y;
            this.disposable = disposable;
        }
        matches(x, y) {
            return this.x === x && this.y === y;
        }
    }
    function makeKeyInfo(x, y, disposable) {
        return new KeyInfo(x, y, disposable);
    }

    class Action {
        constructor(opts) {
            this.actor = null; // actor doing the acting
            this.item = null; // item being acted upon (if any/known)
            this.x = 0;
            this.y = 0;
            this.target = null;
            this.dir = null;
            this.aware = false;
            this.identified = false;
            this.machine = 0;
            this.try = false;
            this.force = false;
            this.good = false;
            this.seen = false;
            this.quiet = false;
            // TODO - move to Game
            // rng?: GWU.rng.Random;
            // time = 0; // turn time (-1 means dead, 0 means no action, >0 means did something)
            this.ok = false;
            this.failed = false;
            this.done = false;
            this.logged = false; // message was logged
            this.visible = false; // visible to player
            this.data = {};
            this.map = opts.map;
            this.actor = opts.actor || null;
            this.item = opts.item || null;
            this.target = opts.target || null;
            if (!this.map && this.actor) {
                this.map = this.actor.map;
            }
            if (!this.map && this.item) {
                this.map = this.item.map;
            }
            this.game = opts.game;
            if (!this.game && this.map) {
                this.game = this.map.game;
            }
            if (opts.x !== undefined) {
                this.x = opts.x;
                this.y = opts.y;
            }
            else if (this.actor) {
                this.x = this.actor.x;
                this.y = this.actor.y;
            }
            else if (this.item) {
                this.x = this.item.x;
                this.y = this.item.y;
            }
            this.originX = this.x;
            this.originY = this.y;
            this.key = !!opts.key;
            if (opts.force)
                this.force = true;
            if (opts.aware)
                this.aware = true;
            if (opts.machine)
                this.machine = opts.machine;
        }
        isSuccess() {
            return this.ok;
        }
        isFailed() {
            return this.failed;
        }
        didSomething() {
            this.ok = true;
        }
        didNothing() { }
        fail() {
            this.failed = true;
            this.done = true;
        }
        isDone() {
            return this.done;
        }
        stop() {
            this.done = true;
        }
        reset() {
            this.done = false;
            this.failed = false;
            this.ok = false;
        }
    }
    // export type ActionNext = () => boolean;
    // export type ActionFn = (req: ActionCtx, next: ActionNext) => boolean;
    // export type ActionAfterFn = (req: ActionCtx) => void;
    // export enum Priority {
    //     FIRST = 0,
    //     EARLY = 25,
    //     NORMAL = 50,
    //     LATE = 75,
    //     LAST = 100,
    // }
    // export interface Action {
    //     fn: ActionFn;
    //     priority: Priority;
    // }
    // interface ActionData {
    //     fns: Action[];
    //     afterFns: ActionAfterFn[];
    // }
    // export interface ActionObj {
    //     [key: string]: ActionFn | ActionFn[] | null | false;
    // }
    // export type ActionBase = ActionFn | ActionFn[];
    // export type ActionConfig = ActionBase | ActionObj;
    // // function isActionObj(arg: any): arg is ActionObj {
    // //     return typeof arg === 'object' && !Array.isArray(arg);
    // // }
    // export class ActionManager {
    //     ACTIONS: Record<string, ActionData> = {};
    //     has(name: string): boolean {
    //         return name in this.ACTIONS;
    //     }
    //     load(obj: ActionObj) {
    //         Object.entries(obj).forEach(([key, value]) => {
    //             if (!value) {
    //                 this.clear(key);
    //             } else {
    //                 this.use(key, value);
    //             }
    //         });
    //     }
    //     copy(other: ActionManager) {
    //         Object.entries(other.ACTIONS).forEach(([name, data]) => {
    //             this.ACTIONS[name] = {
    //                 fns: data.fns.slice(),
    //                 afterFns: data.afterFns.slice(),
    //             };
    //         });
    //     }
    //     clear(name: string) {
    //         delete this.ACTIONS[name];
    //     }
    //     use(name: string, fn: ActionBase): void;
    //     use(
    //         name: string,
    //         fn: ActionFn,
    //         afterFn?: ActionAfterFn,
    //         priority?: number | keyof typeof Priority
    //     ): void;
    //     use(
    //         name: string,
    //         fn: ActionFn,
    //         priority?: number | keyof typeof Priority
    //     ): void;
    //     use(
    //         name: string,
    //         fn: ActionBase,
    //         afterFn?: ActionAfterFn | number | keyof typeof Priority,
    //         priority?: number | keyof typeof Priority
    //     ): void {
    //         if (Array.isArray(fn)) {
    //             if (fn.length && !fn[0]) {
    //                 this.clear(name);
    //                 fn.shift();
    //             }
    //             fn = chain(...fn);
    //         }
    //         if (typeof afterFn !== 'function') {
    //             priority = afterFn;
    //             afterFn = undefined;
    //         }
    //         if (priority === undefined) priority = Priority.NORMAL;
    //         if (typeof priority === 'string') {
    //             priority = Priority[priority] || 50;
    //         }
    //         if (name.startsWith('!') || name.startsWith('^')) {
    //             name = name.substring(1);
    //             priority = Priority.FIRST;
    //         } else if (name.startsWith('-')) {
    //             name = name.substring(1);
    //             priority = Priority.EARLY;
    //         } else if (name.startsWith('+')) {
    //             name = name.substring(1);
    //             priority = Priority.LATE;
    //         } else if (name.startsWith('$')) {
    //             name = name.substring(1);
    //             priority = Priority.LAST;
    //         }
    //         if (!(name in this.ACTIONS)) {
    //             this.ACTIONS[name] = { fns: [], afterFns: [] };
    //         }
    //         const data = this.ACTIONS[name];
    //         const a = { fn, priority };
    //         data.fns.unshift(a); // should go before others with same priority
    //         data.fns.sort((a, b) => a.priority - b.priority);
    //         if (afterFn) {
    //             data.afterFns.push(afterFn);
    //         }
    //     }
    //     useAfter(name: string, fn: ActionAfterFn) {
    //         if (!(name in this.ACTIONS)) {
    //             this.ACTIONS[name] = { fns: [], afterFns: [] };
    //         }
    //         const data = this.ACTIONS[name];
    //         data.afterFns.push(fn);
    //     }
    //     trigger(action: string, req: ActionCtx, next?: ActionNext): boolean {
    //         const data = this.ACTIONS[action];
    //         if (data) {
    //             return this._trigger(req, data.fns, data.afterFns, next);
    //         }
    //         return true;
    //     }
    //     _trigger(
    //         req: ActionCtx,
    //         fns: Action[],
    //         afterFns: ActionAfterFn[] = [],
    //         next?: ActionNext
    //     ): boolean {
    //         let index = -1;
    //         function _next(): boolean {
    //             index += 1;
    //             if (index >= fns.length) {
    //                 return next ? next() : true;
    //             }
    //             const result = fns[index].fn(req, _next);
    //             return result;
    //         }
    //         const result = _next();
    //         afterFns.forEach((fn) => fn(req));
    //         return result;
    //     }
    // }
    // export function chain(...fns: ActionFn[]): ActionFn {
    //     return function (req: ActionCtx, next: ActionNext): boolean {
    //         let index = -1;
    //         function _next(): boolean {
    //             index += 1;
    //             if (index >= fns.length) {
    //                 return next();
    //             }
    //             return fns[index](req, _next);
    //         }
    //         return _next();
    //     };
    // }
    // export function each(...fns: ActionFn[]): ActionFn {
    //     return function (req: ActionCtx, next: ActionNext): boolean {
    //         for (let fn of fns) {
    //             fn(req, GWU.TRUE);
    //         }
    //         return next();
    //     };
    // }
    // export function make(opts?: ActionBase): ActionManager {
    // }
    /*
        ActorKind
            actions: Record<string,ActionFn[]>={};
            use(action, fn, priority) {
                // push
                // sort
            }
            exec(action,req, res) {
                // see exec
            }
    */
    /*

    function TRUE() { return true; }

    type ActionCtx = any;
    type ActionNext = () => boolean | boolean;
    type ActionFn = (ctx: ActionCtx, next: ActionNext) => boolean | boolean;

    interface ActionObj {
      actions: Record<string, ActionFn[]>;
    }

     function actionObj(ev: string, ctx: ActionCtx, obj: ActionObj, next: ActionNext=TRUE): boolean {

      const allActions = obj.actions;
      if (!(ev in allActions)) return next();
      const actions = allActions[ev];
      
      let index = -1;
       function _next() : boolean {
        ++index;
        if (index >= actions.length) return next();
        return actions[index](ctx, _next);
      }

      return _next();
    }

    // e.g. actionObj('test', {}, a, next);

     function actionObjs(ev: string, ctx: ActionCtx, objs: ActionObj[], next:ActionNext=TRUE): boolean {

      let index = -1;
       function _nextObj() {
        ++index;
        if (index >= objs.length) return next();
        const obj = objs[index];
        return actionObj(ev, ctx, obj, _nextObj);
      }

      return _nextObj();
    }

    // e.g. actionObjs('test', {}, a, b, c, next);

    type ActionArg = ActionFn | { eg: string, obj: ActionObj };
    type ChainList = [...ActionArg[], ActionNext] | ActionArg[];

     function actionChain(ctx: ActionCtx, ...args: ChainList) : boolean {



      return true;
    }

    // map move might include something like...
    // e.g. actionChain({}, { ev: 'exit', obj: cell }, { ev: 'enter', obj: newCell }, next);
    // enter - covers bump/collide
    */

    class Actions {
        constructor(ctx) {
            this._handlers = {};
            this.onUnhandled = null;
            this._ctx = ctx;
        }
        copy(other) {
            Object.entries(other._handlers).forEach(([ev, fns]) => {
                if (!fns)
                    return;
                this._handlers[ev] = Array.isArray(fns) ? fns.slice() : fns;
            });
        }
        has(ev) {
            const events = this._handlers[ev];
            if (!events)
                return false;
            return events.some((e) => e && !!e.fn);
        }
        on(ev, fn) {
            if (Array.isArray(ev)) {
                const cleanup = ev.map((e) => this.on(e, fn));
                return () => {
                    cleanup.forEach((c) => c());
                };
            }
            if (Array.isArray(fn)) {
                const cleanup = fn.map((cb) => this.on(ev, cb));
                return () => {
                    cleanup.forEach((c) => c());
                };
            }
            let handlers = this._handlers[ev];
            if (!handlers) {
                handlers = this._handlers[ev] = [];
            }
            const info = { fn };
            handlers.unshift(info);
            return () => {
                const events = this._handlers[ev];
                if (Array.isArray(events)) {
                    GWU__namespace.arrayNullify(events, info);
                }
            };
        }
        load(obj) {
            Object.entries(obj).forEach(([ev, cfg]) => {
                this.on(ev, cfg);
            });
        }
        once(ev, fn) {
            if (Array.isArray(ev)) {
                const cleanup = ev.map((e) => this.once(e, fn));
                return () => {
                    cleanup.forEach((c) => c());
                };
            }
            if (Array.isArray(fn)) {
                const cleanup = fn.map((cb) => this.on(ev, cb));
                return () => {
                    cleanup.forEach((c) => c());
                };
            }
            let handlers = this._handlers[ev];
            if (!handlers) {
                handlers = this._handlers[ev] = [];
            }
            const info = { fn, once: true };
            handlers.unshift(info);
            return () => {
                const events = this._handlers[ev];
                if (Array.isArray(events)) {
                    GWU__namespace.arrayNullify(events, info);
                }
            };
        }
        off(ev, cb) {
            if (Array.isArray(ev)) {
                ev.forEach((e) => this.off(e, cb));
                return;
            }
            const events = this._handlers[ev];
            if (!events)
                return;
            if (cb) {
                const current = events.findIndex((i) => i && i.fn === cb);
                if (current > -1) {
                    events[current] = null;
                }
            }
            else {
                for (let i = 0; i < events.length; ++i) {
                    events[i] = null;
                }
            }
        }
        trigger(ev, action) {
            if (!action)
                throw new Error('Need Action parameter.');
            if (Array.isArray(ev)) {
                let didSomething = false;
                for (let name of ev) {
                    didSomething = this.trigger(name, action) || didSomething;
                    if (action.isDone())
                        return didSomething;
                }
                return didSomething;
            }
            const handlers = this._handlers[ev];
            if (!handlers || handlers.length == 0) {
                return this._unhandled(ev, action);
            }
            for (let i = 0; i < handlers.length; ++i) {
                const info = handlers[i];
                if (info) {
                    if (info.fn) {
                        // console.log('info.fn', info.fn);
                        info.fn.call(this._ctx, action);
                    }
                    if (info.once) {
                        handlers[i] = null;
                    }
                }
                if (action.isDone())
                    break;
            }
            this._handlers[ev] = handlers.filter((i) => i);
            return true;
        }
        _unhandled(ev, action) {
            if (!this.onUnhandled)
                return false;
            this.onUnhandled(ev, action);
            return true;
        }
        clear() {
            this._handlers = {};
            this.onUnhandled = null;
        }
        restart() {
            Object.keys(this._handlers).forEach((ev) => {
                this._handlers[ev] = this._handlers[ev].filter((i) => i && !i.once);
            });
            // this.onUnhandled = null;
        }
    }
    const global = new Actions();
    function install$7(ev, fn) {
        fn.seen = false;
        global.on(ev, fn);
    }
    function doAction(ev, action = {}) {
        if (!(action instanceof Action)) {
            action = new Action(action);
        }
        if (action.actor) {
            if (!action.actor.canDoAction(ev)) {
                return action.fail();
            }
        }
        if (action.item) {
            if (!action.item.canDoAction(ev)) {
                return action.fail();
            }
        }
        action.map.trigger(ev, action);
        if (action.isDone())
            return;
        if (action.item) {
            action.item.trigger(ev, action);
            if (action.isDone())
                return;
        }
        action.actor && action.actor.trigger(ev, action);
        if (action.isDone())
            return;
        action.game.trigger(ev, action);
        if (action.isDone())
            return;
        global.trigger(ev, action);
    }
    function defaultAction(ev, _action) {
        // if we get here then there was no action installed, this is a problem
        throw new Error('Unhandled action - ' + ev);
    }
    global.onUnhandled = defaultAction;

    var index$f = /*#__PURE__*/Object.freeze({
        __proto__: null,
        Action: Action,
        Actions: Actions,
        install: install$7,
        doAction: doAction,
        defaultAction: defaultAction
    });

    let lastId = 0;
    class Entity {
        // lastSeen: GWU.xy.Loc = [-1, -1];
        constructor(kind) {
            this._map = null;
            this.key = null;
            this.machineHome = 0;
            this.changed = true;
            this.actions = new Actions(this);
            this._actions = {};
            this.depth = 1; // default - TODO - enum/const
            this.light = null;
            this.flags = { entity: 0 };
            this.next = null;
            this.x = -1;
            this.y = -1;
            this.kind = kind;
            this.id = '' + ++lastId;
        }
        get map() {
            return this._map;
        }
        isPlural() {
            return this.hasEntityFlag(Entity$1.L_ALWAYS_PLURAL);
        }
        isOnMap() {
            // return this.hasEntityFlag(Flags.Entity.L_ON_MAP);
            return !!this._map;
        }
        addToMap(map, x, y) {
            this.x = x;
            this.y = y;
            this.setEntityFlag(Entity$1.L_ON_MAP);
            if (this._map === map) {
                return false;
            }
            this._map = map;
            this.kind.addToMap(this, map);
            return true;
        }
        removeFromMap() {
            this.clearEntityFlag(Entity$1.L_ON_MAP);
            this.kind.removeFromMap(this);
        }
        get sprite() {
            return this.kind.sprite;
        }
        get isDestroyed() {
            return this.hasEntityFlag(Entity$1.L_DESTROYED);
        }
        isAt(x, y) {
            return this.x === x && this.y === y;
        }
        clone() {
            const other = new this.constructor(this.kind);
            other.copy(this);
            return other;
        }
        copy(other) {
            this.depth = other.depth;
            this.light = other.light;
            Object.assign(this.flags, other.flags);
            this.next = other.next;
            this.x = other.x;
            this.y = other.y;
            this.kind = other.kind;
            this.id = other.id;
        }
        canBeSeen() {
            return this.kind.canBeSeen(this);
        }
        destroy() {
            this.flags.entity |= Entity$1.L_DESTROYED;
        }
        hasEntityFlag(flag) {
            return !!(this.flags.entity & flag);
        }
        hasAllEntityFlags(flags) {
            return (this.flags.entity & flags) === flags;
        }
        setEntityFlag(flag) {
            this.flags.entity |= flag;
        }
        clearEntityFlag(flag) {
            this.flags.entity &= ~flag;
        }
        hasTag(tag) {
            return this.kind.tags.includes(tag);
        }
        blocksMove() {
            return this.hasEntityFlag(Entity$1.L_BLOCKS_MOVE);
        }
        blocksVision() {
            return this.hasEntityFlag(Entity$1.L_BLOCKS_VISION);
        }
        blocksPathing() {
            return this.hasEntityFlag(Entity$1.L_BLOCKS_MOVE);
        }
        blocksEffects() {
            return this.hasEntityFlag(Entity$1.L_BLOCKS_EFFECTS);
        }
        isKey(x, y) {
            return this.key && this.key.matches(x, y);
        }
        forbidsCell(cell) {
            return this.kind.forbidsCell(cell, this);
        }
        avoidsCell(cell) {
            return this.kind.avoidsCell(cell, this);
        }
        getName(opts) {
            return this.kind.getName(this, opts);
        }
        getDescription(opts) {
            return this.kind.getDescription(this, opts);
        }
        getFlavor(opts) {
            return this.kind.getFlavor(this, opts);
        }
        getVerb(verb) {
            return this.kind.getVerb(this, verb);
        }
        drawSidebar(buffer, bounds) {
            return this.kind.drawSidebar(this, buffer, bounds);
        }
        drawInto(dest, _observer) {
            dest.drawSprite(this.sprite);
        }
        canDoAction(action) {
            const v = this._actions[action];
            if (v !== undefined)
                return v;
            return this.kind.canDoAction(action);
        }
        hasAction(action) {
            return this.actions.has(action) || this.kind.actions.has(action);
        }
        on(action, fn) {
            this.actions.on(action, fn);
        }
        once(action, fn) {
            this.actions.once(action, fn);
        }
        off(action, fn) {
            this.actions.off(action, fn);
        }
        trigger(name, action = {}) {
            if (!(action instanceof Action)) {
                action = new Action(action);
            }
            if (action.isDone())
                return;
            this.actions.trigger(name, action);
            if (action.isDone())
                return;
            this.kind.trigger(name, action);
        }
        toString() {
            return `${this.kind.id}-${this.id} @ ${this.x},${this.y}`;
        }
    }
    Entity.default = {
        sidebarFg: 'purple',
    };

    class EntityKind {
        constructor(config) {
            this.tags = [];
            this.requireTileFlags = 0;
            this.forbidTileFlags = 0;
            this.avoidTileFlags = 0;
            this.requireTileTags = [];
            this.forbidTileTags = [];
            this.avoidTileTags = [];
            this.actions = new Actions(this);
            this._actions = {};
            this.id = config.id || config.name;
            this.name = config.name;
            this.flavor = config.flavor || this.name;
            this.description = config.description || this.flavor;
            this.sprite = GWU__namespace.sprite.make(config.sprite ? config.sprite : config);
            if (config.tags) {
                if (typeof config.tags === 'string') {
                    this.tags = config.tags.split(/[,|]/).map((t) => t.trim());
                }
                else {
                    this.tags = config.tags.slice();
                }
            }
            if (config.requireTileFlags) {
                this.requireTileFlags = GWU__namespace.flag.from(Tile$1, config.requireTileFlags);
            }
            if (config.avoidTileFlags) {
                this.avoidTileFlags = GWU__namespace.flag.from(Tile$1, config.avoidTileFlags);
            }
            if (config.forbidTileFlags) {
                this.forbidTileFlags = GWU__namespace.flag.from(Tile$1, config.forbidTileFlags);
            }
            if (config.requireTileTags) {
                if (typeof config.requireTileTags === 'string') {
                    config.requireTileTags = config.requireTileTags.split(/[,|]/g);
                }
                this.requireTileTags = config.requireTileTags.map((t) => t.trim());
            }
            if (config.avoidTileTags) {
                if (typeof config.avoidTileTags === 'string') {
                    config.avoidTileTags = config.avoidTileTags.split(/[,|]/g);
                }
                this.avoidTileTags = config.avoidTileTags.map((t) => t.trim());
            }
            if (config.forbidTileTags) {
                if (typeof config.forbidTileTags === 'string') {
                    config.forbidTileTags = config.forbidTileTags.split(/[,|]/g);
                }
                this.forbidTileTags = config.forbidTileTags.map((t) => t.trim());
            }
            if (config.drawSidebar) {
                this.drawSidebar = config.drawSidebar;
            }
            this.sidebarFg = GWU__namespace.color.from(config.sidebarFg || Entity.default.sidebarFg);
            if (config.actions) {
                Object.entries(config.actions).forEach(([name, value]) => this.on(name, value));
            }
        }
        make(opts) {
            const entity = new Entity(this);
            this.init(entity, opts);
            return entity;
        }
        init(entity, opts = {}) {
            if (opts.machineHome) {
                entity.machineHome = opts.machineHome;
            }
        }
        addToMap(_entity, _map) { }
        removeFromMap(_entity) { }
        canBeSeen(_entity) {
            return true;
        }
        forbidsCell(cell, _entity) {
            if (this.requireTileFlags &&
                !cell.hasAllTileFlags(this.requireTileFlags) &&
                !cell.hasTileFlag(Tile$1.T_BRIDGE)) {
                return true;
            }
            if (this.forbidTileFlags &&
                cell.hasTileFlag(this.forbidTileFlags) &&
                !cell.hasTileFlag(Tile$1.T_BRIDGE)) {
                return true;
            }
            if (this.requireTileTags.length &&
                !cell.hasAllTileTags(this.requireTileTags) &&
                !cell.hasTileFlag(Tile$1.T_BRIDGE)) {
                return true;
            }
            if (this.forbidTileTags.length &&
                cell.hasAnyTileTag(this.forbidTileTags) &&
                !cell.hasTileFlag(Tile$1.T_BRIDGE)) {
                return true;
            }
            return false;
        }
        avoidsCell(cell, entity) {
            if (this.forbidsCell(cell, entity))
                return true;
            if (this.avoidTileFlags &&
                cell.hasTileFlag(this.avoidTileFlags) &&
                !cell.hasTileFlag(Tile$1.T_BRIDGE)) {
                return true;
            }
            if (this.avoidTileTags.length &&
                cell.hasAnyTileTag(this.avoidTileTags) &&
                !cell.hasTileFlag(Tile$1.T_BRIDGE)) {
                return true;
            }
            return false;
        }
        getName(_entity, _opts) {
            return this.name;
        }
        getDescription(_entity, _opts) {
            return this.description;
        }
        getFlavor(_entity, _opts) {
            return this.flavor;
        }
        getVerb(_entity, verb) {
            return verb;
        }
        drawSidebar(entity, buffer, bounds) {
            if (!entity.map)
                return 0;
            if (entity.isDestroyed)
                return 0;
            const mixer = new GWU__namespace.sprite.Mixer();
            entity.map.getAppearanceAt(entity.x, entity.y, mixer);
            buffer.drawSprite(bounds.x + 1, bounds.y, mixer);
            buffer.wrapText(bounds.x + 3, bounds.y, bounds.width - 3, entity.getName(), this.sidebarFg);
            return 1;
        }
        canDoAction(action) {
            const v = this._actions[action];
            if (v !== undefined)
                return v;
            return true; // by default you can do everything!
        }
        on(action, fn) {
            if (Array.isArray(action)) {
                action.forEach((a) => this.on(a, fn));
                return;
            }
            if (fn === true) {
                this._actions[action] = true;
            }
            else if (fn === false) {
                this._actions[action] = false;
            }
            else {
                this.actions.on(action, fn);
                this._actions[action] = true;
            }
        }
        off(action) {
            if (Array.isArray(action)) {
                action.forEach((a) => this.off(a));
                return;
            }
            this._actions[action] = false;
        }
        trigger(name, action = {}) {
            if (!(action instanceof Action)) {
                action = new Action(action);
            }
            if (action.isDone())
                return;
            this.actions.trigger(name, action);
        }
    }
    function make$7(opts, makeOpts = {}) {
        const kind = new EntityKind(opts);
        return kind.make(makeOpts);
    }

    class Status {
        constructor() {
            this._set = {};
            this._time = {};
            this._count = {};
            this._done = {};
            this._value = {};
            this.changed = null;
        }
        clear(name) {
            this.clearTime(name);
            this.clearCount(name);
            this.setOff(name);
            return this._update(name);
        }
        get(name) {
            return this._value[name] || false;
        }
        has(name) {
            return this._value[name] || false;
        }
        _addDone(name, done) {
            if (done) {
                if (!this._done[name]) {
                    this._done[name] = done;
                }
            }
        }
        /**
         * Sets the count for a status variable.
         * If setting the count turns on the status (it was off),
         * then this function returns true.  Otherwise, false.
         * The done variable is only set if there is no other done function
         * already for this status.
         * @param {string} name The name of the status to set.
         * @param {number} count The count to set.
         * @param {function} [done] The function to call whenever the count goes to 0.
         * @returns {boolean} Whether or not setting the count turned the status on.
         */
        setCount(name, count, done) {
            const status = this;
            status._count[name] = Math.max(count, status._count[name] || 0);
            this._addDone(name, done);
            return this._update(name);
        }
        /**
         * Increments the count for the status by the given amount (1=default)
         * If incrementing the count turns on the status (it was off),
         * then this function returns true.  Otherwise, false.
         * The done variable is only set if there is no other done function
         * already for this status.
         * @param {string} name The name of the status to set.
         * @param {number} [count=1] The count to incrmeent.
         * @param {function} [done] The function to call whenever the count goes to 0.
         * @returns {boolean} Whether or not incrementing the count turned the status on.
         */
        increment(name, count = 1, done) {
            if (typeof count == 'function') {
                done = count;
                count = 1;
            }
            const status = this;
            status._count[name] = (status._count[name] || 0) + count;
            this._addDone(name, done);
            return this._update(name);
        }
        /**
         * Decrements the count for the status by the given amount (1=default)
         * If decrementing the count turns off the status (it was on),
         * then this function returns true.  Otherwise, false.
         * Also, if the status is turned off, and a done function was set, then it
         * is called.
         * @param {string} name The name of the status to adjust.
         * @param {number} [count=1] The count to decrement.
         * @returns {boolean} Whether or not decrementing the count turned the status off.
         */
        decrement(name, count = 1) {
            const status = this;
            status._count[name] = Math.max(0, (status._count[name] || 0) - count);
            return this._update(name);
        }
        /**
         * Clears all counts from the given status.
         * If clearing the count turns off the status (it was on),
         * then this function returns true.  Otherwise, false.
         * Also, if the status is turned off, and a done function was set, then it
         * is called.
         * @param {string} name The name of the status to adjust.
         * @returns {boolean} Whether or not decrementing the count turned the status off.
         */
        clearCount(name) {
            const status = this;
            status._count[name] = 0;
            return this._update(name);
        }
        /**
         * Turns on the given status.
         * @param {string} name The status to adjust.
         * @param {function} [done] The function to call when the status is turned off.
         * @returns {boolean} True if this turns on the status. (It could be on because of a time or count).
         */
        setOn(name, done) {
            const status = this;
            status._set[name] = true;
            this._addDone(name, done);
            return this._update(name);
        }
        /**
         * Turns off the given status.
         *
         * @param {string} name The status to adjust.
         * @returns {boolean} True if this turns off the status. (It could be on because of a time or count).
         */
        setOff(name) {
            const status = this;
            status._set[name] = false;
            return this._update(name);
        }
        /**
         * Sets the time for a status variable.
         * If setting the time turns on the status (it was off),
         * then this function returns true.  Otherwise, false.
         * The done variable is only set if there is no other done function
         * already for this status.
         * @param {string} name The name of the status to set.
         * @param {GWU.range.RangeBase} time The time value to set.
         * @param {function} [done] The function to call whenever the status goes false.
         * @returns {boolean} Whether or not setting the time turned the status on.
         */
        setTime(name, value, done) {
            const status = this;
            // if (value === true) {
            //   return RUT.Status.setOn(source, name, done);
            // }
            value = GWU__namespace.range.make(value).value();
            const current = status._time[name] || 0;
            status._time[name] = Math.max(value, current);
            this._addDone(name, done);
            return this._update(name);
        }
        /**
         * Adds to the time for a status variable.
         * If adding to the time turns on the status (it was off),
         * then this function returns true.  Otherwise, false.
         * The done variable is only set if there is no other done function
         * already for this status.
         * @param {string} name The name of the status to set.
         * @param {GWU.range.RangeBase} time The time value to add.
         * @param {function} [done] The function to call whenever the status goes false.
         * @returns {boolean} Whether or not adding the time turned the status on.
         */
        addTime(name, value = 1, done) {
            if (typeof value == 'function') {
                done = value;
                value = 1;
            }
            const status = this;
            // if (value === true) {
            //   return RUT.Status.setOn(source, name, done);
            // }
            value = GWU__namespace.range.make(value).value();
            status._time[name] = (status._time[name] || 0) + value;
            this._addDone(name, done);
            return this._update(name);
        }
        /**
         * Removes time for a status variable.
         * If removing to the time turns off the status (it was on),
         * then this function returns true.  Otherwise, false.
         * @param {string} name The name of the status to set.
         * @param {GWU.range.RangeBase} time The time value to remove.
         * @returns {boolean} Whether or not removing the time turned the status off.
         */
        removeTime(name, value = 1) {
            const status = this;
            value = GWU__namespace.range.make(value).value();
            status._time[name] = Math.max(0, (status._time[name] || 0) - value);
            return this._update(name);
        }
        /**
         * Removes all time for a status variable.
         * If removing to the time turns off the status (it was on),
         * then this function returns true.  Otherwise, false.
         * @param {string} name The name of the status to set.
         * @returns {boolean} Whether or not removing the time turned the status off.
         */
        clearTime(name) {
            const status = this;
            status._time[name] = 0;
            return this._update(name);
        }
        /**
         * Removes time for all status variables that have time.
         * If removing the time turns off any status (it was on),
         * then this function returns an object with all of those statuses as keys and false as the values.  Otherwise, false.
         * @param {Status|object} source The object to set the status on.  If object.status is set then that is where the values are updated.
         * @param {string} name The name of the status to set.
         * @returns {boolean|object} false or an object with the names of the statuses that were cleared as keys and false as the values.
         */
        decayAllTimes(delta = 1) {
            const status = this;
            const cleared = {};
            let noticed = false;
            for (let name in status._time) {
                if (this.removeTime(name, delta)) {
                    noticed = true;
                    cleared[name] = false;
                }
            }
            return noticed ? cleared : false;
        }
        /**
         * Updates the value of the status and returns whether or not this change
         * turned the status on or off (true = change, false = no change)
         * @param {string} name The name of the status to update
         * @returns {boolean} True if the value was turned on or off, False otherwise.
         */
        _update(name) {
            const status = this;
            const rec = this._value;
            let was = rec[name];
            let value = (rec[name] =
                status._set[name] ||
                    status._time[name] > 0 ||
                    status._count[name] > 0 ||
                    false);
            const doneFn = this._done[name];
            if (!value && doneFn) {
                doneFn(this, name);
                status._done[name] = null;
            }
            if (was && !value) {
                if (this.changed)
                    this.changed(this, name);
                // console.log('called changed: false');
                return true;
            }
            else if (!was && value) {
                if (this.changed)
                    this.changed(this, name);
                // console.log('called changed: true');
                return true;
            }
            return false;
        }
    }

    class Stats {
        constructor(opts = {}) {
            this._max = {};
            this._rate = {};
            this._value = {};
            this.init(opts);
        }
        get(name) {
            return this._value[name] || 0;
        }
        getPct(name) {
            const max = this.max(name);
            return max ? Math.round((100 * this.get(name)) / max) : 0;
        }
        max(name) {
            return this._max[name] || 0;
        }
        regen(name) {
            return this._rate[name] || null;
        }
        init(opts) {
            for (let name in opts) {
                this.set(name, opts[name]);
            }
        }
        set(name, v, max) {
            if (typeof v !== 'number') {
                const r = GWU__namespace.range.make(v);
                v = r.value();
            }
            this._value[name] = v;
            this._max[name] = max || v;
        }
        gain(name, amount, allowOver = false) {
            if (typeof amount !== 'number') {
                amount = GWU__namespace.range.value(amount);
            }
            let v = this._value[name] + amount;
            if (!allowOver) {
                v = Math.min(v, this._max[name]);
            }
            this._value[name] = v;
        }
        drain(name, amount) {
            if (typeof amount !== 'number') {
                amount = GWU__namespace.range.value(amount);
            }
            this._value[name] = Math.max(0, this._value[name] - amount);
        }
        raiseMax(name, amount, raiseValue = true) {
            if (typeof amount !== 'number') {
                amount = GWU__namespace.range.value(amount);
            }
            this._max[name] += amount;
            if (raiseValue) {
                this.gain(name, amount);
            }
        }
        reduceMax(name, amount, lowerValue = false) {
            if (typeof amount !== 'number') {
                amount = GWU__namespace.range.value(amount);
            }
            this._max[name] = Math.max(0, this._max[name] - amount);
            if (lowerValue) {
                this.drain(name, amount);
            }
        }
        setRegen(name, turns, count = 1) {
            const r = (this._rate[name] = this._rate[name] || { elapsed: 0 });
            r.turns = turns;
            r.count = count;
        }
        regenAll() {
            for (let name in this._max) {
                const r = this._rate[name];
                r.elapsed += 1;
                if (r.elapsed >= r.turns) {
                    this.gain(name, r.count);
                    r.elapsed -= r.turns;
                }
            }
        }
        restore(name, value) {
            if (value === undefined)
                value = this._max[name];
            this._value[name] = value;
        }
        adjust(name, type, amount) {
            amount = GWU__namespace.range.from(amount);
            const v = amount.value();
            const c = this.get(name);
            if (type === 'inc') {
                this.gain(name, amount);
            }
            else if (type === 'dec') {
                this.drain(name, amount);
            }
            else if (type === 'set') {
                this.set(name, amount);
            }
            else if (type === 'min') {
                const v = amount.value();
                if (this.get(name) < v) {
                    this.set(name, v);
                }
            }
            else if (type === 'max') {
                if (this.get(name) > v) {
                    this.set(name, v);
                }
            }
            else {
                throw new Error('Invalid stat adjust type: ' + type);
            }
            return c !== this.get(name);
        }
    }

    class Actor extends Entity {
        constructor(kind) {
            super(kind);
            this.ai = {};
            this._action = 'idle';
            this._turnTime = 0;
            this.leader = null;
            this.items = null; // inventory
            this.visionDistance = 99;
            this.data = {};
            this._costMap = null;
            this._goalMap = null;
            this._mapToMe = null;
            this.next = null; // TODO - can we get rid of this?
            // @ts-ignore - initialized in Entity
            this.flags.actor = 0;
            this.depth = Depth.ACTOR;
            this.kind = kind;
            this.stats = new Stats();
            this.status = new Status();
        }
        setData(key, value) {
            this.data[key] = value;
            this.changed = true;
        }
        copy(other) {
            super.copy(other);
            this.leader = other.leader;
            this.items = other.items;
            this.visionDistance = other.visionDistance;
        }
        destroy() {
            this.setEntityFlag(Entity$1.L_DESTROYED);
            if (this._costMap) {
                GWU__namespace.grid.free(this._costMap);
                this._costMap = null;
            }
            if (this._goalMap) {
                GWU__namespace.grid.free(this._goalMap);
                this._goalMap = null;
            }
            if (this._mapToMe) {
                GWU__namespace.grid.free(this._mapToMe);
                this._mapToMe = null;
            }
        }
        hasActorFlag(flag) {
            return !!(this.flags.actor & flag);
        }
        hasAllActorFlags(flags) {
            return (this.flags.actor & flags) === flags;
        }
        actorFlags() {
            return this.flags.actor;
        }
        setActorFlag(flag) {
            this.flags.actor |= flag;
        }
        clearActorFlag(flag) {
            this.flags.actor &= ~flag;
        }
        isPlayer() {
            return this.hasActorFlag(Actor$1.IS_PLAYER);
        }
        isDead() {
            return this.hasEntityFlag(Entity$1.L_DESTROYED);
        }
        getBumpActions() {
            return this.kind.bump;
        }
        /////////////// VISIBILITY
        becameVisible() {
            return (this.hasActorFlag(Actor$1.IS_VISIBLE) &&
                !this.hasActorFlag(Actor$1.WAS_VISIBLE));
        }
        canSee(x, y) {
            if (x instanceof Entity) {
                return this.canSee(x.x, x.y) && this.kind.isAbleToSee(this, x);
            }
            else if (this.map) {
                if (this.isPlayer()) {
                    return this.map.fov.isDirectlyVisible(x, y);
                }
                if (GWU__namespace.xy.distanceBetween(this.x, this.y, x, y) >
                    this.visionDistance) {
                    return false;
                }
                return GWU__namespace.xy.forLineBetween(this.x, this.y, x, y, (i, j) => {
                    if (this.map.cell(i, j).blocksVision())
                        return false;
                });
            }
            else {
                return false; // need a map or an fov
            }
        }
        canSeeOrSense(x, y) {
            if (x instanceof Entity) {
                return (this.canSeeOrSense(x.x, x.y) &&
                    (this.kind.isAbleToSee(this, x) ||
                        this.kind.isAbleToSense(this, x)));
            }
            if (this.map && this.isPlayer()) {
                return this.map.fov.isAnyKindOfVisible(x, y);
            }
            return this.canSee(x, y);
        }
        isAbleToSee(entity) {
            return this.kind.isAbleToSee(this, entity);
        }
        isAbleToSense(entity) {
            return this.kind.isAbleToSense(this, entity);
        }
        ////////////////// ACTOR
        setAction(name) {
            if (!this.canDoAction(name)) {
                throw new Error('Actor cannot do action - ' + name);
            }
            this._action = name;
        }
        clearAction() {
            this._action = 'idle';
        }
        act(game) {
            let startedVisible = false;
            if (game.player.canSee(this)) {
                this.setActorFlag(Actor$1.IS_VISIBLE);
                startedVisible = true;
            }
            else {
                this.clearActorFlag(Actor$1.IS_VISIBLE);
            }
            if (this.becameVisible()) {
                game.player.interrupt(this);
            }
            doAction(this._action, { game, actor: this, map: this.map });
            // let r = 0;
            // if (this.ai && this.ai.fn) {
            //     r = this.ai.fn(game, this);
            // }
            // if (r == 0 && this.kind.ai.fn) {
            //     r = this.kind.ai.fn(game, this);
            // }
            // if (r) {
            //     // did something
            if (startedVisible || game.player.canSee(this)) ;
            //     return r;
            // }
            // // idle - always
            return this._turnTime;
        }
        moveSpeed() {
            return this.kind.moveSpeed;
        }
        startTurn() {
            this._turnTime = 0;
            if (this.hasActorFlag(Actor$1.IS_VISIBLE)) {
                this.setActorFlag(Actor$1.WAS_VISIBLE);
            }
            else {
                this.clearActorFlag(Actor$1.WAS_VISIBLE);
            }
            const map = this.map;
            const isVisible = map && map.fov.isAnyKindOfVisible(this.x, this.y);
            if (isVisible) {
                this.setActorFlag(Actor$1.IS_VISIBLE);
            }
            else {
                this.clearActorFlag(Actor$1.IS_VISIBLE);
            }
        }
        endTurn(pct = 100) {
            if (this.hasActorFlag(Actor$1.IS_VISIBLE)) {
                this.setActorFlag(Actor$1.WAS_VISIBLE);
            }
            else {
                this.clearActorFlag(Actor$1.WAS_VISIBLE);
            }
            const map = this.map;
            const isVisible = map && map.fov.isAnyKindOfVisible(this.x, this.y);
            if (isVisible) {
                this.setActorFlag(Actor$1.IS_VISIBLE);
                if (!this.hasEntityFlag(Entity$1.L_NO_SIDEBAR) &&
                    !this.hasEntityFlag(Entity$1.L_IN_SIDEBAR)) {
                    map.setMapFlag(Map$1.MAP_SIDEBAR_CHANGED);
                }
            }
            else {
                this.clearActorFlag(Actor$1.IS_VISIBLE);
                if (map &&
                    !this.hasEntityFlag(Entity$1.L_NO_SIDEBAR) &&
                    this.hasEntityFlag(Entity$1.L_IN_SIDEBAR)) {
                    map.setMapFlag(Map$1.MAP_SIDEBAR_CHANGED);
                }
            }
            this._turnTime = Math.max(this._turnTime, Math.floor((pct * this.moveSpeed()) / 100));
        }
        ///////
        willAttack(_other) {
            return true;
        }
        canPass(_other) {
            return false;
        }
        ////////////////// INVENTORY
        avoidsItem(_item) {
            return false;
        }
        canAddItem(_item) {
            return false;
        }
        addItem(_item) { }
        pickupItem(item, opts) {
            return this.kind.pickupItem(this, item, opts);
        }
        dropItem(item, opts) {
            return this.kind.dropItem(this, item, opts);
        }
        // PATHFINDING
        addToMap(map, x, y) {
            const mapChanged = super.addToMap(map, x, y);
            if (mapChanged) {
                this.clearActorFlag(Actor$1.STABLE_COST_MAP);
            }
            return mapChanged;
        }
        removeFromMap() {
            super.removeFromMap();
            if (this._costMap) {
                GWU__namespace.grid.free(this._costMap);
                this._costMap = null;
            }
            if (this._goalMap) {
                GWU__namespace.grid.free(this._goalMap);
                this._goalMap = null;
            }
            if (this._mapToMe) {
                GWU__namespace.grid.free(this._mapToMe);
                this._mapToMe = null;
            }
        }
        /*
        Calculates and returns the actor's move cost map.
        Used in pathfinding.
        */
        costMap() {
            if (!this.map) {
                throw new Error('Actor must have map to calculate costMap.');
            }
            const staleMap = !this.hasActorFlag(Actor$1.STABLE_COST_MAP);
            if (staleMap && this._costMap) {
                GWU__namespace.grid.free(this._costMap);
                this._costMap = null;
            }
            if (!this._costMap) {
                this._costMap = GWU__namespace.grid.alloc(this.map.width, this.map.height);
            }
            else if (!staleMap) {
                return this._costMap;
            }
            const kind = this.kind;
            const map = this.map;
            this._costMap.update((_v, x, y) => {
                const cell = map.cell(x, y);
                return kind.cellCost(cell, this);
            });
            this.setActorFlag(Actor$1.STABLE_COST_MAP);
            /*

                if (cellHasTerrainFlag(i, j, T_OBSTRUCTS_PASSABILITY)
                && (!cellHasTMFlag(i, j, TM_IS_SECRET) || (discoveredTerrainFlagsAtLoc(i, j) & T_OBSTRUCTS_PASSABILITY)))
                {
                    playerCostMap[i][j] = monsterCostMap[i][j] = cellHasTerrainFlag(i, j, T_OBSTRUCTS_DIAGONAL_MOVEMENT) ? PDS_OBSTRUCTION : PDS_FORBIDDEN;
                } else if (cellHasTerrainFlag(i, j, T_SACRED)) {
                        playerCostMap[i][j] = 1;
                        monsterCostMap[i][j] = PDS_FORBIDDEN;
                } else if (cellHasTerrainFlag(i, j, T_LAVA_INSTA_DEATH)) {
            monsterCostMap[i][j] = PDS_FORBIDDEN;
            if (player.status[STATUS_LEVITATING] || !player.status[STATUS_IMMUNE_TO_FIRE]) {
                playerCostMap[i][j] = 1;
            } else {
                playerCostMap[i][j] = PDS_FORBIDDEN;
            }
                } else {
                    if (pmap[i][j].flags & HAS_MONSTER) {
                        monst = monsterAtLoc(i, j);
                        if ((monst.creatureState == MONSTER_SLEEPING
                             || monst.turnsSpentStationary > 2
                 || (monst.info.flags & MONST_GETS_TURN_ON_ACTIVATION)
                             || monst.creatureState == MONSTER_ALLY)
                            && monst.creatureState != MONSTER_FLEEING)
                        {
                            playerCostMap[i][j] = 1;
                            monsterCostMap[i][j] = PDS_FORBIDDEN;
                            continue;
                        }
                    }

                    if (cellHasTerrainFlag(i, j, (T_AUTO_DESCENT | T_IS_DF_TRAP))) {
                        monsterCostMap[i][j] = PDS_FORBIDDEN;
              if (player.status[STATUS_LEVITATING]) {
                  playerCostMap[i][j] = 1;
              } else {
                  playerCostMap[i][j] = PDS_FORBIDDEN;
              }
                    } else if (cellHasTerrainFlag(i, j, T_IS_FIRE)) {
                        monsterCostMap[i][j] = PDS_FORBIDDEN;
              if (player.status[STATUS_IMMUNE_TO_FIRE]) {
                  playerCostMap[i][j] = 1;
              } else {
                  playerCostMap[i][j] = PDS_FORBIDDEN;
              }
                    } else if (cellHasTerrainFlag(i, j, (T_IS_DEEP_WATER | T_SPONTANEOUSLY_IGNITES))) {
              if (player.status[STATUS_LEVITATING]) {
                  playerCostMap[i][j] = 1;
              } else {
                  playerCostMap[i][j] = 5;
              }
                        monsterCostMap[i][j] = 5;
            } else if (cellHasTerrainFlag(i, j, T_OBSTRUCTS_PASSABILITY)
                       && cellHasTMFlag(i, j, TM_IS_SECRET) && !(discoveredTerrainFlagsAtLoc(i, j) & T_OBSTRUCTS_PASSABILITY)
                       && !(pmap[i][j].flags & IN_FIELD_OF_VIEW))
                 {
                // Secret door that the player can't currently see
                playerCostMap[i][j] = 100;
                monsterCostMap[i][j] = 1;
                    } else {
                        playerCostMap[i][j] = monsterCostMap[i][j] = 1;
                    }
                }
            }
        }
            */
            return this._costMap;
        }
        get goalMap() {
            return this._goalMap;
        }
        hasGoal() {
            return !!this._goalMap;
        }
        setGoal(x, y) {
            const map = this._map;
            if (!map)
                throw new Error('No map to set goal with!');
            if (!this._goalMap) {
                this._goalMap = GWU__namespace.grid.alloc(map.width, map.height);
            }
            const goalMap = this._goalMap;
            GWU__namespace.path.calculateDistances(goalMap, x, y, this.costMap());
            return this._goalMap;
        }
        clearGoal() {
            if (this._goalMap) {
                GWU__namespace.grid.free(this._goalMap);
                this._goalMap = null;
            }
        }
        mapToMe() {
            if (!this.map)
                throw new Error('No map!');
            if (!this._mapToMe) {
                this._mapToMe = GWU__namespace.grid.alloc(this.map.width, this.map.height);
            }
            if (this._mapToMe.x !== this.x || this._mapToMe.y !== this.y) {
                GWU__namespace.path.calculateDistances(this._mapToMe, this.x, this.y, this.costMap());
            }
            return this._mapToMe;
        }
    }
    Actor.default = {
        sidebarFg: 'purple',
    };

    const handlers = {};
    function installHandler(id, handler) {
        handlers[id.toLowerCase()] = handler;
    }
    function make$6(id, config) {
        if (!id)
            return GWU__namespace.NOOP;
        if (typeof id === 'string') {
            if (!id.length)
                throw new Error('Cannot create effect from empty string.');
            if (!config) {
                const parts = id.split(':');
                id = parts.shift().toLowerCase();
                config = parts;
            }
            const handler = handlers[id];
            if (!handler)
                throw new Error('Failed to find effect - ' + id);
            return handler(config || {});
        }
        let steps;
        if (Array.isArray(id)) {
            steps = id
                .map((config) => make$6(config))
                .filter((a) => a !== null);
        }
        else if (typeof id === 'function') {
            return id;
        }
        else {
            steps = Object.entries(id)
                .map(([key, config]) => make$6(key, config))
                .filter((a) => a !== null);
        }
        if (steps.length === 1) {
            return steps[0];
        }
        return (a) => {
            const x = a.x;
            const y = a.y;
            for (let step of steps) {
                a.x = x;
                a.y = y;
                step && step(a);
                if (a.isDone())
                    return;
            }
        };
    }
    function makeArray(cfg) {
        if (!cfg)
            return [];
        if (Array.isArray(cfg)) {
            return cfg
                .map((c) => make$6(c))
                .filter((fn) => fn !== null);
        }
        if (typeof cfg === 'string') {
            if (!cfg.length)
                throw new Error('Cannot create effect from empty string.');
            const parts = cfg.split(':');
            cfg = parts.shift().toLowerCase();
            const handler = handlers[cfg];
            if (!handler)
                return [];
            return [handler(parts)];
        }
        else if (typeof cfg === 'function') {
            return [cfg];
        }
        const steps = Object.entries(cfg).map(([key, config]) => make$6(key, config));
        return steps.filter((s) => s !== null);
    }
    function trigger(effect, map, x, y, opts) {
        const cfg = Object.assign({ map, x, y }, opts);
        const action = new Action(cfg);
        const fn = handlers[effect];
        if (!fn)
            return;
        fn(action);
    }
    /*

    /////////////////////////
    // TYPES

    export type MakeEffectFn = (config: any) => Effect;

    export const effectTypes: Record<string, MakeEffectFn> = {};

    export function installType(id: string, type: MakeEffectFn) {
        effectTypes[id] = type;
    }

    //////////////////////////
    // EFFECT

    export interface Effect {
        chance: number; //  100 * 100 =  100%
        seen: boolean;
        effects: EffectFn[];
        next: Effect | null;

        trigger(loc: MapXY, ctx?: EffectCtx): boolean;
        // clone(): this;
    }

    //////////////////////////
    // MAKE

    export interface EffectConfig {
        chance?: number | string;
        type?: string; // basic | bolt | beam | ball | burst | adjacent | spread

        effects: string | EffectFn | (string | EffectFn)[] | Record<string, any>;
        good?: boolean;
        flags?: GWU.flag.FlagBase;

        next?: EffectBase;

        [key: string]: any;
    }

    export type EffectBase =
        | string
        | EffectFn
        | (string | EffectFn)[]
        | EffectConfig
        | Record<string, any>;

    */
    // export class Effect {
    //     id = '';
    //     chance = 100 * 100; // 100%
    //     type: string; // self | bolt | beam | ball | burst | adjacent | spread
    //     aim: string; // actor | item | cell
    //     bolt: string | GWU.sprite.SpriteData | null = null;
    //     beam = false;
    //     range = 0;
    //     ball: string | GWU.sprite.SpriteData | null = null;
    //     radius = 0;
    //     center = false;
    //     effects: EffectFn[];
    //     good = false;
    //     seen = false;
    //     next: Effect | null = null;
    //     constructor(config: EffectConfig) {
    //         if (typeof config.effects === 'string') {
    //             config.effects = [config.effects];
    //         } else if (typeof config.effects === 'function') {
    //             config.effects = [config.effects];
    //         }
    //         this.aim = config.aim || 'actor';
    //         if (typeof config.chance === 'string') {
    //             // '20%' becomes 2000
    //             config.chance = Math.floor(Number.parseFloat(config.chance) * 100);
    //         }
    //         this.chance = config.chance || 100 * 100;
    //         const type = config.type || 'basic';
    //         const parts = type.split(':');
    //         if (type.startsWith('bolt') || type.startsWith('beam')) {
    //             // bolt:range:sprite
    //             this.type = parts[0];
    //             this.range = parts[1] ? Number.parseInt(parts[1]) : 99;
    //             this.bolt = parts[1] || 'missile';
    //             this.beam = type.startsWith('beam');
    //         } else if (
    //             type.startsWith('ball') ||
    //             type.startsWith('burst') ||
    //             type.startsWith('aura')
    //         ) {
    //             this.type = parts[0];
    //             this.radius = parts[1] ? Number.parseInt(parts[1]) : 2;
    //             this.range = parts[2] ? Number.parseInt(parts[2]) : 99;
    //             this.ball = parts[3] || 'explosion';
    //             this.center = !type.startsWith('aura');
    //         } else {
    //             this.type = 'basic';
    //         }
    //         if (typeof config.effects === 'string') {
    //             config.effects = [config.effects];
    //         } else if (typeof config.effects === 'function') {
    //             config.effects = [config.effects];
    //         }
    //         if (Array.isArray(config.effects)) {
    //             this.effects = config.effects.map((e) => {
    //                 if (typeof e === 'function') return e;
    //                 return effectFnFromString(e);
    //             });
    //         } else {
    //             this.effects = [];
    //             Object.entries(config.effects).forEach(([key, value]) => {
    //                 const handler = handlers[key.toLowerCase()];
    //                 if (handler) {
    //                     this.effects.push(handler(value));
    //                 } else if (typeof value === 'function') {
    //                     this.effects.push(value);
    //                 } else {
    //                     throw new Error('Unknown effect: ' + key);
    //                 }
    //             });
    //         }
    //         if (this.effects.length === 0) throw new Error('No effects!');
    //     }
    //     clone(): this {
    //         const other = new (this.constructor as new (
    //             config: EffectConfig
    //         ) => this)(this as EffectConfig);
    //         return other;
    //     }
    //     fire(map: Map.MapType, x: number, y: number, ctx: EffectCtx = {}): boolean {
    //         let didSomething = false;
    //         ctx.good = this.good;
    //         ctx.seen = this.seen;
    //         if (!this.chance || map.rng.chance(this.chance, 10000)) {
    //             // fire
    //             for (let effect of this.effects) {
    //                 if (GWU.data.gameHasEnded) break;
    //                 if (effect(map, x, y, ctx)) {
    //                     didSomething = true;
    //                 } else {
    //                     break;
    //                 }
    //             }
    //         }
    //         if (ctx.aware && didSomething) {
    //             this.seen = true;
    //         }
    //         this.good = ctx.good;
    //         return didSomething;
    //     }
    //     reset() {
    //         this.seen = false;
    //     }
    // }
    // export function effectFnFromString(e: string): EffectFn {
    //     const parts = e.split(':');
    //     if (parts.length === 0) throw new Error('Invalid effect string.');
    //     // @ts-ignore
    //     const name = parts.shift().toLowerCase();
    //     const handler = handlers[name] || null;
    //     if (!handler) {
    //         throw new Error('Failed to find effect handler: ' + name);
    //     }
    //     return handler(parts);
    // }
    /*
    export function make(opts: EffectBase): Effect {
        if (!opts) throw new Error('opts required to make effect.');
        let config = {} as EffectConfig;

        if (typeof opts === 'string') {
            // Special case
            if (opts.toLowerCase().startsWith('spread:')) {
                const endPos = opts.indexOf(':', 8);
                const tile = opts.substring(8, endPos);
                config = {
                    type: 'spread:' + opts.substring(endPos),
                    effects: ['tile:' + tile],
                };
            } else {
                config = { type: 'basic', effects: [opts] };
            }
        } else if (typeof opts === 'function') {
            config = { type: 'basic', effects: [opts] };
        } else if (Array.isArray(opts)) {
            config = { type: 'basic', effects: opts };
        } else {
            // @ts-ignore
            if (opts.effect) {
                // @ts-ignore
                opts.effects = [opts.effect];
                delete opts.effect;
            }

            // object only
            if (opts.effects) {
                Object.assign(config, opts);
                if (typeof config.effects === 'string') {
                    config.effects = [opts.effects];
                } else if (typeof config.effects === 'function') {
                    config.effects = [opts.effects];
                }
            } else {
                config.effects = {} as Record<string, any>;
                Object.entries(opts).forEach(([key, value]) => {
                    const handler = handlers[key.toLowerCase()];
                    if (handler !== undefined) {
                        // @ts-ignore
                        config.effects[key] = value;
                    } else if (typeof value === 'function') {
                        // @ts-ignore
                        config.effects[key] = value;
                    } else {
                        // @ts-ignore
                        config[key] = value;
                    }
                });
            }
        }

        config.type = config.type || 'basic';

        if (typeof config.type !== 'string')
            throw new Error('Invalid effect type: ' + JSON.stringify(config.type));

        const typeParts = config.type.split(':').map((t) => t.trim());
        const typeName = typeParts.shift()!;

        const makeFn = effectTypes[typeName.toLowerCase()];
        if (!makeFn) throw new Error('Invalid effect type: ' + typeName);

        const effect = makeFn(config);

        if (Array.isArray(config.effects)) {
            config.effects.forEach((e: string | EffectFn) => {
                if (typeof e === 'function') {
                    effect.effects.push(e);
                } else {
                    const parts = e.split(':').map((t: string) => t.trim());

                    if (parts.length === 1) {
                        const effect = installedEffects[parts[0]];
                        if (!effect)
                            throw new Error(
                                'Failed to find effect with id: ' + parts[0]
                            );
                        effect.effects.push(effect.trigger.bind(effect));
                    } else {
                        const handler = handlers[parts[0].toLowerCase()];
                        if (!handler)
                            throw new Error('Unknown effect: ' + parts[0]);
                        parts.shift();
                        effect.effects.push(handler(parts));
                    }
                }
            });
        } else {
            Object.entries(config.effects).forEach(([key, value]) => {
                const handler = handlers[key.toLowerCase()];
                if (!handler)
                    throw new Error('Failed to find handler type: ' + key);

                effect.effects.push(handler(value));
            });
        }

        if (config.next) {
            effect.next = make(config.next);
        }

        return effect;
    }

    export function from(opts: EffectBase): Effect {
        if (!opts) throw new Error('Cannot make effect from null | undefined');
        if (typeof opts === 'object' && 'trigger' in opts) {
            return opts as Effect;
        }

        if (typeof opts === 'string') {
            const effect = installedEffects[opts];
            if (effect) return effect;
            throw new Error('Unknown effect - ' + opts);
        }
        return make(opts);
    }
    */
    //////////////////////////////
    // INSTALL
    const installed = {};
    function install$6(id, config) {
        const effect = make$6(config);
        if (!effect)
            throw new Error('Failed to make effect.');
        installed[id] = effect;
        return effect;
    }
    function installAll$2(effects) {
        Object.entries(effects).forEach(([id, config]) => {
            install$6(id, config);
        });
    }
    function resetAll() {
        Object.values(installed).forEach((e) => (e.seen = false));
    }

    var index$e = /*#__PURE__*/Object.freeze({
        __proto__: null,
        handlers: handlers,
        installHandler: installHandler,
        make: make$6,
        makeArray: makeArray,
        trigger: trigger,
        installed: installed,
        install: install$6,
        installAll: installAll$2,
        resetAll: resetAll
    });

    class Tile {
        constructor(config) {
            var _a, _b, _c, _d;
            this.index = -1;
            this.dissipate = 20 * 100; // 0%
            this.actions = new Actions(this);
            this.priority = 50;
            this.depth = 0;
            this.light = null;
            this.groundTile = null;
            this.tags = [];
            this.id = config.id || 'n/a';
            this.dissipate = (_a = config.dissipate) !== null && _a !== void 0 ? _a : this.dissipate;
            this.priority = (_b = config.priority) !== null && _b !== void 0 ? _b : this.priority;
            this.depth = (_c = config.depth) !== null && _c !== void 0 ? _c : this.depth;
            this.light = config.light || null;
            this.groundTile = config.groundTile || null;
            this.sprite = GWU__namespace.sprite.make(config);
            this.name = config.name || 'tile';
            this.description = config.description || this.name;
            this.flavor = config.flavor || this.name;
            this.article = (_d = config.article) !== null && _d !== void 0 ? _d : null;
            this.flags = config.flags || { entity: 0, tile: 0, tileMech: 0 };
            if (config.actions) {
                Object.entries(config.actions).forEach(([ev, fn]) => {
                    this.on(ev, fn);
                });
            }
            if (config.tags) {
                if (typeof config.tags === 'string') {
                    config.tags
                        .split(/[,|]/)
                        .map((t) => t.trim())
                        .forEach((t) => {
                        this.tags.push(t);
                    });
                }
                else {
                    this.tags = config.tags.slice().map((t) => t.trim());
                }
            }
        }
        hasTag(tag) {
            return this.tags.includes(tag);
        }
        hasAnyTag(tags) {
            return GWU__namespace.arraysIntersect(this.tags, tags);
        }
        hasAllTags(tags) {
            return tags.every((t) => this.tags.includes(t));
        }
        hasEntityFlag(flag) {
            return !!(this.flags.entity & flag);
        }
        hasTileFlag(flag) {
            return !!(this.flags.tile & flag);
        }
        hasTileMechFlag(flag) {
            return !!(this.flags.tileMech & flag);
        }
        hasAllEntityFlags(flag) {
            return (this.flags.entity & flag) === flag;
        }
        hasAllTileFlags(flag) {
            return (this.flags.tile & flag) === flag;
        }
        hasAllTileMechFlags(flag) {
            return (this.flags.tileMech & flag) === flag;
        }
        blocksVision() {
            return !!(this.flags.entity & Entity$1.L_BLOCKS_VISION);
        }
        blocksMove() {
            return !!(this.flags.entity & Entity$1.L_BLOCKS_MOVE);
        }
        blocksPathing() {
            return (this.blocksMove() || this.hasTileFlag(Tile$1.T_PATHING_BLOCKER));
        }
        blocksEffects() {
            return !!(this.flags.entity & Entity$1.L_BLOCKS_EFFECTS);
        }
        // ACTIONS
        hasAction(name) {
            return this.actions.has(name);
        }
        on(name, fn) {
            if (!fn) {
                this.actions.off(name);
                if (name === 'fire') {
                    this.flags.tile &= ~Tile$1.T_IS_FLAMMABLE;
                }
                return;
            }
            if (typeof fn === 'string') {
                const effect = make$6(fn);
                if (effect === null)
                    throw new Error('Failed to make effect: ' + fn);
                fn = effect;
            }
            if (Array.isArray(fn)) {
                fn.reverse().forEach((cb) => this.on(name, cb));
            }
            else if (typeof fn === 'object') {
                Object.entries(fn)
                    .reverse()
                    .forEach(([key, value]) => {
                    const effect = make$6(key, value);
                    effect && this.on(name, effect);
                });
            }
            else {
                this.actions.on(name, fn);
                if (name === 'fire') {
                    this.flags.tile |= Tile$1.T_IS_FLAMMABLE;
                }
            }
        }
        trigger(name, action = {}) {
            if (!(action instanceof Action)) {
                action = new Action(action);
            }
            if (!action.map)
                throw new Error('Need action with a map.');
            this.actions.trigger(name, action);
        }
        // INFO
        isNull() {
            return this === NULL;
        }
        isPassable() {
            return !this.blocksMove();
        }
        isWall() {
            return this.hasAllEntityFlags(Entity$1.L_WALL_FLAGS);
        }
        isDoor() {
            return this.hasTileFlag(Tile$1.T_IS_DOOR);
        }
        isStairs() {
            return this.hasTileFlag(Tile$1.T_HAS_STAIRS);
        }
        isFloor() {
            // Floor tiles do not block anything...
            return (!this.hasEntityFlag(Entity$1.L_BLOCKS_EVERYTHING) &&
                !this.hasTileFlag(Tile$1.T_PATHING_BLOCKER));
        }
        isDiggable() {
            return this.isNull() || this.isWall();
        }
        getName(arg) {
            let opts = {};
            if (typeof arg === 'boolean') {
                opts.article = arg;
            }
            else if (typeof arg === 'string') {
                opts.article = arg;
            }
            else if (arg) {
                opts = arg;
            }
            if (!opts.article && !opts.color)
                return this.name;
            let result = this.name;
            if (opts.color) {
                let color = opts.color;
                if (opts.color === true) {
                    color = this.sprite.fg || 'white';
                }
                if (typeof color !== 'string') {
                    color = GWU__namespace.color.from(color).toString();
                }
                result = `Ω${color}Ω${this.name}∆`;
            }
            if (opts.article) {
                let article = typeof opts.article === 'string'
                    ? opts.article
                    : this.article || 'a';
                result = article + ' ' + result;
            }
            return result;
        }
        getDescription(opts) {
            return this.description || this.getName(opts);
        }
        getFlavor(opts) {
            return this.flavor || this.getName(opts);
        }
    }
    function make$5(options) {
        var _a, _b, _c, _d, _e, _f;
        let base = { flags: {}, sprite: {}, priority: 50 };
        if (options.extends) {
            base = tiles[options.extends];
            if (!base)
                throw new Error('Failed to find base tile: ' + options.extends);
        }
        let priority = base.priority;
        if (typeof options.priority === 'string') {
            let text = options.priority.replace(/ /g, '');
            let index = text.search(/[+-]/);
            if (index == 0) {
                priority = base.priority + Number.parseInt(text);
            }
            else if (index == -1) {
                if (text.search(/[a-zA-Z]/) == 0) {
                    const tile = tiles[text];
                    if (!tile)
                        throw new Error('Failed to find tile for priority - ' + text + '.');
                    priority = tile.priority;
                }
                else {
                    priority = Number.parseInt(text);
                }
            }
            else {
                const id = text.substring(0, index);
                const delta = Number.parseInt(text.substring(index));
                const tile = tiles[id];
                if (!tile)
                    throw new Error('Failed to find tile for priority - ' + id + '.');
                priority = tile.priority + delta;
            }
        }
        else if (options.priority !== undefined) {
            priority = options.priority;
        }
        const flags = {
            entity: GWU__namespace.flag.from(Entity$1, base.flags.entity, options.flags),
            tile: GWU__namespace.flag.from(Tile$1, base.flags.tile, options.flags),
            tileMech: GWU__namespace.flag.from(TileMech, base.flags.tileMech, options.flags),
        };
        let depth = base.depth || 0;
        if (options.depth) {
            if (typeof options.depth === 'string') {
                depth = Depth[options.depth];
            }
            else {
                depth = options.depth;
            }
        }
        let light = base.light;
        if (options.light) {
            light = GWU__namespace.light.make(options.light);
        }
        else if (options.light === null) {
            light = null;
        }
        const config = {
            id: options.id,
            flags,
            dissipate: (_a = options.dissipate) !== null && _a !== void 0 ? _a : base.dissipate,
            priority,
            depth: depth,
            light,
            groundTile: options.groundTile || null,
            ch: (_b = options.ch) !== null && _b !== void 0 ? _b : base.sprite.ch,
            fg: (_c = options.fg) !== null && _c !== void 0 ? _c : base.sprite.fg,
            bg: (_d = options.bg) !== null && _d !== void 0 ? _d : base.sprite.bg,
            opacity: (_e = options.opacity) !== null && _e !== void 0 ? _e : base.sprite.opacity,
            name: options.name || base.name,
            description: options.description || base.description,
            flavor: options.flavor || base.flavor,
            article: (_f = options.article) !== null && _f !== void 0 ? _f : base.article,
            tags: options.tags || null,
        };
        const tile = new Tile(config);
        if (base && base.actions) {
            tile.actions.copy(base.actions);
        }
        if (options.actions) {
            Object.entries(options.actions).forEach(([key, value]) => {
                tile.on(key, value);
            });
        }
        return tile;
    }
    const tiles = {};
    const all = [];
    function get$3(id) {
        if (id instanceof Tile)
            return id;
        if (typeof id === 'string') {
            const t = tiles[id];
            if (t)
                return t;
            throw new Error('Failed to find tile with id - ' + id);
        }
        const t = all[id];
        if (t)
            return t;
        throw new Error('Failed to find tile with index - ' + id);
    }
    function install$5(id, ...args) {
        let options = args[0];
        if (args.length == 2) {
            options = args[1];
            options.extends = args[0];
        }
        options.id = id;
        const tile = make$5(options);
        tile.index = all.length;
        all.push(tile);
        tiles[id] = tile;
        return tile;
    }
    function installAll$1(tiles) {
        Object.entries(tiles).forEach(([id, config]) => {
            install$5(id, config);
        });
    }
    // These are the minimal set of tiles to make the diggers work
    const NULL = install$5('NULL', {
        ch: '\u2205',
        fg: 'white',
        bg: 'black',
        flags: 'L_BLOCKS_MOVE',
        name: 'eerie nothingness',
        article: 'an',
        priority: 0,
    });

    const flags = { Tile: Tile$1, TileMech };
    // import './tiles';

    var index$d = /*#__PURE__*/Object.freeze({
        __proto__: null,
        flags: flags,
        Tile: Tile,
        make: make$5,
        tiles: tiles,
        all: all,
        get: get$3,
        install: install$5,
        installAll: installAll$1,
        NULL: NULL
    });

    GWU__namespace.color.install('cellStatusName', 'light_blue');
    const NEVER_SEEN = {
        tiles: [NULL],
        item: null,
        actor: null,
        flags: {
            cell: 0,
            entity: NULL.flags.entity,
            tile: NULL.flags.tile,
            tileMech: NULL.flags.tileMech,
        },
    };
    class Cell {
        constructor(map, x, y, groundTile) {
            this.chokeCount = 0;
            this.machineId = 0;
            this.x = -1;
            this.y = -1;
            // toFire: Partial<Effect.EffectCtx>[] = [];
            this.memory = null;
            this.volume = 0;
            // this._entities = new CellEntities(this);
            this.flags = { cell: Cell$1.NEEDS_REDRAW };
            this.tiles = [tiles.NULL];
            this.map = map;
            this.x = x;
            this.y = y;
            this.snapshot = GWU__namespace.sprite.makeMixer();
            if (groundTile) {
                const tile = get$3(groundTile);
                this.setTile(tile);
            }
            this.memory = NEVER_SEEN;
        }
        getSnapshot(dest) {
            dest.copy(this.snapshot);
        }
        putSnapshot(src) {
            this.snapshot.copy(src);
        }
        get hasStableSnapshot() {
            return this.hasCellFlag(Cell$1.STABLE_SNAPSHOT);
        }
        get hasStableMemory() {
            return this.hasCellFlag(Cell$1.STABLE_MEMORY);
        }
        storeMemory() {
            var _a;
            this.setCellFlag(Cell$1.STABLE_MEMORY);
            // store memory
            this.memory = {
                flags: {
                    cell: this.flags.cell,
                    entity: this.tiles.reduce((out, tile) => out | ((tile === null || tile === void 0 ? void 0 : tile.flags.entity) || 0), 0),
                    tile: this.tiles.reduce((out, tile) => out | ((tile === null || tile === void 0 ? void 0 : tile.flags.tile) || 0), 0),
                    tileMech: this.tiles.reduce((out, tile) => out | ((tile === null || tile === void 0 ? void 0 : tile.flags.tileMech) || 0), 0),
                },
                tiles: this.tiles.slice(),
                item: ((_a = this.item) === null || _a === void 0 ? void 0 : _a.clone()) || null,
                actor: null,
            };
            if (this.hasItem()) {
                const item = this.item;
                if (item) {
                    this.memory.flags.entity |= item.flags.entity;
                }
            }
            if (this.hasActor()) {
                const actor = this.actor;
                if (actor) {
                    this.memory.flags.entity |= actor.flags.entity;
                }
                this.clearCellFlag(Cell$1.STABLE_SNAPSHOT);
            }
        }
        clearMemory() {
            this.clearCellFlag(Cell$1.STABLE_SNAPSHOT | Cell$1.STABLE_MEMORY);
            this.memory = null;
            this.needsRedraw = true;
        }
        copy(other) {
            Object.assign(this.flags, other.flags);
            this.chokeCount = other.chokeCount;
            this.tiles.length = other.tiles.length;
            for (let i = 0; i < this.tiles.length; ++i) {
                this.tiles[i] = other.tiles[i];
            }
            this.machineId = other.machineId;
            // this._actor = other.actor;
            // this._item = other.item;
            this.memory = other.memory;
            this.volume = other.volume;
            this.map = other.map;
            this.x = other.x;
            this.y = other.y;
            other.getSnapshot(this.snapshot);
        }
        hasCellFlag(flag) {
            return !!(this.flags.cell & flag);
        }
        setCellFlag(flag) {
            this.flags.cell |= flag;
        }
        clearCellFlag(flag) {
            this.flags.cell &= ~flag;
        }
        hasEntityFlag(flag, checkEntities = false) {
            var _a, _b;
            if (this.tiles.some((t) => t && t.flags.entity & flag))
                return true;
            if (!checkEntities)
                return false;
            if (this.hasItem()) {
                if ((_a = this.item) === null || _a === void 0 ? void 0 : _a.hasEntityFlag(flag))
                    return true;
            }
            if (this.hasActor()) {
                if ((_b = this.actor) === null || _b === void 0 ? void 0 : _b.hasEntityFlag(flag))
                    return true;
            }
            return false;
        }
        hasAllEntityFlags(flags, checkEntities = false) {
            return (this.entityFlags(checkEntities) & flags) == flags;
        }
        hasTileFlag(flag) {
            return this.tiles.some((t) => t && t.flags.tile & flag);
        }
        hasAllTileFlags(flags) {
            return (this.tileFlags() & flags) == flags;
        }
        hasTileMechFlag(flag) {
            return this.tiles.some((t) => t && t.flags.tileMech & flag);
        }
        hasAllTileMechFlags(flags) {
            return (this.tileMechFlags() & flags) == flags;
        }
        hasTileTag(tag) {
            return this.tiles.some((tile) => tile && tile.hasTag(tag));
        }
        hasAllTileTags(tags) {
            return this.tiles.some((tile) => {
                return tile && tile.hasAllTags(tags);
            });
        }
        hasAnyTileTag(tags) {
            return this.tiles.some((tile) => {
                return tile && tile.hasAnyTag(tags);
            });
        }
        cellFlags() {
            return this.flags.cell;
        }
        entityFlags(withEntities = false) {
            var _a, _b;
            let flag = this.tiles.reduce((out, t) => out | (t ? t.flags.entity : 0), 0);
            if (withEntities) {
                if (this.hasItem()) {
                    flag |= ((_a = this.item) === null || _a === void 0 ? void 0 : _a.flags.entity) || 0;
                }
                if (this.hasActor()) {
                    flag |= ((_b = this.actor) === null || _b === void 0 ? void 0 : _b.flags.entity) || 0;
                }
            }
            return flag;
        }
        tileFlags() {
            return this.tiles.reduce((out, t) => out | (t ? t.flags.tile : 0), 0);
        }
        tileMechFlags() {
            return this.tiles.reduce((out, t) => out | (t ? t.flags.tileMech : 0), 0);
        }
        get needsRedraw() {
            return !!(this.flags.cell & Cell$1.NEEDS_REDRAW);
        }
        set needsRedraw(v) {
            if (v) {
                if (!this.memory) {
                    this.flags.cell |= Cell$1.NEEDS_REDRAW;
                    this.flags.cell &= ~Cell$1.STABLE_SNAPSHOT;
                    this.map.needsRedraw = true;
                }
            }
            else {
                this.flags.cell &= ~Cell$1.NEEDS_REDRAW;
            }
        }
        get changed() {
            return !!(this.flags.cell & Cell$1.CHANGED);
        }
        depthPriority(depth) {
            const tile = this.tiles[depth];
            return tile ? tile.priority : tiles.NULL.priority;
        }
        highestPriority() {
            return this.tiles.reduce((out, t) => Math.max(out, t ? t.priority : 0), tiles.NULL.priority);
        }
        depthTile(depth) {
            return this.tiles[depth] || null;
        }
        hasTile(tile) {
            if (!tile)
                return this.tiles.some((t) => t);
            if (!(tile instanceof Tile)) {
                tile = get$3(tile);
            }
            return this.tiles.includes(tile);
        }
        hasDepthTile(depth) {
            const t = this.tiles[depth];
            return !!t && t !== tiles.NULL;
        }
        highestPriorityTile() {
            return this.tiles.reduce((out, tile) => {
                if (!tile)
                    return out;
                if (tile.priority >= out.priority)
                    return tile; // higher depth will get picked with >=
                return out;
            }, tiles.NULL);
        }
        get tile() {
            return this.highestPriorityTile();
        }
        eachTile(cb) {
            this.tiles.forEach((t) => t && cb(t));
        }
        tileWithObjectFlag(flag) {
            return this.tiles.find((t) => t && t.flags.entity & flag) || null;
        }
        tileWithFlag(flag) {
            return this.tiles.find((t) => t && t.flags.tile & flag) || null;
        }
        tileWithMechFlag(flag) {
            return this.tiles.find((t) => t && t.flags.tileMech & flag) || null;
        }
        blocksVision() {
            return this.tiles.some((t) => t && t.blocksVision());
        }
        blocksPathing() {
            return (this.tiles.some((t) => t && t.blocksPathing()) &&
                !this.tiles.some((t) => t && t.hasTileFlag(Tile$1.T_BRIDGE)));
        }
        blocksMove() {
            return this.tiles.some((t) => t && t.blocksMove());
        }
        blocksEffects() {
            return this.tiles.some((t) => t && t.blocksEffects());
        }
        blocksLayer(depth) {
            return this.tiles.some((t) => t &&
                !!(t.flags.tile & flags.Tile.T_BLOCKS_OTHER_LAYERS) &&
                t.depth != depth);
        }
        // Tests
        isNull() {
            return this.tiles.every((t) => !t || t === tiles.NULL);
        }
        isPassable() {
            return !this.blocksMove();
        }
        isWall() {
            return this.hasAllEntityFlags(Entity$1.L_WALL_FLAGS);
        }
        isDoor() {
            return this.hasTileFlag(Tile$1.T_IS_DOOR);
        }
        isStairs() {
            return this.hasTileFlag(Tile$1.T_HAS_STAIRS);
        }
        isFloor() {
            // Floor tiles do not block anything...
            return (!this.hasEntityFlag(Entity$1.L_BLOCKS_EVERYTHING) &&
                !this.hasTileFlag(Tile$1.T_PATHING_BLOCKER));
        }
        isGateSite() {
            return this.hasCellFlag(Cell$1.IS_GATE_SITE);
        }
        isSecretlyPassable() {
            return this.hasEntityFlag(Entity$1.L_SECRETLY_PASSABLE);
        }
        // hasKey(): boolean {
        //     return this._entities.some(
        //         (e) => !!e.key && e.key.matches(this.x, this.y)
        //     );
        // }
        hasLiquid() {
            return this.hasTileFlag(Tile$1.T_ANY_LIQUID);
        }
        // @returns - whether or not the change results in a change to the cell tiles.
        //          - If there is a change to cell lighting, the cell will have the
        //          - LIGHT_CHANGED flag set.
        setTile(tile, opts = {}) {
            if (!(tile instanceof Tile)) {
                tile = get$3(tile);
                if (!tile)
                    return false;
            }
            const current = this.tiles[tile.depth] || tiles.NULL;
            if (current === tile) {
                if (opts.volume) {
                    this.volume += opts.volume;
                }
                return false;
            }
            if (!opts.superpriority) {
                // if (current !== tile) {
                //     this.gasVolume = 0;
                //     this.liquidVolume = 0;
                // }
                // Check priority, etc...
                if (current.priority > tile.priority) {
                    return false;
                }
            }
            if (this.blocksLayer(tile.depth))
                return false;
            if (opts.blockedByItems && this.hasItem())
                return false;
            if (opts.blockedByActors && this.hasActor())
                return false;
            if (opts.blockedByOtherLayers && this.highestPriority() > tile.priority)
                return false;
            // TODO - Are we blocked by other layer (L_BLOCKS_SURFACE on an already present tile)?
            if (tile.depth > Depth.GROUND && tile.groundTile) {
                const currentGround = this.depthTile(Depth.GROUND);
                const wantGround = get$3(tile.groundTile);
                if (currentGround !== wantGround) {
                    if (!this.setTile(wantGround, opts)) {
                        return false;
                    }
                }
            }
            this.tiles[tile.depth] = tile;
            this.needsRedraw = true;
            if (tile.hasEntityFlag(Entity$1.L_BLOCKS_SURFACE)) {
                this.clearDepth(Depth.SURFACE);
            }
            if (opts.machine) {
                this.machineId = opts.machine;
            }
            if (current.light !== tile.light) {
                this.map.light.glowLightChanged = true;
            }
            if (current.hasTileFlag(Tile$1.T_LIST_IN_SIDEBAR) !==
                tile.hasTileFlag(Tile$1.T_LIST_IN_SIDEBAR)) {
                this.map.setMapFlag(Map$1.MAP_SIDEBAR_TILES_CHANGED);
            }
            if (tile.hasTileFlag(Tile$1.T_IS_FIRE)) {
                this.setCellFlag(Cell$1.CAUGHT_FIRE_THIS_TURN);
            }
            if (tile.hasTileFlag(Tile$1.T_IS_FIRE)) {
                this.map.setMapFlag(Map$1.MAP_HAS_FIRE);
            }
            this.volume = opts.volume || 0;
            if (tile.depth === Depth.GAS) {
                this.map.setMapFlag(Map$1.MAP_HAS_GAS);
            }
            if (tile.depth === Depth.LIQUID) {
                this.map.setMapFlag(Map$1.MAP_HAS_LIQUID);
            }
            // if (volume) {
            //     if (tile.depth === Depth.GAS) {
            //         this.gasVolume = volume;
            //     }
            //     if (tile.depth === Depth.LIQUID) {
            //         this.liquidVolume = volume;
            //     }
            // }
            return true;
        }
        clearTiles(tile) {
            this.tiles[0] = tiles.NULL;
            for (let i = 1; i < this.tiles.length; ++i) {
                this.tiles[i] = null;
            }
            if (tile) {
                this.setTile(tile);
            }
            this.needsRedraw = true;
        }
        clear(tile) {
            this.tiles = [tiles.NULL];
            this.flags.cell = 0;
            this.needsRedraw = true;
            this.chokeCount = 0;
            this.machineId = 0;
            this.volume = 0;
            if (tile) {
                this.setTile(tile);
            }
            this.snapshot.blackOut();
        }
        clearDepth(depth) {
            if (depth == 0) {
                this.tiles[0] = tiles.NULL;
                this.needsRedraw = true;
                return true;
            }
            else if (this.tiles[depth] !== null) {
                this.tiles[depth] = null;
                this.needsRedraw = true;
                if (depth === Depth.GAS) {
                    this.volume = 0;
                }
                return true;
            }
            return false;
        }
        clearDepthsWithFlags(tileFlag, tileMechFlag = 0) {
            for (let i = 0; i < this.tiles.length; ++i) {
                const tile = this.tiles[i];
                if (!tile)
                    continue;
                if (!tile.hasTileFlag(tileFlag))
                    continue;
                if (tileMechFlag && !tile.hasTileMechFlag(tileMechFlag))
                    continue;
                this.clearDepth(i);
            }
        }
        // Lights
        eachGlowLight(cb) {
            this.tiles.forEach((tile) => {
                if (tile && tile.light)
                    cb(tile.light);
            });
        }
        // Effects
        tileWithAction(name) {
            return this.tiles.find((t) => t === null || t === void 0 ? void 0 : t.hasAction(name)) || null;
        }
        trigger(action, ctx = {}) {
            if (!(ctx instanceof Action)) {
                ctx = new Action(ctx);
            }
            ctx.x = this.x;
            ctx.y = this.y;
            ctx.map = this.map;
            this.tiles.forEach((t) => t && t.trigger(action, ctx));
        }
        hasAction(name) {
            for (let tile of this.tiles) {
                if (tile && tile.hasAction(name))
                    return true;
            }
            return false;
        }
        // // Items
        hasItem() {
            return this.hasCellFlag(Cell$1.HAS_ITEM);
        }
        get item() {
            return this.map.itemAt(this.x, this.y);
        }
        canAddItem(_item) {
            return true;
        }
        canRemoveItem(_item) {
            return true;
        }
        _addItem(_item) {
            this.setCellFlag(Cell$1.HAS_ITEM);
            this.needsRedraw = true;
            // this.clearCellFlag(Flags.Cell.STABLE_SNAPSHOT);
            return true;
        }
        _removeItem(item) {
            let hasItems = false;
            let foundIndex = -1;
            this.map.items.forEach((obj, index) => {
                if (obj === item) {
                    foundIndex = index;
                }
                else if (obj.x === this.x && obj.y === this.y) {
                    hasItems = true;
                }
            });
            if (!hasItems) {
                this.clearCellFlag(Cell$1.HAS_ITEM);
            }
            if (foundIndex < 0)
                return false;
            this.needsRedraw = true;
            // this.clearCellFlag(Flags.Cell.STABLE_SNAPSHOT);
            return true;
        }
        // // Actors
        hasActor() {
            return this.hasCellFlag(Cell$1.HAS_ACTOR);
        }
        hasPlayer() {
            return this.hasCellFlag(Cell$1.HAS_PLAYER);
        }
        get actor() {
            return this.map.actorAt(this.x, this.y);
        }
        canAddActor(_actor) {
            return !this.hasActor();
        }
        canRemoveActor(_actor) {
            return true;
        }
        _addActor(actor) {
            this.setCellFlag(Cell$1.HAS_ACTOR);
            if (actor.isPlayer()) {
                this.setCellFlag(Cell$1.HAS_PLAYER);
            }
            this.needsRedraw = true;
            // this.clearCellFlag(Flags.Cell.STABLE_SNAPSHOT);
            return true;
        }
        _removeActor(actor) {
            let hasActor = false;
            let foundIndex = -1;
            this.map.actors.forEach((obj, index) => {
                if (obj === actor) {
                    foundIndex = index;
                }
                else if (obj.x === this.x && obj.y === this.y) {
                    hasActor = true;
                }
            });
            if (!hasActor) {
                this.clearCellFlag(Cell$1.HAS_ACTOR | Cell$1.HAS_PLAYER);
            }
            if (foundIndex < 0)
                return false;
            this.needsRedraw = true;
            // this.clearCellFlag(Flags.Cell.STABLE_SNAPSHOT);
            return true;
        }
        hasFx() {
            return !!(this.flags.cell & Cell$1.HAS_FX);
        }
        get fx() {
            return this.map.fxAt(this.x, this.y);
        }
        _addFx(_fx) {
            this.setCellFlag(Cell$1.HAS_FX);
            this.needsRedraw = true;
        }
        _removeFx(_fx) {
            if (!this.fx) {
                this.clearCellFlag(Cell$1.HAS_FX);
            }
            this.needsRedraw = true;
        }
        getDescription() {
            return this.highestPriorityTile().description;
        }
        getFlavor() {
            return this.highestPriorityTile().flavor;
        }
        getName(opts = {}) {
            return this.highestPriorityTile().getName(opts);
        }
        dump() {
            if (this.hasActor()) {
                const actor = this.map.actorAt(this.x, this.y);
                if (actor && actor.sprite.ch)
                    return actor.sprite.ch;
            }
            if (this.hasItem()) {
                const item = this.map.itemAt(this.x, this.y);
                if (item && item.sprite.ch)
                    return item.sprite.ch;
            }
            if (this.hasTileFlag(Tile$1.T_BRIDGE)) {
                return '=';
            }
            return this.highestPriorityTile().sprite.ch || ' ';
        }
        drawSidebar(buffer, bounds) {
            const mixer = new GWU__namespace.sprite.Mixer();
            this.map.getAppearanceAt(this.x, this.y, mixer);
            buffer.drawSprite(bounds.x + 1, bounds.y, mixer);
            buffer.wrapText(bounds.x + 3, bounds.y, bounds.width - 3, this.getName(), 'cellStatusName');
            return 1;
        }
        toString() {
            return `Cell @ ${this.x},${this.y}`;
        }
    }

    class Item extends Entity {
        constructor(kind) {
            super(kind);
            this.quantity = 1;
            this.next = null;
            // @ts-ignore - initialized in constructor
            this.flags.item = 0;
            this.depth = Depth.ITEM;
            this.kind = kind;
        }
        isPlural() {
            if (this.quantity > 1)
                return true;
            return super.isPlural();
        }
        copy(other) {
            super.copy(other);
            this.quantity = other.quantity;
        }
        itemFlags() {
            return this.flags.item;
        }
        hasItemFlag(flag) {
            return !!(this.flags.item & flag);
        }
        hasAllItemFlags(flags) {
            return (this.flags.item & flags) === flags;
        }
        // getAction(name: string): ACTION.ItemActionBase | undefined {
        //     const action = this.kind.actions[name];
        //     return action;
        // }
        getBumpActions() {
            return this.kind.bump;
        }
    }
    Item.default = {
        sidebarFg: 'gold',
    };

    function messageYou(name, view, args) {
        const field = args[0] || 'actor';
        const actor = this.get(view, field);
        if (actor && actor instanceof Actor) {
            if (actor.isPlayer()) {
                return 'you';
            }
            else {
                return 'the ' + actor.getName();
            }
        }
        return actor || name;
    }
    GWU__namespace.text.addHelper('you', messageYou);
    function messageThe(name, view, args) {
        const value = args[0]
            ? this.get(view, args[0])
            : view.item || view.cell || view.target || view.actor;
        if (value) {
            if (value instanceof Cell) {
                return value.getFlavor();
            }
            else if (value instanceof Actor) {
                if (value.isPlayer()) {
                    return 'you';
                }
                else {
                    return 'the ' + value.getName();
                }
            }
            else if (value instanceof Item) {
                return 'the ' + value.getName();
            }
        }
        return name;
    }
    GWU__namespace.text.addHelper('the', messageThe);
    function messageA(name, view, args) {
        const value = args[0]
            ? this.get(view, args[0])
            : view.item || view.cell || view.target || view.actor;
        if (value) {
            if (value instanceof Cell) {
                return value.getFlavor();
            }
            else if (value instanceof Actor) {
                if (value.isPlayer()) {
                    return 'you';
                }
                else if (value.hasEntityFlag(Entity$1.L_FORMAL_NAME)) {
                    return value.getName();
                }
            }
            if ('getName' in value) {
                const name = value.getName();
                const char = GWU__namespace.text.firstChar(name);
                const ana = /[aeiouy]/i.exec(char) ? 'an ' : 'a ';
                return ana + name;
            }
        }
        return name;
    }
    GWU__namespace.text.addHelper('a', messageA);
    GWU__namespace.text.addHelper('an', messageA);
    function messageVerb(_name, view, args) {
        const verb = args[0] || 'verb';
        const value = args[1]
            ? this.get(view, args[1])
            : view.actor || view.target || view.item || view.cell;
        let plural = false;
        if (value) {
            if (value instanceof Cell) {
                plural = false;
            }
            else if (value instanceof Actor) {
                plural = value.isPlural();
            }
            else if (value instanceof Item) {
                plural = value.isPlural();
            }
        }
        return plural ? GWU__namespace.text.toPluralVerb(verb) : GWU__namespace.text.toSingularVerb(verb);
    }
    GWU__namespace.text.addHelper('verb', messageVerb);

    var index$c = /*#__PURE__*/Object.freeze({
        __proto__: null,
        KeyInfo: KeyInfo,
        makeKeyInfo: makeKeyInfo,
        EntityKind: EntityKind,
        make: make$7,
        Entity: Entity,
        messageYou: messageYou,
        messageThe: messageThe,
        messageA: messageA,
        messageVerb: messageVerb
    });

    class PainMessages {
        constructor(msgs = []) {
            this._msgs = [];
            msgs.forEach((m) => this.add(m));
        }
        add(msg) {
            this._msgs.push(msg);
            return this;
        }
        get(pct, singular = true) {
            const index = GWU__namespace.clamp(Math.floor(pct * this._msgs.length), 0, this._msgs.length - 1);
            const msg = this._msgs[index];
            return this._format(msg, singular);
        }
        _format(msg, singular = true) {
            return msg.replace(/\[(\w+)\|?(\w*)\]/g, singular ? '$1' : '$2');
        }
    }
    const painMessages = {};
    function installPain(id, pain) {
        if (Array.isArray(pain)) {
            pain = new PainMessages(pain);
        }
        painMessages[id] = pain;
    }
    function getPain(id) {
        const m = painMessages[id];
        if (!m)
            throw new Error('No such pain message index: ' + id);
        return m;
    }

    function fillSafetyMap(safetyMap, actor, target) {
        const costGrid = GWU__namespace.grid.alloc(actor.costMap());
        GWU__namespace.path.calculateDistances(safetyMap, target.x, target.y, costGrid, true);
        safetyMap.update((v) => v * -1); // Can set factor to be < -1 e.g. -1.2
        actor.map.actors.forEach((a) => {
            if (a.willAttack(actor)) {
                costGrid[a.x][a.y] = GWU__namespace.path.FORBIDDEN; // This is why we allocate a copy
            }
        });
        actor.map.eachCell((c, x, y) => {
            if (c.hasCellFlag(Cell$1.IS_IN_LOOP)) {
                safetyMap[x][y] -= GWU__namespace.path.AVOIDED; // loop cells are extra good
            }
        });
        GWU__namespace.path.rescan(safetyMap, costGrid, true);
        safetyMap.update((v) => (v <= -30000 ? 30000 : v));
        GWU__namespace.grid.free(costGrid);
    }

    // AI functions
    // actor is current actor
    // returns time until next turn for this actor
    // < 0 means do not requeue
    const ais = {};
    function install$4(name, fn) {
        ais[name] = fn;
    }
    function make$4(opts) {
        if (typeof opts === 'string') {
            opts = { fn: opts };
        }
        if (typeof opts === 'function') {
            opts = { fn: opts };
        }
        if (typeof opts.fn === 'string') {
            opts.fn = ais[opts.fn];
        }
        if (!opts.fn) {
            opts.fn = ais.default;
        }
        return opts;
    }

    function wander(action) {
        const map = action.map;
        const actor = action.actor;
        if (!actor)
            throw new Error('Actor required.');
        // Do we have a wander target?
        let goalMap = actor.goalMap;
        if (!goalMap) {
            //      pick new wander target
            const costMap = actor.costMap();
            const loc = GWU__namespace.random.matchingLoc(costMap.width, costMap.height, (x, y) => {
                return costMap[x][y] > 0 && costMap[x][y] !== GWU__namespace.path.NO_PATH;
            });
            if (!loc || loc[0] < 0 || loc[1] < 0) {
                console.log('No wander location found!');
                return action.didNothing();
            }
            //      build distance map to target
            goalMap = actor.setGoal(loc[0], loc[1]);
        }
        // take the next step to the target
        const step = GWU__namespace.path.nextStep(goalMap, actor.x, actor.y, (x, y) => {
            if (!map.hasActor(x, y))
                return false;
            const other = map.actorAt(x, y);
            if (!other) {
                console.log(`Cell @ ${x},${y} has actor flag, but no actor.`);
                map.cell(x, y).clearCellFlag(Cell$1.HAS_ACTOR);
                return false;
            }
            return !actor.canPass(other);
        });
        if (!step) {
            actor.clearGoal();
            return action.didNothing();
        }
        if (!step || (step[0] == 0 && step[1] == 0)) {
            return action.didNothing();
        }
        action.dir = step;
        return doAction('moveDir', action);
    }

    /*
    http://roguebasin.com/index.php/Roguelike_Intelligence_-_Stateless_AIs
    -- Typical AI
    */
    function typical(action) {
        // const map = action.map;
        const actor = action.actor;
        if (!actor)
            throw new Error('Actor required.');
        if (actor.isDead())
            return action.didNothing();
        const target = action.game.player;
        const tryAttack = actor.canSee(target) && actor.willAttack(target);
        if (tryAttack) {
            const damagePct = 100 - actor.stats.getPct('health');
            const morale = actor.stats.get('morale');
            const chargeChance = 100;
            const retreatChance = 0;
            actor.ai.lastSawPlayer = [target.x, target.y];
            actor.clearGoal();
            console.log('SAW YOU!', actor.id, target.x, target.y);
            if (damagePct > morale) {
                if (canAttack(action)) {
                    attack(action);
                }
                return;
            }
            if (tooFarFrom(action) && canAttack(action) && canMoveToward(action)) {
                if (GWU__namespace.random.chance(chargeChance)) {
                    moveToward(action);
                }
                else {
                    attack(action);
                }
                return;
            }
            if (tooCloseTo(action) &&
                canAttack(action) &&
                canMoveAwayFrom()) {
                if (GWU__namespace.random.chance(retreatChance)) {
                    moveAwayFrom(action);
                }
                else {
                    attack(action);
                }
                return;
            }
            if (canAttack(action)) {
                attack(action);
                return;
            }
            if (tooFarFrom(action) && canMoveToward(action)) {
                moveToward(action);
                return;
            }
            if (tooCloseTo(action) && canMoveAwayFrom()) {
                moveAwayFrom(action);
                return;
            }
        }
        // TODO - Use scent, menory, other teammates info, ...
        else if (actor.ai.lastSawPlayer) {
            if (!actor.hasGoal()) {
                const loc = actor.ai.lastSawPlayer;
                actor.setGoal(loc[0], loc[1]);
            }
            console.log('CHASING YOU!', actor.id, actor.goalMap.x, actor.goalMap.y);
            moveTowardGoal(action);
            if (action.isSuccess()) {
                return;
            }
            actor.ai.lastSawPlayer = null; // no longer
            actor.clearGoal();
        }
        // check if they noticed the player scent
        if (target.scent) {
            action.dir = target.scent.nextDir(actor.x, actor.y);
            if (action.dir) {
                console.log('tracking scent', actor.id, action.dir);
                doAction('moveDir', action);
                if (action.isDone())
                    return;
            }
        }
        const wanderOpt = GWU__namespace.object.firstOpt('wander', actor.ai, actor.kind.ai, false);
        if (wanderOpt) {
            if (actor.goalMap || // we have a current goal
                typeof wanderOpt !== 'number' || // wander: true
                GWU__namespace.random.chance(wanderOpt) // chance
            ) {
                wander(action);
                if (action.isSuccess())
                    return;
            }
            else {
                doAction('idle', action);
                if (action.isSuccess()) {
                    return;
                }
            }
        }
        return doAction('standStill', action);
    }
    install$4('typical', typical);
    install$4('default', typical);
    function canMoveToward(action) {
        // can move?
        const map = action.map;
        const actor = action.actor;
        if (!actor)
            throw new Error('Actor required.');
        const target = action.target;
        if (!target)
            throw new Error('No target.');
        let x = target.x;
        let y = target.y;
        const distanceMap = GWU__namespace.grid.alloc(map.width, map.height);
        const costMap = actor.costMap();
        GWU__namespace.path.calculateDistances(distanceMap, x, y, costMap);
        const canMoveDiagonal = false;
        // look for distance > current around me
        let center = distanceMap[actor.x][actor.y];
        let count = 0;
        GWU__namespace.xy.eachNeighbor(actor.x, actor.y, (x, y) => {
            if (distanceMap[x][y] < center) {
                ++count;
            }
        }, canMoveDiagonal);
        GWU__namespace.grid.free(distanceMap);
        return count > 0;
    }
    function moveToward(action) {
        // pathfinding?
        const map = action.map;
        const actor = action.actor;
        if (!actor)
            throw new Error('Actor required.');
        const target = action.target;
        if (!target)
            throw new Error('No target.');
        let x = target.x;
        let y = target.y;
        const distanceMap = GWU__namespace.grid.alloc(map.width, map.height);
        const costMap = actor.costMap();
        GWU__namespace.path.calculateDistances(distanceMap, x, y, costMap);
        const step = GWU__namespace.path.nextStep(distanceMap, actor.x, actor.y, (x, y) => {
            const cell = map.cell(x, y);
            if (!cell)
                return true;
            if (cell.hasActor() && cell.actor !== action.target)
                return true;
            if (cell.blocksMove())
                return true;
            return false;
        });
        GWU__namespace.grid.free(distanceMap);
        if (!step || (step[0] == 0 && step[1] == 0)) {
            return doAction('standStill', action);
        }
        action.dir = step;
        return doAction('moveDir', action);
    }
    function canMoveAwayFrom(_action) {
        // can move?
        // const distanceMap = ctx.distanceMap;
        // const canMoveDiagonal = false;
        // // look for distance > current around me
        // let center = distanceMap[actor.x][actor.y];
        // let count = 0;
        // GWU.xy.eachNeighbor(
        //     actor.x,
        //     actor.y,
        //     (x, y) => {
        //         const d = distanceMap[x][y];
        //         if (d >= GWU.path.NO_PATH) return;
        //         if (distanceMap[x][y] > center) {
        //             ++count;
        //         }
        //     },
        //     canMoveDiagonal
        // );
        // return ctx.done(count > 0);
        return false;
    }
    function moveAwayFrom(action) {
        const actor = action.actor;
        if (!actor)
            throw new Error('Need actor.');
        // safety/strategy?
        // always move using safety map?
        actor.endTurn();
        return action.didSomething();
    }
    function canRunAwayFrom(_action) {
        // can move?
        return false;
    }
    function runAwayFrom(action) {
        // move toward loop if away from player
        if (!action.actor)
            throw new Error('Need actor.');
        action.actor.endTurn();
        return action.didSomething();
    }
    function canAttack(action) {
        // has attack?
        // attack affects player?
        // cooldown?
        const actor = action.actor;
        const target = action.target;
        if (!actor || !target)
            return false;
        return GWU__namespace.xy.distanceFromTo(actor, target) <= 1;
    }
    function attack(action) {
        const actor = action.actor;
        const target = action.target;
        if (!actor || !target)
            throw new Error('Actor and Target required to attack.');
        console.log('attack!', actor.id, target.id);
        return doAction('attack', action);
    }
    function tooFarFrom(action) {
        // diagonal?
        const actor = action.actor;
        const target = action.target;
        if (!actor || !target)
            return true;
        return GWU__namespace.xy.distanceFromTo(actor, target) > 1;
    }
    function tooCloseTo(action) {
        const actor = action.actor;
        const target = action.target;
        if (!actor || !target)
            return true;
        return GWU__namespace.xy.distanceFromTo(actor, target) < 1;
    }
    // TODO - make an action
    function moveTowardGoal(action) {
        const actor = action.actor;
        if (!actor)
            throw new Error('Need actor.');
        if (!actor.hasGoal())
            return action.didNothing();
        const nextStep = GWU__namespace.path.nextStep(actor.goalMap, actor.x, actor.y, (x, y) => {
            return actor.map.hasActor(x, y);
        });
        if (!nextStep) {
            actor.clearGoal();
            return action.didNothing();
        }
        action.dir = nextStep;
        return doAction('moveDir', action);
    }

    var index$b = /*#__PURE__*/Object.freeze({
        __proto__: null,
        fillSafetyMap: fillSafetyMap,
        ais: ais,
        install: install$4,
        make: make$4,
        typical: typical,
        canMoveToward: canMoveToward,
        moveToward: moveToward,
        canMoveAwayFrom: canMoveAwayFrom,
        moveAwayFrom: moveAwayFrom,
        canRunAwayFrom: canRunAwayFrom,
        runAwayFrom: runAwayFrom,
        canAttack: canAttack,
        attack: attack,
        tooFarFrom: tooFarFrom,
        tooCloseTo: tooCloseTo,
        moveTowardGoal: moveTowardGoal,
        wander: wander
    });

    class ActorKind extends EntityKind {
        constructor(opts) {
            super(opts);
            this.flags = {
                actor: Actor$1.DEFAULT,
                entity: Entity$1.DEFAULT_ACTOR,
            };
            this.vision = {};
            this.bump = ['attack'];
            this.moveSpeed = 100;
            if (opts.flags) {
                this.flags.actor = GWU__namespace.flag.from(Actor$1, this.flags.actor, opts.flags);
                this.flags.entity = GWU__namespace.flag.from(Entity$1, this.flags.entity, opts.flags);
            }
            if (opts.vision) {
                this.vision.normal = opts.vision;
            }
            this.stats = Object.assign({ health: 1, morale: 100 }, opts.stats);
            if (opts.moveSpeed) {
                this.moveSpeed = opts.moveSpeed;
            }
            this.ai = make$4(opts.ai || 'default');
            if (opts.bump) {
                if (typeof opts.bump === 'string') {
                    opts.bump = opts.bump.split(/[|,]/g).map((t) => t.trim());
                }
                if (typeof opts.bump === 'function') {
                    opts.bump = [opts.bump];
                }
                if (Array.isArray(opts.bump)) {
                    this.bump = opts.bump.slice();
                }
            }
            if (opts.waterOnly) {
                this.forbidTileFlags =
                    this.forbidTileFlags & ~Tile$1.T_IS_DEEP_LIQUID;
                this.avoidTileFlags =
                    this.avoidTileFlags & ~Tile$1.T_IS_DEEP_LIQUID;
                this.requireTileFlags |= Tile$1.T_IS_DEEP_LIQUID;
            }
            else if (opts.lavaOnly) {
                this.forbidTileFlags = this.forbidTileFlags & ~Tile$1.T_LAVA;
                this.avoidTileFlags = this.avoidTileFlags & ~Tile$1.T_LAVA;
                this.requireTileFlags |= Tile$1.T_LAVA;
            }
            else {
                if (opts.swim) {
                    this.avoidTileFlags |= Tile$1.T_IS_DEEP_LIQUID;
                }
                else {
                    this.forbidTileFlags |= Tile$1.T_IS_DEEP_LIQUID;
                }
                if (opts.fly) {
                    this.forbidTileFlags =
                        this.forbidTileFlags & ~Tile$1.T_LAVA;
                    this.avoidTileFlags = this.avoidTileFlags & ~Tile$1.T_LAVA;
                    this.requireTileFlags =
                        this.requireTileFlags & ~Tile$1.T_LAVA;
                    this.forbidTileFlags =
                        this.forbidTileFlags & ~Tile$1.T_IS_DEEP_LIQUID;
                    this.avoidTileFlags =
                        this.avoidTileFlags & ~Tile$1.T_IS_DEEP_LIQUID;
                    this.requireTileFlags =
                        this.requireTileFlags & ~Tile$1.T_IS_DEEP_LIQUID;
                }
            }
            this.sidebarFg = GWU__namespace.color.from(opts.sidebarFg || Actor.default.sidebarFg);
        }
        make(options) {
            const actor = new Actor(this);
            this.init(actor, options);
            return actor;
        }
        init(actor, options = {}) {
            super.init(actor, options);
            Object.assign(actor.flags, this.flags);
            // if (options.fov) {
            //     actor.fov = options.fov;
            // }
            // if (options.memory) {
            //     actor.memory = options.memory;
            // }
            if (this.vision.normal) {
                actor.visionDistance = this.vision.normal;
            }
            actor.stats.init(this.stats);
        }
        addToMap(actor, map) {
            super.addToMap(actor, map);
            // if (this.hasActorFlag(Flags.Actor.HAS_MEMORY)) {
            //     actor.memory = Memory.get(actor, map);
            // }
            // if (this.hasActorFlag(Flags.Actor.USES_FOV)) {
            //     actor.fov = new GWU.fov.FovSystem(map);
            //     actor.fov.follow = actor;
            //     if (actor.memory) {
            //         actor.fov.callback = actor.memory;
            //     }
            // }
        }
        removeFromMap(actor) {
            super.removeFromMap(actor);
            // if (actor._map && actor.memory) {
            //     Memory.store(actor, actor._map, actor.memory);
            // }
        }
        hasActorFlag(flag) {
            return !!(this.flags.actor & flag);
        }
        canSeeEntity(_actor, _entity) {
            return true;
        }
        isAbleToSee(_actor, _entity) {
            return true;
        }
        isAbleToSense(_actor, _entity) {
            return true;
        }
        forbidsCell(cell, actor) {
            if (super.forbidsCell(cell, actor)) {
                return true;
            }
            if (cell.blocksMove())
                return true;
            return false;
        }
        avoidsCell(cell, actor) {
            if (super.avoidsCell(cell, actor))
                return true;
            if (cell.blocksPathing())
                return true;
            return false;
        }
        getFlavor(actor, opts) {
            const flavor = actor.isPlayer() ? 'yourself' : this.flavor;
            if (opts && opts.action) {
                return flavor + ' standing';
            }
            return flavor;
        }
        pickupItem(actor, item, _opts) {
            if (!GWU__namespace.list.push(actor, 'items', item))
                return false;
            // TODO - Pickup effects
            return true;
        }
        dropItem(actor, item, _opts) {
            if (!GWU__namespace.list.remove(actor, 'items', item))
                return false;
            // TODO - Drop effects
            return true;
        }
        cellCost(cell, actor) {
            if (this.forbidsCell(cell, actor)) {
                return cell.hasEntityFlag(Entity$1.L_BLOCKS_DIAGONAL)
                    ? GWU__namespace.path.OBSTRUCTION
                    : GWU__namespace.path.FORBIDDEN;
            }
            else if (this.avoidsCell(cell, actor)) {
                return GWU__namespace.path.AVOIDED;
            }
            return GWU__namespace.path.OK;
        }
        drawSidebar(actor, buffer, bounds) {
            let count = super.drawSidebar(actor, buffer, bounds);
            if (actor.map.hasTileFlag(actor.x, actor.y, Tile$1.T_DEEP_WATER) &&
                !actor.map.hasTileFlag(actor.x, actor.y, Tile$1.T_BRIDGE)) {
                buffer.drawText(bounds.x + 3, bounds.y + count++, 'Swimming', '#66F');
            }
            return count;
        }
    }

    function make$3(info, makeOptions) {
        let kind;
        if (typeof info === 'string') {
            // @ts-ignore
            kind = get$2(info);
            if (!kind)
                throw new Error('Failed to find item kind - ' + info);
        }
        else if (info instanceof ActorKind) {
            kind = info;
        }
        else {
            kind = makeKind$2(info);
        }
        return kind.make(makeOptions);
    }
    function makeRandom$1(opts, makeOptions) {
        const kind = randomKind$1(opts);
        if (!kind)
            throw new Error('Failed to find item kind matching - ' + JSON.stringify(opts));
        return kind.make(makeOptions);
    }
    const kinds$1 = {};
    function install$3(id, kind) {
        if (kind instanceof ActorKind) {
            kinds$1[id] = kind;
            return kind;
        }
        const made = makeKind$2(kind);
        made.id = id;
        kinds$1[id] = made;
        return made;
    }
    function get$2(id) {
        if (id instanceof ActorKind)
            return id;
        return kinds$1[id];
    }
    function makeKind$2(info) {
        const config = Object.assign({}, info);
        return new ActorKind(config);
    }
    function randomKind$1(opts = {}) {
        const match = {
            tags: [],
            forbidTags: [],
        };
        if (typeof opts === 'string') {
            opts = {
                tags: opts,
            };
        }
        if (typeof opts.tags === 'string') {
            opts.tags
                .split(/[,|&]/)
                .map((t) => t.trim())
                .forEach((t) => {
                if (t.startsWith('!')) {
                    match.forbidTags.push(t.substring(1).trim());
                }
                else {
                    match.tags.push(t);
                }
            });
        }
        else if (Array.isArray(opts.tags)) {
            match.tags = opts.tags.slice();
        }
        if (typeof opts.forbidTags === 'string') {
            match.forbidTags = opts.forbidTags.split(/[,|&]/).map((t) => t.trim());
        }
        else if (Array.isArray(opts.forbidTags)) {
            match.forbidTags = opts.forbidTags.slice();
        }
        const matches = Object.values(kinds$1).filter((k) => {
            if (match.tags.length && !GWU__namespace.arraysIntersect(match.tags, k.tags))
                return false;
            if (match.forbidTags && GWU__namespace.arraysIntersect(match.forbidTags, k.tags))
                return false;
            return true;
        });
        const rng = opts.rng || GWU__namespace.rng.random;
        return rng.item(matches) || null;
    }

    var index$a = /*#__PURE__*/Object.freeze({
        __proto__: null,
        PainMessages: PainMessages,
        painMessages: painMessages,
        installPain: installPain,
        getPain: getPain,
        Stats: Stats,
        Status: Status,
        ActorKind: ActorKind,
        Actor: Actor,
        make: make$3,
        makeRandom: makeRandom$1,
        kinds: kinds$1,
        install: install$3,
        get: get$2,
        makeKind: makeKind$2,
        randomKind: randomKind$1
    });

    class ItemKind extends EntityKind {
        constructor(config) {
            super(config);
            this.flags = {
                item: Item$1.DEFAULT,
                entity: Entity$1.DEFAULT_ACTOR,
            };
            this.bump = [];
            if (config.flags) {
                this.flags.item = GWU__namespace.flag.from(Item$1, this.flags.item, config.flags);
                this.flags.entity = GWU__namespace.flag.from(Entity$1, this.flags.entity, config.flags);
            }
            if (config.bump) {
                if (typeof config.bump === 'string' ||
                    typeof config.bump === 'function') {
                    config.bump = [config.bump];
                }
                if (Array.isArray(config.bump)) {
                    this.bump = config.bump.slice();
                }
            }
            this.avoidTileFlags |= Tile$1.T_DEEP_WATER;
            this.forbidTileFlags |= Tile$1.T_LAVA | Tile$1.T_AUTO_DESCENT;
            this.sidebarFg = GWU__namespace.color.from(config.sidebarFg || Item.default.sidebarFg);
        }
        make(options) {
            const item = new Item(this);
            this.init(item, options);
            return item;
        }
        init(item, options = {}) {
            super.init(item, options);
            Object.assign(item.flags, this.flags);
            item.quantity = options.quantity || 1;
        }
        avoidsCell(cell, item) {
            if (cell.isDoor() || cell.isStairs())
                return true;
            return super.avoidsCell(cell, item);
        }
    }

    function make$2(info, makeOptions) {
        let kind;
        if (typeof info === 'string') {
            // @ts-ignore
            kind = get$1(info);
            if (!kind)
                throw new Error('Failed to find item kind - ' + info);
        }
        else if (info instanceof ItemKind) {
            kind = info;
        }
        else {
            kind = makeKind$1(info);
        }
        return kind.make(makeOptions);
    }
    function makeRandom(opts, makeOptions) {
        const kind = randomKind(opts);
        if (!kind)
            throw new Error('Failed to find item kind matching - ' + JSON.stringify(opts));
        return kind.make(makeOptions);
    }
    const kinds = {};
    function install$2(id, kind) {
        if (kind instanceof ItemKind) {
            kinds[id] = kind;
            kind.id = id;
            return kind;
        }
        const made = makeKind$1(kind);
        made.id = id;
        kinds[id] = made;
        return made;
    }
    function get$1(id) {
        if (id instanceof ItemKind)
            return id;
        return kinds[id];
    }
    function makeKind$1(info) {
        const config = Object.assign({}, info);
        return new ItemKind(config);
    }
    function randomKind(opts = {}) {
        const match = {
            tags: [],
            forbidTags: [],
        };
        if (typeof opts === 'string') {
            opts = {
                tags: opts,
            };
        }
        if (typeof opts.tags === 'string') {
            opts.tags
                .split(/[,|&]/)
                .map((t) => t.trim())
                .forEach((t) => {
                if (t.startsWith('!')) {
                    match.forbidTags.push(t.substring(1).trim());
                }
                else {
                    match.tags.push(t);
                }
            });
        }
        else if (Array.isArray(opts.tags)) {
            match.tags = opts.tags.slice();
        }
        if (typeof opts.forbidTags === 'string') {
            match.forbidTags = opts.forbidTags.split(/[,|&]/).map((t) => t.trim());
        }
        else if (Array.isArray(opts.forbidTags)) {
            match.forbidTags = opts.forbidTags.slice();
        }
        const matches = Object.values(kinds).filter((k) => {
            if (match.tags.length && !GWU__namespace.arraysIntersect(match.tags, k.tags))
                return false;
            if (match.forbidTags && GWU__namespace.arraysIntersect(match.forbidTags, k.tags))
                return false;
            return true;
        });
        const rng = opts.rng || GWU__namespace.rng.random;
        return rng.item(matches) || null;
    }

    var index$9 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        ItemKind: ItemKind,
        Item: Item,
        make: make$2,
        makeRandom: makeRandom,
        kinds: kinds,
        install: install$2,
        get: get$1,
        makeKind: makeKind$1,
        randomKind: randomKind
    });

    function standStill(action) {
        if (action.actor) {
            action.actor.endTurn();
            action.didSomething();
        }
    }
    install$7('standStill', standStill);

    function flashSprite(map, x, y, sprite, duration = 100, count = 1) {
        if (typeof sprite === 'string') {
            sprite = GWU__namespace.sprite.from(sprite);
        }
        const entity = make$7({ name: 'FX', sprite });
        map.addFx(x, y, entity);
        const tween = GWU__namespace.tween
            .make({ visible: true })
            .to({ visible: false })
            .repeat(count)
            .repeatDelay(duration)
            .duration(duration)
            .onUpdate((obj) => {
            if (obj.visible) {
                map.addFx(x, y, entity);
            }
            else {
                map.removeFx(entity);
            }
        });
        return tween;
    }
    GWU__namespace.sprite.install('bump', 'white', 50);
    function hit(map, target, sprite, duration) {
        sprite = sprite || 'hit';
        duration = duration || 200;
        return flashSprite(map, target.x, target.y, sprite, duration, 1);
    }
    GWU__namespace.sprite.install('hit', 'red', 50);
    function miss(map, target, sprite, duration) {
        sprite = sprite || 'miss';
        duration = duration || 200;
        return flashSprite(map, target.x, target.y, sprite, duration, 1);
    }
    GWU__namespace.sprite.install('miss', 'green', 50);
    function fadeInOut(map, x, y, sprite, duration = 100) {
        if (typeof sprite === 'string') {
            sprite = GWU__namespace.sprite.from(sprite).clone();
        }
        else {
            sprite = GWU__namespace.sprite.make(sprite);
        }
        const entity = make$7({ name: 'FX', sprite });
        map.addFx(x, y, entity);
        const tween = GWU__namespace.tween
            .make({ opacity: 0 })
            .to({ opacity: 100 })
            .repeat(2)
            .yoyo(true)
            .duration(Math.floor(duration / 2))
            .onUpdate((obj) => {
            entity.sprite.opacity = obj.opacity;
            map.cell(x, y).needsRedraw = true; // we changed the sprite so redraw
        })
            .onFinish(() => {
            map.removeFx(entity);
        });
        // realTime
        return tween;
    }
    function moveSprite(map, source, target, sprite, opts = {}) {
        if (typeof sprite === 'string') {
            sprite = GWU__namespace.sprite.from(sprite);
        }
        const entity = make$7({ name: 'FX', sprite });
        const from = { x: GWU__namespace.xy.x(source), y: GWU__namespace.xy.y(source) };
        map.addFx(from.x, from.y, entity);
        let duration = opts.duration ||
            Math.ceil(16 * (GWU__namespace.xy.maxAxisFromTo(source, target) / (opts.speed || 8)));
        if (GWU__namespace.xy.isLoc(target)) {
            target = { x: target[0], y: target[1] };
        }
        const tween = GWU__namespace.tween
            .make(from)
            .to(target)
            .duration(duration)
            .onUpdate((vals) => {
            // tweens dont update every step, so...
            // draw line from current pos to vals pos
            // check each step for blocking...
            // end at either vals or last blocking spot
            const dest = { x: entity.x, y: entity.y };
            const ok = GWU__namespace.xy.forLineBetween(dest.x, dest.y, vals.x, vals.y, (x, y) => {
                if (opts.stepFn) {
                    if (opts.stepFn(x, y)) {
                        if (!opts.stopBeforeWalls) {
                            dest.x = x;
                            dest.y = y;
                        }
                        return false;
                    }
                }
                else if (map.hasEntityFlag(x, y, Entity$1.L_BLOCKS_MOVE)) {
                    if (!opts.stopBeforeWalls) {
                        dest.x = x;
                        dest.y = y;
                    }
                    return false;
                }
                dest.x = x;
                dest.y = y;
            });
            map.moveFx(entity, dest.x, dest.y);
            if (!ok) {
                tween.stop();
            }
        })
            .onFinish(() => {
            map.removeFx(entity);
            return entity;
        });
        return tween;
    }
    function bolt(map, source, target, sprite, opts = {}) {
        return moveSprite(map, source, target, sprite, opts);
    }
    function projectile(map, source, target, sprite, opts = {}) {
        if (typeof sprite === 'string') {
            sprite = GWU__namespace.sprite.from(sprite);
        }
        if (sprite.ch && sprite.ch.length == 4) {
            const dir = GWU__namespace.xy.dirFromTo(source, target);
            let index = 0;
            if (dir[0] && dir[1]) {
                index = 2;
                if (dir[0] != dir[1]) {
                    // remember up is -y
                    index = 3;
                }
            }
            else if (dir[0]) {
                index = 1;
            }
            const ch = sprite.ch[index];
            sprite = GWU__namespace.sprite.make(ch, sprite.fg, sprite.bg);
        }
        else if (sprite.ch && sprite.ch.length !== 1) {
            throw new Error('projectile requires 4 chars - vert,horiz,diag-left,diag-right (e.g: "|-\\/")');
        }
        return moveSprite(map, source, target, sprite, opts);
    }
    function beam(map, from, to, sprite, opts = {}) {
        opts.fade = opts.fade || 100;
        if (opts.stopAtWalls === undefined)
            opts.stopAtWalls = true;
        const line = [];
        GWU__namespace.xy.forLineFromTo(from, to, (x, y) => {
            if (!map.hasXY(x, y))
                return false;
            if (opts.stepFn && opts.stepFn(x, y))
                return false;
            if (opts.stopAtWalls || opts.stopBeforeWalls) {
                if (map.hasEntityFlag(x, y, Entity$1.L_BLOCKS_MOVE)) {
                    if (opts.stopBeforeWalls)
                        return false;
                    line.push([x, y]);
                    return false;
                }
            }
            line.push([x, y]);
            return true;
        });
        const duration = opts.duration || Math.ceil(16 * (line.length / (opts.speed || 8)));
        let lastIndex = -1;
        const tween = GWU__namespace.tween
            .make({ index: 0 })
            .to({ index: line.length - 1 })
            .duration(duration)
            .onUpdate((vals) => {
            while (lastIndex < vals.index) {
                ++lastIndex;
                const loc = line[lastIndex] || [-1, -1];
                tween.addChild(fadeInOut(map, loc[0], loc[1], sprite, opts.fade));
            }
        });
        return tween;
    }
    function isInShape(shape, cx, cy, allowCenter, x, y) {
        const sx = Math.abs(x - cx);
        const sy = Math.abs(y - cy);
        if (sx == 0 && sy == 0 && !allowCenter)
            return false;
        switch (shape) {
            case '+':
                return sx == 0 || sy == 0;
            case 'x':
            case 'X':
                return sx == sy;
            case '*':
                return sx == 0 || sy == 0 || sx == sy;
            default:
                return true;
        }
    }
    function checkExplosionOpts(opts) {
        opts.speed = opts.speed || 2;
        opts.fade = opts.fade || 100;
        opts.shape = opts.shape || 'o';
        if (opts.center === undefined) {
            opts.center = true;
        }
    }
    function explosion(map, x, y, radius, sprite, opts = {}) {
        checkExplosionOpts(opts);
        // opts.stepFn = opts.stepFn || ((x, y) => !map.isObstruction(x, y));
        if (typeof sprite === 'string') {
            sprite = GWU__namespace.sprite.from(sprite);
        }
        const grid = GWU__namespace.grid.alloc(map.width, map.height);
        const fov = new GWU__namespace.fov.FOV({
            isBlocked(x, y) {
                return map.hasEntityFlag(x, y, Entity$1.L_BLOCKS_MOVE);
            },
            hasXY(x, y) {
                return map.hasXY(x, y);
            },
        });
        fov.calculate(x, y, radius, (x1, y1) => {
            grid[x1][y1] = 1;
        });
        const duration = opts.duration || 32 * (radius / opts.speed);
        const tween = GWU__namespace.tween
            .make({ r: 0 })
            .to({ r: radius })
            .duration(duration)
            .onUpdate((vals) => {
            const minX = Math.max(0, x - vals.r);
            const minY = Math.max(0, y - vals.r);
            const maxX = Math.min(map.width - 1, x + vals.r);
            const maxY = Math.min(map.height - 1, y + vals.r);
            for (let x1 = minX; x1 <= maxX; ++x1) {
                for (let y1 = minY; y1 <= maxY; ++y1) {
                    if (grid[x1][y1] &&
                        GWU__namespace.xy.distanceBetween(x, y, x1, y1) <= vals.r) {
                        grid[x1][y1] = 0;
                        if (isInShape(opts.shape, x, y, opts.center, x1, y1)) {
                            tween.addChild(fadeInOut(map, x1, y1, sprite, opts.fade));
                        }
                    }
                }
            }
        })
            .onFinish(() => {
            GWU__namespace.grid.free(grid);
        });
        return tween;
    }

    var fx = /*#__PURE__*/Object.freeze({
        __proto__: null,
        flashSprite: flashSprite,
        hit: hit,
        miss: miss,
        fadeInOut: fadeInOut,
        moveSprite: moveSprite,
        bolt: bolt,
        projectile: projectile,
        beam: beam,
        explosion: explosion
    });

    // import * as ACTOR from '../actor';
    // BUMP
    //
    // prefixes:
    // @ : only for player
    // + : only for ally
    // - : only for opposed
    // = : only for same kind
    // $ : use my action (if used with one of the above, this comes last)
    //
    function bump(action) {
        const other = action.target;
        const actor = action.actor;
        if (!actor)
            throw new Error('Actor is required for bump.');
        if (other) {
            const bumpActions = other.getBumpActions();
            for (let actionName of bumpActions) {
                if (typeof actionName === 'string') {
                    if (actionName.startsWith('@')) {
                        if (!actor.isPlayer())
                            continue;
                        actionName = actionName.substring(1);
                        // } else if (actionName.startsWith('+')) {
                        //     if (!actor.isAllyWith(other)) continue;
                        //     actionName = actionName.substring(1);
                        // } else if (actionName.startsWith('-')) {
                        //     if (actor.isAllyWith(other)) continue;
                        //     actionName = actionName.substring(1);
                    }
                    else if (actionName.startsWith('=')) {
                        if (actor.kind !== other.kind)
                            continue;
                        actionName = actionName.substring(1);
                    }
                    if (actionName.startsWith('$')) {
                        const selfName = actionName.substring(1);
                        if (!other.canDoAction(selfName))
                            throw new Error('Invalid bump choice - ' + actionName);
                        other.trigger(selfName, action);
                        if (action.isDone())
                            return;
                        // let selfAction: ACTOR.ActorActionResult =
                        //     other.getAction(selfName);
                        // if (selfAction === false) {
                        //     throw new Error(
                        //         'Cannot have bump action for self action that actor cannot do: ' +
                        //             action
                        //     );
                        // }
                        // const ctx2 = Object.assign({}, ctx, { actor });
                        // const result = selfAction(game, other, ctx2);
                        // if (result) return result;
                    }
                    else {
                        doAction(actionName, action);
                        if (action.isDone())
                            return;
                        // const config = actor.getAction(actionName);
                        // if (config === false) {
                        //     throw new Error(
                        //         'Cannot configure actor with bump action they cannot do: ' +
                        //             action
                        //     );
                        // } else {
                        //     action = config;
                        // }
                        // const result = action(game, actor, ctx);
                        // if (result) return result;
                    }
                }
                else {
                    actionName(action);
                    if (action.isDone())
                        return;
                }
            }
        }
        action.item;
    }
    install$7('bump', bump);

    function moveDir(action) {
        //
        const step = action.dir;
        if (!step)
            throw new Error('moveDir called with no direction!');
        const actor = action.actor;
        const map = action.map;
        // const game = action.game;
        if (!actor)
            throw new Error('moveDir requires actor!');
        const newX = actor.x + step[0];
        const newY = actor.y + step[1];
        const currentCell = map.cell(actor.x, actor.y);
        const newCell = map.cell(newX, newY);
        // actor, map/cell/tiles, game, global
        // - give them all a chance to handle this
        // if (action.defaultPrevented) return;
        if (actor.forbidsCell(newCell)) {
            if (action.try)
                return action.didNothing();
            if (actor.isPlayer()) {
                hit(map, newCell, 'hit', 100);
                GWU__namespace.message.addAt(newCell.x, newCell.y, '{{you}} {{verb bump~}} into {{a cell}}.', { actor, cell: newCell });
            }
            actor.clearGoal();
            actor.endTurn();
            return action.didSomething();
        }
        if (newCell.blocksMove()) {
            if (action.try)
                return action.didNothing();
            hit(map, newCell, 'hit', 100);
            actor.clearGoal();
            actor.endTurn();
            return action.didSomething();
        }
        // can we leave?
        if (!currentCell.canRemoveActor(actor)) {
            if (action.try)
                return action.didNothing();
            // canActorLeave must add appropriate message
            actor.endTurn();
            return action.didSomething();
        }
        // is there an actor there?
        if (newCell.hasActor() || newCell.hasItem()) {
            if (action.try)
                return action.didNothing();
            action.target = newCell.actor;
            action.item = newCell.item;
            return bump(action);
        }
        // can we enter?
        if (!newCell.canAddActor(actor)) {
            if (action.try)
                return action.didNothing();
            actor.endTurn();
            return action.didSomething();
        }
        if (!map.moveActor(actor, newX, newY)) {
            return standStill(action);
        }
        let rate = 100;
        if (newCell.hasTileFlag(Tile$1.T_DEEP_WATER)) {
            rate = 150;
        }
        actor.endTurn(rate);
        return action.didSomething();
    }
    install$7('moveDir', moveDir);

    function idle(action) {
        const actor = action.actor;
        if (!actor)
            throw new Error('Action requires an actor.');
        if (GWU__namespace.random.chance(50)) {
            // stand still
            actor.endTurn();
            return action.didSomething();
        }
        // try to step in a random direction
        const dirIndex = GWU__namespace.random.number(4);
        action.dir = GWU__namespace.xy.DIRS[dirIndex];
        return moveDir(action);
    }
    install$7('idle', idle);

    function pickup(action) {
        const map = action.map;
        if (!map)
            throw new Error('Map is required!');
        const actor = action.actor;
        if (!actor)
            throw new Error('Actor is required.');
        const item = map.itemAt(action.x, action.y);
        if (!item) {
            if (!action.quiet) {
                GWU__namespace.message.addAt(action.x, action.y, 'Nothing to pickup.');
            }
            return action.didNothing();
        }
        if (actor.avoidsItem(item))
            return action.didNothing();
        if (item.canDoAction('pickup') === false) {
            if (!action.quiet) {
                GWU__namespace.message.addAt(actor.x, actor.y, '{{you}} cannot pickup {{the item}}.', {
                    actor,
                    item,
                });
            }
            return action.didNothing();
        }
        // logs error messages
        if (!actor.canAddItem(item)) {
            return action.didNothing();
        }
        if (!map.removeItem(item)) {
            return action.didNothing();
        }
        actor.addItem(item);
        if (!action.quiet) {
            GWU__namespace.message.addAt(actor.x, actor.y, '{{you}} {{verb pick[s]}} up {{an item}}.', {
                actor,
                item,
            });
        }
        actor.endTurn();
        action.didSomething();
    }
    install$7('pickup', pickup);

    function climb(action) {
        const map = action.map;
        const actor = action.actor;
        if (!actor)
            throw new Error('Actor is required.');
        const x = action.x;
        const y = action.y;
        if (map.hasTileFlag(x, y, Tile$1.T_UP_STAIRS)) {
            GWU__namespace.message.addAt(x, y, '{{you}} {{verb climb[s]}}.', { actor });
            action.game.startNewMap({ up: true });
            actor.endTurn();
            return action.didSomething();
        }
        GWU__namespace.message.addAt(x, y, 'Nothing to climb.');
        actor.endTurn(50); // half turn??
        return action.didSomething();
    }
    install$7('climb', climb);

    var index$8 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        standStill: standStill,
        moveDir: moveDir,
        idle: idle,
        pickup: pickup,
        climb: climb,
        bump: bump
    });

    function fn(cfg) {
        if (typeof cfg === 'function')
            return cfg;
        return (a) => {
            for (let fn of cfg) {
                fn(a);
                if (a.isDone())
                    return;
            }
        };
    }
    installHandler('fn', fn);

    //////////////////////////////////////////////
    // ActivateMachine
    function activateMachine() {
        return activateMachineAction.bind(undefined);
    }
    function activateMachineAction(action) {
        const map = action.map;
        const cell = map.cell(action.x, action.y);
        const machine = cell.machineId;
        if (!machine)
            return action.didNothing();
        action.originX = action.x;
        action.originY = action.y;
        for (let x = 0; x < map.width; ++x) {
            for (let y = 0; y < map.height; ++y) {
                const cell = map.cell(x, y);
                if (cell.machineId !== machine)
                    continue;
                cell.trigger('machine', action); // will set didSomething or didNothing
            }
        }
    }
    installHandler('activateMachine', activateMachine);

    //////////////////////////////////////////////
    // chance
    function chance(opts) {
        if (Array.isArray(opts)) {
            opts = opts[0];
        }
        if (typeof opts === 'object') {
            opts = opts.chance;
        }
        if (typeof opts === 'string') {
            if (opts.endsWith('%')) {
                opts = Number.parseFloat(opts) * 100;
            }
            else {
                opts = Number.parseInt(opts || '10000');
            }
        }
        if (typeof opts !== 'number') {
            throw new Error('Chance effect config must be number or string that can be a number.');
        }
        return chanceAction.bind(undefined, opts);
    }
    function chanceAction(cfg, action) {
        const map = action.map;
        if (!map.rng.chance(cfg, 10000)) {
            return action.stop();
        }
    }
    installHandler('chance', chance);

    function clear(config) {
        let layers = 0;
        if (!config) {
            layers = Depth.ALL_LAYERS;
        }
        else if (typeof config === 'number') {
            layers = config;
        }
        else if (typeof config === 'string') {
            const parts = config.split(/[,|]/g);
            layers = parts.reduce((out, v) => {
                if (typeof v === 'number')
                    return out | v;
                const depth = Depth[v] || 0;
                return out | depth;
            }, 0);
        }
        else {
            throw new Error('Invalid config for clear effect: ' + JSON.stringify(config));
        }
        return clearAction.bind(undefined, layers);
    }
    function clearAction(layers, action) {
        if (!layers)
            return action.didNothing();
        const cell = action.map.cell(action.x, action.y);
        if (cell.clearDepth(layers)) {
            action.didSomething();
        }
        else {
            action.didNothing();
        }
    }
    installHandler('clear', clear);

    //////////////////////////////////////////////
    // EMIT
    function emit(config) {
        if (Array.isArray(config))
            config = config[0];
        if (typeof config !== 'string')
            throw new Error('Invalid EMIT handler config - ' + config);
        return emitAction.bind(undefined, config);
    }
    function emitAction(id, action) {
        action.actor && action.actor.trigger(id, action);
        if (action.isDone())
            return;
        action.item && action.item.trigger(id, action);
        if (action.isDone())
            return;
        action.map.trigger(id, action);
        if (action.isDone())
            return;
        action.game.trigger(id, action);
    }
    installHandler('emit', emit);

    function feature(id) {
        if (Array.isArray(id))
            id = id[0];
        if (id && typeof id !== 'string') {
            id = id.id;
        }
        if (!id || !id.length)
            throw new Error('Feature effect needs ID');
        return featureAction.bind(undefined, id);
    }
    function featureAction(id, action) {
        const feat = installed[id];
        if (!feat) {
            throw new Error('Failed to find feature: ' + id);
        }
        return feat(action);
    }
    installHandler('feature', feature);
    installHandler('effect', feature);
    installHandler('id', feature);

    //////////////////////////////////////////////
    // MESSAGE
    function msg(src) {
        if (Array.isArray(src))
            src = src[0];
        if (typeof src !== 'string') {
            throw new Error('Need message for message effect.');
        }
        const info = {
            msg: src,
        };
        return messageAction.bind(undefined, info);
    }
    function messageAction(info, action) {
        const seen = action.seen;
        const msg = info.msg;
        if (msg &&
            msg.length &&
            action.aware &&
            !seen
        // && map.isVisible(x, y)
        ) {
            GWU__namespace.message.addAt(action.x, action.y, msg, action);
            return action.didSomething();
        }
        return action.didNothing();
    }
    installHandler('msg', msg);

    function nourish(opts) {
        if (!opts)
            throw new Error('Invalid Nourish config.');
        let info = {};
        if (typeof opts === 'string') {
            opts = opts.split(':').map((t) => t.trim());
        }
        if (Array.isArray(opts)) {
            info.type = opts[0] || 'inc';
            info.amount = GWU__namespace.range.make(opts[1] || 1);
        }
        else if (opts.type || opts.amount) {
            info.type = opts.type || 'inc';
            info.amount = GWU__namespace.range.make(opts.amount || 1);
        }
        else {
            throw new Error('Invalid Nourish config: ' + JSON.stringify(opts));
        }
        return nourishAction.bind(undefined, info);
    }
    function nourishAction(config, action) {
        if (!config.amount)
            return action.didNothing();
        // who am I nourishing?
        const map = action.map;
        const actor = map.actorAt(action.x, action.y);
        if (!actor) {
            return action.didNothing();
        }
        const stats = actor.stats;
        const c = stats.get('food');
        if (!stats.adjust('food', config.type, config.amount))
            return action.didNothing();
        const n = stats.get('food');
        if (n < c && n / stats.max('food') < 0.1) {
            GWU__namespace.message.addAt(actor.x, actor.y, nourishAction.default.pukeMsg, {
                actor,
            });
        }
        return action.didSomething();
    }
    nourishAction.default = {
        pukeMsg: '%you vomit.',
    };
    installHandler('nourish', nourish);

    function spread(...args) {
        let config = {};
        if (!args.length) {
            throw new Error('Must have config to create spread.');
        }
        if (args.length === 1) {
            if (typeof args[0] === 'string') {
                args = args[0].split(':').map((t) => t.trim());
            }
            else if (Array.isArray(args[0])) {
                args = args[0];
            }
            else {
                Object.assign(config, args[0]);
                args = [config];
            }
        }
        if (args.length >= 3) {
            Object.assign(config, args[3] || {});
            config.grow = Number.parseInt(args[0]);
            config.decrement = Number.parseInt(args[1]);
            config.actions = args[2];
        }
        else if (args.length === 2) {
            throw new Error('Must have actions to run for spread.');
        }
        if (typeof config.grow !== 'number')
            config.grow = Number.parseInt(config.grow || 0);
        if (typeof config.decrement !== 'number')
            config.decrement = Number.parseInt(config.decrement || 100);
        config.flags = GWU__namespace.flag.from(Effect, config.flags || 0);
        config.matchTile = config.matchTile || '';
        const action = makeArray(config.actions);
        if (!action)
            throw new Error('Failed to make action for spread.');
        config.actions = action;
        const fn = spreadAction.bind(config);
        fn.config = config;
        return fn;
    }
    installHandler('spread', spread);
    function spreadAction(action) {
        const abortIfBlocking = !!(this.flags & Effect.E_ABORT_IF_BLOCKS_MAP);
        const map = action.map;
        const spawnMap = GWU__namespace.grid.alloc(map.width, map.height);
        if (!computeSpawnMap(this, action, spawnMap)) {
            GWU__namespace.grid.free(spawnMap);
            return action.didNothing();
        }
        if (abortIfBlocking && mapDisruptedBy(map, spawnMap)) {
            GWU__namespace.grid.free(spawnMap);
            return action.didNothing();
        }
        if (this.flags & Effect.E_EVACUATE_CREATURES) {
            // first, evacuate creatures, so that they do not re-trigger the tile.
            if (evacuateCreatures(map, spawnMap)) {
                action.didSomething();
            }
        }
        if (this.flags & Effect.E_EVACUATE_ITEMS) {
            // first, evacuate items, so that they do not re-trigger the tile.
            if (evacuateItems(map, spawnMap)) {
                action.didSomething();
            }
        }
        if (this.flags & Effect.E_CLEAR_CELL) {
            // first, clear other tiles (not base/ground)
            if (clearCells(map, spawnMap, this.flags)) {
                action.didSomething();
            }
        }
        spawnMap.update((v) => {
            if (!v)
                return 0;
            return 1;
        });
        let didSomething = action.isSuccess();
        this.actions.forEach((fn, i) => {
            spawnMap.forEach((v, x, y) => {
                if (v !== i + 1)
                    return;
                action.reset();
                action.x = x;
                action.y = y;
                fn(action);
                if (action.isSuccess()) {
                    didSomething = true;
                    spawnMap[x][y] += 1;
                }
            });
        });
        if (didSomething) {
            action.didSomething();
        }
        GWU__namespace.grid.free(spawnMap);
    }
    function mapDisruptedBy(map, blockingGrid, blockingToMapX = 0, blockingToMapY = 0) {
        const walkableGrid = GWU__namespace.grid.alloc(map.width, map.height);
        let disrupts = false;
        // Get all walkable locations after lake added
        GWU__namespace.xy.forRect(map.width, map.height, (i, j) => {
            const lakeX = i + blockingToMapX;
            const lakeY = j + blockingToMapY;
            if (blockingGrid.get(lakeX, lakeY)) {
                if (map.cell(i, j).isStairs()) {
                    disrupts = true;
                }
            }
            else if (!map.cell(i, j).blocksMove()) {
                walkableGrid[i][j] = 1;
            }
        });
        let first = true;
        for (let i = 0; i < walkableGrid.width && !disrupts; ++i) {
            for (let j = 0; j < walkableGrid.height && !disrupts; ++j) {
                if (walkableGrid[i][j] == 1) {
                    if (first) {
                        walkableGrid.floodFill(i, j, 1, 2);
                        first = false;
                    }
                    else {
                        disrupts = true;
                    }
                }
            }
        }
        // console.log('WALKABLE GRID');
        // walkableGWU.grid.dump();
        GWU__namespace.grid.free(walkableGrid);
        return disrupts;
    }
    // Spread
    function cellIsOk(effect, map, x, y, isStart) {
        if (!map.hasXY(x, y))
            return false;
        const cell = map.cell(x, y);
        if (cell.hasCellFlag(Cell$1.EVENT_PROTECTED))
            return false;
        if (cell.blocksEffects() && !effect.matchTile && !isStart) {
            return false;
        }
        if (effect.flags & Effect.E_BUILD_IN_WALLS) {
            if (!map.cell(x, y).isWall())
                return false;
        }
        else if (effect.flags & Effect.E_MUST_TOUCH_WALLS) {
            let ok = false;
            GWU__namespace.xy.eachNeighbor(x, y, (i, j) => {
                if (map.cell(i, j).isWall()) {
                    ok = true;
                }
            }, true);
            if (!ok)
                return false;
        }
        else if (effect.flags & Effect.E_NO_TOUCH_WALLS) {
            let ok = true;
            if (map.cell(x, y).isWall())
                return false; // or on wall
            GWU__namespace.xy.eachNeighbor(x, y, (i, j) => {
                if (map.cell(i, j).isWall()) {
                    ok = false;
                }
            }, true);
            if (!ok)
                return false;
        }
        // if (ctx.bounds && !ctx.bounds.containsXY(x, y)) return false;
        if (effect.matchTile && !isStart && !cell.hasTile(effect.matchTile)) {
            return false;
        }
        return true;
    }
    function computeSpawnMap(effect, loc, spawnMap) {
        let i, j, dir, t, x2, y2;
        let madeChange;
        // const bounds = ctx.bounds || null;
        // if (bounds) {
        //   // Activation.debug('- bounds', bounds);
        // }
        const map = loc.map;
        let startProb = effect.grow || 0;
        let probDec = effect.decrement || 0;
        spawnMap.fill(0);
        if (!cellIsOk(effect, map, loc.x, loc.y, true)) {
            return false;
        }
        spawnMap[loc.x][loc.y] = t = 1; // incremented before anything else happens
        let count = 1;
        if (startProb) {
            madeChange = true;
            if (startProb >= 100) {
                probDec = probDec || 100;
            }
            if (probDec <= 0) {
                probDec = startProb;
            }
            while (madeChange && startProb > 0) {
                madeChange = false;
                t++;
                for (i = 0; i < map.width; i++) {
                    for (j = 0; j < map.height; j++) {
                        if (spawnMap[i][j] == t - 1) {
                            for (dir = 0; dir < 4; dir++) {
                                x2 = i + GWU__namespace.xy.DIRS[dir][0];
                                y2 = j + GWU__namespace.xy.DIRS[dir][1];
                                if (spawnMap.hasXY(x2, y2) &&
                                    !spawnMap[x2][y2] &&
                                    map.rng.chance(startProb) &&
                                    cellIsOk(effect, map, x2, y2, false)) {
                                    spawnMap[x2][y2] = t;
                                    madeChange = true;
                                    ++count;
                                }
                            }
                        }
                    }
                }
                startProb -= probDec;
            }
        }
        return count > 0;
    }
    function clearCells(map, spawnMap, flags = 0) {
        let didSomething = false;
        const clearAll = (flags & Effect.E_CLEAR_CELL) === Effect.E_CLEAR_CELL;
        spawnMap.forEach((v, i, j) => {
            if (!v)
                return;
            const cell = map.cell(i, j);
            if (clearAll) {
                cell.clear();
            }
            else {
                if (flags & Effect.E_CLEAR_GAS) {
                    cell.clearDepth(Depth.GAS);
                }
                if (flags & Effect.E_CLEAR_LIQUID) {
                    cell.clearDepth(Depth.LIQUID);
                }
                if (flags & Effect.E_CLEAR_SURFACE) {
                    cell.clearDepth(Depth.SURFACE);
                }
                if (flags & Effect.E_CLEAR_GROUND) {
                    cell.clearDepth(Depth.GROUND);
                }
            }
            didSomething = true;
        });
        return didSomething;
    }
    function evacuateCreatures(map, blockingMap) {
        let didSomething = false;
        map.eachActor((a) => {
            if (!blockingMap[a.x][a.y])
                return;
            const loc = map.rng.matchingLocNear(a.x, a.y, (x, y) => {
                if (!map.hasXY(x, y))
                    return false;
                if (blockingMap[x][y])
                    return false;
                const c = map.cell(x, y);
                return !a.forbidsCell(c);
            });
            if (loc && loc[0] >= 0 && loc[1] >= 0) {
                map.removeActor(a);
                map.addActor(loc[0], loc[1], a);
                // map.redrawXY(loc[0], loc[1]);
                didSomething = true;
            }
        });
        return didSomething;
    }
    function evacuateItems(map, blockingMap) {
        let didSomething = false;
        map.eachItem((i) => {
            if (!blockingMap[i.x][i.y])
                return;
            const loc = map.rng.matchingLocNear(i.x, i.y, (x, y) => {
                if (!map.hasXY(x, y))
                    return false;
                if (blockingMap[x][y])
                    return false;
                const dest = map.cell(x, y);
                return !i.forbidsCell(dest);
            });
            if (loc && loc[0] >= 0 && loc[1] >= 0) {
                map.removeItem(i);
                map.addItem(loc[0], loc[1], i);
                // map.redrawXY(loc[0], loc[1]);
                didSomething = true;
            }
        });
        return didSomething;
    }

    function stat(opts) {
        if (!opts)
            throw new Error('Invalid Stat config.');
        const info = {};
        if (typeof opts === 'string') {
            opts = opts.split(':').map((t) => t.trim());
        }
        if (Array.isArray(opts)) {
            info.stat = opts[0];
            info.type = opts[1] || 'inc';
            info.amount = GWU__namespace.range.make(opts[2] || 1);
        }
        else if (opts.type || opts.amount) {
            info.stat = opts.stat;
            info.type = opts.type || 'inc';
            info.amount = GWU__namespace.range.make(info.amount || 1);
        }
        else {
            throw new Error('Invalid stat effect configuration: ' + JSON.stringify(opts));
        }
        return statAction.bind(undefined, info);
    }
    function statAction(config, action) {
        if (!config.amount)
            return action.didNothing();
        // who am I nourishing?
        const actor = action.actor || action.map.actorAt(action.x, action.y);
        if (!actor) {
            return action.didNothing();
        }
        // sustain?
        const stats = actor.stats;
        if (!stats.adjust(config.stat, config.type, config.amount))
            return action.didNothing();
        return action.didSomething();
    }
    installHandler('stat', stat);

    function tile(src) {
        if (!src)
            throw new Error('Tile effect needs configuration.');
        if (typeof src === 'string') {
            src = { id: src };
        }
        else if (Array.isArray(src)) {
            src = { id: src[0] };
        }
        else if (!src.id) {
            throw new Error('Tile effect needs configuration with id.');
        }
        const opts = src;
        if (opts.id.includes('!')) {
            opts.superpriority = true;
        }
        if (opts.id.includes('~')) {
            opts.blockedByActors = true;
            opts.blockedByItems = true;
        }
        if (opts.id.includes('+')) {
            opts.protected = true;
        }
        opts.id = opts.id.replace(/[!~+]*/g, '');
        return tileAction.bind(undefined, opts);
    }
    function tileAction(cfg, action) {
        const map = action.map;
        cfg.machine = action.machine || 0;
        if (map.setTile(action.x, action.y, cfg.id, cfg)) {
            if (cfg.protected) {
                map.setCellFlag(action.x, action.y, Cell$1.EVENT_PROTECTED);
            }
            action.didSomething();
        }
    }
    installHandler('tile', tile);

    var index$7 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        fn: fn,
        activateMachine: activateMachine,
        activateMachineAction: activateMachineAction,
        chance: chance,
        chanceAction: chanceAction,
        clear: clear,
        clearAction: clearAction,
        emit: emit,
        emitAction: emitAction,
        feature: feature,
        featureAction: featureAction,
        msg: msg,
        messageAction: messageAction,
        nourish: nourish,
        nourishAction: nourishAction,
        spread: spread,
        spreadAction: spreadAction,
        mapDisruptedBy: mapDisruptedBy,
        computeSpawnMap: computeSpawnMap,
        clearCells: clearCells,
        evacuateCreatures: evacuateCreatures,
        evacuateItems: evacuateItems,
        stat: stat,
        statAction: statAction,
        tile: tile,
        tileAction: tileAction
    });

    class MapLayer {
        constructor(map, name = 'layer') {
            this.changed = false;
            this.map = map;
            this.depth = -1;
            this.properties = {};
            this.name = name;
        }
        copy(_other) { }
        clear() { }
        setTile(_x, _y, _tile, _opts) {
            return false;
        }
        clearTile(_x, _y) {
            return false;
        }
        addActor(_x, _y, _actor) {
            return false;
        }
        forceActor(_x, _y, _actor) {
            return false;
        }
        removeActor(_actor) {
            return false;
        }
        addItem(_x, _y, _item) {
            return false;
        }
        forceItem(_x, _y, _item) {
            return false;
        }
        removeItem(_item) {
            return false;
        }
        // Time based changes to the layer (e.g. dissipate gasses)
        tick(_dt) {
            return false;
        }
    }

    class TileLayer extends MapLayer {
        constructor(map, name = 'tile') {
            super(map, name);
        }
        setTile(x, y, tile, opts) {
            const cell = this.map.cell(x, y);
            return cell.setTile(tile, opts);
        }
        clearTile(x, y) {
            const cell = this.map.cell(x, y);
            return cell.clearDepth(this.depth);
        }
        tick(_dt) {
            // Run any tick effects
            // // Bookkeeping for fire, pressure plates and key-activated tiles.
            // for (let x = 0; x < this.map.width; ++x) {
            //     for (let y = 0; y < this.map.height; ++y) {
            //         const cell = this.map.cell(x, y);
            //         if (
            //             !cell.hasCellFlag(
            //                 Flags.Cell.HAS_ANY_ACTOR | Flags.Cell.HAS_ITEM
            //             ) &&
            //             cell.hasCellFlag(Flags.Cell.PRESSURE_PLATE_DEPRESSED)
            //         ) {
            //             cell.clearCellFlag(Flags.Cell.PRESSURE_PLATE_DEPRESSED);
            //         }
            //     }
            // }
            return true;
        }
    }

    function gas(map) {
        const cleanup = [];
        map.data.gas = true;
        cleanup.push(map.on('tick', () => {
            gasTick(map);
        }));
        cleanup.push(map.on('copy', (src) => {
            if (!src.data.gas) {
                // remove gas
                cleanup.forEach((c) => c());
            }
        }));
        cleanup.push(map.on('assign', (dest) => {
            if (!dest.data.gas) {
                // install gas
                gas(dest);
            }
        }));
    }
    function gasTick(map) {
        if (!map.hasMapFlag(Map$1.MAP_HAS_GAS))
            return;
        const updatedVolumes = GWU__namespace.grid.alloc(map.width, map.height);
        // dissipate the gas...
        dissipateGas(map, updatedVolumes);
        // spread the gas...
        spreadGas(map, updatedVolumes);
        GWU__namespace.grid.free(updatedVolumes);
    }
    function dissipateGas(map, volume) {
        map.cells.forEach((cell, x, y) => {
            if (!cell.volume) {
                volume[x][y] = 0;
            }
            else {
                let v = cell.volume;
                const tile = cell.depthTile(Depth.GAS);
                if (tile && tile.dissipate) {
                    let d = Math.max(0.5, (v * tile.dissipate) / 10000); // 1000 = 10%
                    v = Math.max(0, v - d);
                }
                if (!v) {
                    cell.clearDepth(Depth.GAS);
                }
                else {
                    cell.volume = v;
                }
                volume[x][y] = v;
            }
        });
    }
    // function calcOpacity(volume: number): number {
    //     return Math.floor(Math.min(volume, 10) * 10);
    // }
    function updateCellVolume(map, x, y, startingVolume) {
        let total = 0;
        let count = 0;
        let highestVolume = 0;
        const cell = map.cell(x, y);
        let startingTile = cell.depthTile(Depth.GAS);
        let highestTile = startingTile;
        if (cell.hasEntityFlag(Entity$1.L_BLOCKS_GAS)) {
            startingVolume[x][y] = 0;
            cell.volume = 0;
            return;
        }
        for (let i = Math.max(0, x - 1); i < Math.min(x + 2, startingVolume.width); ++i) {
            for (let j = Math.max(0, y - 1); j < Math.min(y + 2, startingVolume.height); ++j) {
                const v = startingVolume[i][j];
                if (!cell.hasEntityFlag(Entity$1.L_BLOCKS_GAS)) {
                    ++count;
                    if (v > highestVolume) {
                        highestVolume = v;
                        highestTile = map.cell(i, j).depthTile(Depth.GAS);
                    }
                }
                total += v;
            }
        }
        const v = Math.floor((total * 10) / count) / 10;
        // startingVolume[x][y] = v;
        if (v > 0 && highestTile) {
            if (!startingTile || startingTile !== highestTile) {
                cell.setTile(highestTile, { volume: v });
            }
            else {
                cell.volume = v;
            }
        }
        if (v > 0) {
            cell.needsRedraw = true;
        }
    }
    function spreadGas(map, startingVolume) {
        for (let x = 0; x < startingVolume.width; ++x) {
            for (let y = 0; y < startingVolume.height; ++y) {
                updateCellVolume(map, x, y, startingVolume);
            }
        }
    }

    const ObjectFlags = Entity$1;
    const TileFlags = Tile$1;
    const TileMechFlags = TileMech;
    const CellFlags = Cell$1;
    function fire(map) {
        map.data.fire = true;
        const cancelFns = [];
        cancelFns.push(map.on('tick', () => {
            fireTick(map);
        }));
        cancelFns.push(map.on('assign', (dest) => {
            if (!dest.data.fire) {
                fire(dest);
            }
        }));
        // Not sure if we should do this, but...
        cancelFns.push(map.on('copy', (src) => {
            if (!src.data.fire) {
                cancelFns.forEach((c) => c());
            }
        }));
    }
    function fireTick(map) {
        // Run any tick effects
        if (!map.hasMapFlag(Map$1.MAP_HAS_FIRE))
            return;
        map.clearMapFlag(Map$1.MAP_HAS_FIRE);
        // Bookkeeping for fire
        for (let x = 0; x < map.width; ++x) {
            for (let y = 0; y < map.height; ++y) {
                const cell = map.cell(x, y);
                cell.clearCellFlag(CellFlags.CAUGHT_FIRE_THIS_TURN);
            }
        }
        // now spread the fire...
        for (let x = 0; x < map.width; ++x) {
            for (let y = 0; y < map.height; ++y) {
                const cell = map.cell(x, y);
                if (cell.hasTileFlag(TileFlags.T_IS_FIRE) &&
                    !(cell.flags.cell & CellFlags.CAUGHT_FIRE_THIS_TURN)) {
                    exposeToFire(map, x, y, false);
                    for (let d = 0; d < 4; ++d) {
                        const dir = GWU__namespace.xy.DIRS[d];
                        exposeToFire(map, x + dir[0], y + dir[1]);
                    }
                }
            }
        }
        if (map.someCell((c) => c.hasTileFlag(Tile$1.T_IS_FIRE))) {
            map.setMapFlag(Map$1.MAP_HAS_FIRE);
        }
    }
    function exposeToFire(map, x, y, alwaysIgnite = false) {
        let firePriority = 0, bestExtinguishingPriority = 0, explosiveNeighborCount = 0;
        let explosivePromotion = false;
        const cell = map.cell(x, y);
        if (!cell.hasTileFlag(TileFlags.T_IS_FLAMMABLE)) {
            return false;
        }
        cell.eachTile((tile) => {
            // Pick the extinguishing layer with the best priority.
            if (tile.hasTileFlag(TileFlags.T_EXTINGUISHES_FIRE) &&
                tile.priority > bestExtinguishingPriority) {
                bestExtinguishingPriority = tile.priority;
            }
            // Pick the fire type of the most flammable layer that is either gas or equal-or-better priority than the best extinguishing layer.
            if (tile.flags.tile & TileFlags.T_IS_FLAMMABLE &&
                tile.priority > firePriority) {
                firePriority = tile.priority;
            }
        });
        // didNothing
        if (bestExtinguishingPriority >= firePriority && !alwaysIgnite)
            return false;
        // Count explosive neighbors.
        if (cell.hasTileMechFlag(TileMechFlags.TM_EXPLOSIVE_PROMOTE)) {
            GWU__namespace.xy.eachNeighbor(x, y, (x0, y0) => {
                const n = map.cell(x0, y0);
                if (n.hasEntityFlag(ObjectFlags.L_BLOCKS_GAS) ||
                    n.hasTileFlag(TileFlags.T_IS_FIRE) ||
                    n.hasTileMechFlag(TileMechFlags.TM_EXPLOSIVE_PROMOTE)) {
                    ++explosiveNeighborCount;
                }
            });
            if (explosiveNeighborCount >= 8) {
                explosivePromotion = true;
            }
        }
        let event = 'fire';
        if (explosivePromotion && cell.hasAction('explode')) {
            event = 'explode';
        }
        // cell.eachTile( (tile) => {
        //     if (tile.flags.tile & TileFlags.T_IS_FLAMMABLE) {
        //         if (tile.depth === Depth.GAS) {
        //             cell.gasVolume = 0;
        //         } else if (tile.depth === Depth.LIQUID) {
        //             cell.liquidVolume = 0;
        //         }
        //     }
        // });
        cell.trigger(event, {
            force: true,
        });
        // cell.needsRedraw = true;
        return true;
    }

    var index$6 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        MapLayer: MapLayer,
        TileLayer: TileLayer,
        gas: gas,
        fire: fire
    });

    const highlightColor = GWU__namespace.color.install('highlight', [100, 100, 0]);
    class BasicDrawer {
        constructor() {
            this.scent = false;
        }
        drawInto(dest, map, opts = {}) {
            const offsetX = opts.offsetX || 0;
            const offsetY = opts.offsetY || 0;
            map.clearMapFlag(Map$1.MAP_DANCES);
            const mixer = new GWU__namespace.sprite.Mixer();
            for (let x = 0; x < dest.width; ++x) {
                for (let y = 0; y < dest.height; ++y) {
                    if (map.hasXY(x + offsetX, y + offsetY)) {
                        const cell = map.cell(x + offsetX, y + offsetY);
                        this.drawCell(mixer, map, cell, map.fov);
                        dest.draw(x, y, mixer.ch || ' ', mixer.fg, mixer.bg);
                    }
                }
            }
        }
        drawCell(dest, map, cell, fov) {
            dest.blackOut();
            // const isVisible = fov ? fov.isAnyKindOfVisible(cell.x, cell.y) : true;
            const needSnapshot = !cell.hasCellFlag(Cell$1.STABLE_SNAPSHOT);
            if (cell.needsRedraw || needSnapshot) {
                this.getAppearance(dest, map, cell);
                cell.putSnapshot(dest);
                cell.needsRedraw = false;
                cell.setCellFlag(Cell$1.STABLE_SNAPSHOT);
            }
            else {
                cell.getSnapshot(dest);
                if (cell.hasCellFlag(Cell$1.COLORS_DANCE)) {
                    map.setMapFlag(Map$1.MAP_DANCES);
                }
            }
            this.applyLight(dest, cell, fov);
            let separate = false;
            if (cell.memory) {
                separate = !!((cell.memory.flags.entity & Entity$1.L_VISUALLY_DISTINCT)
                // Flags.Entity.L_LIST_IN_SIDEBAR)
                );
            }
            else {
                separate = cell.hasEntityFlag(Entity$1.L_VISUALLY_DISTINCT, 
                // Flags.Entity.L_LIST_IN_SIDEBAR,
                true);
            }
            if (cell.hasCellFlag(Cell$1.IS_CURSOR)) {
                dest.bg = highlightColor;
                dest.fg = dest.bg.inverse();
                separate = true;
            }
            else if (cell.hasCellFlag(Cell$1.IS_HIGHLIGHTED)) {
                dest.bg = highlightColor.mix(dest.bg, 35);
                dest.fg = dest.bg.inverse();
                separate = true;
            }
            if (this.scent && map.player) {
                const s = GWU__namespace.clamp(map.player.scent.get(cell.x, cell.y) * 5, 0, 50);
                if (s) {
                    const c = GWU__namespace.color.colors.red;
                    dest.mix(c, 0, s);
                }
            }
            if (separate) {
                [dest.fg, dest.bg] = GWU__namespace.color.separate(dest.fg, dest.bg);
            }
            return true;
        }
        // getCellAppearance(cell: CellType, dest: GWU.sprite.Mixer) {
        //     dest.blackOut();
        //     const isVisible = true; // this.fov.isAnyKindOfVisible(x, y);
        //     const isRevealed = true; // this.fov.isRevealed(x, y);
        //     const needSnapshot = !cell.hasCellFlag(Flags.Cell.STABLE_SNAPSHOT);
        //     if (needSnapshot || (cell.needsRedraw && isVisible)) {
        //         this.layers.forEach((layer) => layer.putAppearance(dest, cell));
        //         if (dest.dances) {
        //             cell.setCellFlag(Flags.Cell.COLORS_DANCE);
        //         } else {
        //             cell.clearCellFlag(Flags.Cell.COLORS_DANCE);
        //         }
        //         dest.bake();
        //         cell.putSnapshot(dest);
        //         cell.needsRedraw = false;
        //         cell.setCellFlag(Flags.Cell.STABLE_SNAPSHOT);
        //     } else {
        //         cell.getSnapshot(dest);
        //     }
        //     if (isVisible) {
        //         const light = this.light.getLight(cell.x, cell.y);
        //         dest.multiply(light);
        //     } else if (isRevealed) {
        //         dest.scale(50);
        //     } else {
        //         dest.blackOut();
        //     }
        //     if (cell.hasEntityFlag(Flags.Entity.L_VISUALLY_DISTINCT)) {
        //         [dest.fg, dest.bg] = GWU.color.separate(dest.fg, dest.bg);
        //     }
        // }
        getAppearance(dest, map, cell) {
            let tiles = cell.tiles;
            let actor = null;
            let item = null;
            if (cell.memory) {
                tiles = cell.memory.tiles;
                item = cell.memory.item;
            }
            else {
                actor = cell.hasActor() ? cell.actor : null;
                item = cell.hasItem() ? cell.item : null;
            }
            const ground = tiles[Depth.GROUND];
            const surface = tiles[Depth.SURFACE];
            const liquid = tiles[Depth.LIQUID];
            const gas = tiles[Depth.GAS]; // How to get volume!?!?!?!
            dest.drawSprite(ground.sprite);
            if (surface) {
                dest.drawSprite(surface.sprite);
            }
            if (liquid) {
                dest.drawSprite(liquid.sprite);
            }
            if (item) {
                item.drawInto(dest);
            }
            if (actor) {
                actor.drawInto(dest);
            }
            if (gas) {
                const opacity = GWU__namespace.rng.cosmetic.number(50) + 25;
                dest.drawSprite(gas.sprite, opacity);
            }
            if (cell.hasFx()) {
                const fx = map.fxAt(cell.x, cell.y);
                if (fx)
                    dest.drawSprite(fx.sprite);
            }
            if (dest.dances) {
                cell.setCellFlag(Cell$1.COLORS_DANCE);
                map.setMapFlag(Map$1.MAP_DANCES);
            }
            else {
                cell.clearCellFlag(Cell$1.COLORS_DANCE);
            }
            dest.bake(true); // apply dancing
        }
        applyLight(dest, cell, fov) {
            const isVisible = !fov || fov.isAnyKindOfVisible(cell.x, cell.y);
            const isRevealed = !fov || fov.isRevealed(cell.x, cell.y);
            const light = cell.map.light.getLight(cell.x, cell.y);
            dest.multiply(light);
            // TODO - is Clairy
            // TODO - is Telepathy
            if (fov && fov.isCursor(cell.x, cell.y)) {
                dest.invert();
            }
            else if (!isVisible) {
                if (cell.hasEntityFlag(Entity$1.L_BRIGHT_MEMORY)) ;
                else if (isRevealed) {
                    dest.scale(70);
                }
                else {
                    dest.blackOut();
                }
            }
        }
    }

    // export interface MapEvents extends GWU.events.Events {
    //     // add or remove actor
    //     actor: (map: Map, actor: Actor, isNew: boolean) => void;
    //     // add or remove item
    //     item: (map: Map, item: Item, isNew: boolean) => void;
    //     // add or remove fx
    //     fx: (map: Map, fx: Entity, isNew: boolean) => void;
    //     // change cell tiles
    //     cell: (map: Map, cell: Cell) => void;
    // }
    class Map {
        constructor(width, height, opts = {}) {
            this.locations = {};
            // _memory: GWU.grid.Grid<CellMemory>;
            // machineCount = 0;
            // _seed = 0;
            this.rng = GWU__namespace.rng.random;
            this.id = 0;
            this.actors = [];
            this.items = [];
            this.fx = [];
            this.player = null;
            this._tweens = new GWU__namespace.app.Tweens();
            // actions = new ACTION.Actions(this);
            this.events = new GWU__namespace.app.Events(this);
            this.flags = { map: 0 };
            // this.layers = [];
            this.data = { seed: 0, machineCount: 0 };
            if (opts.id) {
                this.data.id = opts.id;
            }
            this.drawer = opts.drawer || new BasicDrawer();
            this.cells = GWU__namespace.grid.make(width, height, (x, y) => new Cell(this, x, y));
            // this._memory = GWU.grid.make(
            //     width,
            //     height,
            //     (x, y) => new CellMemory(this, x, y)
            // );
            if (opts.seed) {
                this.data.seed = opts.seed;
                this.rng = GWU__namespace.rng.make(opts.seed);
            }
            this.light = new GWU__namespace.light.LightSystem(this, opts);
            if (opts.fov === undefined) {
                opts.alwaysVisible = true;
            }
            else if (opts.fov === false) {
                opts.visible = true;
            }
            opts.callback = this.onFovChange.bind(this);
            this.fov = new GWU__namespace.fov.FovSystem(this, opts);
            // this.initLayers();
            if (opts.player) {
                this.setPlayer(opts.player);
            }
            if (opts.actions) {
                this.events.load(opts.actions);
            }
        }
        get seed() {
            return this.data.seed;
        }
        set seed(v) {
            this.data.seed = v;
            this.rng = GWU__namespace.rng.make(v);
        }
        get width() {
            return this.cells.width;
        }
        get height() {
            return this.cells.height;
        }
        // memory(x: number, y: number): CellMemory {
        //     return this._memory[x][y];
        // }
        // knowledge(x: number, y: number): CellInfoType {
        //     if (this.fov.isAnyKindOfVisible(x, y)) return this.cell(x,y);
        //     return this._memory[x][y];
        // }
        // LAYERS
        // initLayers() {
        //     this.addLayer(Flags.Depth.GROUND, new Layer.TileLayer(this, 'ground'));
        //     this.addLayer(
        //         Flags.Depth.SURFACE,
        //         new Layer.FireLayer(this, 'surface')
        //     );
        //     this.addLayer(Flags.Depth.GAS, new Layer.GasLayer(this, 'gas'));
        // }
        // addLayer(depth: number | keyof typeof Flags.Depth, layer: LayerType) {
        //     if (typeof depth !== 'number') {
        //         depth = Flags.Depth[depth as keyof typeof Flags.Depth];
        //     }
        //     layer.depth = depth;
        //     this.layers[depth] = layer;
        // }
        // removeLayer(depth: number | keyof typeof Flags.Depth) {
        //     if (typeof depth !== 'number') {
        //         depth = Flags.Depth[depth as keyof typeof Flags.Depth];
        //     }
        //     if (!depth) throw new Error('Cannot remove layer with depth=0.');
        //     delete this.layers[depth];
        // }
        // getLayer(depth: number | keyof typeof Flags.Depth): LayerType | null {
        //     if (typeof depth !== 'number') {
        //         depth = Flags.Depth[depth as keyof typeof Flags.Depth];
        //     }
        //     return this.layers[depth] || null;
        // }
        hasXY(x, y) {
            return this.cells.hasXY(x, y);
        }
        isBoundaryXY(x, y) {
            return x == 0 || y == 0 || x == this.width - 1 || y == this.height - 1;
        }
        cell(x, y) {
            return this.cells[x][y];
        }
        get(x, y) {
            return this.cells.get(x, y);
        }
        eachCell(cb) {
            this.cells.forEach((cell, x, y) => cb(cell, x, y, this));
        }
        someCell(cb) {
            return this.cells.some((c, x, y) => cb(c, x, y, this));
        }
        // items
        hasItem(x, y) {
            return this.cell(x, y).hasItem();
        }
        itemAt(x, y) {
            return this.items.find((i) => i.isAt(x, y)) || null;
        }
        eachItem(cb) {
            this.items.forEach(cb);
        }
        addItem(x, y, item, fireEffects = false) {
            if (!this.hasXY(x, y))
                return false;
            const cell = this.cell(x, y);
            // if (!cell.canAddItem(item)) return false;
            if (cell._addItem(item)) {
                const index = this.items.indexOf(item);
                if (index < 0) {
                    this.items.push(item);
                }
                item.addToMap(this, x, y);
                if (fireEffects) {
                    this._fireAddItemEffects(item, cell);
                }
                return true;
            }
            return false;
        }
        _fireAddItemEffects(item, cell) {
            if (item.key &&
                item.key.matches(cell.x, cell.y) &&
                cell.hasAction('key')) {
                cell.trigger('key', { map: this, key: true, item });
            }
            else if (cell.hasAction('place')) {
                cell.trigger('place', { map: this, item });
            }
        }
        addItemNear(x, y, item, fireEffects = false) {
            const loc = this.rng.matchingLocNear(x, y, (i, j) => {
                if (!this.hasXY(i, j))
                    return false;
                const cell = this.cell(i, j);
                if (cell.hasItem())
                    return false;
                if (cell.blocksMove())
                    return false;
                if (item.avoidsCell(cell))
                    return false;
                return true;
            });
            if (!loc || loc[0] < 0)
                return false;
            return this.addItem(loc[0], loc[1], item, fireEffects);
        }
        removeItem(item, fireEffects = false) {
            const cell = this.cell(item.x, item.y);
            // if (!cell.canRemoveItem(item)) return false;
            if (cell._removeItem(item)) {
                if (fireEffects) {
                    this._fireRemoveItemEffects(item, cell);
                }
                GWU__namespace.arrayDelete(this.items, item);
                item.removeFromMap();
                return true;
            }
            return false;
        }
        _fireRemoveItemEffects(item, cell) {
            if (item.isKey(cell.x, cell.y) && cell.hasAction('no_key')) {
                cell.trigger('no_key', {
                    map: this,
                    key: true,
                    item,
                });
            }
            else if (cell.hasAction('remove')) {
                cell.trigger('remove', { map: this, key: true, item });
            }
        }
        moveItem(item, x, y, fireEffects = false) {
            if (item.map !== this)
                throw new Error('Actor not on this map!');
            const currentCell = this.cell(item.x, item.y);
            const newCell = this.cell(x, y);
            // if (!currentCell.canRemoveItem(item)) return false;
            // if (!newCell.canAddItem(item)) return false;
            currentCell._removeItem(item);
            if (newCell._addItem(item)) {
                if (fireEffects) {
                    this._fireRemoveItemEffects(item, currentCell);
                    this._fireAddItemEffects(item, newCell);
                }
                item.addToMap(this, x, y);
            }
            return true;
        }
        //  moveItem(item: Item, dir: GWU.xy.Loc | number): boolean {
        //     if (typeof dir === 'number') {
        //         dir = GWU.xy.DIRS[dir];
        //     }
        //     const oldX = item.x;
        //     const oldY = item.y;
        //     const x = oldX + dir[0];
        //     const y = oldY + dir[1];
        //     if (!this.hasXY(x, y)) return false;
        //     const layer = this.layers[item.depth] as Layer.ItemLayer;
        //     if (!( layer.removeItem(item))) return false;
        //     if (!( this.addItem(x, y, item))) {
        //         layer.forceItem(item.x, item.y, item);
        //         return false;
        //     }
        //     // const wasVisible = this.fov.isAnyKindOfVisible(oldX, oldY);
        //     // const isVisible = this.fov.isAnyKindOfVisible(x, y);
        //     // if (isVisible && !wasVisible) {
        //     //     if (item.lastSeen) {
        //     //         this._memory[item.lastSeen.x][item.lastSeen.y].removeItem(item);
        //     //         this.clearCellFlag(
        //     //             item.lastSeen.x,
        //     //             item.lastSeen.y,
        //     //             Flags.Cell.STABLE_SNAPSHOT
        //     //         );
        //     //         item.lastSeen = null;
        //     //     }
        //     // } else if (wasVisible && !isVisible) {
        //     //     const mem = this._memory[x][y];
        //     //     mem.item = item;
        //     //     this.clearCellFlag(x, y, Flags.Cell.STABLE_SNAPSHOT);
        //     //     item.lastSeen = this.cell(x, y);
        //     // }
        //     return true;
        // }
        // Actors
        hasPlayer(x, y) {
            return this.cell(x, y).hasPlayer();
        }
        setPlayer(player) {
            this.player = player;
        }
        actorAt(x, y) {
            return this.actors.find((a) => a.isAt(x, y)) || null;
        }
        eachActor(cb) {
            this.actors.forEach(cb);
        }
        addActor(x, y, actor, fireEffects = false) {
            if (!this.hasXY(x, y))
                return false;
            const cell = this.cell(x, y);
            if (!cell.canAddActor(actor))
                return false;
            if (cell._addActor(actor)) {
                const index = this.actors.indexOf(actor);
                if (index < 0) {
                    this.actors.push(actor);
                }
                actor.addToMap(this, x, y);
                if (fireEffects) {
                    this._fireAddActorEffects(actor, cell);
                }
                if (index < 0) {
                    this.trigger('enter', { map: this, actor });
                }
                return true;
            }
            return false;
        }
        _fireAddActorEffects(actor, cell) {
            if (actor.isKey(cell.x, cell.y) && cell.hasAction('key')) {
                cell.trigger('key', { map: this, key: true, actor });
            }
            else if (actor.isPlayer() && cell.hasAction('player-enter')) {
                cell.trigger('player-enter', {
                    map: this,
                    actor,
                });
            }
            else if (cell.hasAction('enter')) {
                cell.trigger('enter', { map: this, actor });
            }
        }
        addActorNear(x, y, actor, fireEffects = false) {
            const loc = this.rng.matchingLocNear(x, y, (i, j) => {
                if (!this.hasXY(i, j))
                    return false;
                const cell = this.cell(i, j);
                if (cell.hasActor())
                    return false;
                if (cell.blocksMove())
                    return false;
                if (actor.avoidsCell(cell))
                    return false;
                return true;
            });
            if (!loc || loc[0] < 0)
                return false;
            return this.addActor(loc[0], loc[1], actor, fireEffects);
        }
        removeActor(actor, fireEffects = false) {
            const cell = this.cell(actor.x, actor.y);
            if (!cell.canRemoveActor(actor))
                return false;
            if (cell._removeActor(actor)) {
                if (fireEffects) {
                    this._fireRemoveActorEffects(actor, cell);
                }
                actor.removeFromMap();
                GWU__namespace.arrayDelete(this.actors, actor);
                this.trigger('exit', { map: this, actor });
                return true;
            }
            return false;
        }
        _fireRemoveActorEffects(actor, cell) {
            if (actor.isKey(actor.x, actor.y) && cell.hasAction('no_key')) {
                cell.trigger('no_key', { map: this, key: true, actor });
            }
            else if (actor.isPlayer() && cell.hasAction('player-exit')) {
                cell.trigger('player-exit', { map: this, actor });
            }
            else if (cell.hasAction('exit')) {
                cell.trigger('exit', { map: this, actor });
            }
        }
        moveActor(actor, x, y, fireEffects = false) {
            if (actor.map !== this)
                throw new Error('Actor not on this map!');
            const currentCell = this.cell(actor.x, actor.y);
            const newCell = this.cell(x, y);
            // if (!currentCell.canRemoveActor(actor)) return false;
            // if (!newCell.canAddActor(actor)) return false;
            currentCell._removeActor(actor);
            if (newCell._addActor(actor)) {
                actor.addToMap(this, x, y);
                if (fireEffects) {
                    this._fireRemoveActorEffects(actor, currentCell);
                    this._fireAddActorEffects(actor, newCell);
                }
            }
            return true;
        }
        //  moveActor(actor: Actor, dir: GWU.xy.Loc | number): boolean {
        //     if (typeof dir === 'number') {
        //         dir = GWU.xy.DIRS[dir];
        //     }
        //     const oldX = actor.x;
        //     const oldY = actor.y;
        //     const x = oldX + dir[0];
        //     const y = oldY + dir[1];
        //     if (!this.hasXY(x, y)) return false;
        //     const layer = this.layers[actor.depth] as Layer.ActorLayer;
        //     if (!( layer.removeActor(actor))) return false;
        //     if (!( layer.addActor(x, y, actor))) {
        //         layer.forceActor(actor.x, actor.y, actor);
        //         return false;
        //     }
        //     // const wasVisible = this.fov.isAnyKindOfVisible(oldX, oldY);
        //     // const isVisible = this.fov.isAnyKindOfVisible(x, y);
        //     // if (isVisible && !wasVisible) {
        //     //     if (actor.lastSeen) {
        //     //         this._memory[actor.lastSeen.x][actor.lastSeen.y].removeActor(
        //     //             actor
        //     //         );
        //     //         this.clearCellFlag(
        //     //             actor.lastSeen.x,
        //     //             actor.lastSeen.y,
        //     //             Flags.Cell.STABLE_SNAPSHOT
        //     //         );
        //     //         actor.lastSeen = null;
        //     //     }
        //     // } else if (wasVisible && !isVisible) {
        //     //     const mem = this._memory[x][y];
        //     //     mem.actor = actor;
        //     //     this.clearCellFlag(x, y, Flags.Cell.STABLE_SNAPSHOT);
        //     //     actor.lastSeen = this.cell(x, y);
        //     // }
        //     return true;
        // }
        fxAt(x, y) {
            return this.fx.find((i) => i.isAt(x, y)) || null;
        }
        eachFx(cb) {
            this.fx.forEach(cb);
        }
        addFx(x, y, fx) {
            const cell = this.get(x, y);
            if (!cell)
                return false;
            fx.x = x;
            fx.y = y;
            cell._addFx(fx);
            this.fx.push(fx);
            // this.events.emit('fx', this, fx, true);
            return true;
        }
        moveFx(fx, x, y) {
            const current = this.get(fx.x, fx.y);
            const updated = this.get(x, y);
            if (!updated)
                return false;
            current._removeFx(fx);
            fx.x = x;
            fx.y = y;
            updated._addFx(fx);
            return true;
        }
        removeFx(fx) {
            const cell = this.get(fx.x, fx.y);
            GWU__namespace.arrayDelete(this.fx, fx);
            if (cell) {
                cell._removeFx(fx);
            }
            // this.events.emit('fx', this, fx, false);
            return true;
        }
        // Information
        // isVisible(x: number, y: number): boolean {
        //     return this.fov.isAnyKindOfVisible(x, y);
        // }
        hasKey(x, y) {
            const actor = this.actorAt(x, y);
            if (actor && actor.isKey(x, y))
                return true;
            const item = this.itemAt(x, y);
            if (item && item.isKey(x, y))
                return true;
            return false;
        }
        count(cb) {
            return this.cells.count((cell, x, y) => cb(cell, x, y, this));
        }
        dump(fmt, log = console.log) {
            const getCh = (cell) => {
                return cell.dump();
            };
            this.cells.dump(fmt || getCh, log);
        }
        // flags
        hasMapFlag(flag) {
            return !!(this.flags.map & flag);
        }
        setMapFlag(flag) {
            this.flags.map |= flag;
        }
        clearMapFlag(flag) {
            this.flags.map &= ~flag;
        }
        get needsRedraw() {
            return this.hasMapFlag(Map$1.MAP_NEEDS_REDRAW);
        }
        set needsRedraw(v) {
            if (v)
                this.setMapFlag(Map$1.MAP_NEEDS_REDRAW);
            else
                this.clearMapFlag(Map$1.MAP_NEEDS_REDRAW);
        }
        hasCellFlag(x, y, flag) {
            return this.cell(x, y).hasCellFlag(flag);
        }
        setCellFlag(x, y, flag) {
            this.cell(x, y).setCellFlag(flag);
        }
        clearCellFlag(x, y, flag) {
            this.cell(x, y).clearCellFlag(flag);
        }
        hasEntityFlag(x, y, flag) {
            return this.cell(x, y).hasEntityFlag(flag);
        }
        hasTileFlag(x, y, flag) {
            return this.cell(x, y).hasTileFlag(flag);
        }
        highlightPath(path, markCursor = true) {
            this.clearPath();
            path.forEach((loc) => {
                this.setCellFlag(loc[0], loc[1], Cell$1.IS_HIGHLIGHTED);
            });
            if (markCursor && path[0]) {
                const loc = path[0];
                this.setCellFlag(loc[0], loc[1], Cell$1.IS_CURSOR);
            }
            this.needsRedraw = true;
        }
        highlightCell(x, y, markCursor = false) {
            this.setCellFlag(x, y, markCursor ? Cell$1.IS_CURSOR : Cell$1.IS_HIGHLIGHTED);
            this.needsRedraw = true;
        }
        clearPath() {
            this.cells.forEach((c) => c.clearCellFlag(Cell$1.IS_CURSOR | Cell$1.IS_HIGHLIGHTED));
            this.needsRedraw = true;
        }
        showCursor(x, y) {
            this.clearCursor();
            this.cell(x, y).setCellFlag(Cell$1.IS_CURSOR);
            this.needsRedraw = true;
        }
        clearCursor() {
            this.cells.forEach((c) => c.clearCellFlag(Cell$1.IS_CURSOR));
            this.needsRedraw = true;
        }
        clear() {
            this.light.glowLightChanged = true;
            // this.fov.needsUpdate = true;
            // this.layers.forEach((l) => l.clear());
            this.cells.forEach((c) => {
                c.clear();
                this.events.trigger('changed', c);
            });
        }
        clearCell(x, y, tile) {
            const cell = this.cell(x, y);
            cell.clear(tile);
            this.events.trigger('changed', cell);
        }
        // Skips all the logic checks and just forces a clean cell with the given tile
        fill(tile, boundary) {
            tile = get$3(tile);
            boundary = get$3(boundary || tile);
            let i, j;
            for (i = 0; i < this.width; ++i) {
                for (j = 0; j < this.height; ++j) {
                    const cell = this.cells[i][j];
                    cell.clear(this.isBoundaryXY(i, j) ? boundary : tile);
                    this.events.trigger('changed', cell);
                }
            }
        }
        hasTile(x, y, tile
        // useMemory = false
        ) {
            return this.cell(x, y).hasTile(tile);
            // if (!useMemory) return this.cell(x, y).hasTile(tile);
            // return this.memory(x, y).hasTile(tile);
        }
        forceTile(x, y, tile) {
            return this.setTile(x, y, tile, { superpriority: true });
        }
        setTile(x, y, tile, opts) {
            if (!(tile instanceof Tile)) {
                const name = tile;
                tile = get$3(name);
                if (!tile)
                    throw new Error('Failed to find tile: ' + name);
            }
            if (opts === true) {
                opts = { superpriority: true };
            }
            // const depth = tile.depth || 0;
            // const layer = this.layers[depth] || this.layers[0];
            // if (!(layer instanceof Layer.TileLayer)) return false;
            const cell = this.cell(x, y);
            if (cell.setTile(tile, opts)) {
                this.events.trigger('changed', cell, opts);
                return true;
            }
            return false;
        }
        // clearTiles(x: number, y: number, tile?: TileBase) {
        //     const cell = this.cell(x, y);
        //     cell.clearTiles(tile);
        // }
        tick(dt) {
            let didSomething = this._tweens.length > 0;
            this._tweens.update(dt);
            if (this.triggerAll('tick')) {
                didSomething = true;
            }
            // for (let layer of this.layers) {
            //     if (layer && layer.tick(dt)) {
            //         didSomething = true;
            //     }
            // }
            this.events.trigger('tick', dt);
            return didSomething;
        }
        copy(src) {
            if (this.constructor !== src.constructor)
                throw new Error('Maps must be same type to copy.');
            if (this.width !== src.width || this.height !== src.height)
                throw new Error('Maps must be same size to copy');
            this.cells.forEach((c, x, y) => {
                c.copy(src.cell(x, y));
            });
            // this.layers.forEach((l, depth) => {
            //     l.copy(src.layers[depth]);
            // });
            this.actors = src.actors.slice();
            this.items = src.items.slice();
            this.flags.map = src.flags.map;
            // this.fov.needsUpdate = true;
            this.light.copy(src.light);
            this.rng = src.rng;
            this.data = Object.assign({}, src.data);
            src.events.trigger('assign', this);
            this.events.trigger('copy', src);
        }
        clone() {
            // @ts-ignore
            const other = new this.constructor(this.width, this.height);
            other.copy(this);
            return other;
        }
        hasAction(action) {
            return this.events.has(action);
        }
        on(action, fn) {
            return this.events.on(action, fn);
        }
        once(action, fn) {
            return this.events.once(action, fn);
        }
        off(action, fn) {
            this.events.off(action, fn);
        }
        trigger(ev, action = {}) {
            if (!(action instanceof Action)) {
                action = new Action(action);
            }
            this.events.trigger(ev, action);
            if (action.isDone())
                return;
            if (action.x !== undefined && action.y !== undefined) {
                const cell = this.cell(action.x, action.y);
                cell.trigger(ev, action);
            }
        }
        triggerAll(name, action = {}) {
            if (!(action instanceof Action)) {
                action = new Action(action);
            }
            let didSomething = false;
            const willFire = GWU__namespace.grid.alloc(this.width, this.height);
            action.map = this;
            // Figure out which tiles will fire - before we change everything...
            this.cells.forEach((cell, x, y) => {
                cell.clearCellFlag(Cell$1.EVENT_FIRED_THIS_TURN | Cell$1.EVENT_PROTECTED);
                cell.eachTile((tile) => {
                    if (!tile.hasAction(name))
                        return;
                    // const effect = Effect.from(ev);
                    // if (!effect) return;
                    let promoteChance = 0;
                    // < 0 means try to fire my neighbors...
                    {
                        promoteChance = 100 * 100; // 100%
                    }
                    if (!cell.hasCellFlag(Cell$1.CAUGHT_FIRE_THIS_TURN) &&
                        this.rng.chance(promoteChance, 10000)) {
                        willFire[x][y] |= GWU__namespace.flag.fl(tile.depth);
                        // cell.flags.cellMech |= Cell.MechFlags.EVENT_FIRED_THIS_TURN;
                    }
                });
            });
            // Then activate them - so that we don't activate the next generation as part of the forEach
            action.force = true;
            willFire.forEach((w, x, y) => {
                if (!w)
                    return;
                const cell = this.cell(x, y);
                if (cell.hasCellFlag(Cell$1.EVENT_FIRED_THIS_TURN))
                    return;
                for (let depth = 0; depth <= Depth.GAS; ++depth) {
                    if (w & GWU__namespace.flag.fl(depth)) {
                        cell.trigger(name, action);
                        if (action.isSuccess()) {
                            didSomething = true;
                        }
                        action.reset();
                    }
                }
            });
            GWU__namespace.grid.free(willFire);
            return didSomething;
        }
        // DRAW
        drawInto(dest, opts) {
            this.drawer.drawInto(dest, this, opts);
        }
        getAppearanceAt(x, y, dest) {
            const cell = this.cell(x, y);
            return this.drawer.drawCell(dest, this, cell);
        }
        // // LightSystemSite
        hasActor(x, y) {
            return this.cell(x, y).hasActor();
        }
        eachGlowLight(cb) {
            this.cells.forEach((cell, x, y) => {
                cell.eachGlowLight((light) => cb(x, y, light));
                // cell.clearCellFlag(Flags.Cell.LIGHT_CHANGED);
            });
        }
        eachDynamicLight(_cb) { }
        // FOV System Site
        eachViewport(cb) {
            // TODO - Clairy, Telepathy, Detect, etc...
            if (this.player) {
                cb(this.player.x, this.player.y, this.player.visionDistance, GWU__namespace.fov.FovFlags.PLAYER);
            }
        }
        lightingChanged() {
            return this.light.changed;
        }
        hasVisibleLight(x, y) {
            return !this.light.isDark(x, y);
        }
        blocksVision(x, y) {
            return this.cell(x, y).blocksVision();
        }
        // redrawCell(x: number, y: number): void {
        //     // if (clearMemory) {
        //     //     this.clearMemory(x, y);
        //     // }
        //     this.cell(x, y).needsRedraw = true;
        // }
        storeMemory(x, y) {
            const cell = this.cell(x, y);
            cell.storeMemory();
            if (cell.hasActor() &&
                cell.actor.hasEntityFlag(Entity$1.L_IN_SIDEBAR)) {
                this.setMapFlag(Map$1.MAP_SIDEBAR_CHANGED);
            }
        }
        makeVisible(x, y) {
            const cell = this.cell(x, y);
            cell.clearMemory();
            if (cell.hasTileFlag(Tile$1.T_LIST_IN_SIDEBAR)) {
                this.setMapFlag(Map$1.MAP_SIDEBAR_TILES_CHANGED |
                    Map$1.MAP_SIDEBAR_CHANGED);
            }
            else if (cell.hasActor() &&
                !cell.actor.hasEntityFlag(Entity$1.L_IN_SIDEBAR)) {
                this.setMapFlag(Map$1.MAP_SIDEBAR_CHANGED);
            }
            else if (cell.hasItem() &&
                !cell.item.hasEntityFlag(Entity$1.L_IN_SIDEBAR)) {
                this.setMapFlag(Map$1.MAP_SIDEBAR_CHANGED);
            }
        }
        onFovChange(x, y, isVisible) {
            if (!isVisible) {
                this.storeMemory(x, y);
            }
            else {
                this.makeVisible(x, y);
            }
        }
        // Animator
        addAnimation(a) {
            this._tweens.add(a);
        }
        removeAnimation(a) {
            this._tweens.remove(a);
        }
    }

    function analyze(map, updateChokeCounts = true) {
        updateLoopiness(map);
        updateChokepoints(map, updateChokeCounts);
    }
    /////////////////////////////////////////////////////
    /////////////////////////////////////////////////////
    // TODO - Move to Map?
    function updateChokepoints(map, updateCounts) {
        const passMap = GWU__namespace.grid.alloc(map.width, map.height);
        const grid = GWU__namespace.grid.alloc(map.width, map.height);
        for (let i = 0; i < map.width; i++) {
            for (let j = 0; j < map.height; j++) {
                const cell = map.cell(i, j);
                if ((cell.blocksPathing() || cell.blocksMove()) &&
                    !cell.hasEntityFlag(Entity$1.L_SECRETLY_PASSABLE)) {
                    // cell.flags &= ~Flags.Cell.IS_IN_LOOP;
                    passMap[i][j] = 0;
                }
                else {
                    // cell.flags |= Flags.Cell.IS_IN_LOOP;
                    passMap[i][j] = 1;
                }
            }
        }
        let passableArcCount;
        // done finding loops; now flag chokepoints
        for (let i = 1; i < passMap.width - 1; i++) {
            for (let j = 1; j < passMap.height - 1; j++) {
                map.cell(i, j).flags.cell &= ~Cell$1.IS_CHOKEPOINT;
                if (passMap[i][j] &&
                    !(map.cell(i, j).flags.cell & Cell$1.IS_IN_LOOP)) {
                    passableArcCount = 0;
                    for (let dir = 0; dir < 8; dir++) {
                        const oldX = i + GWU__namespace.xy.CLOCK_DIRS[(dir + 7) % 8][0];
                        const oldY = j + GWU__namespace.xy.CLOCK_DIRS[(dir + 7) % 8][1];
                        const newX = i + GWU__namespace.xy.CLOCK_DIRS[dir][0];
                        const newY = j + GWU__namespace.xy.CLOCK_DIRS[dir][1];
                        if ((map.hasXY(newX, newY) && // RUT.Map.makeValidXy(map, newXy) &&
                            passMap[newX][newY]) !=
                            (map.hasXY(oldX, oldY) && // RUT.Map.makeValidXy(map, oldXy) &&
                                passMap[oldX][oldY])) {
                            if (++passableArcCount > 2) {
                                if ((!passMap[i - 1][j] && !passMap[i + 1][j]) ||
                                    (!passMap[i][j - 1] && !passMap[i][j + 1])) {
                                    map.cell(i, j).flags.cell |=
                                        Cell$1.IS_CHOKEPOINT;
                                }
                                break;
                            }
                        }
                    }
                }
            }
        }
        if (updateCounts) {
            // Done finding chokepoints; now create a chokepoint map.
            // The chokepoint map is a number for each passable tile. If the tile is a chokepoint,
            // then the number indicates the number of tiles that would be rendered unreachable if the
            // chokepoint were blocked. If the tile is not a chokepoint, then the number indicates
            // the number of tiles that would be rendered unreachable if the nearest exit chokepoint
            // were blocked.
            // The cost of all of this is one depth-first flood-fill per open point that is adjacent to a chokepoint.
            // Start by setting the chokepoint values really high, and roping off room machines.
            for (let i = 0; i < map.width; i++) {
                for (let j = 0; j < map.height; j++) {
                    map.cell(i, j).chokeCount = 30000;
                    // Not sure why this was done in Brogue
                    // if (map.cell(i, j).flags.cell & Flags.Cell.IS_IN_ROOM_MACHINE) {
                    //     passMap[i][j] = 0;
                    // }
                }
            }
            // Scan through and find a chokepoint next to an open point.
            for (let i = 0; i < map.width; i++) {
                for (let j = 0; j < map.height; j++) {
                    const cell = map.cell(i, j);
                    if (passMap[i][j] &&
                        cell.flags.cell & Cell$1.IS_CHOKEPOINT) {
                        for (let dir = 0; dir < 4; dir++) {
                            const newX = i + GWU__namespace.xy.DIRS[dir][0];
                            const newY = j + GWU__namespace.xy.DIRS[dir][1];
                            if (map.hasXY(newX, newY) && // RUT.Map.makeValidXy(map, newXy) &&
                                passMap[newX][newY] &&
                                !(map.cell(newX, newY).flags.cell &
                                    Cell$1.IS_CHOKEPOINT)) {
                                // OK, (newX, newY) is an open point and (i, j) is a chokepoint.
                                // Pretend (i, j) is blocked by changing passMap, and run a flood-fill cell count starting on (newX, newY).
                                // Keep track of the flooded region in grid[][].
                                grid.fill(0);
                                passMap[i][j] = 0;
                                let cellCount = floodFillCount(map, grid, passMap, newX, newY);
                                passMap[i][j] = 1;
                                // CellCount is the size of the region that would be obstructed if the chokepoint were blocked.
                                // CellCounts less than 4 are not useful, so we skip those cases.
                                if (cellCount >= 4) {
                                    // Now, on the chokemap, all of those flooded cells should take the lesser of their current value or this resultant number.
                                    for (let i2 = 0; i2 < grid.width; i2++) {
                                        for (let j2 = 0; j2 < grid.height; j2++) {
                                            if (grid[i2][j2] &&
                                                cellCount <
                                                    map.cell(i2, j2).chokeCount) {
                                                map.cell(i2, j2).chokeCount =
                                                    cellCount;
                                                map.cell(i2, j2).flags.cell &=
                                                    ~Cell$1.IS_GATE_SITE;
                                            }
                                        }
                                    }
                                    // The chokepoint itself should also take the lesser of its current value or the flood count.
                                    if (cellCount < cell.chokeCount) {
                                        cell.chokeCount = cellCount;
                                        cell.flags.cell |= Cell$1.IS_GATE_SITE;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        GWU__namespace.grid.free(passMap);
        GWU__namespace.grid.free(grid);
    }
    // Assumes it is called with respect to a passable (startX, startY), and that the same is not already included in results.
    // Returns 10000 if the area included an area machine.
    function floodFillCount(map, results, passMap, startX, startY) {
        function getCount(x, y) {
            let count = passMap[x][y] == 2 ? 5000 : 1;
            if (map.cell(x, y).flags.cell & Cell$1.IS_IN_AREA_MACHINE) {
                count = 10000;
            }
            return count;
        }
        let count = 0;
        const todo = [[startX, startY]];
        const free = [];
        while (todo.length) {
            const item = todo.pop();
            free.push(item);
            const x = item[0];
            const y = item[1];
            if (results[x][y])
                continue;
            results[x][y] = 1;
            count += getCount(x, y);
            for (let dir = 0; dir < 4; dir++) {
                const newX = x + GWU__namespace.xy.DIRS[dir][0];
                const newY = y + GWU__namespace.xy.DIRS[dir][1];
                if (map.hasXY(newX, newY) && // RUT.Map.makeValidXy(map, newXy) &&
                    passMap[newX][newY] &&
                    !results[newX][newY]) {
                    const item = free.pop() || [-1, -1];
                    item[0] = newX;
                    item[1] = newY;
                    todo.push(item);
                }
            }
        }
        return Math.min(count, 10000);
    }
    ////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////
    // TODO = Move loopiness to Map
    function updateLoopiness(map) {
        map.eachCell(resetLoopiness);
        checkLoopiness(map);
        cleanLoopiness(map);
    }
    function resetLoopiness(cell, _x, _y, _map) {
        if ((cell.blocksPathing() || cell.blocksMove()) &&
            !cell.hasEntityFlag(Entity$1.L_SECRETLY_PASSABLE)) {
            cell.flags.cell &= ~Cell$1.IS_IN_LOOP;
            // passMap[i][j] = false;
        }
        else {
            cell.flags.cell |= Cell$1.IS_IN_LOOP;
            // passMap[i][j] = true;
        }
    }
    function checkLoopiness(map) {
        let inString;
        let newX, newY, dir, sdir;
        let numStrings, maxStringLength, currentStringLength;
        const todo = GWU__namespace.grid.alloc(map.width, map.height, 1);
        let tryAgain = true;
        while (tryAgain) {
            tryAgain = false;
            todo.forEach((v, x, y) => {
                if (!v)
                    return;
                const cell = map.cell(x, y);
                todo[x][y] = 0;
                if (!cell.hasCellFlag(Cell$1.IS_IN_LOOP)) {
                    return;
                }
                // find an unloopy neighbor to start on
                for (sdir = 0; sdir < 8; sdir++) {
                    newX = x + GWU__namespace.xy.CLOCK_DIRS[sdir][0];
                    newY = y + GWU__namespace.xy.CLOCK_DIRS[sdir][1];
                    if (!map.hasXY(newX, newY))
                        continue;
                    const cell = map.cell(newX, newY);
                    if (!cell.hasCellFlag(Cell$1.IS_IN_LOOP)) {
                        break;
                    }
                }
                if (sdir == 8) {
                    // no unloopy neighbors
                    return; // leave cell loopy
                }
                // starting on this unloopy neighbor,
                // work clockwise and count up:
                // (a) the number of strings of loopy neighbors, and
                // (b) the length of the longest such string.
                numStrings = maxStringLength = currentStringLength = 0;
                inString = false;
                for (dir = sdir; dir < sdir + 8; dir++) {
                    newX = x + GWU__namespace.xy.CLOCK_DIRS[dir % 8][0];
                    newY = y + GWU__namespace.xy.CLOCK_DIRS[dir % 8][1];
                    if (!map.hasXY(newX, newY))
                        continue;
                    const newCell = map.cell(newX, newY);
                    if (newCell.hasCellFlag(Cell$1.IS_IN_LOOP)) {
                        currentStringLength++;
                        if (!inString) {
                            numStrings++;
                            inString = true;
                            if (numStrings > 1) {
                                break; // more than one string here; leave loopy
                            }
                        }
                    }
                    else if (inString) {
                        if (currentStringLength > maxStringLength) {
                            maxStringLength = currentStringLength;
                        }
                        currentStringLength = 0;
                        inString = false;
                    }
                }
                if (inString && currentStringLength > maxStringLength) {
                    maxStringLength = currentStringLength;
                }
                if (numStrings == 1 && maxStringLength <= 4) {
                    cell.clearCellFlag(Cell$1.IS_IN_LOOP);
                    // console.log(x, y, numStrings, maxStringLength);
                    // map.dump((c) =>
                    //     c.hasCellFlag(Flags.Cell.IS_IN_LOOP) ? '*' : ' '
                    // );
                    for (dir = 0; dir < 8; dir++) {
                        newX = x + GWU__namespace.xy.CLOCK_DIRS[dir][0];
                        newY = y + GWU__namespace.xy.CLOCK_DIRS[dir][1];
                        if (map.hasXY(newX, newY) &&
                            map.cell(newX, newY).hasCellFlag(Cell$1.IS_IN_LOOP)) {
                            todo[newX][newY] = 1;
                            tryAgain = true;
                        }
                    }
                }
            });
        }
    }
    function fillInnerLoopGrid(map, grid) {
        for (let x = 0; x < map.width; ++x) {
            for (let y = 0; y < map.height; ++y) {
                const cell = map.cell(x, y);
                if (cell.flags.cell & Cell$1.IS_IN_LOOP) {
                    grid[x][y] = 1;
                }
                else if (x > 0 && y > 0) {
                    const up = map.cell(x, y - 1);
                    const left = map.cell(x - 1, y);
                    if (up.flags.cell & Cell$1.IS_IN_LOOP &&
                        left.flags.cell & Cell$1.IS_IN_LOOP) {
                        grid[x][y] = 1;
                    }
                }
            }
        }
    }
    function cleanLoopiness(map) {
        // remove extraneous loop markings
        const grid = GWU__namespace.grid.alloc(map.width, map.height);
        fillInnerLoopGrid(map, grid);
        // const xy = { x: 0, y: 0 };
        let designationSurvives;
        for (let i = 0; i < grid.width; i++) {
            for (let j = 0; j < grid.height; j++) {
                const cell = map.cell(i, j);
                if (cell.flags.cell & Cell$1.IS_IN_LOOP) {
                    designationSurvives = false;
                    for (let dir = 0; dir < 8; dir++) {
                        let newX = i + GWU__namespace.xy.CLOCK_DIRS[dir][0];
                        let newY = j + GWU__namespace.xy.CLOCK_DIRS[dir][1];
                        if (map.hasXY(newX, newY) && // RUT.Map.makeValidXy(map, xy, newX, newY) &&
                            !grid[newX][newY] &&
                            !(map.cell(newX, newY).flags.cell &
                                Cell$1.IS_IN_LOOP)) {
                            designationSurvives = true;
                            break;
                        }
                    }
                    if (!designationSurvives) {
                        grid[i][j] = 1;
                        map.cell(i, j).flags.cell &= ~Cell$1.IS_IN_LOOP;
                    }
                }
            }
        }
        GWU__namespace.grid.free(grid);
    }
    ////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////

    class Snapshot {
        constructor(map) {
            this.map = new Map(map.width, map.height);
            this.version = 0;
        }
    }
    class SnapshotManager {
        constructor(map) {
            this.version = 0;
            // layerVersion: number[] = [];
            this.lightVersion = 0;
            // fovVersion = 0;
            this.free = [];
            this.map = map;
            this.cellVersion = GWU__namespace.grid.make(map.width, map.height);
            // this.layerVersion = map.layers.map(() => 1);
        }
        takeNew() {
            ++this.version;
            const snap = this.free.length
                ? this.free.pop()
                : new Snapshot(this.map);
            snap.map.flags.map = this.map.flags.map;
            this.cellVersion.update((v, x, y) => {
                const srcCell = this.map.cell(x, y);
                if (srcCell.changed) {
                    v = this.version;
                }
                if (v !== snap.version) {
                    const destCell = snap.map.cell(x, y);
                    destCell.copy(srcCell);
                }
                return v;
            });
            // systems
            if (this.map.light.changed) {
                this.lightVersion = this.version;
                this.map.light.changed = false;
            }
            if (snap.version !== this.lightVersion) {
                snap.map.light.copy(this.map.light);
            }
            // if (this.map.fov.changed) {
            //     this.fovVersion = this.version;
            //     this.map.fov.changed = false;
            // }
            // if (snap.version !== this.fovVersion) {
            //     snap.map.fov.copy(this.map.fov);
            // }
            // layers
            // this.map.layers.forEach((layer, index) => {
            //     const snapLayer = snap.map.layers[index];
            //     if (layer.changed) {
            //         this.layerVersion[index] = this.version;
            //     }
            //     if (this.layerVersion[index] !== snap.version) {
            //         snapLayer.copy(layer);
            //     }
            // });
            snap.version = this.version;
            return snap;
        }
        revertMapTo(snap) {
            this.cellVersion.update((v, x, y) => {
                if (v < snap.version)
                    return v;
                const destCell = this.map.cell(x, y);
                if (v > snap.version || destCell.changed) {
                    const srcCell = snap.map.cell(x, y);
                    destCell.copy(srcCell);
                    return snap.version;
                }
                return v;
            });
            // systems
            if (snap.version < this.lightVersion || this.map.light.changed) {
                this.map.light.copy(snap.map.light);
                this.lightVersion = snap.version;
            }
            // if (snap.version < this.fovVersion || this.map.fov.changed) {
            //     this.map.fov.copy(snap.map.fov);
            //     this.fovVersion = snap.version;
            // }
            // layers
            // this.layerVersion.forEach((v, index) => {
            //     if (v < snap.version) return;
            //     const destLayer = this.map.layers[index];
            //     if (v > snap.version || destLayer.changed) {
            //         const srcLayer = snap.map.layers[index];
            //         destLayer.copy(srcLayer);
            //         this.layerVersion[index] = snap.version;
            //     }
            // });
            this.version = snap.version;
        }
        release(snap) {
            this.free.push(snap);
        }
    }

    function isHallway(map, x, y) {
        return (GWU__namespace.xy.arcCount(x, y, (i, j) => {
            return map.cell(i, j).isPassable();
        }) > 1);
    }
    function replaceTile(map, find, replace) {
        let count = 0;
        map.eachCell((c) => {
            if (!c.hasTile(find))
                return;
            if (c.setTile(replace)) {
                ++count;
            }
        });
        return count;
    }
    function getCellPathCost(map, x, y) {
        const cell = map.cell(x, y);
        if (cell.blocksMove())
            return GWU__namespace.path.OBSTRUCTION;
        if (cell.blocksPathing())
            return GWU__namespace.path.FORBIDDEN;
        if (cell.hasActor())
            return 10;
        return 1;
    }
    function fillCostMap(map, costMap) {
        costMap.update((_v, x, y) => getCellPathCost(map, x, y));
    }
    function getPathBetween(map, x0, y0, x1, y1, options = {}) {
        const distanceMap = GWU__namespace.grid.alloc(map.width, map.height);
        const costMap = GWU__namespace.grid.alloc(map.width, map.height);
        fillCostMap(map, costMap);
        GWU__namespace.path.calculateDistances(distanceMap, x1, y1, costMap, options.eightWays, GWU__namespace.xy.straightDistanceBetween(x0, y0, x1, y1) + 1);
        const path = GWU__namespace.path.getPath(distanceMap, x0, y0, (x, y) => map.cell(x, y).blocksMove(), options.eightWays);
        if (path) {
            path.push([x1, y1]);
        }
        GWU__namespace.grid.free(costMap);
        GWU__namespace.grid.free(distanceMap);
        return path;
    }

    function make$1(w, h, opts = {}, boundary) {
        if (typeof opts === 'string') {
            opts = { tile: opts };
        }
        if (boundary) {
            opts.boundary = boundary;
        }
        if (opts.tile === true) {
            opts.tile = 'FLOOR';
        }
        if (opts.boundary === true) {
            opts.boundary = 'WALL';
        }
        const map = new Map(w, h, opts);
        if (opts.tile === undefined) {
            opts.tile = 'FLOOR';
        }
        if (opts.boundary === undefined) {
            opts.boundary = 'WALL';
        }
        if (opts.tile) {
            map.fill(opts.tile, opts.boundary);
            map.light.update();
        }
        // if (!DATA.map) {
        //     DATA.map = map;
        // }
        // // In case we reveal the map or make it all visible we need our memory set correctly
        // map.cells.forEach((_c, x, y) => {
        //     if (map.fov.isRevealed(x, y)) {
        //         map.storeMemory(x, y, true); // with snapshot
        //     }
        // });
        return map;
    }
    function isString(value) {
        return typeof value === 'string';
    }
    function isStringArray(value) {
        return Array.isArray(value) && typeof value[0] === 'string';
    }
    function from$1(prefab, charToTile, opts = {}) {
        let height = 0;
        let width = 0;
        let map;
        if (isString(prefab)) {
            prefab = prefab.split('\n');
        }
        if (isStringArray(prefab)) {
            height = prefab.length;
            width = prefab.reduce((len, line) => Math.max(len, line.length), 0);
            map = make$1(width, height, opts);
            prefab.forEach((line, y) => {
                for (let x = 0; x < width; ++x) {
                    const ch = line[x] || '.';
                    const tile = charToTile[ch] || 'FLOOR';
                    map.setTile(x, y, tile);
                }
            });
        }
        else {
            height = prefab.height;
            width = prefab.width;
            map = make$1(width, height, opts);
            prefab.forEach((v, x, y) => {
                const tile = charToTile[v] || 'FLOOR';
                map.setTile(x, y, tile);
            });
        }
        map.light.update();
        return map;
    }

    // export * from './path';

    var index$5 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        NEVER_SEEN: NEVER_SEEN,
        Cell: Cell,
        Map: Map,
        analyze: analyze,
        updateChokepoints: updateChokepoints,
        floodFillCount: floodFillCount,
        updateLoopiness: updateLoopiness,
        resetLoopiness: resetLoopiness,
        checkLoopiness: checkLoopiness,
        fillInnerLoopGrid: fillInnerLoopGrid,
        cleanLoopiness: cleanLoopiness,
        Snapshot: Snapshot,
        SnapshotManager: SnapshotManager,
        isHallway: isHallway,
        replaceTile: replaceTile,
        getCellPathCost: getCellPathCost,
        fillCostMap: fillCostMap,
        getPathBetween: getPathBetween,
        make: make$1,
        from: from$1
    });

    class Horde {
        // requiredTile: string | null = null;
        constructor(config) {
            this.tags = [];
            this.members = {};
            // blueprintId: string | null = null;
            this.flags = { horde: 0 };
            if (config.tags) {
                if (typeof config.tags === 'string') {
                    this.tags = config.tags.split(/[,|]/).map((t) => t.trim());
                }
                else {
                    this.tags = config.tags.slice();
                }
            }
            this.leader = config.leader;
            if (config.members) {
                Object.entries(config.members).forEach(([id, range]) => {
                    this.members[id] = GWU__namespace.range.make(range);
                });
            }
            this.frequency = GWU__namespace.frequency.make(config.frequency || 100);
            // this.blueprintId = config.blueprintId || null;
            this.flags.horde = GWU__namespace.flag.from(Horde$1, config.flags);
            // if (config.requiredTile) this.requiredTile = config.requiredTile;
        }
        spawn(map, x = -1, y = -1, opts = {}) {
            var _a;
            opts.canSpawn = opts.canSpawn || GWU__namespace.TRUE;
            opts.rng = opts.rng || map.rng;
            opts.machine = (_a = opts.machine) !== null && _a !== void 0 ? _a : 0;
            const leader = this._spawnLeader(map, x, y, opts);
            if (!leader)
                return null;
            this._spawnMembers(leader, map, opts);
            return leader;
        }
        _spawnLeader(map, x, y, opts) {
            const leaderKind = get$2(this.leader);
            if (!leaderKind) {
                throw new Error('Failed to find leader kind = ' + this.leader);
            }
            if (x >= 0 && y >= 0) {
                if (leaderKind.avoidsCell(map.cell(x, y)))
                    return null;
            }
            const leader = make$3(leaderKind, { machineHome: opts.machine });
            if (!leader)
                throw new Error('Failed to make horde leader - ' + this.leader);
            if (x < 0 || y < 0) {
                [x, y] = this._pickLeaderLoc(leader, map, opts) || [-1, -1];
                if (x < 0 || y < 0) {
                    return null;
                }
            }
            // pre-placement stuff?  machine? effect?
            if (!this._addLeader(leader, map, x, y, opts)) {
                return null;
            }
            return leader;
        }
        _addLeader(leader, map, x, y, _opts) {
            return map.addActor(x, y, leader);
        }
        _addMember(member, map, x, y, leader, _opts) {
            member.leader = leader;
            return map.addActor(x, y, member);
        }
        _spawnMembers(leader, map, opts) {
            const entries = Object.entries(this.members);
            if (entries.length == 0)
                return 0;
            let count = 0;
            entries.forEach(([kindId, countRange]) => {
                const count = countRange.value(opts.rng);
                for (let i = 0; i < count; ++i) {
                    this._spawnMember(kindId, map, leader, opts);
                }
            });
            return count;
        }
        _spawnMember(kindId, map, leader, opts) {
            const kind = get$2(kindId);
            if (!kind) {
                throw new Error('Failed to find member kind = ' + kindId);
            }
            const member = make$3(kind, { machineHome: opts.machine });
            if (!member)
                throw new Error('Failed to make horde member - ' + kindId);
            const [x, y] = this._pickMemberLoc(member, map, leader, opts) || [
                -1, -1,
            ];
            if (x < 0 || y < 0) {
                return null;
            }
            // pre-placement stuff?  machine? effect?
            if (!this._addMember(member, map, x, y, leader, opts)) {
                return null;
            }
            return member;
        }
        _pickLeaderLoc(leader, map, opts) {
            let loc = opts.rng.matchingLoc(map.width, map.height, (x, y) => {
                const cell = map.cell(x, y);
                if (cell.hasActor())
                    return false; // Brogue kills existing actors, but lets do this instead
                if (!opts.canSpawn(x, y))
                    return false;
                if (leader.avoidsCell(cell))
                    return false;
                if (isHallway(map, x, y)) {
                    return false;
                }
                return true;
            });
            return loc;
        }
        _pickMemberLoc(actor, map, leader, opts) {
            let loc = opts.rng.matchingLocNear(leader.x, leader.y, (x, y) => {
                if (!map.hasXY(x, y))
                    return false;
                const cell = map.cell(x, y);
                if (cell.hasActor())
                    return false; // Brogue kills existing actors, but lets do this instead
                // if (map.fov.isAnyKindOfVisible(x, y)) return false;
                if (actor.avoidsCell(cell))
                    return false;
                if (isHallway(map, x, y)) {
                    return false;
                }
                return true;
            });
            return loc;
        }
    }

    const hordes = {};
    function install$1(id, horde) {
        if (typeof horde === 'string') {
            horde = { leader: horde };
        }
        if (!(horde instanceof Horde)) {
            horde = new Horde(horde);
        }
        hordes[id] = horde;
        return horde;
    }
    function installAll(hordes) {
        Object.entries(hordes).forEach(([id, config]) => {
            install$1(id, config);
        });
    }
    function from(id) {
        if (id instanceof Horde) {
            return id;
        }
        if (typeof id === 'string') {
            return hordes[id];
        }
        return new Horde(id);
    }
    function random(opts = {}) {
        const match = {
            tags: [],
            forbidTags: [],
            flags: 0,
            forbidFlags: 0,
            depth: 0,
        };
        if (typeof opts === 'string') {
            opts = {
                tags: opts,
            };
        }
        const rng = opts.rng || GWU__namespace.rng.random;
        if (typeof opts.tags === 'string') {
            opts.tags
                .split(/[,|&]/)
                .map((t) => t.trim())
                .forEach((t) => {
                if (t.startsWith('!')) {
                    match.forbidTags.push(t.substring(1).trim());
                }
                else {
                    match.tags.push(t);
                }
            });
        }
        else if (Array.isArray(opts.tags)) {
            match.tags = opts.tags.slice();
        }
        if (typeof opts.forbidTags === 'string') {
            match.forbidTags = opts.forbidTags.split(/[,|&]/).map((t) => t.trim());
        }
        else if (Array.isArray(opts.forbidTags)) {
            match.forbidTags = opts.forbidTags.slice();
        }
        if (opts.flags) {
            if (typeof opts.flags === 'string') {
                opts.flags
                    .split(/[,|]/)
                    .map((t) => t.trim())
                    .forEach((flag) => {
                    if (flag.startsWith('!')) {
                        const key = flag.substring(1);
                        match.forbidFlags |= Horde$1[key];
                    }
                    else {
                        match.flags |= Horde$1[flag];
                    }
                });
            }
        }
        if (opts.forbidFlags) {
            match.forbidFlags = GWU__namespace.flag.from(Horde$1, opts.forbidFlags);
        }
        if (opts.depth) {
            match.depth = opts.depth;
        }
        if (match.depth && opts.oodChance) {
            while (rng.chance(opts.oodChance)) {
                match.depth += 1;
            }
            match.forbidFlags |= Horde$1.HORDE_NEVER_OOD;
        }
        const matches = Object.values(hordes).filter((k) => {
            if (match.tags.length && !GWU__namespace.arraysIntersect(match.tags, k.tags))
                return false;
            if (match.forbidTags && GWU__namespace.arraysIntersect(match.forbidTags, k.tags))
                return false;
            if (match.flags && !(k.flags.horde & match.flags)) {
                return false;
            }
            if (match.forbidFlags && k.flags.horde & match.forbidFlags) {
                return false;
            }
            return true;
        });
        if (match.depth) {
            return rng.item(matches) || null;
        }
        const depth = match.depth;
        const weights = matches.map((h) => h.frequency(depth));
        const index = rng.weighted(weights);
        if (index < 0)
            return null;
        return matches[index];
    }

    var index$4 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        Horde: Horde,
        hordes: hordes,
        install: install$1,
        installAll: installAll,
        from: from,
        random: random
    });

    // export * from './memory';
    // export * from './system';
    const empty = {};

    var index$3 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        empty: empty
    });

    var index$2 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        BasicDrawer: BasicDrawer
    });

    /*
        Attributes
        ========================

        To configure attributes, set the defaults:

        Attribute.install(')

        const attr = new Attributes(10);

        attr.set('str', 10);
        attr.set('dex', 10);
        ...
        attr.set('chr', 10);

        // to get the current value
        attr.get('str');

        // To raise an attribute permanently
        attr.gain('chr', 1);

        // To raise an attribute temporarily
        attr.gain('chr', 1, false);

        // To lower an attribute permanently
        attr.drain('chr', 1, true);

        // to lower an attribute temporarily
        attr.drain('chr', 1);

        // to restore (remove) all temporary changes
        attr.restore();

        // to add a temporary change that can be removed by itself
        attr.addBonus('str', 1);

        // to remove the bonus
        attr.clearBonus('str', 1);

        // adjustments (bonuses) are also possible via:
        attr.adjust('str', { bonus: 1 });

        // But adjustments can also set the
        attr.adjust('str', { fixed: 14 });      // temporarily sets base
        attr.adjust('str', { base: 21 });       // resets the base
        attr.adjust('str', { restore: true });  // removes all bonuses/penalties
        attr.adjust('str', { min: 10 });        // limits value
        attr.adjust('str', { max: 30 });        // limits value
        attr.adjust('str', { sustain: true });  // turns off lowering values
    */
    class Attributes {
        constructor(baseValues) {
            this._base = {};
            this._max = {};
            this._bonus = {};
            this._sustain = {};
            this._value = {};
            this.changed = null;
            this.init(baseValues);
        }
        init(baseValues) {
            for (let k in attributes) {
                const v = typeof baseValues === 'number' ? baseValues : attributes[k];
                this.set(k, v);
            }
            if (typeof baseValues !== 'number') {
                for (let k in baseValues) {
                    this.set(k, baseValues[k]);
                }
            }
        }
        forEach(fn) {
            Object.keys(attributes).forEach((k) => fn(this.get(k)));
        }
        // modifier(name: string) {
        //     return Math.floor((this.get(name) - 10) / 2);
        // }
        get(name) {
            return this._value[name] || 0;
        }
        set(name, value = 0) {
            this._value[name] = value;
            this._base[name] = value;
            this._max[name] = value;
            this._bonus[name] = [];
            return value;
        }
        base(name) {
            return this._base[name] || 0;
        }
        max(name) {
            return this._max[name] || 0;
        }
        sustain(name) {
            return this._sustain[name] || false;
        }
        gain(name, delta, raiseMax = true) {
            if (delta < 0 && this._sustain[name])
                return 0;
            this._base[name] += delta;
            if (raiseMax && this._base[name] > this._max[name]) {
                this._max[name] = this._base[name];
            }
            let old = this.get(name);
            return this._calcValue(name) - old;
        }
        drain(name, loss, lowerMax = false) {
            if (loss < 0)
                loss = -loss;
            const changed = this.gain(name, -loss, false);
            if (changed && lowerMax) {
                this._max[name] = this._base[name];
            }
            return changed;
        }
        restore(name) {
            this._base[name] = this._max[name];
            let old = this.get(name);
            return this._calcValue(name) - old;
        }
        addBonus(name, bonus) {
            return this._addBonus(name, { bonus });
        }
        _addBonus(name, bonus) {
            if (typeof bonus === 'number')
                bonus = { bonus };
            if (this._value[name] === undefined) {
                this.set(name, 0);
            }
            this._bonus[name].push(bonus);
            let old = this.get(name);
            return this._calcValue(name) - old;
        }
        clearBonus(name, bonus) {
            return this._clearBonus(name, { bonus });
        }
        _clearBonus(name, bonus) {
            if (typeof bonus === 'number')
                bonus = { bonus };
            let arr = this._bonus[name] || [];
            let key = JSON.stringify(bonus);
            let index = arr.findIndex((o) => {
                return JSON.stringify(o) == key;
            });
            if (index > -1) {
                arr.splice(index, 1);
                let old = this.get(name);
                return this._calcValue(name) - old;
            }
            return 0;
        }
        _calcValue(name) {
            let allAdjustments = {};
            this._bonus[name].forEach((adj) => this._applyAdjustment(allAdjustments, adj));
            this._sustain[name] = allAdjustments.sustain || false;
            let value = this._base[name] || 0;
            if (allAdjustments.fixed !== undefined) {
                value = allAdjustments.fixed;
            }
            else {
                value += allAdjustments.bonus || 0;
                if (allAdjustments.min !== undefined) {
                    value = Math.max(allAdjustments.min, value);
                }
                if (allAdjustments.max !== undefined) {
                    value = Math.min(allAdjustments.max, value);
                }
            }
            return (this._value[name] = value);
        }
        adjust(name, adj) {
            let delta = undefined;
            if (typeof adj === 'number') {
                adj = { bonus: adj };
            }
            if (adj.base) {
                delta = this.gain(name, adj.base);
            }
            else if (adj.restore) {
                delta = this.restore(name);
                if (delta == 0)
                    delta = undefined;
            }
            else {
                delta = this._addBonus(name, adj);
            }
            if (this.changed && delta !== undefined)
                this.changed(this, name);
            return delta;
        }
        clearAdjustment(name, adj) {
            let delta = undefined;
            if (typeof adj === 'number') {
                adj = { bonus: adj };
            }
            if (adj.base) {
                delta = this.drain(name, adj.base, true);
            }
            else if (adj.restore) ;
            else {
                delta = this._clearBonus(name, adj);
            }
            if (this.changed && delta !== undefined)
                this.changed(this, name);
            return delta;
        }
        _applyAdjustment(total, opts) {
            if (opts.bonus) {
                total.bonus = (total.bonus || 0) + opts.bonus;
            }
            if (opts.fixed !== undefined) {
                total.fixed = Math.max(total.fixed || 0, opts.fixed);
            }
            if (opts.min !== undefined) {
                total.min = Math.max(total.min || 0, opts.min);
            }
            if (opts.max !== undefined) {
                total.max = Math.max(total.max || 0, opts.max);
            }
            if (opts.sustain !== undefined) {
                total.sustain = opts.sustain;
            }
        }
    }
    const attributes = {};
    function installAttribute(attr) {
        if (typeof attr === 'string') {
            attributes[attr] = 0;
            return;
        }
        // clear existing
        Object.keys(attributes).forEach((k) => {
            delete attributes[k];
        });
        Object.assign(attributes, attr);
    }
    function makeAttributes(defaults) {
        return new Attributes(defaults);
    }
    /*
    function adjust(being, ...args) {
        let adj;
        if (args.length == 1 && typeof args[0] == 'number') {
            adj = RUT.Attributes.map((key) => {
                return { name: key, bonus: args[0] };
            });
        } else {
            adj = normalize_adjustment(args);
        }

        let results = adj.reduce((out, a) => {
            let delta = undefined;
            if (a.base) {
                delta = being.attributes.addBase(a.name, a.base);
            } else if (a.restore) {
                delta = being.attributes.restoreBase(a.name);
                if (delta == 0) delta = undefined;
            } else {
                delta = being.attributes.addBonus(a.name, a);
            }
            if (delta !== undefined) {
                out[a.name] = delta;
            }
            return out;
        }, {});
        being.changed({ attributes: results });

        return results;
    };

     function clearAdjustment(being, ...args) {
        let adj;
        if (args.length == 1 && typeof args[0] == 'number') {
            adj = RUT.Attributes.map((key) => {
                return { name: key, bonus: args[0] };
            });
        } else {
            adj = normalize_adjustment(args);
        }

        let results = adj.reduce((out, a) => {
            let delta = 0;
            delta += being.attributes.clearBonus(a.name, a);

            out[a.name] = delta;
            return out;
        }, {});
        being.changed({ attributes: results });
        return results;
    };

    RUT.Attribute.rollAttributes = function (opts = {}) {
        let dice = [];
        let total = 0;

        if (RUT.Calc.isValue(opts)) opts = { value: opts };
        Object.defaults(opts, RUT.Config.Attribute.rollAttributes);

        let attributes = RUT.Config.Attributes;

        let min_average = Math.max(opts.min_average - 5, 0);
        let max_average = Math.min(opts.max_average - 5, RUT.Config.ATTRIBUTE_MAX);

        let min_total = min_average * attributes.length;
        let max_total = max_average * attributes.length;

        do {
            total = 0;
            dice = [];
            for (let i = 0; i < 18; ++i) {
                dice.push(RUT.RNG.rollDie(3 + (i % 3)));
                total += dice[i];
            }
        } while (total <= min_total || total > max_total);

        let values = attributes.reduce((out, name, i) => {
            let index = 3 * i;
            let value = 5 + dice[index] + dice[index + 1] + dice[index + 2];
            if (opts.value) {
                value = RUT.Calc.calc(opts.value);
            } else if (opts[name]) {
                value = RUT.Calc.calc(opts[name]);
            }
            out[name] = value;
            return out;
        }, {});
        return values;
    };
    RUT.Config.Attribute.rollAttributes = { min_average: 11, max_average: 14 };
    */
    /*
    export function normalize_adjustment(args: ) {
        if (args.length == 3) {
            let opts = args[2];
            if (RUT.Calc.isValue(opts)) {
                opts = { bonus: opts };
            }
            let name = `${args[0]}.${args[1]}`;
            return [Object.assign({ name }, opts)];
        }
        if (args.length == 2) {
            let opts = args[1];
            if (opts === true || opts === false) {
                opts = { has: opts };
            } else if (RUT.Calc.isValue(opts)) {
                opts = { bonus: opts };
            }
            return [Object.assign({ name: args[0] }, opts)];
        }

        let opts = args[0];
        if (opts.name) {
            return [opts];
        }
        if (opts.attribute) {
            opts.name = opts.attribute;
            return [opts];
        }
        if (opts.restore) {
            if (opts.restore == 'all') {
                return RUT.Attributes.map((a) => {
                    return { name: a, restore: true };
                });
            }
            return [{ name: opts.restore, restore: true }];
        }
        if (opts.skill) {
            opts.name = opts.skill;
            return [opts];
        }
        if (opts.stat) {
            opts.name = opts.stat;
            return [opts];
        }
        if (opts.save) {
            opts.name = opts.save;
            return [opts];
        }
        // if (opts.saves) {
        //   opts.name = opts.saves;
        //   return [opts];
        // }
        if (opts.ability) {
            opts.name = opts.ability;
            return [opts];
        }

        // now we assume that each key is for a separate skill...
        return Object.keys(opts).reduce((out, key) => {
            let opt = opts[key];
            if (key == 'reset' || key == 'restore') {
                if (typeof opt == 'string') opt = [opt];
                opt.forEach((a) => {
                    out.push({ name: a, restore: true });
                });
            } else {
                if (typeof opt == 'number' || Array.isArray(opt)) {
                    opt = { bonus: opt };
                } else if (opt === true || opt === false) {
                    opt = { has: opt };
                } else if (opt == 'reset' || opt == 'restore') {
                    opt = { restore: true };
                } else if (opt == 'sustain') {
                    opt = { sustain: true };
                }
                out.push(Object.assign({ name: key }, opt));
            }
            return out;
        }, []);
    }
    */

    /*
    Skills

    Skills generally fall into 2 categories - binary and progressive.


    // Create a skills object
    const skills = new Skills();

    // set skills
    skills.set('diving', true); // = { has: true, level: 0 }
    skills.set('diving', 10); // = { has: true, level: 10 }

    skills.remove('diving'); // {}

    // adjustments
    skills.adjust('diving', { bonus: 1 });
    skills.adjust('diving', { disadvantage: true });
    skills.adjust('diving', { advantage: 3 });
    skills.adjust('diving', { fixed: 10 });
    skills.adjust('diving', { critical: 5 });





    */
    class Skill {
        constructor(name) {
            this.name = name;
        }
        get has() {
            return this._bool('_has');
        }
        get level() {
            return this._int('_level');
        }
        get disadvantage() {
            return this._bool('_disadvantage');
        }
        get advantage() {
            return this._bool('_advantage');
        }
        get fixed() {
            return this._int('_fixed');
        }
        get bonus() {
            const b = this._int('_bonus') || 0;
            if (!this._parent)
                return b;
            return b + this._parent.bonus;
        }
        get succeed() {
            return this._bool('_succeed');
        }
        get fail() {
            return this._bool('_fail');
        }
        set(value) {
            if (value === false) {
                this._has = false;
                this._level = 0;
            }
            else {
                this._has = true;
                this._level = value === true ? 0 : value;
            }
        }
        _value(name) {
            if (this[name] !== undefined) {
                // @ts-ignore
                return this[name];
            }
            if (this._parent) {
                // @ts-ignore
                return this._parent._value(name);
            }
            return undefined;
        }
        _bool(name) {
            return !!this._value(name);
        }
        _int(name) {
            return this._value(name);
        }
        adjust(adj) {
            Object.entries(adj).forEach(([key, value]) => {
                key = '_' + key;
                if (value === undefined)
                    return;
                if (key === '_fixed') {
                    if (typeof value !== 'number') {
                        throw new Error('fixed skill adjustment must be a number.');
                    }
                    value = Math.max(value, this._fixed || 0);
                }
                else if (key === '_bonus') {
                    if (typeof value !== 'number') {
                        throw new Error('fixed skill adjustment must be a number.');
                    }
                    value = value + (this._bonus || 0);
                }
                // @ts-ignore
                this[key] = value;
            });
        }
        clear(adj) {
            Object.keys(adj).forEach((key) => {
                key = '_' + key;
                // @ts-ignore
                if (this[key] !== undefined) {
                    // @ts-ignore
                    this[key] = undefined;
                }
            });
        }
    }
    class Skills {
        constructor(vals = {}) {
            this._skills = {};
            Object.entries(vals).forEach(([key, value]) => {
                this.set(key, value);
            });
        }
        set(name, value) {
            const s = this.get(name);
            s.set(value);
            return s;
        }
        get(name) {
            let s = this._skills[name];
            if (s)
                return s;
            s = this._skills[name] = new Skill(name);
            const index = name.lastIndexOf('.');
            if (index > 0) {
                s._parent = this.get(name.substring(0, index));
            }
            else {
                s.set(false);
            }
            return s;
        }
        adjust(name, adj) {
            if (typeof adj === 'number') {
                adj = { bonus: adj };
            }
            let s = this.get(name);
            s.adjust(adj);
            return s;
        }
    }

    class Scent {
        constructor(player) {
            this._player = player;
        }
        get(x, y) {
            if (!this._data)
                return 0;
            return this._data[x][y];
        }
        clear() {
            if (!this._player.map)
                return;
            if (this._data)
                GWU__namespace.grid.free(this._data);
            this._data = GWU__namespace.grid.alloc(this._player.map.width, this._player.map.height);
        }
        update() {
            if (!this._player.map)
                return;
            const scent = this._player.data.scent || 10;
            this._data[this._player.x][this._player.y] = scent;
            const updated = GWU__namespace.grid.alloc(this._data.width, this._data.height);
            const map = this._player.map;
            this._data.forEach((v, x, y) => {
                const cell = map.cell(x, y);
                if (cell.blocksMove())
                    return;
                let highest = v;
                GWU__namespace.xy.eachNeighbor(x, y, (x1, y1) => {
                    if (!this._data.hasXY(x1, y1))
                        return;
                    const v1 = this._data[x1][y1];
                    if (v1 > highest) {
                        highest = v1;
                    }
                }, true);
                const delta = cell.hasLiquid() ? 3 : 1;
                updated[x][y] = Math.max(0, highest - delta);
            });
            GWU__namespace.grid.free(this._data);
            this._data = updated;
        }
        nextDir(x, y) {
            const v = this._data[x][y] || 0;
            if (!v)
                return null;
            let highest = v;
            let highestLoc = [];
            GWU__namespace.xy.eachNeighbor(x, y, (x1, y1) => {
                if (!this._data.hasXY(x1, y1))
                    return;
                const v1 = this._data[x1][y1];
                if (v1 == highest) {
                    highestLoc.push([x1, y1]);
                }
                else if (v1 > highest) {
                    highestLoc = [[x1, y1]];
                    highest = v1;
                }
            }, false);
            if (!highestLoc.length)
                return null;
            const loc = GWU__namespace.random.item(highestLoc);
            loc[0] = loc[0] - x;
            loc[1] = loc[1] - y;
            return loc;
        }
    }

    class Player extends Actor {
        constructor(kind) {
            super(kind);
            this.scent = new Scent(this);
        }
        interrupt(other) {
            if (this.hasGoal()) {
                this.clearGoal();
                GWU__namespace.message.addAt(this.x, this.y, '{{you}} {{verb see~}} {{a other}}.', {
                    actor: this,
                    verb: 'see',
                    other,
                });
            }
        }
        endTurn(pct = 100) {
            if (this.map) {
                if (this.map.fov.update()) {
                    this.clearActorFlag(Actor$1.STABLE_COST_MAP);
                }
                this.scent.update();
            }
            super.endTurn(pct);
        }
        addToMap(map, x, y) {
            if (!super.addToMap(map, x, y))
                return false;
            this.scent.clear();
            return true;
        }
        setGoal(x, y) {
            const map = this._map;
            if (!map)
                throw new Error('No map to set goal with!');
            if (!this._goalMap) {
                this._goalMap = GWU__namespace.grid.alloc(map.width, map.height);
            }
            const goalMap = this._goalMap;
            const mapToPlayer = this.mapToMe();
            if (mapToPlayer[x][y] < 0 ||
                mapToPlayer[x][y] >= GWU__namespace.path.NO_PATH ||
                !map.fov.isRevealed(x, y)) {
                let loc = GWU__namespace.path.getClosestValidLocation(mapToPlayer, x, y, (x, y) => !map.fov.isRevealed(x, y));
                loc = loc || [this.x, this.y];
                x = loc[0];
                y = loc[1];
            }
            GWU__namespace.path.calculateDistances(goalMap, x, y, this.costMap());
            return this._goalMap;
        }
        nextGoalStep() {
            const map = this.map;
            if (!map)
                return null;
            const goalMap = this.goalMap;
            const step = GWU__namespace.path.nextStep(goalMap, this.x, this.y, (x, y) => map.hasActor(x, y) && map.actorAt(x, y) !== this);
            return step;
        }
        pathTo(...args) {
            let x = args[0];
            let y = args[1];
            if (args.length === 1) {
                x = args[0].x;
                y = args[0].y;
            }
            const map = this.map;
            if (!map)
                return null;
            const mapToPlayer = this.mapToMe();
            if (mapToPlayer[x][y] < 0 ||
                mapToPlayer[x][y] >= GWU__namespace.path.NO_PATH ||
                !map.fov.isRevealed(x, y)) {
                const loc = GWU__namespace.path.getClosestValidLocation(mapToPlayer, x, y, (x, y) => !map.fov.isRevealed(x, y));
                if (!loc)
                    return null;
                x = loc[0];
                y = loc[1];
            }
            const path = GWU__namespace.path.getPath(mapToPlayer, x, y, (x, y) => !map.fov.isRevealed(x, y), true);
            return path;
        }
    }
    Player.default = {
        ch: '@',
        fg: 'white',
        name: 'You',
        swim: true,
        sidebarFg: 'purple',
    };

    class PlayerKind extends ActorKind {
        constructor(opts = {}) {
            super((() => {
                if (!opts.sprite) {
                    opts.ch = opts.ch || Player.default.ch;
                    opts.fg = opts.fg || Player.default.fg;
                }
                if (!opts.name) {
                    opts.name = Player.default.name;
                }
                if (opts.swim === undefined) {
                    opts.swim = Player.default.swim;
                }
                return opts;
            })());
            this.flags.actor |= Actor$1.IS_PLAYER;
            this.flags.entity |= Entity$1.L_ALWAYS_PLURAL;
            this.attributes = new Attributes(opts.attributes || {});
            this.skills = new Skills(opts.skills || {});
        }
        make(options) {
            const actor = new Player(this);
            this.init(actor, options);
            return actor;
        }
        cellCost(cell, player) {
            const map = cell.map;
            if (!map.fov.isRevealed(cell.x, cell.y))
                return GWU__namespace.path.FORBIDDEN;
            return super.cellCost(cell, player);
        }
    }

    function make(id, makeOptions) {
        let kind;
        if (typeof id === 'string') {
            // @ts-ignore
            kind = get$2(id);
            if (!kind)
                throw new Error('Failed to find item kind - ' + id);
            if (!(kind instanceof PlayerKind))
                throw new Error('Not a player kind.');
        }
        else if (id instanceof PlayerKind) {
            kind = id;
        }
        else {
            kind = makeKind(id);
        }
        return kind.make(makeOptions);
    }
    function install(id, kind) {
        if (kind instanceof PlayerKind) {
            kinds$1[id] = kind;
            return kind;
        }
        const made = makeKind(kind);
        made.id = id;
        kinds$1[id] = made;
        return made;
    }
    function get(id) {
        if (id instanceof PlayerKind)
            return id;
        const k = kinds$1[id];
        if (k && !(k instanceof PlayerKind)) {
            throw new Error('No a player kind.');
        }
        return k;
    }
    function makeKind(info) {
        const config = Object.assign({}, info);
        return new PlayerKind(config);
    }

    var index$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        Attributes: Attributes,
        attributes: attributes,
        installAttribute: installAttribute,
        makeAttributes: makeAttributes,
        Skills: Skills,
        PlayerKind: PlayerKind,
        Player: Player,
        make: make,
        install: install,
        get: get,
        makeKind: makeKind
    });

    class Viewport extends GWU__namespace.widget.Widget {
        constructor(opts) {
            super((() => {
                opts.tag = opts.tag || 'viewport';
                return opts;
            })());
            this.offsetX = 0;
            this.offsetY = 0;
            this._subject = null;
            this.player = null;
            this.bounds = new GWU__namespace.xy.Bounds(opts.x, opts.y, opts.width, opts.height);
            this.bg = GWU__namespace.color.from(opts.bg || 'black');
            this.attr('snap', opts.snap || false);
            this.attr('center', opts.center || false);
            this.attr('lockX', opts.lock || opts.lockX || false);
            this.attr('lockY', opts.lock || opts.lockY || false);
            this.filter = opts.filter || null;
            this.scent = opts.scent || false;
        }
        get subject() {
            return this._subject;
        }
        set subject(subject) {
            this.attr('center', !!subject);
            if (subject) {
                this.offsetX = subject.x - this.halfWidth();
                this.offsetY = subject.y - this.halfHeight();
            }
            this._subject = subject;
            if (subject && subject instanceof Player) {
                this.player = subject;
            }
            else {
                this.player = null;
            }
        }
        set lock(v) {
            this.attr('lockX', v);
            this.attr('lockY', v);
        }
        get lockX() {
            return this._attrBool('lockX');
        }
        set lockX(v) {
            this.attr('lockX', v);
        }
        get lockY() {
            return this._attrBool('lockY');
        }
        set lockY(v) {
            this.attr('lockY', v);
        }
        toMapX(x) {
            return x + this.offsetX - this.bounds.x;
        }
        toMapY(y) {
            return y + this.offsetY - this.bounds.y;
        }
        toInnerX(x) {
            return x - this.bounds.x;
        }
        toInnerY(y) {
            return y - this.bounds.y;
        }
        halfWidth() {
            return Math.floor(this.bounds.width / 2);
        }
        halfHeight() {
            return Math.floor(this.bounds.height / 2);
        }
        centerOn(map, x, y) {
            this.attr('center', true);
            this.subject = { x, y, map };
        }
        showMap(map, x = 0, y = 0) {
            this.subject = { x, y, map };
            this.offsetX = x;
            this.offsetY = y;
            this.attr('center', false);
            this.attr('snap', false);
        }
        updateOffset() {
            if (!this._subject) {
                this.offsetX = 0;
                this.offsetY = 0;
                return;
            }
            const subject = this._subject;
            const map = subject.map;
            const bounds = map;
            if (subject && map.hasXY(subject.x, subject.y)) {
                if (this._attrBool('snap')) {
                    let left = this.offsetX;
                    let right = this.offsetX + this.bounds.width;
                    let top = this.offsetY;
                    let bottom = this.offsetY + this.bounds.height;
                    // auto center if outside the viewport
                    if (subject.x < left || subject.x > right) {
                        left = this.offsetX = subject.x - this.halfWidth();
                        right = left + this.bounds.width;
                    }
                    if (subject.y < top || subject.y > bottom) {
                        top = this.offsetY = subject.y - this.halfHeight();
                        bottom = top + this.bounds.height;
                    }
                    const edgeX = Math.floor(this.bounds.width / 5);
                    const edgeY = Math.floor(this.bounds.height / 5);
                    const thirdW = Math.floor(this.bounds.width / 3);
                    if (left + edgeX >= subject.x) {
                        this.offsetX = Math.max(0, subject.x + thirdW - this.bounds.width);
                    }
                    else if (right - edgeX <= subject.x) {
                        this.offsetX = Math.min(subject.x - thirdW, bounds.width - this.bounds.width);
                    }
                    const thirdH = Math.floor(this.bounds.height / 3);
                    if (top + edgeY >= subject.y) {
                        this.offsetY = Math.max(0, subject.y + thirdH - this.bounds.height);
                    }
                    else if (bottom - edgeY <= subject.y) {
                        this.offsetY = Math.min(subject.y - thirdH, bounds.height - this.bounds.height);
                    }
                }
                else if (this._attrBool('center')) {
                    this.offsetX = subject.x - this.halfWidth();
                    this.offsetY = subject.y - this.halfHeight();
                }
                else {
                    this.offsetX = subject.x;
                    this.offsetY = subject.y;
                }
            }
            if (this.lockX && map) {
                this.offsetX = GWU__namespace.clamp(this.offsetX, 0, map.width - this.bounds.width);
            }
            if (this.lockY && map) {
                this.offsetY = GWU__namespace.clamp(this.offsetY, 0, map.height - this.bounds.height);
            }
        }
        _draw(buffer) {
            if (!this._subject)
                return;
            const map = this._subject.map;
            if (!map || !map.needsRedraw)
                return;
            const fov = map.fov;
            buffer.blackOutRect(this.bounds.x, this.bounds.y, this.bounds.width, this.bounds.height, this.bg);
            if (!this._subject) {
                return;
            }
            this.updateOffset();
            const drawer = map.drawer;
            drawer.scent = this.scent;
            const mixer = new GWU__namespace.sprite.Mixer();
            for (let x = 0; x < this.bounds.width; ++x) {
                for (let y = 0; y < this.bounds.height; ++y) {
                    const mapX = x + this.offsetX;
                    const mapY = y + this.offsetY;
                    if (map.hasXY(mapX, mapY)) {
                        const cell = map.cell(mapX, mapY);
                        map.drawer.drawCell(mixer, map, cell, fov);
                    }
                    else {
                        mixer.draw(' ', this.bg, this.bg); // blackOut
                    }
                    if (this.filter) {
                        this.filter(mixer, mapX, mapY, map);
                    }
                    buffer.drawSprite(x + this.bounds.x, y + this.bounds.y, mixer);
                }
            }
            // map.clearMapFlag(GWM.flags.Map.MAP_CHANGED);
        }
        update(dt) {
            super.update(dt);
            if (!this._subject)
                return;
            const map = this._subject.map;
            if (!map)
                return;
            if (!map.hasMapFlag(Map$1.MAP_DANCES) || !GWU__namespace.cosmetic.chance(10)) {
                return;
            }
            map.eachCell((c) => {
                if (c.hasCellFlag(Cell$1.COLORS_DANCE) &&
                    map.fov.isAnyKindOfVisible(c.x, c.y) &&
                    GWU__namespace.cosmetic.chance(2)) {
                    c.needsRedraw = true;
                }
            });
            map.needsRedraw = true;
        }
        _mousemove(ev) {
            super._mousemove(ev);
            if (!this.bounds.contains(ev.x, ev.y)) {
                this.clearPath();
                return;
            }
            if (!this.player)
                return;
            const map = this.player.map;
            if (!map)
                return;
            this.showPath(this.toInnerX(ev.x), this.toInnerY(ev.y));
        }
        _click(ev) {
            super._click(ev);
            if (!this.player)
                return;
            if (this.player.hasGoal()) {
                this.player.clearGoal();
            }
            else {
                this.player.setGoal(this.toInnerX(ev.x), this.toInnerY(ev.y));
            }
        }
        clearPath() {
            if (!this.player)
                return;
            const map = this.player.map;
            if (!map)
                return;
            map.clearPath();
        }
        showPath(x, y) {
            if (!this.player)
                return false;
            const map = this.player.map;
            if (!map)
                return false;
            // if (!this.player.hasGoal()) return false;
            // console.log('mouse', ev.x, ev.y);
            const path = this.player.pathTo(x, y);
            if (path) {
                map.highlightPath(path, true);
            }
            else {
                map.clearPath();
            }
            map.highlightCell(x, y);
            return true;
        }
    }

    GWU__namespace.app.defaultStyle.add('msgs', { bg: 'darkest_gray', fg: 'white' });
    GWU__namespace.app.defaultStyle.add('archive', { bg: 'darkest_gray', fg: 'white' });
    class Messages extends GWU__namespace.widget.Widget {
        constructor(opts) {
            super((() => {
                opts.tag = opts.tag || 'msgs';
                return opts;
            })());
            if (!this.bounds.height)
                throw new Error('Must provde a height for messages widget.');
            this.cache = new GWU__namespace.message.MessageCache({
                width: this.bounds.width,
                length: opts.archive || 40,
                match: () => {
                    this.needsDraw = true;
                },
            });
            this.on('click', () => {
                this.showArchive();
            });
        }
        clear() {
            this.cache.clear();
            this.needsDraw = true;
        }
        confirmAll() {
            this.cache.confirmAll();
            this.needsDraw = true;
        }
        draw(buffer) {
            const isOnTop = this.bounds.y < 10;
            const bg = this._used.bg;
            const fg = this._used.fg;
            // black out the message area
            buffer.fillRect(this.bounds.x, this.bounds.y, this.bounds.width, this.bounds.height, ' ', bg, bg);
            this.cache.forEach((line, confirmed, i) => {
                if (i >= this.bounds.height)
                    return;
                const localY = isOnTop ? this.bounds.height - i - 1 : i;
                const y = localY + this.bounds.y;
                buffer.drawText(this.bounds.x, y, line, fg);
                if (confirmed && bg) {
                    buffer.mix(bg, 50, this.bounds.x, y, this.bounds.width, 1);
                }
            });
            return true;
        }
        showArchive() {
            if (this.cache.length <= this.bounds.height)
                return;
            if (!this.scene)
                return;
            const app = this.scene.app;
            app.scenes.run('msg-archive', this);
        }
    }
    const ArchiveScene = {
        create() { },
        start(source) {
            new ArchiveWidget({
                scene: this,
                source,
                id: 'ARCHIVE',
            });
        },
        stop() {
            this.children.forEach((c) => c.destroy());
            this.children = [];
        },
        destroy() { },
    };
    GWU__namespace.app.installScene('msg-archive', ArchiveScene);
    class ArchiveWidget extends GWU__namespace.widget.Widget {
        constructor(opts) {
            super({
                scene: opts.scene,
                id: opts.id || 'ARCHIVE',
                tag: opts.tag || 'archive',
                x: 0,
                y: 0,
                tabStop: true,
                // depth: 100, // I'm on top
            });
            this.mode = 'forward';
            this._timeout = null;
            this._needsDraw = true;
            this.source = opts.source;
            this.isOnTop = this.source.bounds.y < 10;
            this.bounds.height = this.isOnTop
                ? this.scene.height - this.source.bounds.y
                : this.source.bounds.bottom;
            this.totalCount = Math.min(this.source.cache.length, this.isOnTop
                ? this.scene.height - this.source.bounds.top
                : this.source.bounds.bottom);
            this.shown = this.source.bounds.height;
            this._timeout = this.scene.wait(16, () => this._forward());
            // confirm them as they are right now...
            this.source.cache.confirmAll();
            this.on('keypress', () => this._next());
            this.on('click', () => this._next());
        }
        set needsDraw(v) {
            this._needsDraw || (this._needsDraw = v);
            super.needsDraw = v;
        }
        contains() {
            return true; // Eat all mouse activity
        }
        finish() {
            this.scene.stop();
        }
        _next() {
            if (!this.scene)
                return;
            if (this.mode === 'ack') {
                this.mode = 'reverse';
                this.scene.needsDraw = true;
                if (this._timeout) {
                    this._timeout();
                }
                this._timeout = this.scene.wait(16, () => this._reverse());
            }
            else if (this.mode === 'reverse') {
                this.finish();
            }
            else {
                this.mode = 'ack';
                this.shown = this.totalCount;
                if (this._timeout) {
                    this._timeout();
                    this._timeout = null;
                }
                this.scene.needsDraw = true;
            }
        }
        _forward() {
            // console.log('forward');
            if (!this.scene)
                return;
            ++this.shown;
            this._timeout = null;
            this.scene.needsDraw = true;
            if (this.shown < this.totalCount) {
                this._timeout = this.scene.wait(16, () => this._forward());
            }
            else {
                this.mode = 'ack';
                this.shown = this.totalCount;
            }
        }
        _reverse() {
            // console.log('reverse');
            if (!this.scene)
                return;
            --this.shown;
            this._timeout = null;
            if (this.shown <= this.source.bounds.height) {
                this.finish();
            }
            else {
                this.scene.needsDraw = true;
                this._timeout = this.scene.wait(16, () => this._reverse());
            }
        }
        _draw(buffer) {
            let fadePercent = 0;
            // let reverse = this.mode === 'reverse';
            if (!this._needsDraw)
                return;
            this._needsDraw = false;
            // Count the number of lines in the archive.
            // let totalMessageCount = this.totalCount;
            const isOnTop = this.isOnTop;
            const dbuf = buffer;
            const fg = GWU__namespace.color.from(this._used.fg);
            // const dM = reverse ? -1 : 1;
            // const startM = reverse ? totalMessageCount : this.bounds.height;
            // const endM = reverse
            //     ? this.bounds.height + dM + 1
            //     : totalMessageCount + dM;
            const startY = isOnTop
                ? this.shown - 1
                : this.bounds.bottom - this.shown;
            const endY = isOnTop ? 0 : this.bounds.bottom - 1;
            const dy = isOnTop ? -1 : 1;
            dbuf.fillRect(this.source.bounds.x, Math.min(startY, endY), this.bounds.width, this.shown, ' ', this._used.bg, this._used.bg);
            this.source.cache.forEach((line, _confirmed, j) => {
                const y = startY + j * dy;
                if (isOnTop) {
                    if (y < endY)
                        return;
                }
                else if (y > endY)
                    return;
                fadePercent = Math.floor((50 * j) / this.shown);
                const fgColor = fg.mix(this._used.bg, fadePercent);
                dbuf.drawText(this.source.bounds.x, y, line, fgColor, this._used.bg);
            });
            if (this.mode === 'ack') {
                const y = this.isOnTop ? 0 : dbuf.height - 1;
                const x = this.source.bounds.x > 8
                    ? this.source.bounds.x - 8 // to left of box
                    : Math.min(this.source.bounds.x + this.bounds.width, // just to right of box
                    dbuf.width - 8 // But definitely on the screen - overwrite some text if necessary
                    );
                dbuf.wrapText(x, y, 8, '--DONE--', this._used.bg, this._used.fg);
            }
        }
    }

    GWU__namespace.color.install('flavorText', 50, 40, 90);
    GWU__namespace.color.install('flavorPrompt', 100, 90, 20);
    class Flavor extends GWU__namespace.widget.Text {
        constructor(opts) {
            super((() => {
                opts.tag = opts.tag || 'flavor';
                return opts;
            })());
            this._needsDraw = true;
            this.overflow = opts.overflow || false;
        }
        showText(text) {
            this.text(text);
            this.removeClass('prompt');
            this.needsDraw = true;
            return this;
        }
        clear() {
            this.text('');
            this.removeClass('prompt');
            this.needsDraw = true;
            return this;
        }
        showPrompt(text) {
            this.text(text);
            this.addClass('prompt');
            this.needsDraw = true;
            return this;
        }
        getFlavorText(map, x, y, fov) {
            const cell = map.cell(x, y); // KNOWLEDGE / MEMORY !!!
            let buf;
            // let magicItem;
            // let standsInTerrain;
            // let subjectMoving;
            // let prepositionLocked = false;
            // let subject;
            // let verb;
            // let preposition;
            let object = '';
            // let adjective;
            const isAnyKindOfVisible = fov ? fov.isAnyKindOfVisible(x, y) : true;
            const isDirectlyVisible = fov ? fov.isDirectlyVisible(x, y) : true;
            const isRemembered = fov ? fov.isRevealed(x, y) : false;
            const isMapped = fov ? fov.isMagicMapped(x, y) : false;
            let intro;
            if (isDirectlyVisible) {
                intro = 'You see';
            }
            else if (isAnyKindOfVisible) {
                intro = 'You sense';
            }
            else if (isRemembered) {
                intro = 'You remember seeing';
            }
            else if (isMapped) {
                intro = 'You expect to see';
            }
            else {
                return '';
            }
            const actor = cell.hasActor() ? map.actorAt(x, y) : null;
            // const player = actor?.isPlayer() ? actor : null;
            const theItem = cell.hasItem() ? map.itemAt(x, y) : null;
            const standsInTile = cell.hasTileFlag(Tile$1.T_STAND_IN_TILE);
            let needObjectArticle = false;
            if (actor) {
                object = actor.getFlavor({
                    color: false,
                    article: true,
                    action: true,
                });
                needObjectArticle = true;
            }
            else if (theItem) {
                object = theItem.getFlavor({ color: false, article: true });
                needObjectArticle = true;
            }
            let article = standsInTile ? ' in ' : ' on ';
            const groundTile = cell.depthTile(Depth.GROUND) || NULL;
            const surfaceTile = cell.depthTile(Depth.SURFACE);
            const liquidTile = cell.depthTile(Depth.LIQUID);
            // const gasTile = cell.depthTile(Flags.Depth.GAS);
            let surface = '';
            if (surfaceTile) {
                const tile = surfaceTile;
                if (needObjectArticle) {
                    needObjectArticle = false;
                    object += ' on ';
                }
                if (tile.hasTileFlag(Tile$1.T_BRIDGE)) {
                    article = ' over ';
                }
                surface = surfaceTile.getFlavor() + article;
            }
            let liquid = '';
            if (liquidTile) {
                liquid = liquidTile.getFlavor() + ' covering ';
                if (needObjectArticle) {
                    needObjectArticle = false;
                    object += ' in ';
                }
            }
            if (needObjectArticle) {
                needObjectArticle = false;
                object += ' on ';
            }
            let ground = groundTile.getFlavor({ article: true });
            buf = GWU__namespace.text.apply('{{intro}} {{text}}.', {
                intro,
                text: object + surface + liquid + ground,
            });
            return buf;
        }
        _draw(buffer) {
            if (!this._needsDraw)
                return;
            this._needsDraw = false;
            super._draw(buffer);
        }
    }

    // import { UISubject } from './viewport';
    GWU__namespace.color.install('blueBar', 15, 10, 50);
    GWU__namespace.color.install('redBar', 45, 10, 15);
    GWU__namespace.color.install('purpleBar', 50, 0, 50);
    GWU__namespace.color.install('greenBar', 10, 50, 10);
    class EntryBase {
        constructor() {
            this.dist = 0;
            this.priority = 0;
            this.sidebarY = -1;
        }
        draw(_buffer, _bounds) {
            return 0;
        }
    }
    class ActorEntry extends EntryBase {
        constructor(actor) {
            super();
            this.actor = actor;
        }
        get x() {
            return this.actor.x;
        }
        get y() {
            return this.actor.y;
        }
        get changed() {
            return this.actor.changed;
        }
        draw(buffer, bounds) {
            return this.actor.drawSidebar(buffer, bounds);
        }
    }
    class ItemEntry extends EntryBase {
        constructor(item) {
            super();
            this.item = item;
        }
        get x() {
            return this.item.x;
        }
        get y() {
            return this.item.y;
        }
        get changed() {
            return this.item.changed;
        }
        draw(buffer, bounds) {
            return this.item.drawSidebar(buffer, bounds);
        }
    }
    class CellEntry extends EntryBase {
        constructor(cell) {
            super();
            this.changed = true;
            this.cell = cell;
        }
        get x() {
            return this.cell.x;
        }
        get y() {
            return this.cell.y;
        }
        draw(buffer, bounds) {
            return this.cell.drawSidebar(buffer, bounds);
        }
    }
    class Sidebar extends GWU__namespace.widget.Widget {
        constructor(opts) {
            super((() => {
                opts.tag = opts.tag || 'sidebar';
                return opts;
            })());
            this.cellCache = [];
            this.lastX = -1;
            this.lastY = -1;
            this.lastMap = null;
            this.entries = [];
            this.subject = null;
            this.highlight = null;
            this._needsDraw = true;
        }
        set needsDraw(v) {
            if (v)
                this._needsDraw = v;
            super.needsDraw = v;
        }
        reset() {
            this.lastMap = null;
            this.lastX = -1;
            this.lastY = -1;
            this._needsDraw = true;
        }
        entryAt(e) {
            return (this.entries.find((entry) => {
                return entry.sidebarY <= e.y && entry.sidebarY !== -1;
            }) || null);
        }
        click(ev) {
            if (!this.bounds.contains(ev.x, ev.y))
                return false;
            if (!this.highlight)
                return false;
            if (!this.subject)
                return false;
            this.subject.setGoal(this.highlight.x, this.highlight.y);
            return true;
        }
        mousemove(e) {
            if (this.contains(e)) {
                this._highlightRow(e.y);
                return true;
            }
            this.clearHighlight();
            return false;
        }
        highlightAt(x, y) {
            const last = this.highlight;
            this.highlight = null;
            // processed in ascending y order
            this.entries.forEach((e) => {
                if (e.x == x && e.y == y) {
                    this.highlight = e;
                }
            });
            const changed = this.highlight !== last;
            this._needsDraw || (this._needsDraw = changed);
            return changed;
        }
        _highlightRow(y) {
            const last = this.highlight;
            this.highlight = null;
            // processed in ascending y order
            this.entries.forEach((e) => {
                if (e.sidebarY <= y && e.sidebarY !== -1) {
                    this.highlight = e;
                }
            });
            const changed = this.highlight !== last;
            this.needsDraw || (this.needsDraw = changed);
            if (this.highlight && this.subject && this.subject.map) {
                const path = this.subject.pathTo(
                // @ts-ignore
                this.highlight.x, 
                // @ts-ignore
                this.highlight.y);
                if (path) {
                    this.subject.map.highlightPath(path, true);
                }
                else {
                    // @ts-ignore
                    this.subject.map.showCursor(this.highlight.x, this.highlight.y);
                }
                // @ts-ignore
                this.subject.map.highlightCell(this.highlight.x, this.highlight.y);
            }
            return changed;
        }
        clearHighlight() {
            const result = !!this.highlight;
            this.highlight = null;
            this.needsDraw || (this.needsDraw = result);
            return result;
        }
        _updateCellCache(map) {
            if (this.lastMap &&
                map === this.lastMap &&
                !map.hasMapFlag(Map$1.MAP_SIDEBAR_TILES_CHANGED)) {
                return false;
            }
            this.lastMap = null; // Force us to regather the entries, even if at same location
            this.cellCache.length = 0;
            GWU__namespace.xy.forRect(map.width, map.height, (x, y) => {
                const info = map.cell(x, y);
                if (info.hasTileFlag(Tile$1.T_LIST_IN_SIDEBAR)) {
                    this.cellCache.push(info);
                }
            });
            map.clearMapFlag(Map$1.MAP_SIDEBAR_TILES_CHANGED);
            this.needsDraw = true;
            return true;
        }
        _makeActorEntry(actor) {
            return new ActorEntry(actor);
        }
        _makeItemEntry(item) {
            return new ItemEntry(item);
        }
        _makeCellEntry(cell) {
            return new CellEntry(cell);
        }
        _getPriority(map, x, y, fov) {
            if (!fov) {
                return map.cell(x, y).hasCellFlag(Cell$1.STABLE_MEMORY) ? 3 : 1;
            }
            if (fov.isDirectlyVisible(x, y)) {
                return 1;
            }
            else if (fov.isAnyKindOfVisible(x, y)) {
                return 2;
            }
            else if (fov.isRevealed(x, y)) {
                if (map.cell(x, y).hasEntityFlag(Entity$1.L_BRIGHT_MEMORY)) {
                    return 3;
                }
                else {
                    return 4;
                }
            }
            return -1; // not visible, or revealed
        }
        _isDim(entry) {
            if (entry === this.highlight)
                return false;
            if (!!this.highlight)
                return true;
            return entry.priority > 3;
        }
        _addActorEntry(actor, map, x, y, fov) {
            const priority = this._getPriority(map, actor.x, actor.y, fov);
            if (priority < 0 || priority > 3)
                return false;
            if (actor.hasEntityFlag(Entity$1.L_NO_SIDEBAR))
                return false;
            const entry = this._makeActorEntry(actor);
            entry.dist = GWU__namespace.xy.distanceBetween(x, y, actor.x, actor.y);
            entry.priority = actor.isPlayer() ? 0 : priority;
            this.entries.push(entry);
            return true;
        }
        _addItemEntry(item, map, x, y, fov) {
            const priority = this._getPriority(map, item.x, item.y, fov);
            if (priority < 0)
                return false;
            if (item.hasEntityFlag(Entity$1.L_NO_SIDEBAR))
                return false;
            const entry = this._makeItemEntry(item);
            entry.dist = GWU__namespace.xy.distanceBetween(x, y, item.x, item.y);
            entry.priority = priority;
            this.entries.push(entry);
            return true;
        }
        _addCellEntry(cell, map, x, y, fov) {
            const priority = this._getPriority(map, cell.x, cell.y, fov);
            if (priority < 0)
                return false;
            const entry = this._makeCellEntry(cell);
            entry.dist = GWU__namespace.xy.distanceBetween(x, y, cell.x, cell.y);
            entry.priority = priority;
            this.entries.push(entry);
            return true;
        }
        _updateEntryCache(map, cx, cy, fov) {
            if (map === this.lastMap &&
                cx === this.lastX &&
                cy === this.lastY &&
                !map.hasMapFlag(Map$1.MAP_SIDEBAR_CHANGED |
                    Map$1.MAP_SIDEBAR_TILES_CHANGED)) {
                let anyChanged = this.entries.some((e) => e.changed);
                if (!anyChanged)
                    return false;
            }
            map.clearMapFlag(Map$1.MAP_SIDEBAR_CHANGED);
            const highlightX = this.highlight ? this.highlight.x : -1;
            const highlightY = this.highlight ? this.highlight.y : -1;
            this.clearHighlight(); // If we are moving around the map, then turn off the highlight
            this.lastMap = map;
            this.lastX = cx;
            this.lastY = cy;
            this.entries.length = 0;
            const done = GWU__namespace.grid.alloc(map.width, map.height);
            map.eachActor((a) => {
                const x = a.x;
                const y = a.y;
                if (!done[x][y] && this._addActorEntry(a, map, cx, cy, fov)) {
                    done[x][y] = 1;
                    a.setEntityFlag(Entity$1.L_IN_SIDEBAR);
                }
                else {
                    a.clearEntityFlag(Entity$1.L_IN_SIDEBAR);
                }
            });
            map.eachItem((i) => {
                const x = i.x;
                const y = i.y;
                if (!done[x][y] && this._addItemEntry(i, map, cx, cy, fov)) {
                    i.setEntityFlag(Entity$1.L_IN_SIDEBAR);
                    done[x][y] = 1;
                }
                else {
                    i.clearEntityFlag(Entity$1.L_IN_SIDEBAR);
                }
            });
            this.cellCache.forEach((c) => {
                if (done[c.x][c.y])
                    return;
                if (this._addCellEntry(c, map, cx, cy, fov)) {
                    done[c.x][c.y] = 1;
                }
            });
            this.entries.sort((a, b) => {
                if (a.priority != b.priority) {
                    return a.priority - b.priority;
                }
                return a.dist - b.dist;
            });
            if (highlightX > -1) {
                this.highlightAt(highlightX, highlightY);
            }
            GWU__namespace.grid.free(done);
            return true;
        }
        update() {
            if (!this.subject) {
                return false;
            }
            return this.updateFor(this.subject);
        }
        updateFor(subject) {
            if (!subject.map)
                return false;
            return this.updateAt(subject.map, subject.x, subject.y, subject.map.fov);
        }
        updateAt(map, cx, cy, fov) {
            let changed = this._updateCellCache(map);
            if (this._updateEntryCache(map, cx, cy, fov)) {
                changed = true;
            }
            return changed;
        }
        draw(buffer) {
            var _a;
            const map = (_a = this.subject) === null || _a === void 0 ? void 0 : _a.map;
            if (!map)
                return false;
            if (this.update()) {
                this.needsDraw = true;
            }
            if (!this.needsDraw)
                return false;
            this.needsDraw = false;
            const bg = this._used.bg || GWU__namespace.color.BLACK;
            buffer.fillRect(this.bounds.x, this.bounds.y, this.bounds.width, this.bounds.height, ' ', bg, bg);
            // clear the row information
            this.entries.forEach((e) => (e.sidebarY = -1));
            const drawBounds = this.bounds.clone();
            let currentEntry;
            for (let i = 0; i < this.entries.length && drawBounds.height > 0; ++i) {
                currentEntry = this.entries[i];
                currentEntry.sidebarY = drawBounds.y;
                let usedLines = currentEntry.draw(buffer, drawBounds);
                if (this._isDim(currentEntry)) {
                    buffer.mix(bg, 50, drawBounds.x, drawBounds.y, drawBounds.width, usedLines);
                }
                else if (this.highlight === currentEntry) {
                    buffer.mix('white', 20, drawBounds.x, drawBounds.y, drawBounds.width, usedLines);
                }
                if (usedLines) {
                    ++usedLines; // skip a space
                    drawBounds.y += usedLines;
                    drawBounds.height -= usedLines;
                }
            }
            return true;
        }
    }

    class Game extends GWU__namespace.app.Scene {
        constructor(id, app) {
            super(id, app);
            this.result = undefined;
            this.mouse = false;
            this.fov = false;
            this.scent = false;
            this.running = false;
            this.keymap = {};
        }
        get viewWidth() {
            return this.viewport.bounds.width;
        }
        get viewHeight() {
            return this.viewport.bounds.height;
        }
        _initMenu(_opts) { }
        _initSidebar(opts) {
            if (typeof opts.sidebar === 'number') {
                opts.sidebar = { width: opts.sidebar };
            }
            else if (opts.sidebar === true) {
                opts.sidebar = {};
            }
            else if (!opts.sidebar) {
                return;
            }
            const sideOpts = opts.sidebar;
            sideOpts.width = sideOpts.width || -20; // on right side
            const viewInit = opts.viewport;
            if (sideOpts.width < 0) {
                sideOpts.width *= -1;
                sideOpts.x = viewInit.x + viewInit.width - sideOpts.width;
                sideOpts.y = viewInit.y;
                sideOpts.height = viewInit.height;
                viewInit.width -= sideOpts.width;
            }
            else {
                sideOpts.x = 0;
                sideOpts.height = viewInit.height;
                sideOpts.y = viewInit.y;
                viewInit.x = sideOpts.width;
                viewInit.width -= sideOpts.width;
            }
            sideOpts.scene = this;
            this.sidebar = new Sidebar(sideOpts);
        }
        _initMessages(opts) {
            if (opts.messages === false)
                return;
            if (opts.messages === true) {
                opts.messages = { archive: -4 };
            }
            else if (typeof opts.messages === 'number') {
                opts.messages = { archive: opts.messages };
            }
            const messOpts = opts.messages || { archive: -4 };
            messOpts.archive = messOpts.archive || messOpts.y || -4;
            if (messOpts.archive < 0) {
                // bottom
                const viewInit = opts.viewport;
                messOpts.x = viewInit.x;
                messOpts.y = viewInit.height + messOpts.archive; // length < 0
                messOpts.width = viewInit.width;
                messOpts.height = -messOpts.archive;
                viewInit.height -= messOpts.height;
            }
            else {
                // top
                const viewInit = opts.viewport;
                messOpts.x = viewInit.x;
                messOpts.y = viewInit.y;
                messOpts.width = viewInit.width;
                messOpts.height = messOpts.archive;
                viewInit.y += messOpts.archive;
                viewInit.height -= messOpts.archive;
            }
            messOpts.scene = this;
            this.messages = new Messages(messOpts);
        }
        _initFlavor(opts) {
            if (opts.flavor === false)
                return;
            if (opts.flavor === true) {
                opts.flavor = {};
            }
            const flavOpts = opts.flavor || {};
            const viewOpts = opts.viewport;
            const y = viewOpts.y || 0;
            if (y === 0) {
                // messages must be on bottom (or not there)
                flavOpts.x = viewOpts.x || 0;
                flavOpts.y = viewOpts.height - 1;
                flavOpts.width = viewOpts.width;
                viewOpts.height -= 1;
            }
            else {
                // messages on top
                flavOpts.x = viewOpts.x;
                flavOpts.y = viewOpts.y;
                flavOpts.width = viewOpts.width;
                viewOpts.y += 1;
                viewOpts.height -= 1;
            }
            flavOpts.scene = this;
            this.flavor = new Flavor(flavOpts);
        }
        _initViewport(opts) {
            if (opts.viewport === true) {
                opts.viewport = {};
            }
            const viewOpts = (opts.viewport || {});
            viewOpts.lock = true;
            viewOpts.x = viewOpts.x || 0;
            viewOpts.y = viewOpts.y || 0;
            viewOpts.width = viewOpts.width || this.app.width - viewOpts.x;
            viewOpts.height = viewOpts.height || this.app.height - viewOpts.y;
            this.viewport = new Viewport(viewOpts);
        }
        create(opts) {
            super.create(opts);
            if (!opts.makeMap || !opts.makePlayer) {
                throw new Error('Need funcitons for makeMap and makePlayer');
            }
            this._makeMap = opts.makeMap;
            this._makePlayer = opts.makePlayer;
            this._startMap = opts.startMap || GWU__namespace.NOOP;
            if (opts.keymap) {
                Object.assign(this.keymap, opts.keymap);
            }
            if (opts.mouse) {
                this.mouse = true;
            }
            if (typeof opts.messages === 'number') {
                opts.messages = { archive: opts.messages };
            }
            if (opts.flavor === true) {
                opts.flavor = {};
            }
            else if (opts.flavor === false) {
                delete opts.flavor;
            }
            if (opts.viewport === true) {
                opts.viewport = {};
            }
            const viewOpts = (opts.viewport = opts.viewport || {});
            viewOpts.x = viewOpts.x || 0;
            viewOpts.y = viewOpts.y || 0;
            viewOpts.width = viewOpts.width || this.app.width - viewOpts.x;
            viewOpts.height = viewOpts.height || this.app.height - viewOpts.y;
            this._initMenu(opts);
            if (opts.sidebar)
                this._initSidebar(opts);
            if (opts.messages)
                this._initMessages(opts);
            if (opts.flavor)
                this._initFlavor(opts);
            this._initViewport(opts);
            this.scheduler = new GWU__namespace.scheduler.Scheduler();
        }
        start(opts = {}) {
            if (this.messages)
                this.messages.clear();
            // move to create?
            this.player = opts.player || this._makePlayer.call(this);
            this.viewport.subject = this.player;
            if (this.sidebar)
                this.sidebar.subject = this.player;
            const id = opts.map || 0;
            this.startNewMap({ id });
            this.scheduler.push(this.player, 0);
            super.start(opts);
        }
        startNewMap(opts = { id: 0 }) {
            this.scheduler.clear();
            if (opts.id === undefined) {
                opts.id = this.map.id;
            }
            this.map = this._makeMap.call(this, opts);
            this.map.setPlayer(this.player);
            this._startMap.call(this, this.map, this.player, opts);
            // make sure player is on map
            if (this.player.map !== this.map) {
                // if not, add them (where?)
                const loc = this.map.locations.start || [0, 0]; // Is top left fallback any good?
                if (!this.map.addActorNear(loc[0], loc[1], this.player)) {
                    throw new Error('Failed to find starting spot for player!');
                }
            }
            if (this.scent) {
                this.map.drawer.scent = this.scent;
            }
            this.map.actors.forEach((a) => {
                if (!a.isPlayer()) {
                    this.scheduler.push(a, a.moveSpeed());
                }
            });
            this.map.fov.update();
            // this.draw();
        }
        // draw() {
        //     this.viewport.draw(this.buffer);
        //     if (this.messages) this.messages.draw(this.buffer);
        //     if (this.flavor) this.flavor.draw(this.buffer);
        //     if (this.sidebar) this.sidebar.draw(this.buffer);
        //     if (this.buffer.changed) {
        //         this.buffer.render();
        //     }
        //     this.buffer.changed = false;
        //     this.map.actors.forEach((a) => (a.changed = false));
        //     this.map.items.forEach((i) => (i.changed = false));
        // }
        // finish(result?: any) {
        //     this.running = false;
        //     this.layer.finish();
        //     this.result = result;
        // }
        update(dt) {
            super.update(dt);
            if (this.tweens.length)
                return;
            let actor = this.scheduler.pop();
            if (!actor) {
                this.stop();
                return;
            }
            let nextTime = 99;
            while (nextTime > 0 && actor) {
                nextTime = actor.act(this);
                if (nextTime >= 0) {
                    this.scheduler.push(actor, nextTime);
                    actor = this.scheduler.pop();
                }
                // stop every time the player acts so we can draw the screen
                if (actor === this.player) {
                    nextTime = 0;
                }
            }
        }
        // playerTurn(player: Player): number {
        //     let done = 0;
        //     const timer = setInterval(() => {
        //         const tick = GWU.app.makeTickEvent(16);
        //         // console.log('-tick', Date.now());
        //         this.io.enqueue(tick);
        //     }, 16);
        //     let elapsed = 0;
        //     while (!done && this.running) {
        //         const ev = await this.io.nextEvent(-1);
        //         if (ev) {
        //             if (ev.type === GWU.app.KEYPRESS) {
        //             }
        //         }
        //         if (elapsed < 50) {
        //             continue;
        //         }
        //         elapsed -= 50;
        //     }
        //     clearInterval(timer);
        //     return done;
        // }
        input(ev) {
            super.input(ev);
            if (ev.defaultPrevented || ev.propagationStopped)
                return;
            if (ev.type === GWU__namespace.app.MOUSEMOVE) {
                this.mousemove(ev);
            }
            else if (ev.type === GWU__namespace.app.CLICK) {
                this.click(ev);
            }
            else if (ev.type === GWU__namespace.app.KEYPRESS) {
                this.keypress(ev);
            }
        }
        mousemove(ev) {
            if (this.viewport.contains(ev)) {
                const x = this.viewport.toInnerX(ev.x);
                const y = this.viewport.toInnerY(ev.y);
                if (this.flavor) {
                    const text = this.flavor.getFlavorText(this.map, x, y, this.map.fov);
                    this.flavor.showText(text);
                }
                if (this.sidebar) {
                    this.sidebar.highlightAt(x, y);
                }
            }
        }
        click(_ev) { }
        keypress(ev) {
            this.map.clearPath();
            if (this.player.hasGoal()) {
                this.player.clearGoal();
            }
            else {
                const action = this._actionFor(this.keymap, ev);
                if (action) {
                    this.player.setAction(action);
                }
            }
        }
        _actionFor(keymap, ev) {
            if (ev.dir && keymap.dir)
                return keymap.dir;
            return (keymap[ev.key] ||
                keymap[ev.code] ||
                keymap.keypress ||
                keymap.default ||
                null);
        }
    }
    GWU__namespace.app.installScene('game', (id, app) => new Game(id, app));

    var index = /*#__PURE__*/Object.freeze({
        __proto__: null,
        Viewport: Viewport,
        Messages: Messages,
        ArchiveScene: ArchiveScene,
        ArchiveWidget: ArchiveWidget,
        Flavor: Flavor,
        EntryBase: EntryBase,
        ActorEntry: ActorEntry,
        ItemEntry: ItemEntry,
        CellEntry: CellEntry,
        Sidebar: Sidebar,
        Game: Game
    });

    install$5('FLOOR', {
        ch: '\u00b7',
        fg: GWU__namespace.color.from([30, 30, 30]).rand(20, 0, 0, 0),
        bg: GWU__namespace.color.from([2, 2, 10]).rand(0, 2, 2, 0),
        priority: 10,
        article: 'the',
        flavor: 'the stone floor',
    });
    install$5('DOOR', {
        ch: '+',
        fg: [100, 40, 40],
        bg: [30, 60, 60],
        priority: 30,
        flags: 'T_IS_DOOR, L_BLOCKS_EFFECTS, L_BLOCKS_ITEMS, L_BLOCKS_VISION, L_VISUALLY_DISTINCT',
        article: 'a',
        actions: {
            enter: 'TILE:DOOR_OPEN',
            open: 'TILE:DOOR_OPEN_ALWAYS',
        },
        flavor: 'a closed door',
    });
    install$5('DOOR_OPEN', 'DOOR', {
        ch: "'",
        fg: [100, 40, 40],
        bg: [30, 60, 60],
        priority: 40,
        flags: '!L_BLOCKS_ITEMS, !L_BLOCKS_VISION',
        name: 'open door',
        article: 'an',
        actions: {
            tick: {
                chance: 100 * 100,
                tile: 'DOOR~!',
            },
            enter: null,
            open: null,
            close: 'TILE:DOOR~!',
        },
        flavor: 'an open door',
    });
    install$5('DOOR_OPEN_ALWAYS', 'DOOR_OPEN', {
        actions: {
            tick: null,
            close: 'TILE:DOOR~!',
        },
        flavor: 'an open door',
    });
    install$5('UP_STAIRS', {
        ch: '>',
        fg: [100, 50, 50],
        bg: [40, 20, 20],
        priority: 200,
        flags: 'T_UP_STAIRS, L_BLOCKED_BY_STAIRS, L_VISUALLY_DISTINCT, T_LIST_IN_SIDEBAR',
        name: 'upward stairs',
        article: 'an',
        actions: {
            climb(action) {
                if (!action.actor)
                    return action.didNothing();
                if (!action.actor.isPlayer())
                    return action.didNothing();
                action.game.startNewMap({ up: true });
                return action.actor.endTurn();
            },
        },
        flavor: 'stairs leading upwards',
    });
    install$5('DOWN_STAIRS', {
        ch: '<',
        fg: [100, 50, 50],
        bg: [40, 20, 20],
        priority: 200,
        flags: 'T_DOWN_STAIRS, L_BLOCKED_BY_STAIRS, L_VISUALLY_DISTINCT, T_LIST_IN_SIDEBAR',
        name: 'downward stairs',
        article: 'a',
        actions: {
            descend(action) {
                if (!action.actor)
                    return action.didNothing();
                if (!action.actor.isPlayer())
                    return action.didNothing();
                action.game.startNewMap({ down: true });
                return action.actor.endTurn();
            },
        },
        flavor: 'downward leading stairs',
    });
    install$5('WALL', {
        ch: '#',
        fg: GWU__namespace.color.from([7, 7, 7]).rand(0, 3, 3, 3),
        bg: GWU__namespace.color.from([40, 40, 40]).rand(10, 10, 0, 5),
        priority: 100,
        flags: 'L_WALL_FLAGS',
        article: 'a',
        name: 'stone wall',
        description: 'A wall made from rough cut stone.',
        flavor: 'a rough stone wall',
    });
    install$5('IMPREGNABLE', {
        ch: '#',
        fg: GWU__namespace.color.from([7, 7, 7]).rand(0, 3, 3, 3),
        bg: GWU__namespace.color.from([40, 40, 40]).rand(10, 10, 0, 5),
        priority: 100,
        flags: 'L_WALL_FLAGS, IMPREGNABLE',
        article: 'a',
        name: 'impregnable wall',
        description: 'A wall made from very hard stone.',
        flavor: 'a very hard wall',
    });
    install$5('LAKE', {
        ch: '~',
        fg: GWU__namespace.color.from([25, 28, 60]).dance(20, 0, 4, 15),
        bg: GWU__namespace.color.from([10, 15, 41]).dance(20, 5, 5, 5),
        priority: 50,
        flags: 'T_DEEP_WATER',
        name: 'deep water',
        article: 'the',
        flavor: 'some deep water',
    });
    install$5('SHALLOW', {
        ch: '\u00b7',
        fg: GWU__namespace.color.from([5, 8, 10]).dance(10, 0, 4, 15),
        bg: GWU__namespace.color.from([10, 30, 30]).dance(6, 0, 10, 10),
        priority: 20,
        name: 'shallow water',
        article: 'the',
        flags: 'T_SHALLOW_WATER',
        // depth: 'LIQUID', // 'SURFACE'?
        flavor: 'some shallow water',
    });
    install$5('BRIDGE', {
        ch: '\u2630',
        fg: [80, 40, 40],
        priority: 40,
        depth: 'SURFACE',
        flags: 'T_BRIDGE, L_VISUALLY_DISTINCT',
        article: 'a',
        groundTile: 'LAKE',
        flavor: 'a bridge',
    });

    exports.action = index$f;
    exports.actions = index$8;
    exports.actor = index$a;
    exports.ai = index$b;
    exports.draw = index$2;
    exports.effect = index$e;
    exports.effects = index$7;
    exports.entity = index$c;
    exports.flags = index$g;
    exports.fx = fx;
    exports.game = index;
    exports.horde = index$4;
    exports.item = index$9;
    exports.layer = index$6;
    exports.map = index$5;
    exports.memory = index$3;
    exports.player = index$1;
    exports.tile = index$d;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=gw-map.js.map
