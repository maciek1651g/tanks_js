/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/consts.ts":
/*!***********************!*\
  !*** ./src/consts.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.EVENTS_NAME = void 0;\nvar EVENTS_NAME;\n(function (EVENTS_NAME) {\n    EVENTS_NAME[\"chestLoot\"] = \"chest-loot\";\n    EVENTS_NAME[\"attack\"] = \"attack\";\n})(EVENTS_NAME = exports.EVENTS_NAME || (exports.EVENTS_NAME = {}));\n\n\n//# sourceURL=webpack://tanks_js/./src/consts.ts?");

/***/ }),

/***/ "./src/js/gameObjects/actor.ts":
/*!*************************************!*\
  !*** ./src/js/gameObjects/actor.ts ***!
  \*************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\nvar __extends = (this && this.__extends) || (function () {\n    var extendStatics = function (d, b) {\n        extendStatics = Object.setPrototypeOf ||\n            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||\n            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };\n        return extendStatics(d, b);\n    };\n    return function (d, b) {\n        if (typeof b !== \"function\" && b !== null)\n            throw new TypeError(\"Class extends value \" + String(b) + \" is not a constructor or null\");\n        extendStatics(d, b);\n        function __() { this.constructor = d; }\n        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());\n    };\n})();\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.Actor = void 0;\nvar phaser_1 = __webpack_require__(/*! phaser */ \"./node_modules/phaser/dist/phaser.js\");\nvar Actor = /** @class */ (function (_super) {\n    __extends(Actor, _super);\n    function Actor(scene, x, y, texture, frame) {\n        var _this = _super.call(this, scene, x, y, texture, frame) || this;\n        _this.hp = 100;\n        _this.speed = 200;\n        _this.speedUp = 100;\n        scene.add.existing(_this);\n        scene.physics.add.existing(_this);\n        _this.getBody().setCollideWorldBounds(true);\n        return _this;\n    }\n    Actor.prototype.getDamage = function (value) {\n        if (value) {\n            this.hp = this.hp - value;\n        }\n    };\n    Actor.prototype.getHPValue = function () {\n        return this.hp;\n    };\n    Actor.prototype.checkFlip = function () {\n        if (this.body.velocity.x < 0) {\n            this.scaleX = -1;\n        }\n        else {\n            this.scaleX = 1;\n        }\n    };\n    Actor.prototype.getBody = function () {\n        return this.body;\n    };\n    return Actor;\n}(phaser_1.Physics.Arcade.Sprite));\nexports.Actor = Actor;\n\n\n//# sourceURL=webpack://tanks_js/./src/js/gameObjects/actor.ts?");

/***/ }),

/***/ "./src/js/gameObjects/connection.ts":
/*!******************************************!*\
  !*** ./src/js/gameObjects/connection.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.Connection = void 0;\nvar otherPlayer_1 = __webpack_require__(/*! ./otherPlayer */ \"./src/js/gameObjects/otherPlayer.ts\");\nvar Connection = /** @class */ (function () {\n    function Connection() {\n        var _this = this;\n        this.syncObjects = {};\n        var hostname = window.location.hostname;\n        var port = '';\n        var protocol = 'wss';\n        if (hostname === 'localhost') {\n            port = ':8080';\n            protocol = 'ws';\n        }\n        var url = \"\".concat(protocol, \"://\").concat(hostname).concat(port, \"/tanks/objects:exchange\");\n        this.socket = new WebSocket(url);\n        this.socket.onopen = function () {\n            console.log('connected');\n        };\n        this.socket.onmessage = function (event) {\n            try {\n                var data = JSON.parse(event.data);\n                if (!_this.syncObjects[data.id]) {\n                    _this.syncObjects[data.id] = new otherPlayer_1.OtherPlayer(window.currentScene, data.coordinates.x, data.coordinates.y, data.id);\n                }\n                else {\n                    _this.syncObjects[data.id].setPosition(data.coordinates.x, data.coordinates.y);\n                }\n            }\n            catch (e) {\n                console.log(e);\n            }\n        };\n        this.socket.onerror = function (error) {\n            console.log(error);\n        };\n        this.socket.onclose = function (close) {\n            console.log('closed');\n        };\n    }\n    Connection.prototype.send = function (message) {\n        if (this.socket.readyState === WebSocket.OPEN) {\n            this.socket.send(JSON.stringify(message));\n        }\n    };\n    return Connection;\n}());\nexports.Connection = Connection;\n\n\n//# sourceURL=webpack://tanks_js/./src/js/gameObjects/connection.ts?");

