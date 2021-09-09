(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('gw-utils')) :
    typeof define === 'function' && define.amd ? define(['exports', 'gw-utils'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.GWM = {}, global.GWU));
}(this, (function (exports, GWU) { 'use strict';

    function _interopNamespace(e) {
        if (e && e.__esModule) return e;
        var n = Object.create(null);
        if (e) {
            Object.keys(e).forEach(function (k) {
                if (k !== 'default') {
                    var d = Object.getOwnPropertyDescriptor(e, k);
                    Object.defineProperty(n, k, d.get ? d : {
                        enumerable: true,
                        get: function () {
                            return e[k];
                        }
                    });
                }
            });
        }
        n['default'] = e;
        return Object.freeze(n);
    }

    var GWU__namespace = /*#__PURE__*/_interopNamespace(GWU);

    var Depth$1;
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
    })(Depth$1 || (Depth$1 = {}));

    const Fl$6 = GWU__namespace.flag.fl;
    var Entity$1;
    (function (Entity) {
        // L_DYNAMIC = Fl(0), // for movable things like actors or items
        Entity[Entity["L_DESTROYED"] = Fl$6(1)] = "L_DESTROYED";
        Entity[Entity["L_SECRETLY_PASSABLE"] = Fl$6(2)] = "L_SECRETLY_PASSABLE";
        Entity[Entity["L_BLOCKS_MOVE"] = Fl$6(3)] = "L_BLOCKS_MOVE";
        Entity[Entity["L_BLOCKS_VISION"] = Fl$6(4)] = "L_BLOCKS_VISION";
        Entity[Entity["L_BLOCKS_SURFACE"] = Fl$6(6)] = "L_BLOCKS_SURFACE";
        Entity[Entity["L_BLOCKS_LIQUID"] = Fl$6(8)] = "L_BLOCKS_LIQUID";
        Entity[Entity["L_BLOCKS_GAS"] = Fl$6(7)] = "L_BLOCKS_GAS";
        Entity[Entity["L_BLOCKS_ITEMS"] = Fl$6(5)] = "L_BLOCKS_ITEMS";
        Entity[Entity["L_BLOCKS_ACTORS"] = Fl$6(11)] = "L_BLOCKS_ACTORS";
        Entity[Entity["L_BLOCKS_EFFECTS"] = Fl$6(9)] = "L_BLOCKS_EFFECTS";
        Entity[Entity["L_BLOCKS_DIAGONAL"] = Fl$6(10)] = "L_BLOCKS_DIAGONAL";
        Entity[Entity["L_INTERRUPT_WHEN_SEEN"] = Fl$6(12)] = "L_INTERRUPT_WHEN_SEEN";
        Entity[Entity["L_LIST_IN_SIDEBAR"] = Fl$6(13)] = "L_LIST_IN_SIDEBAR";
        Entity[Entity["L_VISUALLY_DISTINCT"] = Fl$6(14)] = "L_VISUALLY_DISTINCT";
        Entity[Entity["L_BRIGHT_MEMORY"] = Fl$6(15)] = "L_BRIGHT_MEMORY";
        Entity[Entity["L_INVERT_WHEN_HIGHLIGHTED"] = Fl$6(16)] = "L_INVERT_WHEN_HIGHLIGHTED";
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

    const Fl$5 = GWU__namespace.flag.fl;
    var Actor$1;
    (function (Actor) {
        Actor[Actor["IS_PLAYER"] = Fl$5(0)] = "IS_PLAYER";
    })(Actor$1 || (Actor$1 = {}));

    var Item$1;
    (function (Item) {
    })(Item$1 || (Item$1 = {}));

    const Fl$4 = GWU__namespace.flag.fl;
    ///////////////////////////////////////////////////////
    // TILE
    var Tile$1;
    (function (Tile) {
        Tile[Tile["T_BRIDGE"] = Fl$4(0)] = "T_BRIDGE";
        Tile[Tile["T_AUTO_DESCENT"] = Fl$4(1)] = "T_AUTO_DESCENT";
        Tile[Tile["T_LAVA"] = Fl$4(2)] = "T_LAVA";
        Tile[Tile["T_DEEP_WATER"] = Fl$4(3)] = "T_DEEP_WATER";
        Tile[Tile["T_IS_FLAMMABLE"] = Fl$4(5)] = "T_IS_FLAMMABLE";
        Tile[Tile["T_SPONTANEOUSLY_IGNITES"] = Fl$4(6)] = "T_SPONTANEOUSLY_IGNITES";
        Tile[Tile["T_IS_FIRE"] = Fl$4(7)] = "T_IS_FIRE";
        Tile[Tile["T_EXTINGUISHES_FIRE"] = Fl$4(8)] = "T_EXTINGUISHES_FIRE";
        Tile[Tile["T_IS_SECRET"] = Fl$4(9)] = "T_IS_SECRET";
        Tile[Tile["T_IS_TRAP"] = Fl$4(10)] = "T_IS_TRAP";
        Tile[Tile["T_SACRED"] = Fl$4(11)] = "T_SACRED";
        Tile[Tile["T_UP_STAIRS"] = Fl$4(12)] = "T_UP_STAIRS";
        Tile[Tile["T_DOWN_STAIRS"] = Fl$4(13)] = "T_DOWN_STAIRS";
        Tile[Tile["T_PORTAL"] = Fl$4(14)] = "T_PORTAL";
        Tile[Tile["T_IS_DOOR"] = Fl$4(15)] = "T_IS_DOOR";
        Tile[Tile["T_ALLOWS_SUBMERGING"] = Fl$4(16)] = "T_ALLOWS_SUBMERGING";
        Tile[Tile["T_ENTANGLES"] = Fl$4(17)] = "T_ENTANGLES";
        Tile[Tile["T_REFLECTS"] = Fl$4(18)] = "T_REFLECTS";
        Tile[Tile["T_STAND_IN_TILE"] = Fl$4(19)] = "T_STAND_IN_TILE";
        Tile[Tile["T_CONNECTS_LEVEL"] = Fl$4(20)] = "T_CONNECTS_LEVEL";
        Tile[Tile["T_BLOCKS_OTHER_LAYERS"] = Fl$4(21)] = "T_BLOCKS_OTHER_LAYERS";
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
    })(Tile$1 || (Tile$1 = {}));

    const Fl$3 = GWU__namespace.flag.fl;
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
        TileMech[TileMech["TM_IS_WIRED"] = Fl$3(9)] = "TM_IS_WIRED";
        TileMech[TileMech["TM_IS_CIRCUIT_BREAKER"] = Fl$3(10)] = "TM_IS_CIRCUIT_BREAKER";
        TileMech[TileMech["TM_VANISHES_UPON_PROMOTION"] = Fl$3(15)] = "TM_VANISHES_UPON_PROMOTION";
        TileMech[TileMech["TM_EXPLOSIVE_PROMOTE"] = Fl$3(21)] = "TM_EXPLOSIVE_PROMOTE";
        TileMech[TileMech["TM_SWAP_ENCHANTS_ACTIVATION"] = Fl$3(25)] = "TM_SWAP_ENCHANTS_ACTIVATION";
        // TM_PROMOTES = TM_PROMOTES_WITH_KEY |
        //   TM_PROMOTES_WITHOUT_KEY |
        //   TM_PROMOTES_ON_STEP |
        //   TM_PROMOTES_ON_ITEM_REMOVE |
        //   TM_PROMOTES_ON_SACRIFICE_ENTRY |
        //   TM_PROMOTES_ON_ELECTRICITY |
        //   TM_PROMOTES_ON_PLAYER_ENTRY,
    })(TileMech || (TileMech = {}));

    const Fl$2 = GWU__namespace.flag.fl;
    ///////////////////////////////////////////////////////
    // CELL
    var Cell$1;
    (function (Cell) {
        Cell[Cell["SEARCHED_FROM_HERE"] = Fl$2(0)] = "SEARCHED_FROM_HERE";
        Cell[Cell["PRESSURE_PLATE_DEPRESSED"] = Fl$2(1)] = "PRESSURE_PLATE_DEPRESSED";
        Cell[Cell["KNOWN_TO_BE_TRAP_FREE"] = Fl$2(2)] = "KNOWN_TO_BE_TRAP_FREE";
        Cell[Cell["CAUGHT_FIRE_THIS_TURN"] = Fl$2(3)] = "CAUGHT_FIRE_THIS_TURN";
        Cell[Cell["EVENT_FIRED_THIS_TURN"] = Fl$2(4)] = "EVENT_FIRED_THIS_TURN";
        Cell[Cell["EVENT_PROTECTED"] = Fl$2(5)] = "EVENT_PROTECTED";
        Cell[Cell["IS_IN_LOOP"] = Fl$2(6)] = "IS_IN_LOOP";
        Cell[Cell["IS_CHOKEPOINT"] = Fl$2(7)] = "IS_CHOKEPOINT";
        Cell[Cell["IS_GATE_SITE"] = Fl$2(8)] = "IS_GATE_SITE";
        Cell[Cell["IS_IN_ROOM_MACHINE"] = Fl$2(9)] = "IS_IN_ROOM_MACHINE";
        Cell[Cell["IS_IN_AREA_MACHINE"] = Fl$2(10)] = "IS_IN_AREA_MACHINE";
        Cell[Cell["IMPREGNABLE"] = Fl$2(11)] = "IMPREGNABLE";
        Cell[Cell["NEEDS_REDRAW"] = Fl$2(13)] = "NEEDS_REDRAW";
        Cell[Cell["LIGHT_CHANGED"] = Fl$2(14)] = "LIGHT_CHANGED";
        Cell[Cell["FOV_CHANGED"] = Fl$2(15)] = "FOV_CHANGED";
        // These are to help memory
        Cell[Cell["HAS_SURFACE"] = Fl$2(16)] = "HAS_SURFACE";
        Cell[Cell["HAS_LIQUID"] = Fl$2(17)] = "HAS_LIQUID";
        Cell[Cell["HAS_GAS"] = Fl$2(18)] = "HAS_GAS";
        Cell[Cell["HAS_PLAYER"] = Fl$2(19)] = "HAS_PLAYER";
        Cell[Cell["HAS_ACTOR"] = Fl$2(20)] = "HAS_ACTOR";
        Cell[Cell["HAS_DORMANT_MONSTER"] = Fl$2(21)] = "HAS_DORMANT_MONSTER";
        Cell[Cell["HAS_ITEM"] = Fl$2(22)] = "HAS_ITEM";
        Cell[Cell["IS_IN_PATH"] = Fl$2(23)] = "IS_IN_PATH";
        Cell[Cell["IS_CURSOR"] = Fl$2(24)] = "IS_CURSOR";
        Cell[Cell["STABLE_MEMORY"] = Fl$2(25)] = "STABLE_MEMORY";
        Cell[Cell["IS_WIRED"] = Fl$2(26)] = "IS_WIRED";
        Cell[Cell["IS_CIRCUIT_BREAKER"] = Fl$2(27)] = "IS_CIRCUIT_BREAKER";
        Cell[Cell["IS_POWERED"] = Fl$2(28)] = "IS_POWERED";
        Cell[Cell["COLORS_DANCE"] = Fl$2(30)] = "COLORS_DANCE";
        Cell[Cell["CHANGED"] = Cell.NEEDS_REDRAW | Cell.LIGHT_CHANGED | Cell.FOV_CHANGED] = "CHANGED";
        Cell[Cell["IS_IN_MACHINE"] = Cell.IS_IN_ROOM_MACHINE | Cell.IS_IN_AREA_MACHINE] = "IS_IN_MACHINE";
        Cell[Cell["PERMANENT_CELL_FLAGS"] = Cell.HAS_ITEM |
            Cell.HAS_DORMANT_MONSTER |
            Cell.STABLE_MEMORY |
            Cell.SEARCHED_FROM_HERE |
            Cell.PRESSURE_PLATE_DEPRESSED |
            Cell.KNOWN_TO_BE_TRAP_FREE |
            Cell.IS_IN_LOOP |
            Cell.IS_CHOKEPOINT |
            Cell.IS_GATE_SITE |
            Cell.IS_IN_MACHINE |
            Cell.IMPREGNABLE] = "PERMANENT_CELL_FLAGS";
        Cell[Cell["HAS_ANY_ACTOR"] = Cell.HAS_PLAYER | Cell.HAS_ACTOR] = "HAS_ANY_ACTOR";
        Cell[Cell["HAS_ANY_OBJECT"] = Cell.HAS_ITEM | Cell.HAS_ANY_ACTOR] = "HAS_ANY_OBJECT";
        Cell[Cell["CELL_DEFAULT"] = Cell.NEEDS_REDRAW | Cell.LIGHT_CHANGED] = "CELL_DEFAULT";
    })(Cell$1 || (Cell$1 = {}));

    const Fl$1 = GWU__namespace.flag.fl;
    ///////////////////////////////////////////////////////
    // MAP
    var Map$1;
    (function (Map) {
        Map[Map["MAP_CHANGED"] = Fl$1(0)] = "MAP_CHANGED";
        Map[Map["MAP_ALWAYS_LIT"] = Fl$1(3)] = "MAP_ALWAYS_LIT";
        Map[Map["MAP_SAW_WELCOME"] = Fl$1(4)] = "MAP_SAW_WELCOME";
        Map[Map["MAP_NO_LIQUID"] = Fl$1(5)] = "MAP_NO_LIQUID";
        Map[Map["MAP_NO_GAS"] = Fl$1(6)] = "MAP_NO_GAS";
        Map[Map["MAP_CALC_FOV"] = Fl$1(7)] = "MAP_CALC_FOV";
        Map[Map["MAP_FOV_CHANGED"] = Fl$1(8)] = "MAP_FOV_CHANGED";
        Map[Map["MAP_DANCES"] = Fl$1(9)] = "MAP_DANCES";
        Map[Map["MAP_DEFAULT"] = 0] = "MAP_DEFAULT";
    })(Map$1 || (Map$1 = {}));

    const Fl = GWU__namespace.flag.fl;
    ///////////////////////////////////////////////////////
    // TILE EVENT
    var Effect;
    (function (Effect) {
        // E_ALWAYS_FIRE = Fl(10), // Fire even if the cell is marked as having fired this turn
        Effect[Effect["E_NEXT_ALWAYS"] = Fl(0)] = "E_NEXT_ALWAYS";
        Effect[Effect["E_NEXT_EVERYWHERE"] = Fl(1)] = "E_NEXT_EVERYWHERE";
        Effect[Effect["E_FIRED"] = Fl(2)] = "E_FIRED";
        Effect[Effect["E_NO_MARK_FIRED"] = Fl(3)] = "E_NO_MARK_FIRED";
        // MUST_REPLACE_LAYER
        // NEEDS_EMPTY_LAYER
        Effect[Effect["E_PROTECTED"] = Fl(4)] = "E_PROTECTED";
        // E_NO_REDRAW_CELL = Fl(),
        Effect[Effect["E_TREAT_AS_BLOCKING"] = Fl(5)] = "E_TREAT_AS_BLOCKING";
        Effect[Effect["E_PERMIT_BLOCKING"] = Fl(6)] = "E_PERMIT_BLOCKING";
        Effect[Effect["E_ABORT_IF_BLOCKS_MAP"] = Fl(7)] = "E_ABORT_IF_BLOCKS_MAP";
        Effect[Effect["E_BLOCKED_BY_ITEMS"] = Fl(8)] = "E_BLOCKED_BY_ITEMS";
        Effect[Effect["E_BLOCKED_BY_ACTORS"] = Fl(9)] = "E_BLOCKED_BY_ACTORS";
        Effect[Effect["E_BLOCKED_BY_OTHER_LAYERS"] = Fl(10)] = "E_BLOCKED_BY_OTHER_LAYERS";
        Effect[Effect["E_SUPERPRIORITY"] = Fl(11)] = "E_SUPERPRIORITY";
        Effect[Effect["E_SPREAD_CIRCLE"] = Fl(13)] = "E_SPREAD_CIRCLE";
        Effect[Effect["E_SPREAD_LINE"] = Fl(14)] = "E_SPREAD_LINE";
        Effect[Effect["E_EVACUATE_CREATURES"] = Fl(15)] = "E_EVACUATE_CREATURES";
        Effect[Effect["E_EVACUATE_ITEMS"] = Fl(16)] = "E_EVACUATE_ITEMS";
        Effect[Effect["E_BUILD_IN_WALLS"] = Fl(17)] = "E_BUILD_IN_WALLS";
        Effect[Effect["E_MUST_TOUCH_WALLS"] = Fl(18)] = "E_MUST_TOUCH_WALLS";
        Effect[Effect["E_NO_TOUCH_WALLS"] = Fl(19)] = "E_NO_TOUCH_WALLS";
        Effect[Effect["E_CLEAR_GROUND"] = Fl(21)] = "E_CLEAR_GROUND";
        Effect[Effect["E_CLEAR_SURFACE"] = Fl(22)] = "E_CLEAR_SURFACE";
        Effect[Effect["E_CLEAR_LIQUID"] = Fl(23)] = "E_CLEAR_LIQUID";
        Effect[Effect["E_CLEAR_GAS"] = Fl(24)] = "E_CLEAR_GAS";
        Effect[Effect["E_CLEAR_TILE"] = Fl(25)] = "E_CLEAR_TILE";
        Effect[Effect["E_CLEAR_CELL"] = Effect.E_CLEAR_GROUND |
            Effect.E_CLEAR_SURFACE |
            Effect.E_CLEAR_LIQUID |
            Effect.E_CLEAR_GAS] = "E_CLEAR_CELL";
        Effect[Effect["E_ONLY_IF_EMPTY"] = Effect.E_BLOCKED_BY_ITEMS | Effect.E_BLOCKED_BY_ACTORS] = "E_ONLY_IF_EMPTY";
        // E_NULLIFY_CELL = E_NULL_SURFACE | E_NULL_LIQUID | E_NULL_GAS,
        // These should be effect types
        Effect[Effect["E_ACTIVATE_DORMANT_MONSTER"] = Fl(27)] = "E_ACTIVATE_DORMANT_MONSTER";
        Effect[Effect["E_AGGRAVATES_MONSTERS"] = Fl(28)] = "E_AGGRAVATES_MONSTERS";
        Effect[Effect["E_RESURRECT_ALLY"] = Fl(29)] = "E_RESURRECT_ALLY";
    })(Effect || (Effect = {}));

    var index$7 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        get Depth () { return Depth$1; },
        get Entity () { return Entity$1; },
        get Actor () { return Actor$1; },
        get Item () { return Item$1; },
        get Tile () { return Tile$1; },
        get TileMech () { return TileMech; },
        get Cell () { return Cell$1; },
        get Map () { return Map$1; },
        get Effect () { return Effect; }
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

    class EntityKind {
        constructor(config) {
            this.tags = [];
            this.id = config.id || config.name;
            this.name = config.name;
            this.flavor = config.flavor || this.name;
            this.description = config.description || this.flavor;
            this.sprite = GWU__namespace.sprite.make(config);
            if (config.tags) {
                if (typeof config.tags === 'string') {
                    this.tags = config.tags.split(/[,|]/).map((t) => t.trim());
                }
                else {
                    this.tags = config.tags.slice();
                }
            }
        }
        forbidsCell(_item, _cell) {
            return false;
        }
        getName(_item) {
            return this.name;
        }
        getDescription(_item) {
            return this.description;
        }
        getFlavor(_item) {
            return this.flavor;
        }
        getVerb(_item, verb) {
            return verb;
        }
    }

    class Entity {
        constructor(kind) {
            this.key = null;
            this.depth = 1; // default - TODO - enum/const
            this.light = null;
            this.flags = { entity: 0 };
            this.next = null;
            this.x = -1;
            this.y = -1;
            this.kind = kind;
        }
        get sprite() {
            return this.kind.sprite;
        }
        get isDestroyed() {
            return this.hasEntityFlag(Entity$1.L_DESTROYED);
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
        forbidsCell(cell) {
            return this.kind.forbidsCell(this, cell);
        }
        getName() {
            return this.kind.getName(this);
        }
        getDescription() {
            return this.kind.getDescription(this);
        }
        getFlavor() {
            return this.kind.getFlavor(this);
        }
        getVerb(verb) {
            return this.kind.getVerb(this, verb);
        }
    }

    var index$6 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        KeyInfo: KeyInfo,
        makeKeyInfo: makeKeyInfo,
        EntityKind: EntityKind,
        Entity: Entity
    });

    class ActorKind extends EntityKind {
        constructor(opts) {
            super(opts);
        }
    }

    class Actor extends Entity {
        constructor(kind) {
            super(kind);
            this.next = null;
            // @ts-ignore
            this.flags = this.flags || {};
            this.flags.actor = 0;
            this.depth = Depth$1.ACTOR;
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
        isPlayer() {
            return this.hasActorFlag(Actor$1.IS_PLAYER);
        }
        isVisible() {
            return true;
        }
    }

    var index$5 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        ActorKind: ActorKind,
        Actor: Actor
    });

    class ItemKind extends EntityKind {
        constructor(config) {
            super(config);
        }
        forbidsCell(_item, _cell) {
            return false;
        }
    }
    const kinds = {};
    function install$2(id, kind) {
        if (kind instanceof ItemKind) {
            kinds[id] = kind;
            return kind;
        }
        const made = makeKind(kind);
        made.id = id;
        kinds[id] = made;
        return made;
    }
    function get$1(id) {
        if (id instanceof ItemKind)
            return id;
        return kinds[id];
    }
    function makeKind(info) {
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

    class Item extends Entity {
        constructor(kind) {
            super(kind);
            this.quantity = 1;
            this.next = null;
            // @ts-ignore
            this.flags = this.flags || {};
            this.flags.item = 0;
            this.depth = Depth$1.ITEM;
            this.kind = kind;
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
    }
    function make$3(id) {
        const kind = get$1(id);
        if (!kind)
            throw new Error('Failed to find item kind - ' + id);
        return new Item(kind);
    }
    function makeRandom(opts) {
        const kind = randomKind(opts);
        if (!kind)
            throw new Error('Failed to find item kind matching - ' + JSON.stringify(opts));
        return new Item(kind);
    }
    function from$2(info) {
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
            kind = makeKind(info);
        }
        return new Item(kind);
    }

    var index$4 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        ItemKind: ItemKind,
        kinds: kinds,
        install: install$2,
        get: get$1,
        makeKind: makeKind,
        randomKind: randomKind,
        Item: Item,
        make: make$3,
        makeRandom: makeRandom,
        from: from$2
    });

    function make$2(opts) {
        var _a;
        if (!opts)
            throw new Error('opts required to make effect.');
        if (typeof opts === 'string') {
            throw new Error('Cannot make effect from string: ' + opts);
        }
        if (typeof opts === 'function') {
            opts = { fn: opts };
        }
        // now make base effect stuff
        const info = {
            flags: GWU__namespace.flag.from(Effect, opts.flags),
            chance: (_a = opts.chance) !== null && _a !== void 0 ? _a : 0,
            next: null,
            id: opts.id || 'n/a',
        };
        if (opts.next) {
            if (typeof opts.next === 'string') {
                info.next = opts.next;
            }
            else {
                info.next = make$2(opts.next);
            }
        }
        // and all the handlers
        Object.values(handlers).forEach((v) => v.make(opts, info));
        return info;
    }
    function from$1(opts) {
        if (!opts)
            throw new Error('Cannot make effect from null | undefined');
        if (typeof opts === 'string') {
            const effect = effects[opts];
            if (effect)
                return effect;
            throw new Error('Unknown effect - ' + opts);
        }
        return make$2(opts);
    }

    // resetMessageDisplayed
    function reset(effect) {
        effect.flags &= ~Effect.E_FIRED;
    }
    function resetAll() {
        Object.values(effects).forEach((e) => reset(e));
    }
    const effects = {};
    function install$1(id, config) {
        const effect = make$2(config);
        effects[id] = effect;
        effect.id = id;
        return effect;
    }
    function installAll$1(effects) {
        Object.entries(effects).forEach(([id, config]) => {
            install$1(id, config);
        });
    }
    const handlers = {};
    function installHandler(id, handler) {
        handlers[id] = handler;
    }

    async function fire(effect, map, x, y, ctx_ = {}) {
        if (!effect)
            return false;
        if (typeof effect === 'string') {
            const name = effect;
            effect = from$1(name);
            if (!effect)
                throw new Error('Failed to find effect: ' + name);
        }
        const ctx = ctx_;
        if (!ctx.force && effect.chance && !map.rng.chance(effect.chance, 10000))
            return false;
        const grid = (ctx.grid = GWU__namespace.grid.alloc(map.width, map.height));
        let didSomething = false;
        const allHandlers = Object.values(handlers);
        for (let h of allHandlers) {
            if (await h.fire(effect, map, x, y, ctx)) {
                didSomething = true;
            }
        }
        // do the next effect - if applicable
        if (effect.next &&
            (didSomething || effect.flags & Effect.E_NEXT_ALWAYS) &&
            !GWU__namespace.data.gameHasEnded) {
            const nextInfo = typeof effect.next === 'string' ? from$1(effect.next) : effect.next;
            if (effect.flags & Effect.E_NEXT_EVERYWHERE) {
                await grid.forEachAsync(async (v, i, j) => {
                    if (!v)
                        return;
                    didSomething =
                        (await fire(nextInfo, map, i, j, ctx)) || didSomething;
                });
            }
            else {
                didSomething =
                    (await fire(nextInfo, map, x, y, ctx)) || didSomething;
            }
        }
        // bookkeeping
        if (didSomething &&
            map.isVisible(x, y) &&
            !(effect.flags & Effect.E_NO_MARK_FIRED)) {
            effect.flags |= Effect.E_FIRED;
        }
        GWU__namespace.grid.free(grid);
        return didSomething;
    }
    function fireSync(effect, map, x, y, ctx_ = {}) {
        if (!effect)
            return false;
        if (typeof effect === 'string') {
            const name = effect;
            effect = from$1(name);
            if (!effect)
                throw new Error('Failed to find effect: ' + name);
        }
        const ctx = ctx_;
        if (!ctx.force && effect.chance && !map.rng.chance(effect.chance, 10000))
            return false;
        const grid = (ctx.grid = GWU__namespace.grid.alloc(map.width, map.height));
        let didSomething = false;
        const allHandlers = Object.values(handlers);
        for (let h of allHandlers) {
            if (h.fireSync(effect, map, x, y, ctx)) {
                didSomething = true;
            }
        }
        // bookkeeping
        if (didSomething &&
            map.isVisible(x, y) &&
            !(effect.flags & Effect.E_NO_MARK_FIRED)) {
            effect.flags |= Effect.E_FIRED;
        }
        // do the next effect - if applicable
        if (effect.next &&
            (didSomething || effect.flags & Effect.E_NEXT_ALWAYS) &&
            !GWU__namespace.data.gameHasEnded) {
            const nextInfo = typeof effect.next === 'string' ? from$1(effect.next) : effect.next;
            if (effect.flags & Effect.E_NEXT_EVERYWHERE) {
                grid.forEach(async (v, i, j) => {
                    if (!v)
                        return;
                    fireSync(nextInfo, map, i, j, ctx);
                });
            }
            else {
                fireSync(nextInfo, map, x, y, ctx);
            }
        }
        GWU__namespace.grid.free(grid);
        return didSomething;
    }

    //////////////////////////////////////////////
    // EMIT
    class EmitEffect {
        make(src, dest) {
            if (!src.emit)
                return true;
            if (typeof src.emit !== 'string') {
                throw new Error('emit effects must be string name to emit: { emit: "EVENT" }');
            }
            dest.emit = src.emit;
            return true;
        }
        async fire(config, _map, x, y, ctx) {
            if (config.emit) {
                await GWU__namespace.events.emit(config.emit, x, y, ctx);
                return true;
            }
            return false;
        }
        fireSync(config, _map, _x, _y, _ctx) {
            if (!config.emit)
                return false;
            throw new Error('Cannot use "emit" effects in build steps.');
        }
    }
    installHandler('emit', new EmitEffect());

    //////////////////////////////////////////////
    // FN
    class FnEffect {
        make(src, dest) {
            if (!src.fn)
                return true;
            if (typeof src.fn !== 'function') {
                throw new Error('fn effects must be functions.');
            }
            dest.fn = src.fn;
            return true;
        }
        async fire(config, map, x, y, ctx) {
            if (config.fn) {
                return await config.fn(config, map, x, y, ctx);
            }
            return false;
        }
        fireSync(config, map, x, y, ctx) {
            if (config.fn) {
                const result = config.fn(config, map, x, y, ctx);
                if (result === true || result === false) {
                    return result;
                }
                throw new Error('Cannot use async function effects in build steps.');
            }
            return false;
        }
    }
    installHandler('fn', new FnEffect());

    //////////////////////////////////////////////
    // MESSAGE
    class MessageEffect {
        make(src, dest) {
            if (!src.message)
                return true;
            if (typeof src.message !== 'string') {
                throw new Error('Emit must be configured with name of event to emit');
            }
            dest.message = src.message;
            return true;
        }
        async fire(config, map, x, y, ctx) {
            if (!config.message)
                return false;
            const fired = !!(config.flags & Effect.E_FIRED);
            if (config.message &&
                config.message.length &&
                !fired &&
                map.isVisible(x, y)) {
                GWU__namespace.message.addAt(x, y, config.message, ctx);
                return true;
            }
            return false;
        }
        fireSync(config, _map, _x, _y, _ctx) {
            if (!config.message)
                return false;
            throw new Error('Cannot use "message" effects in build steps.');
        }
    }
    installHandler('message', new MessageEffect());

    //////////////////////////////////////////////
    // ActivateMachine
    class ActivateMachineEffect {
        make(src, dest) {
            if (!src.activateMachine)
                return true;
            dest.activateMachine = true;
            return true;
        }
        async fire(config, map, x, y, ctx) {
            if (config.activateMachine) {
                const cell = map.cell(x, y);
                const machine = cell.machineId;
                if (!machine)
                    return false;
                return await map.activateMachine(machine, x, y, ctx);
            }
            return false;
        }
        fireSync(config, map, x, y, ctx) {
            if (config.activateMachine) {
                const cell = map.cell(x, y);
                const machine = cell.machineId;
                if (!machine)
                    return false;
                return map.activateMachineSync(machine, x, y, ctx);
            }
            return false;
        }
    }
    installHandler('activateMachine', new ActivateMachineEffect());

    //////////////////////////////////////////////
    // EMIT
    class EffectEffect {
        make(src, dest) {
            if (!src.effect)
                return true;
            dest.effect = src.effect;
            return true;
        }
        async fire(config, map, x, y, ctx) {
            if (config.effect) {
                return await fire(config.effect, map, x, y, ctx);
            }
            return false;
        }
        fireSync(config, map, x, y, ctx) {
            if (config.effect) {
                return fireSync(config.effect, map, x, y, ctx);
            }
            return false;
        }
    }
    installHandler('effect', new EffectEffect());

    class SpawnEffect {
        make(src, dest) {
            var _a, _b, _c, _d, _e, _f, _g;
            if (!src.tile)
                return true; // no error
            let config = src.tile;
            if (typeof config === 'string') {
                const parts = config.split(/[,|]/).map((p) => p.trim());
                config = {
                    tile: parts[0],
                    grow: Number.parseInt(parts[1] || '0'),
                    decrement: Number.parseInt(parts[2] || '0'),
                };
            }
            const info = {
                grow: (_b = (_a = config.grow) !== null && _a !== void 0 ? _a : config.spread) !== null && _b !== void 0 ? _b : 0,
                decrement: (_c = config.decrement) !== null && _c !== void 0 ? _c : 0,
                flags: GWU__namespace.flag.from(Effect, config.flags),
                volume: (_d = config.volume) !== null && _d !== void 0 ? _d : 0,
                next: (_e = config.next) !== null && _e !== void 0 ? _e : null,
            };
            const id = (_f = config.tile) !== null && _f !== void 0 ? _f : config.id;
            if (typeof id === 'string') {
                info.tile = id;
            }
            else {
                throw new Error('Invalid tile spawn config: ' + id);
            }
            if (!info.tile) {
                throw new Error('Must have tile.');
            }
            const match = (_g = config.matchTile) !== null && _g !== void 0 ? _g : config.match;
            if (typeof match === 'string') {
                info.matchTile = match;
            }
            else if (match) {
                throw new Error('Invalid tile spawn match tile: ' + config.matchTile);
            }
            dest.tile = info;
            return true;
        }
        async fire(effect, map, x, y, ctx) {
            let didSomething = false;
            const spawned = this.fireSync(effect, map, x, y, ctx);
            if (spawned) {
                didSomething = true;
                // await spawnMap.forEachAsync( (v, x, y) => {
                //     if (!v) return;
                //     await map.applyInstantEffects(x, y);
                // });
                // if (applyEffects) {
                // if (PLAYER.xLoc == i && PLAYER.yLoc == j && !PLAYER.status.levitating && refresh) {
                // 	flavorMessage(tileFlavor(PLAYER.xLoc, PLAYER.yLoc));
                // }
                // if (cell.actor || cell.item) {
                // 	for(let t of cell.tiles()) {
                // 		await t.applyInstantEffects(map, i, j, cell);
                // 		if (Data.gameHasEnded) {
                // 			return true;
                // 		}
                // 	}
                // }
                // if (tile.flags & TileFlags.T_IS_FIRE) {
                // 	if (cell.flags & CellFlags.HAS_ITEM) {
                // 		theItem = map.itemAt(i, j);
                // 		if (theItem.flags & Flags.Item.ITEM_FLAMMABLE) {
                // 			await burnItem(theItem);
                // 		}
                // 	}
                // }
                // }
            }
            // GWU.grid.free(spawnMap);
            return didSomething;
        }
        fireSync(effect, map, x, y, ctx) {
            if (!effect.tile)
                return false; // did nothing
            const id = effect.tile.tile;
            const tile = tiles[id] || null;
            if (!tile) {
                throw new Error('Failed to find tile for effect: ' + id);
            }
            const abortIfBlocking = !!(effect.flags & Effect.E_ABORT_IF_BLOCKS_MAP);
            const isBlocking = !!(abortIfBlocking &&
                !(effect.flags & Effect.E_PERMIT_BLOCKING) &&
                (tile.blocksPathing() ||
                    effect.flags & Effect.E_TREAT_AS_BLOCKING));
            let didSomething = false;
            didSomething = computeSpawnMap(effect, map, x, y, ctx);
            if (!didSomething) {
                return false;
            }
            if (abortIfBlocking &&
                isBlocking &&
                this.mapDisruptedBy(map, ctx.grid)) {
                // GWU.grid.free(spawnMap);
                return false;
            }
            if (effect.flags & Effect.E_EVACUATE_CREATURES) {
                // first, evacuate creatures, so that they do not re-trigger the tile.
                if (evacuateCreatures(map, ctx.grid)) {
                    didSomething = true;
                }
            }
            if (effect.flags & Effect.E_EVACUATE_ITEMS) {
                // first, evacuate items, so that they do not re-trigger the tile.
                if (evacuateItems(map, ctx.grid)) {
                    didSomething = true;
                }
            }
            if (effect.flags & Effect.E_CLEAR_CELL) {
                // first, clear other tiles (not base/ground)
                if (clearCells(map, ctx.grid, effect.flags)) {
                    didSomething = true;
                }
            }
            const spawned = spawnTiles(effect.flags, ctx.grid, map, tile, effect.tile.volume, ctx.machine);
            return spawned;
        }
        mapDisruptedBy(map, blockingGrid, blockingToMapX = 0, blockingToMapY = 0) {
            const walkableGrid = GWU__namespace.grid.alloc(map.width, map.height);
            let disrupts = false;
            // Get all walkable locations after lake added
            GWU__namespace.xy.forRect(map.width, map.height, (i, j) => {
                const lakeX = i + blockingToMapX;
                const lakeY = j + blockingToMapY;
                if (blockingGrid.get(lakeX, lakeY)) {
                    if (map.cellInfo(i, j).isStairs()) {
                        disrupts = true;
                    }
                }
                else if (!map.cellInfo(i, j).blocksMove()) {
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
    }
    installHandler('tile', new SpawnEffect());
    // tick
    // Spawn
    function spawnTiles(flags, spawnMap, map, tile, volume = 0, machine) {
        let i, j;
        let accomplishedSomething;
        accomplishedSomething = false;
        const blockedByOtherLayers = !!(flags & Effect.E_BLOCKED_BY_OTHER_LAYERS);
        const superpriority = !!(flags & Effect.E_SUPERPRIORITY);
        const blockedByActors = !!(flags & Effect.E_BLOCKED_BY_ACTORS);
        const blockedByItems = !!(flags & Effect.E_BLOCKED_BY_ITEMS);
        // const applyEffects = ctx.refreshCell;
        volume = volume || 0; // (tile ? tile.volume : 0);
        for (i = 0; i < spawnMap.width; i++) {
            for (j = 0; j < spawnMap.height; j++) {
                if (!spawnMap[i][j])
                    continue; // If it's not flagged for building in the spawn map,
                // const isRoot = spawnMap[i][j] === 1;
                spawnMap[i][j] = 0; // so that the spawnmap reflects what actually got built
                const cell = map.cell(i, j);
                if (cell.hasTile(tile)) ;
                else if (map.setTile(i, j, tile, {
                    volume,
                    superpriority,
                    blockedByOtherLayers,
                    blockedByActors,
                    blockedByItems,
                    machine,
                })) {
                    // if the fill won't violate the priority of the most important terrain in this cell:
                    spawnMap[i][j] = 1; // so that the spawnmap reflects what actually got built
                    // map.redrawCell(cell);
                    // if (volume && cell.gas) {
                    //     cell.volume += (feat.volume || 0);
                    // }
                    cell.flags.cell |= Cell$1.EVENT_FIRED_THIS_TURN;
                    if (flags & Effect.E_PROTECTED) {
                        cell.flags.cell |= Cell$1.EVENT_PROTECTED;
                    }
                    accomplishedSomething = true;
                    // debug('- tile', i, j, 'tile=', tile.id);
                }
            }
        }
        if (accomplishedSomething) {
            map.setMapFlag(Map$1.MAP_CHANGED);
        }
        return accomplishedSomething;
    }
    // Spread
    function cellIsOk(effect, map, x, y, isStart) {
        if (!map.hasXY(x, y))
            return false;
        const cell = map.cell(x, y);
        if (cell.hasCellFlag(Cell$1.EVENT_PROTECTED))
            return false;
        if (cell.blocksEffects() && !effect.tile.matchTile && !isStart) {
            return false;
        }
        if (effect.flags & Effect.E_BUILD_IN_WALLS) {
            if (!map.cellInfo(x, y).isWall())
                return false;
        }
        else if (effect.flags & Effect.E_MUST_TOUCH_WALLS) {
            let ok = false;
            GWU__namespace.xy.eachNeighbor(x, y, (i, j) => {
                if (map.cellInfo(i, j).isWall()) {
                    ok = true;
                }
            }, true);
            if (!ok)
                return false;
        }
        else if (effect.flags & Effect.E_NO_TOUCH_WALLS) {
            let ok = true;
            if (map.cellInfo(x, y).isWall())
                return false; // or on wall
            GWU__namespace.xy.eachNeighbor(x, y, (i, j) => {
                if (map.cellInfo(i, j).isWall()) {
                    ok = false;
                }
            }, true);
            if (!ok)
                return false;
        }
        // if (ctx.bounds && !ctx.bounds.containsXY(x, y)) return false;
        if (effect.tile.matchTile &&
            !isStart &&
            !cell.hasTile(effect.tile.matchTile)) {
            return false;
        }
        return true;
    }
    function computeSpawnMap(effect, map, x, y, ctx) {
        let i, j, dir, t, x2, y2;
        let madeChange;
        // const bounds = ctx.bounds || null;
        // if (bounds) {
        //   // Activation.debug('- bounds', bounds);
        // }
        const config = effect.tile;
        let startProb = config.grow || 0;
        let probDec = config.decrement || 0;
        const spawnMap = ctx.grid;
        spawnMap.fill(0);
        if (!cellIsOk(effect, map, x, y, true)) {
            return false;
        }
        spawnMap[x][y] = t = 1; // incremented before anything else happens
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
    // export function spreadCircle(
    //     this: any,
    //     ctx: Effect.EffectCtx,
    //     spawnMap: GWU.grid.NumGrid
    // ) {
    //     const x = ctx.x;
    //     const y = ctx.y;
    //     let startProb = this.spread || 0;
    //     let probDec = this.decrement || 0;
    //     spawnMap.fill(0);
    //     spawnMap[x][y] = 1; // incremented before anything else happens
    //     let radius = 0;
    //     startProb = startProb || 100;
    //     if (startProb >= 100) {
    //         probDec = probDec || 100;
    //     }
    //     while (map.rng.chance(startProb)) {
    //         startProb -= probDec;
    //         ++radius;
    //     }
    //     // startProb = 100;
    //     // probDec = 0;
    //     spawnMap.updateCircle(x, y, radius, (_v, i, j) => {
    //         if (!cellIsOk(this, i, j, ctx)) return 0;
    //         // const dist = Math.floor(GWU.utils.distanceBetween(x, y, i, j));
    //         // const prob = startProb - dist * probDec;
    //         // if (!map.rng.chance(prob)) return 0;
    //         return 1;
    //     });
    //     // spawnMap[x][y] = 1;
    //     // if (!isOk(flags, x, y, ctx)) {
    //     //     spawnMap[x][y] = 0;
    //     // }
    //     return true;
    // }
    // export function spreadLine(
    //     this: any,
    //     ctx: Effect.EffectCtx,
    //     spawnMap: GWU.grid.NumGrid
    // ) {
    //     let x2, y2;
    //     let madeChange;
    //     const x = ctx.x;
    //     const y = ctx.y;
    //     let startProb = this.spread || 0;
    //     let probDec = this.decrement || 0;
    //     spawnMap.fill(0);
    //     spawnMap[x][y] = 1; // incremented before anything else happens
    //     if (startProb) {
    //         madeChange = true;
    //         if (startProb >= 100) {
    //             probDec = probDec || 100;
    //         }
    //         x2 = x;
    //         y2 = y;
    //         const dir = GWU.xy.DIRS[map.rng.number(4)];
    //         while (madeChange) {
    //             madeChange = false;
    //             x2 = x2 + dir[0];
    //             y2 = y2 + dir[1];
    //             if (
    //                 spawnMap.hasXY(x2, y2) &&
    //                 !spawnMap[x2][y2] &&
    //                 cellIsOk(this, x2, y2, ctx) &&
    //                 map.rng.chance(startProb)
    //             ) {
    //                 spawnMap[x2][y2] = 1;
    //                 madeChange = true;
    //                 startProb -= probDec;
    //             }
    //         }
    //     }
    //     if (!cellIsOk(this, x, y, ctx)) {
    //         spawnMap[x][y] = 0;
    //     }
    //     return true;
    // }
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
                    cell.clearDepth(Depth$1.GAS);
                }
                if (flags & Effect.E_CLEAR_LIQUID) {
                    cell.clearDepth(Depth$1.LIQUID);
                }
                if (flags & Effect.E_CLEAR_SURFACE) {
                    cell.clearDepth(Depth$1.SURFACE);
                }
                if (flags & Effect.E_CLEAR_GROUND) {
                    cell.clearDepth(Depth$1.GROUND);
                }
            }
            didSomething = true;
        });
        return didSomething;
    }
    function evacuateCreatures(map, blockingMap) {
        let i = 0, j = 0;
        let didSomething = false;
        for (i = 0; i < map.width; i++) {
            for (j = 0; j < map.height; j++) {
                if (!blockingMap[i][j])
                    continue;
                const cell = map.cell(i, j);
                if (!cell.hasActor())
                    continue;
                GWU__namespace.list.forEach(cell.actor, (obj) => {
                    if (!(obj instanceof Actor))
                        return;
                    const monst = obj;
                    const loc = map.rng.matchingLocNear(i, j, (x, y) => {
                        if (!map.hasXY(x, y))
                            return false;
                        if (blockingMap[x][y])
                            return false;
                        const c = map.cell(x, y);
                        return !monst.forbidsCell(c);
                    });
                    if (loc && loc[0] >= 0 && loc[1] >= 0) {
                        map.moveActor(loc[0], loc[1], monst);
                        // map.redrawXY(loc[0], loc[1]);
                        didSomething = true;
                    }
                });
            }
        }
        return didSomething;
    }
    function evacuateItems(map, blockingMap) {
        let didSomething = false;
        blockingMap.forEach((v, i, j) => {
            if (!v)
                return;
            const cell = map.cell(i, j);
            if (!cell.hasItem())
                return;
            GWU__namespace.list.forEach(cell.item, (obj) => {
                if (!(obj instanceof Item))
                    return;
                const item = obj;
                const loc = map.rng.matchingLocNear(i, j, (x, y) => {
                    if (!map.hasXY(x, y))
                        return false;
                    if (blockingMap[x][y])
                        return false;
                    const dest = map.cell(x, y);
                    return !item.forbidsCell(dest);
                });
                if (loc && loc[0] >= 0 && loc[1] >= 0) {
                    map.moveItem(loc[0], loc[1], item);
                    // map.redrawXY(loc[0], loc[1]);
                    didSomething = true;
                }
            });
        });
        return didSomething;
    }
    class ClearTileEffect {
        make(src, dest) {
            if (!src.clear)
                return true;
            let config = src.clear;
            let layers = 0;
            if (typeof config === 'string') {
                config = config.split(/[,|]/).map((t) => t.trim());
            }
            if (config === true) {
                layers = Depth$1.ALL_LAYERS;
            }
            else if (typeof config === 'number') {
                layers = config;
            }
            else if (Array.isArray(config)) {
                layers = config.reduce((out, v) => {
                    if (typeof v === 'number')
                        return out | v;
                    const depth = Depth$1[v] || 0;
                    return out | depth;
                }, 0);
            }
            else {
                throw new Error('clear effect must have number or string config.');
            }
            dest.clear = layers;
            return layers > 0;
        }
        fire(config, map, x, y, ctx) {
            return this.fireSync(config, map, x, y, ctx);
        }
        fireSync(config, map, x, y, _ctx) {
            if (!config.clear)
                return false;
            if (!map)
                return false;
            const cell = map.cell(x, y);
            return cell.clearDepth(config.clear);
        }
    }
    installHandler('clear', new ClearTileEffect());

    var index$3 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        reset: reset,
        resetAll: resetAll,
        effects: effects,
        install: install$1,
        installAll: installAll$1,
        handlers: handlers,
        installHandler: installHandler,
        make: make$2,
        from: from$1,
        fire: fire,
        fireSync: fireSync,
        EmitEffect: EmitEffect,
        FnEffect: FnEffect,
        MessageEffect: MessageEffect,
        ActivateMachineEffect: ActivateMachineEffect,
        EffectEffect: EffectEffect,
        SpawnEffect: SpawnEffect,
        spawnTiles: spawnTiles,
        computeSpawnMap: computeSpawnMap,
        clearCells: clearCells,
        evacuateCreatures: evacuateCreatures,
        evacuateItems: evacuateItems
    });

    class Tile {
        constructor(config) {
            var _a, _b, _c, _d;
            this.index = -1;
            this.dissipate = 20 * 100; // 0%
            this.effects = {};
            this.priority = 50;
            this.depth = 0;
            this.light = null;
            this.groundTile = null;
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
            if (config.effects) {
                Object.assign(this.effects, config.effects);
            }
            if (this.hasEffect('fire')) {
                this.flags.tile |= Tile$1.T_IS_FLAMMABLE;
            }
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
        hasEffect(name) {
            return name in this.effects;
        }
        getName(arg) {
            let opts = {};
            if (arg === true || arg === false) {
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
        getDescription() {
            return this.description || this.getName();
        }
        getFlavor() {
            return this.flavor || this.getName();
        }
    }
    function make$1(options) {
        var _a, _b, _c, _d, _e, _f;
        let base = { effects: {}, flags: {}, sprite: {}, priority: 50 };
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
        const effects = {};
        Object.assign(effects, base.effects);
        if (options.effects) {
            Object.entries(options.effects).forEach(([key, value]) => {
                if (value === null) {
                    delete effects[key];
                    return;
                }
                if (typeof value === 'string') {
                    effects[key] = value;
                    return;
                }
                effects[key] = make$2(value);
            });
        }
        const flags = {
            entity: GWU__namespace.flag.from(Entity$1, base.flags.entity, options.flags),
            tile: GWU__namespace.flag.from(Tile$1, base.flags.tile, options.flags),
            tileMech: GWU__namespace.flag.from(TileMech, base.flags.tileMech, options.flags),
        };
        let depth = base.depth || 0;
        if (options.depth) {
            if (typeof options.depth === 'string') {
                depth = Depth$1[options.depth];
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
            effects,
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
        };
        const tile = new Tile(config);
        return tile;
    }
    const tiles = {};
    const all = [];
    function get(id) {
        if (id instanceof Tile)
            return id;
        if (typeof id === 'string')
            return tiles[id] || null;
        return all[id] || null;
    }
    function install(id, ...args) {
        let options = args[0];
        if (args.length == 2) {
            options = args[1];
            options.extends = args[0];
        }
        options.id = id;
        const tile = make$1(options);
        tile.index = all.length;
        all.push(tile);
        tiles[id] = tile;
        return tile;
    }
    function installAll(tiles) {
        Object.entries(tiles).forEach(([id, config]) => {
            install(id, config);
        });
    }

    // These are the minimal set of tiles to make the diggers work
    install('NULL', {
        ch: '\u2205',
        fg: 'white',
        bg: 'black',
        flags: 'L_BLOCKS_MOVE',
        name: 'eerie nothingness',
        article: 'an',
        priority: 0,
    });
    install('FLOOR', {
        ch: '\u00b7',
        fg: [30, 30, 30, 20, 0, 0, 0],
        bg: [2, 2, 10, 0, 2, 2, 0],
        priority: 10,
        article: 'the',
    });
    install('DOOR', {
        ch: '+',
        fg: [100, 40, 40],
        bg: [30, 60, 60],
        priority: 30,
        flags: 'T_IS_DOOR, L_BLOCKS_EFFECTS, L_BLOCKS_ITEMS, L_BLOCKS_VISION, L_VISUALLY_DISTINCT',
        article: 'a',
        effects: {
            enter: { tile: 'DOOR_OPEN' },
            open: { tile: 'DOOR_OPEN_ALWAYS' },
        },
    });
    install('DOOR_OPEN', 'DOOR', {
        ch: "'",
        fg: [100, 40, 40],
        bg: [30, 60, 60],
        priority: 40,
        flags: '!L_BLOCKS_ITEMS, !L_BLOCKS_VISION',
        name: 'open door',
        article: 'an',
        effects: {
            tick: {
                chance: 100 * 100,
                tile: 'DOOR',
                flags: 'E_SUPERPRIORITY, E_ONLY_IF_EMPTY',
            },
            enter: null,
            open: null,
            close: { tile: 'DOOR', flags: 'E_SUPERPRIORITY, E_ONLY_IF_EMPTY' },
        },
    });
    install('DOOR_OPEN_ALWAYS', 'DOOR_OPEN', {
        effects: {
            tick: null,
            close: { tile: 'DOOR', flags: 'E_SUPERPRIORITY, E_ONLY_IF_EMPTY' },
        },
    });
    install('UP_STAIRS', {
        ch: '<',
        fg: [100, 50, 50],
        bg: [40, 20, 20],
        priority: 200,
        flags: 'T_UP_STAIRS, L_BLOCKED_BY_STAIRS, L_VISUALLY_DISTINCT, L_LIST_IN_SIDEBAR',
        name: 'upward staircase',
        article: 'an',
        effects: {
            player: { emit: 'UP_STAIRS' },
        },
    });
    install('DOWN_STAIRS', {
        ch: '>',
        fg: [100, 50, 50],
        bg: [40, 20, 20],
        priority: 200,
        flags: 'T_DOWN_STAIRS, L_BLOCKED_BY_STAIRS, L_VISUALLY_DISTINCT, L_LIST_IN_SIDEBAR',
        name: 'downward staircase',
        article: 'a',
        effects: {
            player: { emit: 'DOWN_STAIRS' },
        },
    });
    install('WALL', {
        ch: '#',
        fg: [7, 7, 7, 0, 3, 3, 3],
        bg: [40, 40, 40, 10, 10, 0, 5],
        priority: 100,
        flags: 'L_WALL_FLAGS',
        article: 'a',
        name: 'stone wall',
        description: 'A wall made from rough cut stone.',
        flavor: 'a rough stone wall',
    });
    install('IMPREGNABLE', {
        ch: '#',
        fg: [7, 7, 7, 0, 3, 3, 3],
        bg: [40, 40, 40, 10, 10, 0, 5],
        priority: 100,
        flags: 'L_WALL_FLAGS, IMPREGNABLE',
        article: 'a',
        name: 'impregnable wall',
        description: 'A wall made from very hard stone.',
        flavor: 'an impregnable wall',
    });
    install('LAKE', {
        ch: '~',
        fg: [5, 8, 20, 10, 0, 4, 15, true],
        bg: [10, 15, 41, 6, 5, 5, 5, true],
        priority: 50,
        flags: 'T_DEEP_WATER',
        name: 'deep water',
        article: 'the',
    });
    install('SHALLOW', {
        ch: '\u00b7',
        fg: [5, 8, 10, 10, 0, 4, 15, true],
        bg: [10, 30, 30, 6, 0, 10, 10, true],
        priority: 20,
        name: 'shallow water',
        article: 'the',
        depth: 'SURFACE', // 'LIQUID'?
    });
    install('BRIDGE', {
        ch: '=',
        fg: [100, 40, 40],
        priority: 40,
        depth: 'SURFACE',
        flags: 'T_BRIDGE, L_VISUALLY_DISTINCT',
        article: 'a',
        groundTile: 'LAKE',
    });

    const flags = { Tile: Tile$1, TileMech };

    var index$2 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        flags: flags,
        Tile: Tile,
        make: make$1,
        tiles: tiles,
        all: all,
        get: get,
        install: install,
        installAll: installAll
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
        setTile(_x, _y, _tile) {
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
        setTile(x, y, tile, opts = {}) {
            const cell = this.map.cell(x, y);
            const current = cell.depthTile(tile.depth) || tiles.NULL;
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
            if (cell.blocksLayer(tile.depth))
                return false;
            if (opts.blockedByItems && cell.hasItem())
                return false;
            if (opts.blockedByActors && cell.hasActor())
                return false;
            if (opts.blockedByOtherLayers && cell.highestPriority() > tile.priority)
                return false;
            // TODO - Are we blocked by other layer (L_BLOCKS_SURFACE on an already present tile)?
            if (tile.depth > Depth$1.GROUND && tile.groundTile) {
                const ground = cell.depthTile(Depth$1.GROUND);
                if (!ground || ground === tiles.NULL) {
                    this.setTile(x, y, get(tile.groundTile));
                }
            }
            // if nothing changed... return false
            if (!cell.setTile(tile))
                return false;
            if (tile.hasEntityFlag(Entity$1.L_BLOCKS_SURFACE)) {
                cell.clearDepth(Depth$1.SURFACE);
            }
            if (opts.machine) {
                cell.machineId = opts.machine;
            }
            if (current.light !== tile.light) {
                this.map.light.glowLightChanged = true;
            }
            if (tile.hasTileFlag(Tile$1.T_IS_FIRE)) {
                cell.setCellFlag(Cell$1.CAUGHT_FIRE_THIS_TURN);
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
        clearTile(x, y) {
            const cell = this.map.cell(x, y);
            return cell.clearDepth(this.depth);
        }
        async tick(_dt) {
            // Run any tick effects
            // Bookkeeping for fire, pressure plates and key-activated tiles.
            for (let x = 0; x < this.map.width; ++x) {
                for (let y = 0; y < this.map.height; ++y) {
                    const cell = this.map.cell(x, y);
                    if (!cell.hasCellFlag(Cell$1.HAS_ANY_ACTOR | Cell$1.HAS_ITEM) &&
                        cell.hasCellFlag(Cell$1.PRESSURE_PLATE_DEPRESSED)) {
                        cell.clearCellFlag(Cell$1.PRESSURE_PLATE_DEPRESSED);
                    }
                    if (cell.hasEffect('noKey') && !this.map.hasKey(x, y)) {
                        await cell.activate('noKey', this.map, x, y);
                    }
                }
            }
            return true;
        }
        putAppearance(dest, x, y) {
            const cell = this.map.cell(x, y);
            const tile = cell.depthTile(this.depth);
            if (tile && tile !== tiles.NULL) {
                dest.drawSprite(tile.sprite);
            }
        }
    }

    class ActorLayer extends MapLayer {
        constructor(map, name = 'actor') {
            super(map, name);
        }
        async addActor(x, y, obj, _opts) {
            const actor = obj;
            if (actor.isDestroyed)
                return false;
            const cell = this.map.cell(x, y);
            if (actor.forbidsCell(cell))
                return false;
            if (!GWU__namespace.list.push(cell, 'actor', obj))
                return false;
            if (obj.isPlayer()) {
                cell.setCellFlag(Cell$1.HAS_PLAYER);
            }
            obj.x = x;
            obj.y = y;
            if (obj.key && obj.key.matches(x, y) && cell.hasEffect('key')) {
                await cell.activate('key', this.map, x, y);
            }
            return true;
        }
        forceActor(x, y, actor, _opts) {
            if (actor.isDestroyed)
                return false;
            const cell = this.map.cell(x, y);
            if (!GWU__namespace.list.push(cell, 'actor', actor))
                return false;
            if (actor.isPlayer()) {
                cell.setCellFlag(Cell$1.HAS_PLAYER);
            }
            actor.x = x;
            actor.y = y;
            return true;
        }
        async removeActor(obj) {
            const x = obj.x;
            const y = obj.y;
            const cell = this.map.cell(x, y);
            if (!GWU__namespace.list.remove(cell, 'actor', obj))
                return false;
            if (obj.isPlayer()) {
                cell.clearCellFlag(Cell$1.HAS_PLAYER);
            }
            if (obj.key && obj.key.matches(x, y) && cell.hasEffect('nokey')) {
                await cell.activate('key', this.map, x, y);
            }
            return true;
        }
        putAppearance(dest, x, y) {
            const cell = this.map.cell(x, y);
            if (!cell.actor)
                return;
            dest.drawSprite(cell.actor.sprite);
        }
    }

    class ItemLayer extends MapLayer {
        constructor(map, name = 'item') {
            super(map, name);
        }
        async addItem(x, y, obj, _opts) {
            const item = obj;
            if (item.isDestroyed)
                return false;
            const cell = this.map.cell(x, y);
            if (item.forbidsCell(cell))
                return false;
            if (obj.key && obj.key.matches(x, y) && cell.hasEffect('key')) {
                await cell.activate('key', this.map, x, y);
                if (obj.key.disposable) {
                    obj.destroy();
                    return true; // ??? didSomething?
                }
            }
            if (!GWU__namespace.list.push(cell, 'item', obj))
                return false;
            obj.x = x;
            obj.y = y;
            obj.depth = this.depth;
            return true;
        }
        forceItem(x, y, obj, _opts) {
            const cell = this.map.cell(x, y);
            if (!GWU__namespace.list.push(cell, 'item', obj))
                return false;
            obj.x = x;
            obj.y = y;
            obj.depth = this.depth;
            return true;
        }
        async removeItem(obj) {
            const x = obj.x;
            const y = obj.y;
            const cell = this.map.cell(x, y);
            if (!GWU__namespace.list.remove(cell, 'item', obj))
                return false;
            if (obj.key && obj.key.matches(x, y) && cell.hasEffect('nokey')) {
                await cell.activate('nokey', this.map, x, y);
            }
            return true;
        }
        putAppearance(dest, x, y) {
            const cell = this.map.cell(x, y);
            if (!cell.item)
                return;
            dest.drawSprite(cell.item.sprite);
        }
    }

    class GasLayer extends TileLayer {
        constructor(map, name = 'gas') {
            super(map, name);
            this.volume = GWU__namespace.grid.alloc(map.width, map.height, 0);
        }
        clear() {
            this.volume.fill(0);
        }
        setTile(x, y, tile, opts = {}) {
            if (!opts.volume)
                return false;
            const cell = this.map.cell(x, y);
            if (cell.depthTile(tile.depth) === tile) {
                this.volume[x][y] += opts.volume;
                return true;
            }
            if (!super.setTile(x, y, tile, opts)) {
                return false;
            }
            this.volume[x][y] = opts.volume;
            this.changed = true;
            return true;
        }
        clearTile(x, y) {
            const cell = this.map.cell(x, y);
            if (cell.clearDepth(this.depth)) {
                this.volume[x][y] = 0;
                return true;
            }
            return false;
        }
        copy(other) {
            this.volume.copy(other.volume);
            this.changed = other.changed;
        }
        async tick(_dt) {
            if (!this.changed)
                return false;
            this.changed = false;
            const startingVolume = this.volume;
            this.volume = GWU__namespace.grid.alloc(this.map.width, this.map.height);
            // dissipate the gas...
            this.dissipate(startingVolume);
            // spread the gas...
            this.spread(startingVolume);
            GWU__namespace.grid.free(startingVolume);
            return true;
        }
        dissipate(volume) {
            volume.update((v, x, y) => {
                if (!v)
                    return 0;
                const tile = this.map.cell(x, y).depthTile(this.depth);
                if (tile && tile.dissipate) {
                    let d = Math.max(0.5, (v * tile.dissipate) / 10000); // 1000 = 10%
                    v = Math.max(0, v - d);
                }
                if (v) {
                    this.changed = true;
                }
                else {
                    this.clearTile(x, y);
                }
                return v;
            });
        }
        calcOpacity(volume) {
            return Math.floor(Math.min(volume, 10) * 10);
        }
        updateCellVolume(x, y, startingVolume) {
            let total = 0;
            let count = 0;
            let highestVolume = 0;
            const cell = this.map.cell(x, y);
            let startingTile = cell.depthTile(this.depth);
            let highestTile = startingTile;
            if (cell.hasEntityFlag(Entity$1.L_BLOCKS_GAS)) {
                this.volume[x][y] = 0;
                if (startingVolume[x][y]) {
                    this.clearTile(x, y);
                }
                return;
            }
            for (let i = Math.max(0, x - 1); i < Math.min(x + 2, startingVolume.width); ++i) {
                for (let j = Math.max(0, y - 1); j < Math.min(y + 2, startingVolume.height); ++j) {
                    const v = startingVolume[i][j];
                    if (!cell.hasEntityFlag(Entity$1.L_BLOCKS_GAS)) {
                        ++count;
                        if (v > highestVolume) {
                            highestVolume = v;
                            highestTile = this.map.cell(i, j).depthTile(this.depth);
                        }
                    }
                    total += v;
                }
            }
            const v = Math.floor((total * 10) / count) / 10;
            this.volume[x][y] = v;
            if (v > 0 && highestTile) {
                if (!startingTile || startingTile !== highestTile) {
                    cell.setTile(highestTile);
                }
            }
            if (v > 0) {
                cell.needsRedraw = true;
            }
        }
        spread(startingVolume) {
            for (let x = 0; x < startingVolume.width; ++x) {
                for (let y = 0; y < startingVolume.height; ++y) {
                    this.updateCellVolume(x, y, startingVolume);
                }
            }
        }
        putAppearance(dest, x, y) {
            const volume = this.volume[x][y];
            if (!volume)
                return;
            const cell = this.map.cell(x, y);
            const tile = cell.depthTile(this.depth);
            if (tile) {
                const opacity = this.calcOpacity(volume);
                dest.drawSprite(tile.sprite, opacity);
            }
        }
    }

    const Depth = Depth$1;
    const ObjectFlags = Entity$1;
    const TileFlags = Tile$1;
    const TileMechFlags = TileMech;
    const CellFlags = Cell$1;
    class FireLayer extends TileLayer {
        constructor(map, name = 'tile') {
            super(map, name);
        }
        async tick(_dt) {
            // Run any tick effects
            // Bookkeeping for fire
            for (let x = 0; x < this.map.width; ++x) {
                for (let y = 0; y < this.map.height; ++y) {
                    const cell = this.map.cell(x, y);
                    cell.clearCellFlag(CellFlags.CAUGHT_FIRE_THIS_TURN);
                }
            }
            // now spread the fire...
            for (let x = 0; x < this.map.width; ++x) {
                for (let y = 0; y < this.map.height; ++y) {
                    const cell = this.map.cell(x, y);
                    if (cell.hasTileFlag(TileFlags.T_IS_FIRE) &&
                        !(cell.flags.cell & CellFlags.CAUGHT_FIRE_THIS_TURN)) {
                        await this.exposeToFire(x, y, false);
                        for (let d = 0; d < 4; ++d) {
                            const dir = GWU__namespace.xy.DIRS[d];
                            await this.exposeToFire(x + dir[0], y + dir[1]);
                        }
                    }
                }
            }
            return true;
        }
        async exposeToFire(x, y, alwaysIgnite = false) {
            let ignitionChance = 0, bestExtinguishingPriority = 0, explosiveNeighborCount = 0;
            let fireIgnited = false, explosivePromotion = false;
            const cell = this.map.cell(x, y);
            if (!cell.hasTileFlag(TileFlags.T_IS_FLAMMABLE)) {
                return false;
            }
            // Pick the extinguishing layer with the best priority.
            cell.eachTile((tile) => {
                if (tile.hasTileFlag(TileFlags.T_EXTINGUISHES_FIRE) &&
                    tile.priority > bestExtinguishingPriority) {
                    bestExtinguishingPriority = tile.priority;
                }
            });
            // Pick the fire type of the most flammable layer that is either gas or equal-or-better priority than the best extinguishing layer.
            cell.eachTile((tile) => {
                if (tile.flags.tile & TileFlags.T_IS_FLAMMABLE &&
                    (tile.depth === Depth.GAS ||
                        tile.priority >= bestExtinguishingPriority)) {
                    const effect = from$1(tile.effects.fire);
                    if (effect && effect.chance > ignitionChance) {
                        ignitionChance = effect.chance;
                    }
                }
            });
            if (alwaysIgnite ||
                (ignitionChance && this.map.rng.chance(ignitionChance, 10000))) {
                // If it ignites...
                fireIgnited = true;
                // Count explosive neighbors.
                if (cell.hasTileMechFlag(TileMechFlags.TM_EXPLOSIVE_PROMOTE)) {
                    GWU__namespace.xy.eachNeighbor(x, y, (x0, y0) => {
                        const n = this.map.cell(x0, y0);
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
                if (explosivePromotion && cell.hasEffect('explode')) {
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
                await cell.activate(event, this.map, x, y, {
                    force: true,
                });
                cell.needsRedraw = true;
            }
            return fireIgnited;
        }
    }

    var index$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        MapLayer: MapLayer,
        TileLayer: TileLayer,
        ActorLayer: ActorLayer,
        ItemLayer: ItemLayer,
        GasLayer: GasLayer,
        FireLayer: FireLayer
    });

    class CellObjects {
        constructor(cell) {
            this.cell = cell;
        }
        eachItem(cb) {
            let object = this.cell._item;
            while (object) {
                cb(object);
                object = object.next;
            }
        }
        eachActor(cb) {
            let object = this.cell._actor;
            while (object) {
                cb(object);
                object = object.next;
            }
        }
        forEach(cb) {
            this.eachItem(cb);
            this.eachActor(cb);
        }
        some(cb) {
            let object = this.cell._item;
            while (object) {
                if (cb(object))
                    return true;
                object = object.next;
            }
            object = this.cell._actor;
            while (object) {
                if (cb(object))
                    return true;
                object = object.next;
            }
            return false;
        }
        reduce(cb, start) {
            let object = this.cell._item;
            while (object) {
                if (start === undefined) {
                    start = object;
                }
                else {
                    start = cb(start, object);
                }
                object = object.next;
            }
            object = this.cell._actor;
            while (object) {
                if (start === undefined) {
                    start = object;
                }
                else {
                    start = cb(start, object);
                }
                object = object.next;
            }
            return start;
        }
    }
    class Cell {
        constructor(groundTile) {
            this.chokeCount = 0;
            this.machineId = 0;
            // keyId = 0;
            // gasVolume: number = 0;
            // liquidVolume: number = 0;
            this._actor = null;
            this._item = null;
            this._objects = new CellObjects(this);
            this.flags = { cell: 0 };
            this.tiles = [tiles.NULL];
            if (groundTile) {
                const tile = get(groundTile);
                this.setTile(tile);
            }
        }
        copy(other) {
            Object.assign(this.flags, other.flags);
            this.chokeCount = other.chokeCount;
            this.tiles.length = other.tiles.length;
            for (let i = 0; i < this.tiles.length; ++i) {
                this.tiles[i] = other.tiles[i];
            }
            this._actor = other._actor;
            this._item = other._item;
            // this.keyId = other.keyId;
            this.machineId = other.machineId;
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
        hasEntityFlag(flag) {
            return (this.tiles.some((t) => t && t.flags.entity & flag) ||
                this._objects.some((o) => !!(o.flags.entity & flag)));
        }
        hasAllEntityFlags(flags) {
            return (this.entityFlags() & flags) == flags;
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
        cellFlags() {
            return this.flags.cell;
        }
        entityFlags() {
            return (this.tiles.reduce((out, t) => out | (t ? t.flags.entity : 0), 0) |
                this._objects.reduce((out, o) => out | o.flags.entity, 0));
        }
        tileFlags() {
            return this.tiles.reduce((out, t) => out | (t ? t.flags.tile : 0), 0);
        }
        tileMechFlags() {
            return this.tiles.reduce((out, t) => out | (t ? t.flags.tileMech : 0), 0);
        }
        itemFlags() {
            let flags = 0;
            this._objects.eachItem((i) => {
                flags |= i.flags.item;
            });
            return flags;
        }
        actorFlags() {
            let flags = 0;
            this._objects.eachActor((a) => {
                flags |= a.flags.actor;
            });
            return flags;
        }
        get needsRedraw() {
            return !!(this.flags.cell & Cell$1.NEEDS_REDRAW);
        }
        set needsRedraw(v) {
            if (v) {
                this.flags.cell |= Cell$1.NEEDS_REDRAW;
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
                tile = get(tile);
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
            return (this.tiles.some((t) => t && t.blocksVision()) ||
                this._objects.some((o) => o.blocksVision()));
        }
        blocksPathing() {
            return (this.tiles.some((t) => t && t.blocksPathing()) ||
                this._objects.some((o) => o.blocksPathing()));
        }
        blocksMove() {
            return (this.tiles.some((t) => t && t.blocksMove()) ||
                this._objects.some((o) => o.blocksMove()));
        }
        blocksEffects() {
            return (this.tiles.some((t) => t && t.blocksEffects()) ||
                this._objects.some((o) => o.blocksEffects()));
        }
        blocksLayer(depth) {
            return this.tiles.some((t) => t &&
                !!(t.flags.tile & flags.Tile.T_BLOCKS_OTHER_LAYERS) &&
                t.depth != depth);
        }
        // Tests
        isEmpty() {
            return (this.tiles.every((t) => !t || t === tiles.NULL) &&
                this._actor == null &&
                this._item == null);
        }
        isPassable() {
            return !this.blocksMove();
        }
        isWall() {
            return this.hasAllEntityFlags(Entity$1.L_WALL_FLAGS);
        }
        isStairs() {
            return this.hasTileFlag(Tile$1.T_HAS_STAIRS);
        }
        isGateSite() {
            return this.hasCellFlag(Cell$1.IS_GATE_SITE);
        }
        // @returns - whether or not the change results in a change to the cell tiles.
        //          - If there is a change to cell lighting, the cell will have the
        //          - LIGHT_CHANGED flag set.
        setTile(tile) {
            if (!(tile instanceof Tile)) {
                tile = get(tile);
                if (!tile)
                    return false;
            }
            const current = this.tiles[tile.depth] || tiles.NULL;
            if (current === tile)
                return false;
            this.tiles[tile.depth] = tile;
            this.needsRedraw = true;
            if (current.light !== tile.light) {
                this.setCellFlag(Cell$1.LIGHT_CHANGED);
            }
            if (current.blocksVision() !== tile.blocksVision()) {
                this.setCellFlag(Cell$1.FOV_CHANGED);
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
        }
        clear(tile) {
            this.tiles = [tiles.NULL];
            this.flags.cell = 0;
            this.needsRedraw = true;
            this.chokeCount = 0;
            this.machineId = 0;
            this._actor = null;
            this._item = null;
            if (tile) {
                this.setTile(tile);
            }
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
        async activate(event, map, x, y, ctx = {}) {
            ctx.cell = this;
            let didSomething = false;
            if (ctx.depth !== undefined) {
                const tile = (ctx.tile = this.depthTile(ctx.depth));
                if (tile && tile.effects) {
                    const ev = tile.effects[event];
                    didSomething = await this._activate(ev, map, x, y, ctx);
                }
            }
            else {
                // console.log('fire event - %s', event);
                for (ctx.tile of this.tiles) {
                    if (!ctx.tile || !ctx.tile.effects)
                        continue;
                    const ev = ctx.tile.effects[event];
                    // console.log(' - ', ev);
                    if (await this._activate(ev, map, x, y, ctx)) {
                        didSomething = true;
                        break;
                    }
                    // }
                }
            }
            return didSomething;
        }
        build(event, map, x, y, ctx = {}) {
            ctx.cell = this;
            let didSomething = false;
            if (ctx.depth !== undefined) {
                const tile = (ctx.tile = this.depthTile(ctx.depth));
                if (tile && tile.effects) {
                    const ev = tile.effects[event];
                    didSomething = this._build(ev, map, x, y, ctx);
                }
            }
            else {
                // console.log('fire event - %s', event);
                for (ctx.tile of this.tiles) {
                    if (!ctx.tile || !ctx.tile.effects)
                        continue;
                    const ev = ctx.tile.effects[event];
                    // console.log(' - ', ev);
                    if (this._build(ev, map, x, y, ctx)) {
                        didSomething = true;
                        break;
                    }
                    // }
                }
            }
            return didSomething;
        }
        async _activate(effect, map, x, y, ctx) {
            if (typeof effect === 'string') {
                effect = effects[effect];
            }
            let didSomething = false;
            if (effect) {
                // console.log(' - spawn event @%d,%d - %s', x, y, name);
                didSomething = await fire(effect, map, x, y, ctx);
                // cell.debug(" - spawned");
            }
            return didSomething;
        }
        _build(effect, map, x, y, ctx) {
            if (typeof effect === 'string') {
                effect = effects[effect];
            }
            let didSomething = false;
            if (effect) {
                // console.log(' - spawn event @%d,%d - %s', x, y, name);
                didSomething = fireSync(effect, map, x, y, ctx);
                // cell.debug(" - spawned");
            }
            return didSomething;
        }
        hasEffect(name) {
            for (let tile of this.tiles) {
                if (tile && tile.hasEffect(name))
                    return true;
            }
            return false;
        }
        // // Items
        hasItem() {
            return this.hasCellFlag(Cell$1.HAS_ITEM);
        }
        get item() {
            return this._item;
        }
        set item(val) {
            this._item = val;
            if (val) {
                this.setCellFlag(Cell$1.HAS_ITEM);
            }
            else {
                this.clearCellFlag(Cell$1.HAS_ITEM);
            }
            this.needsRedraw = true;
        }
        // // Actors
        hasActor() {
            return this.hasCellFlag(Cell$1.HAS_ACTOR);
        }
        hasPlayer() {
            return this.hasCellFlag(Cell$1.HAS_PLAYER);
        }
        get actor() {
            return this._actor;
        }
        set actor(val) {
            this._actor = val;
            if (val) {
                this.setCellFlag(Cell$1.HAS_ACTOR);
            }
            else {
                this.clearCellFlag(Cell$1.HAS_ACTOR);
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
            var _a, _b, _c, _d;
            if ((_b = (_a = this._actor) === null || _a === void 0 ? void 0 : _a.sprite) === null || _b === void 0 ? void 0 : _b.ch)
                return this._actor.sprite.ch;
            if ((_d = (_c = this._item) === null || _c === void 0 ? void 0 : _c.sprite) === null || _d === void 0 ? void 0 : _d.ch)
                return this._item.sprite.ch;
            return this.highestPriorityTile().sprite.ch || ' ';
        }
    }

    class CellMemory {
        constructor() {
            this.chokeCount = 0;
            this.machineId = 0;
            this.keyId = 0;
            this.flags = {
                cell: 0,
                item: 0,
                actor: 0,
                tile: 0,
                tileMech: 0,
                object: 0,
            };
            this.blocks = {
                vision: false,
                effects: false,
                move: false,
                pathing: false,
            };
            this._tile = tiles.NULL;
            this._item = null;
            this._actor = null;
            this._hasKey = false;
            this.snapshot = new GWU__namespace.sprite.Mixer();
        }
        clear() {
            this.snapshot.blackOut();
            this._item = null;
            this._actor = null;
            this._tile = tiles.NULL;
            this.flags.cell = 0;
            this.flags.object = 0;
            this.flags.tile = 0;
            this.flags.tileMech = 0;
            this.blocks.effects = false;
            this.blocks.move = false;
            this.blocks.pathing = false;
            this.blocks.vision = false;
            this.machineId = 0;
            this.chokeCount = 0;
        }
        store(cell) {
            this._item = null;
            if (cell.hasItem()) {
                this._item = cell.item;
            }
            this._actor = null;
            if (cell.hasActor()) {
                this._actor = cell.actor;
            }
            this._tile = cell.tile;
            this.flags.cell = cell.cellFlags();
            this.flags.tile = cell.tileFlags();
            this.flags.tileMech = cell.tileMechFlags();
            this.flags.object = cell.entityFlags();
            this.flags.item = cell.itemFlags();
            this.flags.actor = cell.actorFlags();
            this.blocks.effects = cell.blocksEffects();
            this.blocks.move = cell.blocksMove();
            this.blocks.pathing = cell.blocksPathing();
            this.blocks.vision = cell.blocksVision();
            this.chokeCount = cell.chokeCount;
            this.machineId = cell.machineId;
        }
        getSnapshot(dest) {
            dest.copy(this.snapshot);
        }
        putSnapshot(src) {
            this.snapshot.copy(src);
        }
        get needsRedraw() {
            return this.hasCellFlag(Cell$1.NEEDS_REDRAW);
        }
        hasCellFlag(flag) {
            return !!(this.flags.cell & flag);
        }
        hasTileFlag(flag) {
            return !!(this.flags.tile & flag);
        }
        hasAllTileFlags(flags) {
            return (this.flags.tile & flags) == flags;
        }
        hasEntityFlag(flag) {
            return !!(this.flags.object & flag);
        }
        hasAllEntityFlags(flags) {
            return (this.flags.object & flags) == flags;
        }
        hasTileMechFlag(flag) {
            return !!(this.flags.tileMech & flag);
        }
        cellFlags() {
            return this.flags.cell;
        }
        entityFlags() {
            return this.flags.object;
        }
        tileFlags() {
            return this.flags.tile;
        }
        tileMechFlags() {
            return this.flags.tileMech;
        }
        itemFlags() {
            return this.flags.item;
        }
        actorFlags() {
            return this.flags.actor;
        }
        blocksVision() {
            return this.blocks.vision;
        }
        blocksPathing() {
            return this.blocks.pathing;
        }
        blocksMove() {
            return this.blocks.move;
        }
        blocksEffects() {
            return this.blocks.effects;
        }
        isWall() {
            return this.blocksVision() && this.blocksMove();
        }
        isStairs() {
            return this.hasTileFlag(Tile$1.T_HAS_STAIRS);
        }
        get tile() {
            return this._tile;
        }
        hasTile(tile) {
            if (!(tile instanceof Tile)) {
                tile = get(tile);
            }
            return this._tile === tile;
        }
        hasItem() {
            return !!this._item;
        }
        get item() {
            return this._item;
        }
        hasActor() {
            return !!this._actor;
        }
        hasPlayer() {
            return !!(this.flags.cell & Cell$1.HAS_PLAYER);
        }
        get actor() {
            return this._actor;
        }
        getDescription() {
            throw new Error('Method not implemented.');
        }
        getFlavor() {
            throw new Error('Method not implemented.');
        }
        getName(_opts) {
            throw new Error('Method not implemented.');
        }
    }

    class Map {
        constructor(width, height, opts = {}) {
            this._seed = 0;
            this.rng = GWU__namespace.rng.random;
            this.width = width;
            this.height = height;
            this.flags = { map: 0 };
            this.layers = [];
            this.cells = GWU__namespace.grid.make(width, height, () => new Cell());
            this.memory = GWU__namespace.grid.make(width, height, () => new CellMemory());
            if (opts.seed) {
                this._seed = opts.seed;
                this.rng = GWU__namespace.rng.make(opts.seed);
            }
            this.light = new GWU__namespace.light.LightSystem(this, opts);
            this.fov = new GWU__namespace.fov.FovSystem(this, opts);
            this.properties = {};
            this.initLayers();
        }
        get seed() {
            return this._seed;
        }
        set seed(v) {
            this._seed = v;
            this.rng = GWU__namespace.rng.make(v);
        }
        cellInfo(x, y, useMemory = false) {
            if (useMemory)
                return this.memory[x][y];
            return this.cell(x, y);
        }
        // LAYERS
        initLayers() {
            this.addLayer(Depth$1.GROUND, new TileLayer(this, 'ground'));
            this.addLayer(Depth$1.SURFACE, new FireLayer(this, 'surface'));
            this.addLayer(Depth$1.GAS, new GasLayer(this, 'gas'));
            this.addLayer(Depth$1.ITEM, new ItemLayer(this, 'item'));
            this.addLayer(Depth$1.ACTOR, new ActorLayer(this, 'actor'));
        }
        addLayer(depth, layer) {
            if (typeof depth !== 'number') {
                depth = Depth$1[depth];
            }
            layer.depth = depth;
            this.layers[depth] = layer;
        }
        removeLayer(depth) {
            if (typeof depth !== 'number') {
                depth = Depth$1[depth];
            }
            if (!depth)
                throw new Error('Cannot remove layer with depth=0.');
            delete this.layers[depth];
        }
        getLayer(depth) {
            if (typeof depth !== 'number') {
                depth = Depth$1[depth];
            }
            return this.layers[depth] || null;
        }
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
        // DRAW
        drawInto(dest, opts = {}) {
            const buffer = dest instanceof GWU__namespace.canvas.Canvas ? dest.buffer : dest;
            if (typeof opts === 'boolean')
                opts = { force: opts };
            const mixer = new GWU__namespace.sprite.Mixer();
            for (let x = 0; x < buffer.width; ++x) {
                for (let y = 0; y < buffer.height; ++y) {
                    // const cell = this.cell(x, y);
                    // if (
                    //     cell.needsRedraw ||
                    //     this.light.lightChanged(x, y) ||
                    //     this.fov.fovChanged(x, y)
                    // ) {
                    this.getAppearanceAt(x, y, mixer);
                    buffer.drawSprite(x, y, mixer);
                    // }
                }
            }
        }
        // items
        itemAt(x, y) {
            return this.cell(x, y).item;
        }
        eachItem(cb) {
            this.cells.forEach((cell) => {
                GWU__namespace.list.forEach(cell.item, cb);
            });
        }
        async addItem(x, y, item) {
            if (!this.hasXY(x, y))
                return false;
            for (let layer of this.layers) {
                if (layer && (await layer.addItem(x, y, item))) {
                    return true;
                }
            }
            return false;
        }
        forceItem(x, y, item) {
            if (!this.hasXY(x, y))
                return false;
            for (let layer of this.layers) {
                if (layer && layer.forceItem(x, y, item)) {
                    return true;
                }
            }
            return false;
        }
        async removeItem(item) {
            const layer = this.layers[item.depth];
            return layer.removeItem(item);
        }
        async moveItem(x, y, item) {
            if (!this.hasXY(x, y))
                return false;
            const layer = this.layers[item.depth];
            if (!(await layer.removeItem(item)))
                return false;
            return this.addItem(x, y, item);
        }
        // Actors
        hasPlayer(x, y) {
            return this.cell(x, y).hasPlayer();
        }
        actorAt(x, y) {
            return this.cell(x, y).actor;
        }
        eachActor(cb) {
            this.cells.forEach((cell) => {
                GWU__namespace.list.forEach(cell.actor, cb);
            });
        }
        async addActor(x, y, actor) {
            if (!this.hasXY(x, y))
                return false;
            for (let layer of this.layers) {
                if (layer && (await layer.addActor(x, y, actor))) {
                    return true;
                }
            }
            return false;
        }
        forceActor(x, y, actor) {
            if (!this.hasXY(x, y))
                return false;
            for (let layer of this.layers) {
                if (layer && layer.forceActor(x, y, actor)) {
                    return true;
                }
            }
            return false;
        }
        async removeActor(actor) {
            const layer = this.layers[actor.depth];
            return layer.removeActor(actor);
        }
        async moveActor(x, y, actor) {
            if (!this.hasXY(x, y))
                return false;
            const layer = this.layers[actor.depth];
            if (!(await layer.removeActor(actor)))
                return false;
            return this.addActor(x, y, actor);
        }
        // Information
        isVisible(x, y) {
            return this.fov.isAnyKindOfVisible(x, y);
        }
        hasKey(x, y) {
            if (!this.hasXY(x, y))
                return false;
            const cell = this.cells[x][y];
            return cell._objects.some((e) => !!e.key && e.key.matches(x, y));
        }
        count(cb) {
            return this.cells.count((cell, x, y) => cb(cell, x, y, this));
        }
        dump(fmt, log = console.log) {
            this.cells.dump(fmt || ((c) => c.dump()), log);
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
        setCellFlag(x, y, flag) {
            this.cell(x, y).setCellFlag(flag);
        }
        clearCellFlag(x, y, flag) {
            this.cell(x, y).clearCellFlag(flag);
        }
        clear() {
            this.light.glowLightChanged = true;
            this.fov.needsUpdate = true;
            this.layers.forEach((l) => l.clear());
        }
        clearCell(x, y, tile) {
            const cell = this.cell(x, y);
            cell.clear(tile);
        }
        // Skips all the logic checks and just forces a clean cell with the given tile
        fill(tile, boundary) {
            tile = get(tile);
            boundary = get(boundary || tile);
            let i, j;
            for (i = 0; i < this.width; ++i) {
                for (j = 0; j < this.height; ++j) {
                    const cell = this.cell(i, j);
                    cell.clear(this.isBoundaryXY(i, j) ? boundary : tile);
                }
            }
        }
        hasTile(x, y, tile, useMemory = false) {
            return this.cellInfo(x, y, useMemory).hasTile(tile);
        }
        forceTile(x, y, tile) {
            return this.setTile(x, y, tile, { superpriority: true });
        }
        setTile(x, y, tile, opts) {
            if (!(tile instanceof Tile)) {
                tile = get(tile);
                if (!tile)
                    return false;
            }
            if (opts === true) {
                opts = { superpriority: true };
            }
            const depth = tile.depth || 0;
            const layer = this.layers[depth] || this.layers[0];
            if (!(layer instanceof TileLayer))
                return false;
            return layer.setTile(x, y, tile, opts);
        }
        clearTiles(x, y, tile) {
            const cell = this.cell(x, y);
            cell.clearTiles(tile);
        }
        async tick(dt) {
            let didSomething = await this.fireAll('tick');
            for (let layer of this.layers) {
                if (layer && (await layer.tick(dt))) {
                    didSomething = true;
                }
            }
            return didSomething;
        }
        copy(src) {
            if (this.constructor !== src.constructor)
                throw new Error('Maps must be same type to copy.');
            if (this.width !== src.width || this.height !== src.height)
                throw new Error('Maps must be same size to copy');
            this.cells.forEach((c, x, y) => {
                c.copy(src.cells[x][y]);
            });
            this.layers.forEach((l, depth) => {
                l.copy(src.layers[depth]);
            });
            this.flags.map = src.flags.map;
            this.fov.needsUpdate = true;
            this.light.copy(src.light);
            this.rng = src.rng;
            Object.assign(this.properties, src.properties);
        }
        clone() {
            // @ts-ignore
            const other = new this.constructor(this.width, this.height);
            other.copy(this);
            return other;
        }
        async fire(event, x, y, ctx = {}) {
            const cell = this.cell(x, y);
            return cell.activate(event, this, x, y, ctx);
        }
        fireSync(event, x, y, ctx = {}) {
            const cell = this.cell(x, y);
            return cell.build(event, this, x, y, ctx);
        }
        async fireAll(event, ctx = {}) {
            let didSomething = false;
            const willFire = GWU__namespace.grid.alloc(this.width, this.height);
            // Figure out which tiles will fire - before we change everything...
            this.cells.forEach((cell, x, y) => {
                cell.clearCellFlag(Cell$1.EVENT_FIRED_THIS_TURN | Cell$1.EVENT_PROTECTED);
                cell.eachTile((tile) => {
                    const ev = tile.effects[event];
                    if (!ev)
                        return;
                    const effect = from$1(ev);
                    if (!effect)
                        return;
                    let promoteChance = 0;
                    // < 0 means try to fire my neighbors...
                    if (effect.chance < 0) {
                        promoteChance = 0;
                        GWU__namespace.xy.eachNeighbor(x, y, (i, j) => {
                            const n = this.cell(i, j);
                            if (!n.hasEntityFlag(Entity$1.L_BLOCKS_EFFECTS) &&
                                n.depthTile(tile.depth) !=
                                    cell.depthTile(tile.depth) &&
                                !n.hasCellFlag(Cell$1.CAUGHT_FIRE_THIS_TURN)) {
                                // TODO - Should this break from the loop after doing this once or keep going?
                                promoteChance += -1 * effect.chance;
                            }
                        }, true);
                    }
                    else {
                        promoteChance = effect.chance || 100 * 100; // 100%
                    }
                    if (!cell.hasCellFlag(Cell$1.CAUGHT_FIRE_THIS_TURN) &&
                        this.rng.chance(promoteChance, 10000)) {
                        willFire[x][y] |= GWU__namespace.flag.fl(tile.depth);
                        // cell.flags.cellMech |= Cell.MechFlags.EVENT_FIRED_THIS_TURN;
                    }
                });
            });
            // Then activate them - so that we don't activate the next generation as part of the forEach
            ctx.force = true;
            await willFire.forEachAsync(async (w, x, y) => {
                if (!w)
                    return;
                const cell = this.cell(x, y);
                if (cell.hasCellFlag(Cell$1.EVENT_FIRED_THIS_TURN))
                    return;
                for (let depth = 0; depth <= Depth$1.GAS; ++depth) {
                    if (w & GWU__namespace.flag.fl(depth)) {
                        await cell.activate(event, this, x, y, {
                            force: true,
                            depth,
                        });
                    }
                }
            });
            GWU__namespace.grid.free(willFire);
            return didSomething;
        }
        fireAllSync(event, ctx = {}) {
            let didSomething = false;
            const willFire = GWU__namespace.grid.alloc(this.width, this.height);
            // Figure out which tiles will fire - before we change everything...
            this.cells.forEach((cell, x, y) => {
                cell.clearCellFlag(Cell$1.EVENT_FIRED_THIS_TURN | Cell$1.EVENT_PROTECTED);
                cell.eachTile((tile) => {
                    const ev = tile.effects[event];
                    if (!ev)
                        return;
                    const effect = from$1(ev);
                    if (!effect)
                        return;
                    let promoteChance = 0;
                    // < 0 means try to fire my neighbors...
                    if (effect.chance < 0) {
                        promoteChance = 0;
                        GWU__namespace.xy.eachNeighbor(x, y, (i, j) => {
                            const n = this.cell(i, j);
                            if (!n.hasEntityFlag(Entity$1.L_BLOCKS_EFFECTS) &&
                                n.depthTile(tile.depth) !=
                                    cell.depthTile(tile.depth) &&
                                !n.hasCellFlag(Cell$1.CAUGHT_FIRE_THIS_TURN)) {
                                // TODO - Should this break from the loop after doing this once or keep going?
                                promoteChance += -1 * effect.chance;
                            }
                        }, true);
                    }
                    else {
                        promoteChance = effect.chance || 100 * 100; // 100%
                    }
                    if (!cell.hasCellFlag(Cell$1.CAUGHT_FIRE_THIS_TURN) &&
                        this.rng.chance(promoteChance, 10000)) {
                        willFire[x][y] |= GWU__namespace.flag.fl(tile.depth);
                        // cell.flags.cellMech |= Cell.MechFlags.EVENT_FIRED_THIS_TURN;
                    }
                });
            });
            // Then activate them - so that we don't activate the next generation as part of the forEach
            ctx.force = true;
            willFire.forEach((w, x, y) => {
                if (!w)
                    return;
                const cell = this.cell(x, y);
                if (cell.hasCellFlag(Cell$1.EVENT_FIRED_THIS_TURN))
                    return;
                for (let depth = 0; depth <= Depth$1.GAS; ++depth) {
                    if (w & GWU__namespace.flag.fl(depth)) {
                        cell.activate(event, this, x, y, {
                            force: true,
                            depth,
                        });
                    }
                }
            });
            GWU__namespace.grid.free(willFire);
            return didSomething;
        }
        async activateMachine(machineId, originX, originY, ctx = {}) {
            let didSomething = false;
            ctx.originX = originX;
            ctx.originY = originY;
            for (let x = 0; x < this.width; ++x) {
                for (let y = 0; y < this.height; ++y) {
                    const cell = this.cells[x][y];
                    if (cell.machineId !== machineId)
                        continue;
                    if (cell.hasEffect('machine')) {
                        didSomething =
                            (await cell.activate('machine', this, x, y, ctx)) ||
                                didSomething;
                    }
                }
            }
            return didSomething;
        }
        activateMachineSync(machineId, originX, originY, ctx = {}) {
            let didSomething = false;
            ctx.originX = originX;
            ctx.originY = originY;
            for (let x = 0; x < this.width; ++x) {
                for (let y = 0; y < this.height; ++y) {
                    const cell = this.cells[x][y];
                    if (cell.machineId !== machineId)
                        continue;
                    if (cell.hasEffect('machine')) {
                        didSomething =
                            cell.build('machine', this, x, y, ctx) || didSomething;
                    }
                }
            }
            return didSomething;
        }
        getAppearanceAt(x, y, dest) {
            dest.blackOut();
            const cell = this.cell(x, y);
            const isVisible = this.fov.isAnyKindOfVisible(x, y);
            if (cell.needsRedraw && isVisible) {
                this.layers.forEach((layer) => layer.putAppearance(dest, x, y));
                if (dest.dances) {
                    cell.setCellFlag(Cell$1.COLORS_DANCE);
                }
                else {
                    cell.clearCellFlag(Cell$1.COLORS_DANCE);
                }
                dest.bake();
                this.memory[x][y].putSnapshot(dest);
                cell.needsRedraw = false;
            }
            else {
                this.memory[x][y].getSnapshot(dest);
            }
            if (isVisible) {
                const light = this.light.getLight(x, y);
                dest.multiply(light);
            }
            else if (this.fov.isRevealed(x, y)) {
                dest.scale(50);
            }
            else {
                dest.blackOut();
            }
            if (cell.hasEntityFlag(Entity$1.L_VISUALLY_DISTINCT)) {
                GWU__namespace.color.separate(dest.fg, dest.bg);
            }
        }
        // // LightSystemSite
        hasActor(x, y) {
            return this.cell(x, y).hasActor();
        }
        eachGlowLight(cb) {
            this.cells.forEach((cell, x, y) => {
                cell.eachGlowLight((light) => cb(x, y, light));
                cell.clearCellFlag(Cell$1.LIGHT_CHANGED);
            });
        }
        eachDynamicLight(_cb) { }
        // FOV System Site
        eachViewport(_cb) {
            // TODO !!
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
        onCellRevealed(_x, _y) {
            // if (DATA.automationActive) {
            // if (cell.item) {
            //     const theItem: GW.types.ItemType = cell.item;
            //     if (
            //         theItem.hasObjectFlag(ObjectFlags.L_INTERRUPT_WHEN_SEEN)
            //     ) {
            //         GW.message.add(
            //             '§you§ §see§ ΩitemMessageColorΩ§item§∆.',
            //             {
            //                 item: theItem,
            //                 actor: DATA.player,
            //             }
            //         );
            //     }
            // }
            // if (
            //     !(this.fov.isMagicMapped(x, y)) &&
            //     this.site.hasObjectFlag(
            //         x,
            //         y,
            //         ObjectFlags.L_INTERRUPT_WHEN_SEEN
            //     )
            // ) {
            //     const tile = cell.tileWithLayerFlag(
            //         ObjectFlags.L_INTERRUPT_WHEN_SEEN
            //     );
            //     if (tile) {
            //         GW.message.add(
            //             '§you§ §see§ ΩbackgroundMessageColorΩ§item§∆.',
            //             {
            //                 actor: DATA.player,
            //                 item: tile.name,
            //             }
            //         );
            //     }
            // }
        }
        redrawCell(x, y, clearMemory) {
            if (clearMemory) {
                this.clearMemory(x, y);
            }
            this.cells[x][y].needsRedraw = true;
        }
        clearMemory(x, y) {
            this.memory[x][y].clear();
        }
        storeMemory(x, y) {
            const cell = this.cell(x, y);
            this.memory[x][y].store(cell);
        }
    }
    function make(w, h, opts = {}, boundary) {
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
        if (opts.tile) {
            map.fill(opts.tile, opts.boundary);
        }
        map.light.update();
        // if (!DATA.map) {
        //     DATA.map = map;
        // }
        return map;
    }
    function isString(value) {
        return typeof value === 'string';
    }
    function isStringArray(value) {
        return Array.isArray(value) && typeof value[0] === 'string';
    }
    function from(prefab, charToTile, opts = {}) {
        let height = 0;
        let width = 0;
        let map;
        if (isString(prefab)) {
            prefab = prefab.split('\n');
        }
        if (isStringArray(prefab)) {
            height = prefab.length;
            width = prefab.reduce((len, line) => Math.max(len, line.length), 0);
            map = make(width, height, opts);
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
            map = make(width, height, opts);
            prefab.forEach((v, x, y) => {
                const tile = charToTile[v] || 'FLOOR';
                map.setTile(x, y, tile);
            });
        }
        map.light.update();
        return map;
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
                                                map.cell(i2, j2).chokeCount = cellCount;
                                                map.cell(i2, j2).flags.cell &= ~Cell$1
                                                    .IS_GATE_SITE;
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
            this.layerVersion = [];
            this.lightVersion = 0;
            this.fovVersion = 0;
            this.free = [];
            this.map = map;
            this.cellVersion = GWU__namespace.grid.make(map.width, map.height);
            this.layerVersion = map.layers.map(() => 1);
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
            if (this.map.fov.changed) {
                this.fovVersion = this.version;
                this.map.fov.changed = false;
            }
            if (snap.version !== this.fovVersion) {
                snap.map.fov.copy(this.map.fov);
            }
            // layers
            this.map.layers.forEach((layer, index) => {
                const snapLayer = snap.map.layers[index];
                if (layer.changed) {
                    this.layerVersion[index] = this.version;
                }
                if (this.layerVersion[index] !== snap.version) {
                    snapLayer.copy(layer);
                }
            });
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
            if (snap.version < this.fovVersion || this.map.fov.changed) {
                this.map.fov.copy(snap.map.fov);
                this.fovVersion = snap.version;
            }
            // layers
            this.layerVersion.forEach((v, index) => {
                if (v < snap.version)
                    return;
                const destLayer = this.map.layers[index];
                if (v > snap.version || destLayer.changed) {
                    const srcLayer = snap.map.layers[index];
                    destLayer.copy(srcLayer);
                    this.layerVersion[index] = snap.version;
                }
            });
            this.version = snap.version;
        }
        release(snap) {
            this.free.push(snap);
        }
    }

    var index = /*#__PURE__*/Object.freeze({
        __proto__: null,
        Cell: Cell,
        Map: Map,
        make: make,
        from: from,
        analyze: analyze,
        updateChokepoints: updateChokepoints,
        floodFillCount: floodFillCount,
        updateLoopiness: updateLoopiness,
        resetLoopiness: resetLoopiness,
        checkLoopiness: checkLoopiness,
        fillInnerLoopGrid: fillInnerLoopGrid,
        cleanLoopiness: cleanLoopiness,
        CellMemory: CellMemory,
        Snapshot: Snapshot,
        SnapshotManager: SnapshotManager
    });

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
        GWU__namespace.path.calculateDistances(distanceMap, x0, y0, costMap, options.eightWays, GWU__namespace.xy.straightDistanceBetween(x0, y0, x1, y1) + 1);
        const path = GWU__namespace.path.getPath(distanceMap, x1, y1, (x, y) => map.cell(x, y).blocksMove(), options.eightWays);
        GWU__namespace.grid.free(costMap);
        GWU__namespace.grid.free(distanceMap);
        return path;
    }

    var path = /*#__PURE__*/Object.freeze({
        __proto__: null,
        getCellPathCost: getCellPathCost,
        fillCostMap: fillCostMap,
        getPathBetween: getPathBetween
    });

    exports.actor = index$5;
    exports.effect = index$3;
    exports.entity = index$6;
    exports.flags = index$7;
    exports.item = index$4;
    exports.layer = index$1;
    exports.map = index;
    exports.path = path;
    exports.tile = index$2;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=gw-map.js.map