/***/ }),

/***/ "./src/js/gameObjects/enemy.ts":
/*!*************************************!*\
  !*** ./src/js/gameObjects/enemy.ts ***!
  \*************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\nvar __extends = (this && this.__extends) || (function () {\n    var extendStatics = function (d, b) {\n        extendStatics = Object.setPrototypeOf ||\n            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||\n            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };\n        return extendStatics(d, b);\n    };\n    return function (d, b) {\n        if (typeof b !== \"function\" && b !== null)\n            throw new TypeError(\"Class extends value \" + String(b) + \" is not a constructor or null\");\n        extendStatics(d, b);\n        function __() { this.constructor = d; }\n        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());\n    };\n})();\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.Enemy = void 0;\nvar actor_1 = __webpack_require__(/*! ./actor */ \"./src/js/gameObjects/actor.ts\");\nvar consts_1 = __webpack_require__(/*! ../../consts */ \"./src/consts.ts\");\nvar Enemy = /** @class */ (function (_super) {\n    __extends(Enemy, _super);\n    function Enemy(scene, x, y, texture, target, frame) {\n        var _this = _super.call(this, scene, x, y, texture, frame) || this;\n        _this.AGRESSOR_RADIUS = 100;\n        _this.target = target;\n        // ADD TO SCENE\n        scene.add.existing(_this);\n        scene.physics.add.existing(_this);\n        // PHYSICS MODEL\n        _this.getBody().setSize(16, 16);\n        _this.getBody().setOffset(0, 0);\n        // ATACK HANDLER\n        _this.attackHandler = function () {\n            if (Phaser.Math.Distance.BetweenPoints({ x: _this.x, y: _this.y }, { x: _this.target.x, y: _this.target.y }) <\n                _this.target.width) {\n                _this.getDamage();\n                _this.disableBody(true, false);\n                _this.scene.time.delayedCall(300, function () {\n                    _this.destroy();\n                });\n            }\n        };\n        // EVENTS\n        _this.scene.game.events.on(consts_1.EVENTS_NAME.attack, _this.attackHandler, _this);\n        _this.on('destroy', function () {\n            _this.scene.game.events.removeListener(consts_1.EVENTS_NAME.attack, _this.attackHandler);\n        });\n        return _this;\n    }\n    Enemy.prototype.preUpdate = function () {\n        if (Phaser.Math.Distance.BetweenPoints({ x: this.x, y: this.y }, { x: this.target.x, y: this.target.y }) <\n            this.AGRESSOR_RADIUS) {\n            this.getBody().setVelocityX(this.target.x - this.x);\n            this.getBody().setVelocityY(this.target.y - this.y);\n        }\n        else {\n            this.getBody().setVelocity(0);\n        }\n    };\n    Enemy.prototype.setTarget = function (target) {\n        this.target = target;\n    };\n    return Enemy;\n}(actor_1.Actor));\nexports.Enemy = Enemy;\n\n\n//# sourceURL=webpack://tanks_js/./src/js/gameObjects/enemy.ts?");

/***/ }),

/***/ "./src/js/gameObjects/otherPlayer.ts":
/*!*******************************************!*\
  !*** ./src/js/gameObjects/otherPlayer.ts ***!
  \*******************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\nvar __extends = (this && this.__extends) || (function () {\n    var extendStatics = function (d, b) {\n        extendStatics = Object.setPrototypeOf ||\n            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||\n            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };\n        return extendStatics(d, b);\n    };\n    return function (d, b) {\n        if (typeof b !== \"function\" && b !== null)\n            throw new TypeError(\"Class extends value \" + String(b) + \" is not a constructor or null\");\n        extendStatics(d, b);\n        function __() { this.constructor = d; }\n        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());\n    };\n})();\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.OtherPlayer = void 0;\nvar actor_1 = __webpack_require__(/*! ./actor */ \"./src/js/gameObjects/actor.ts\");\nvar text_1 = __webpack_require__(/*! ./text */ \"./src/js/gameObjects/text.ts\");\nvar OtherPlayer = /** @class */ (function (_super) {\n    __extends(OtherPlayer, _super);\n    function OtherPlayer(scene, x, y, playerId) {\n        var _this = _super.call(this, scene, x, y, 'king') || this;\n        // PHYSICS\n        _this.getBody().setSize(30, 30);\n        _this.getBody().setOffset(8, 0);\n        // HP\n        _this.hpValue = new text_1.Text(_this.scene, _this.x, _this.y - _this.height, _this.hp.toString())\n            .setFontSize(12)\n            .setOrigin(0.8, 0.5);\n        // Player id\n        _this.playerId = playerId;\n        return _this;\n    }\n    OtherPlayer.prototype.update = function () {\n        // HP update\n        this.hpValue.setPosition(this.x, this.y - this.height * 0.4);\n        this.hpValue.setOrigin(0.8, 0.5);\n    };\n    OtherPlayer.prototype.getDamage = function (value) {\n        _super.prototype.getDamage.call(this, value);\n        this.hpValue.setText(this.hp.toString());\n    };\n    return OtherPlayer;\n}(actor_1.Actor));\nexports.OtherPlayer = OtherPlayer;\n\n\n//# sourceURL=webpack://tanks_js/./src/js/gameObjects/otherPlayer.ts?");

/***/ }),

/***/ "./src/js/gameObjects/player.ts":
/*!**************************************!*\
  !*** ./src/js/gameObjects/player.ts ***!
  \**************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\nvar __extends = (this && this.__extends) || (function () {\n    var extendStatics = function (d, b) {\n        extendStatics = Object.setPrototypeOf ||\n            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||\n            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };\n        return extendStatics(d, b);\n    };\n    return function (d, b) {\n        if (typeof b !== \"function\" && b !== null)\n            throw new TypeError(\"Class extends value \" + String(b) + \" is not a constructor or null\");\n        extendStatics(d, b);\n        function __() { this.constructor = d; }\n        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());\n    };\n})();\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.Player = void 0;\nvar actor_1 = __webpack_require__(/*! ./actor */ \"./src/js/gameObjects/actor.ts\");\nvar text_1 = __webpack_require__(/*! ./text */ \"./src/js/gameObjects/text.ts\");\nvar consts_1 = __webpack_require__(/*! ../../consts */ \"./src/consts.ts\");\nvar Player = /** @class */ (function (_super) {\n    __extends(Player, _super);\n    function Player(scene, x, y) {\n        var _this = _super.call(this, scene, x, y, 'king') || this;\n        // KEYS\n        _this.keyW = _this.scene.input.keyboard.addKey('W');\n        _this.keyA = _this.scene.input.keyboard.addKey('A');\n        _this.keyS = _this.scene.input.keyboard.addKey('S');\n        _this.keyD = _this.scene.input.keyboard.addKey('D');\n        _this.keyShift = _this.scene.input.keyboard.addKey('Shift');\n        _this.keySpace = _this.scene.input.keyboard.addKey(32);\n        _this.keySpace.on('down', function (event) {\n            _this.anims.play('attack', true);\n            _this.scene.game.events.emit(consts_1.EVENTS_NAME.attack);\n        });\n        // PHYSICS\n        _this.getBody().setSize(30, 30);\n        _this.getBody().setOffset(8, 0);\n        // HP\n        _this.hpValue = new text_1.Text(_this.scene, _this.x, _this.y - _this.height, _this.hp.toString())\n            .setFontSize(12)\n            .setOrigin(0.8, 0.5);\n        // Player id\n        _this.playerId = Math.random().toString(36).substr(2, 9);\n        return _this;\n    }\n    Player.prototype.update = function () {\n        var _a, _b, _c, _d, _e, _f;\n        // MOVEMENT update\n        this.getBody().setVelocity(0);\n        var speed = ((_a = this.keyShift) === null || _a === void 0 ? void 0 : _a.isDown) ? this.speed + this.speedUp : this.speed;\n        if ((_b = this.keyShift) === null || _b === void 0 ? void 0 : _b.isDown) {\n        }\n        if ((_c = this.keyW) === null || _c === void 0 ? void 0 : _c.isDown) {\n            this.body.velocity.y = -speed;\n        }\n        if ((_d = this.keyA) === null || _d === void 0 ? void 0 : _d.isDown) {\n            this.body.velocity.x = -speed;\n            this.checkFlip();\n            this.getBody().setOffset(48, 15);\n        }\n        if ((_e = this.keyS) === null || _e === void 0 ? void 0 : _e.isDown) {\n            this.body.velocity.y = speed;\n        }\n        if ((_f = this.keyD) === null || _f === void 0 ? void 0 : _f.isDown) {\n            this.body.velocity.x = speed;\n            this.checkFlip();\n            this.getBody().setOffset(15, 15);\n        }\n        // HP update\n        this.hpValue.setPosition(this.x, this.y - this.height * 0.4);\n        this.hpValue.setOrigin(0.8, 0.5);\n        //Sync with server\n        var newMessage = {\n            id: this.playerId,\n            messageType: 'player',\n            coordinates: { x: Math.round(this.x), y: Math.round(this.y) },\n            hp: this.hp,\n        };\n        if (JSON.stringify(newMessage) !== JSON.stringify(this.lastSendMessage)) {\n            this.lastSendMessage = newMessage;\n            window.connection.send(newMessage);\n        }\n    };\n    Player.prototype.getDamage = function (value) {\n        _super.prototype.getDamage.call(this, value);\n        this.hpValue.setText(this.hp.toString());\n    };\n    return Player;\n}(actor_1.Actor));\nexports.Player = Player;\n\n\n//# sourceURL=webpack://tanks_js/./src/js/gameObjects/player.ts?");

/***/ }),

/***/ "./src/js/gameObjects/score.ts":
/*!*************************************!*\
  !*** ./src/js/gameObjects/score.ts ***!
  \*************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\nvar __extends = (this && this.__extends) || (function () {\n    var extendStatics = function (d, b) {\n        extendStatics = Object.setPrototypeOf ||\n            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||\n            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };\n        return extendStatics(d, b);\n    };\n    return function (d, b) {\n        if (typeof b !== \"function\" && b !== null)\n            throw new TypeError(\"Class extends value \" + String(b) + \" is not a constructor or null\");\n        extendStatics(d, b);\n        function __() { this.constructor = d; }\n        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());\n    };\n})();\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.Score = exports.ScoreOperations = void 0;\nvar text_1 = __webpack_require__(/*! ./text */ \"./src/js/gameObjects/text.ts\");\nvar ScoreOperations;\n(function (ScoreOperations) {\n    ScoreOperations[ScoreOperations[\"INCREASE\"] = 0] = \"INCREASE\";\n    ScoreOperations[ScoreOperations[\"DECREASE\"] = 1] = \"DECREASE\";\n    ScoreOperations[ScoreOperations[\"SET_VALUE\"] = 2] = \"SET_VALUE\";\n})(ScoreOperations = exports.ScoreOperations || (exports.ScoreOperations = {}));\nvar Score = /** @class */ (function (_super) {\n    __extends(Score, _super);\n    function Score(scene, x, y, initScore) {\n        if (initScore === void 0) { initScore = 0; }\n        var _this = _super.call(this, scene, x, y, \"Score: \".concat(initScore)) || this;\n        scene.add.existing(_this);\n        _this.scoreValue = initScore;\n        return _this;\n    }\n    Score.prototype.changeValue = function (operation, value) {\n        switch (operation) {\n            case ScoreOperations.INCREASE:\n                this.scoreValue += value;\n                break;\n            case ScoreOperations.DECREASE:\n                this.scoreValue -= value;\n                break;\n            case ScoreOperations.SET_VALUE:\n                this.scoreValue = value;\n                break;\n            default:\n                break;\n        }\n        this.setText(\"Score: \".concat(this.scoreValue));\n    };\n    Score.prototype.getValue = function () {\n        return this.scoreValue;\n    };\n    return Score;\n}(text_1.Text));\nexports.Score = Score;\n\n\n//# sourceURL=webpack://tanks_js/./src/js/gameObjects/score.ts?");

/***/ }),

/***/ "./src/js/gameObjects/text.ts":
/*!************************************!*\
  !*** ./src/js/gameObjects/text.ts ***!
  \************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\nvar __extends = (this && this.__extends) || (function () {\n    var extendStatics = function (d, b) {\n        extendStatics = Object.setPrototypeOf ||\n            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||\n            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };\n        return extendStatics(d, b);\n    };\n    return function (d, b) {\n        if (typeof b !== \"function\" && b !== null)\n            throw new TypeError(\"Class extends value \" + String(b) + \" is not a constructor or null\");\n        extendStatics(d, b);\n        function __() { this.constructor = d; }\n        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());\n    };\n})();\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.Text = void 0;\nvar phaser_1 = __webpack_require__(/*! phaser */ \"./node_modules/phaser/dist/phaser.js\");\nvar Text = /** @class */ (function (_super) {\n    __extends(Text, _super);\n    function Text(scene, x, y, text) {\n        var _this = _super.call(this, scene, x, y, text, {\n            fontSize: 'calc(100vw / 25)',\n            color: '#fff',\n            stroke: '#000',\n            strokeThickness: 4,\n        }) || this;\n        _this.setOrigin(0, 0);\n        scene.add.existing(_this);\n        return _this;\n    }\n    return Text;\n}(phaser_1.GameObjects.Text));\nexports.Text = Text;\n\n\n//# sourceURL=webpack://tanks_js/./src/js/gameObjects/text.ts?");

/***/ }),

/***/ "./src/js/helpers/gameobject-to-object-point.ts":
/*!******************************************************!*\
  !*** ./src/js/helpers/gameobject-to-object-point.ts ***!
  \******************************************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.gameObjectsToObjectPoints = void 0;\nvar gameObjectsToObjectPoints = function (gameObjects) {\n    return gameObjects.map(function (gameObject) { return gameObject; });\n};\nexports.gameObjectsToObjectPoints = gameObjectsToObjectPoints;\n\n\n//# sourceURL=webpack://tanks_js/./src/js/helpers/gameobject-to-object-point.ts?");

/***/ }),

/***/ "./src/js/index.ts":
/*!*************************!*\
  !*** ./src/js/index.ts ***!
  \*************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nvar phaser_1 = __webpack_require__(/*! phaser */ \"./node_modules/phaser/dist/phaser.js\");\nvar loadingScene_1 = __webpack_require__(/*! ./scenes/loadingScene */ \"./src/js/scenes/loadingScene.ts\");\nvar level1_1 = __webpack_require__(/*! ./scenes/level1/level1 */ \"./src/js/scenes/level1/level1.ts\");\nvar uiScene_1 = __webpack_require__(/*! ./scenes/ui/uiScene */ \"./src/js/scenes/ui/uiScene.ts\");\nvar connection_1 = __webpack_require__(/*! ./gameObjects/connection */ \"./src/js/gameObjects/connection.ts\");\nvar gameConfig = {\n    title: 'Phaser game tutorial',\n    type: Phaser.WEBGL,\n    parent: 'game',\n    backgroundColor: '#351f1b',\n    scale: {\n        mode: Phaser.Scale.ScaleModes.NONE,\n        width: window.innerWidth,\n        height: window.innerHeight,\n    },\n    physics: {\n        default: 'arcade',\n        arcade: {\n            debug: false,\n        },\n    },\n    render: {\n        antialiasGL: false,\n        pixelArt: true,\n    },\n    callbacks: {\n        postBoot: function () {\n            window.sizeChanged();\n        },\n    },\n    canvasStyle: \"display: block; width: 100%; height: 100%;\",\n    autoFocus: true,\n    audio: {\n        disableWebAudio: false,\n    },\n    scene: [loadingScene_1.LoadingScene, level1_1.Level1, uiScene_1.UIScene],\n};\nwindow.sizeChanged = function () {\n    if (window.game.isBooted) {\n        setTimeout(function () {\n            window.game.scale.resize(window.innerWidth, window.innerHeight);\n            window.game.canvas.setAttribute('style', \"display: block; width: \".concat(window.innerWidth, \"px; height: \").concat(window.innerHeight, \"px;\"));\n        }, 100);\n    }\n};\nwindow.onresize = function () { return window.sizeChanged(); };\nwindow.game = new phaser_1.Game(gameConfig);\nwindow.connection = new connection_1.Connection();\n\n\n//# sourceURL=webpack://tanks_js/./src/js/index.ts?");

/***/ }),

/***/ "./src/js/scenes/level1/level1.ts":
/*!****************************************!*\
  !*** ./src/js/scenes/level1/level1.ts ***!
  \****************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\nvar __extends = (this && this.__extends) || (function () {\n    var extendStatics = function (d, b) {\n        extendStatics = Object.setPrototypeOf ||\n            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||\n            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };\n        return extendStatics(d, b);\n    };\n    return function (d, b) {\n        if (typeof b !== \"function\" && b !== null)\n            throw new TypeError(\"Class extends value \" + String(b) + \" is not a constructor or null\");\n        extendStatics(d, b);\n        function __() { this.constructor = d; }\n        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());\n    };\n})();\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.Level1 = void 0;\nvar phaser_1 = __webpack_require__(/*! phaser */ \"./node_modules/phaser/dist/phaser.js\");\nvar player_1 = __webpack_require__(/*! ../../gameObjects/player */ \"./src/js/gameObjects/player.ts\");\nvar gameobject_to_object_point_1 = __webpack_require__(/*! ../../helpers/gameobject-to-object-point */ \"./src/js/helpers/gameobject-to-object-point.ts\");\nvar consts_1 = __webpack_require__(/*! ../../../consts */ \"./src/consts.ts\");\nvar enemy_1 = __webpack_require__(/*! ../../gameObjects/enemy */ \"./src/js/gameObjects/enemy.ts\");\nvar Level1 = /** @class */ (function (_super) {\n    __extends(Level1, _super);\n    function Level1() {\n        return _super.call(this, 'level1-scene') || this;\n    }\n    Level1.prototype.create = function () {\n        window.currentScene = this;\n        this.initMap();\n        this.player = new player_1.Player(this, 200, 600);\n        this.physics.add.collider(this.player, this.wallsLayer);\n        this.initChests();\n        this.initEnemies();\n        this.initCamera();\n    };\n    Level1.prototype.update = function () {\n        this.player.update();\n    };\n    Level1.prototype.initMap = function () {\n        this.map = this.make.tilemap({\n            key: 'dungeon',\n            tileWidth: 16,\n            tileHeight: 16,\n        });\n        this.tileset = this.map.addTilesetImage('dungeon', 'tiles');\n        this.groundLayer = this.map.createLayer('Ground', this.tileset, 0, 0);\n        this.wallsLayer = this.map.createLayer('Walls', this.tileset, 0, 0);\n        this.wallsLayer.setCollisionByProperty({ collides: true });\n        this.physics.world.setBounds(0, 0, this.wallsLayer.width, this.wallsLayer.height);\n        // this.showDebugWalls();\n    };\n    Level1.prototype.showDebugWalls = function () {\n        var debugGraphics = this.add.graphics().setAlpha(0.7);\n        this.wallsLayer.renderDebug(debugGraphics, {\n            tileColor: null,\n            collidingTileColor: new Phaser.Display.Color(243, 234, 48, 255),\n        });\n    };\n    Level1.prototype.initChests = function () {\n        var _this = this;\n        var chestPoints = (0, gameobject_to_object_point_1.gameObjectsToObjectPoints)(this.map.filterObjects('Chests', function (obj) { return obj.name === 'ChestPoint'; }));\n        this.chests = chestPoints.map(function (chestPoint) {\n            return _this.physics.add.sprite(chestPoint.x, chestPoint.y, 'tiles_spr', 595).setScale(1.5);\n        });\n        this.chests.forEach(function (chest) {\n            _this.physics.add.overlap(_this.player, chest, function (obj1, obj2) {\n                _this.game.events.emit(consts_1.EVENTS_NAME.chestLoot);\n                obj2.destroy();\n                _this.cameras.main.flash();\n            });\n        });\n    };\n    Level1.prototype.initCamera = function () {\n        this.cameras.main.setSize(this.game.scale.width, this.game.scale.height);\n        this.cameras.main.startFollow(this.player, true, 0.09, 0.09);\n        this.cameras.main.setZoom(1);\n    };\n    Level1.prototype.initEnemies = function () {\n        var _this = this;\n        var enemiesPoints = (0, gameobject_to_object_point_1.gameObjectsToObjectPoints)(this.map.filterObjects('Enemies', function (obj) { return obj.name === 'EnemyPoint'; }));\n        this.enemies = enemiesPoints.map(function (enemyPoint) {\n            return new enemy_1.Enemy(_this, enemyPoint.x, enemyPoint.y, 'tiles_spr', _this.player, 503)\n                .setName(enemyPoint.id.toString())\n                .setScale(1.5);\n        });\n        this.physics.add.collider(this.enemies, this.wallsLayer);\n        this.physics.add.collider(this.enemies, this.enemies);\n        this.physics.add.collider(this.player, this.enemies, function (obj1, obj2) {\n            obj1.getDamage(1);\n        });\n    };\n    return Level1;\n}(phaser_1.Scene));\nexports.Level1 = Level1;\n\n\n//# sourceURL=webpack://tanks_js/./src/js/scenes/level1/level1.ts?");

/***/ }),

/***/ "./src/js/scenes/loadingScene.ts":
/*!***************************************!*\
  !*** ./src/js/scenes/loadingScene.ts ***!
  \***************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\nvar __extends = (this && this.__extends) || (function () {\n    var extendStatics = function (d, b) {\n        extendStatics = Object.setPrototypeOf ||\n            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||\n            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };\n        return extendStatics(d, b);\n    };\n    return function (d, b) {\n        if (typeof b !== \"function\" && b !== null)\n            throw new TypeError(\"Class extends value \" + String(b) + \" is not a constructor or null\");\n        extendStatics(d, b);\n        function __() { this.constructor = d; }\n        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());\n    };\n})();\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.LoadingScene = void 0;\nvar phaser_1 = __webpack_require__(/*! phaser */ \"./node_modules/phaser/dist/phaser.js\");\nvar LoadingScene = /** @class */ (function (_super) {\n    __extends(LoadingScene, _super);\n    function LoadingScene() {\n        return _super.call(this, 'loading-scene') || this;\n    }\n    LoadingScene.prototype.preload = function () {\n        this.load.baseURL = './../../assets/';\n        // Loading king sprite\n        this.load.image('king', 'sprites/Tank_top_model.png');\n        // Loading tilemap\n        this.load.image({\n            key: 'tiles',\n            url: 'tilemaps/tiles/dungeon-16-16.png',\n        });\n        this.load.tilemapTiledJSON('dungeon', 'tilemaps/json/dungeon.json');\n        //Loading spritesheet, we will use it for chest sprite\n        this.load.spritesheet('tiles_spr', 'tilemaps/tiles/dungeon-16-16.png', {\n            frameWidth: 16,\n            frameHeight: 16,\n        });\n    };\n    LoadingScene.prototype.create = function () {\n        this.scene.start('level1-scene');\n        this.scene.start('ui-scene');\n    };\n    return LoadingScene;\n}(phaser_1.Scene));\nexports.LoadingScene = LoadingScene;\n\n\n//# sourceURL=webpack://tanks_js/./src/js/scenes/loadingScene.ts?");

/***/ }),

/***/ "./src/js/scenes/ui/uiScene.ts":
/*!*************************************!*\
  !*** ./src/js/scenes/ui/uiScene.ts ***!
  \*************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\nvar __extends = (this && this.__extends) || (function () {\n    var extendStatics = function (d, b) {\n        extendStatics = Object.setPrototypeOf ||\n            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||\n            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };\n        return extendStatics(d, b);\n    };\n    return function (d, b) {\n        if (typeof b !== \"function\" && b !== null)\n            throw new TypeError(\"Class extends value \" + String(b) + \" is not a constructor or null\");\n        extendStatics(d, b);\n        function __() { this.constructor = d; }\n        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());\n    };\n})();\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.UIScene = void 0;\nvar phaser_1 = __webpack_require__(/*! phaser */ \"./node_modules/phaser/dist/phaser.js\");\nvar score_1 = __webpack_require__(/*! ../../gameObjects/score */ \"./src/js/gameObjects/score.ts\");\nvar consts_1 = __webpack_require__(/*! ../../../consts */ \"./src/consts.ts\");\nvar UIScene = /** @class */ (function (_super) {\n    __extends(UIScene, _super);\n    function UIScene() {\n        var _this = _super.call(this, 'ui-scene') || this;\n        _this.chestLootHandler = function () {\n            _this.score.changeValue(score_1.ScoreOperations.INCREASE, 10);\n        };\n        return _this;\n    }\n    UIScene.prototype.create = function () {\n        this.score = new score_1.Score(this, 20, 20, 0);\n        this.initListeners();\n    };\n    UIScene.prototype.initListeners = function () {\n        this.game.events.on(consts_1.EVENTS_NAME.chestLoot, this.chestLootHandler, this);\n    };\n    return UIScene;\n}(phaser_1.Scene));\nexports.UIScene = UIScene;\n\n\n//# sourceURL=webpack://tanks_js/./src/js/scenes/ui/uiScene.ts?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var [chunkIds, fn, priority] = deferred[i];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"main": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = (chunkId) => (installedChunks[chunkId] === 0);
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunktanks_js"] = self["webpackChunktanks_js"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["phaser"], () => (__webpack_require__("./src/js/index.ts")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;