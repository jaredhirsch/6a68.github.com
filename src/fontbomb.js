// Annotated look at [fontbomb.ilex.ca](http://fontbomb.ilex.ca), some awfully well-written code that
// I heard about from [@tobinibot](http://twitter.com/#!/tobinibot) and really enjoyed reading.

// All these annotations are mine. I don't know the author, so it's possible
// I won't catch all the subtleties. For reference, the author is [@plehoux](http://twitter.com/#!/plehoux),
// and I prettied up the code using [jsbeautifier.org](http://jsbeautifier.org).

// Why bother? Um, well, I dunno. I haven't done code reviews in a while, and
// it was just fun to read, and my pre-front end coding self would probably
// have found this code semi-bewildering to read, yet the animations so enticing and cool.

// ## on to the codez...

// wrap in a function expression to avoid polluting underlying page
(function () {
    // declare stuff visible at top level
    var Bomb, Explosion, Particle, targetTime, vendor, w, _i, _len, _ref,
    // pretty standard bind function used for callbacking
    __bind = function (fn, me) {
            return function () {
                return fn.apply(me, arguments);
            };
        };

    w = window;

    // Hm, so I think there is probably a bug here, now that I'm looking closely. 
    // We try to loop over the different vendor prefixes to find out which prefixed
    // requestAnimationFrame method is defined (so, window.mozRequestAnimationFrame
    // vs. window.webkitRequestAnimationFrame),
    _ref = ['ms', 'moz', 'webkit', 'o'];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        vendor = _ref[_i];
        if (w.requestAnimationFrame) break;
        // but here, we don't actually append the vendor variable to the string,
        // we just look for a property named "vendorRequestAnimationFrame" on window.
        // Actually, we look for an element with an ID of "vendorRequestAnimationFrame"
        // so I think this should always evaluate to undefined--which is okay,
        // because it just means you fall back to setTimeout/clearTimeout below.
        // I think this would work if they had done "w[vendor + 'RequestAnimationFrame']"
        w.requestAnimationFrame = w["#vendorRequestAnimationFrame"];
        w.cancelAnimationFrame = w["#vendorCancelAnimationFrame"] || w["#vendorCancelRequestAnimationFrame"];
    }

    targetTime = 0;

    // so, if requestAnimationFrame wasn't found, create a function that sets a short timeout:
    w.requestAnimationFrame || (w.requestAnimationFrame = function (callback) {
        var currentTime;
        // set the next timeout to the larger of targetTime plus 16 msec or
        // the current time coerced to an integer with '+'
        targetTime = Math.max(targetTime + 16, currentTime = +(new Date));
        // then set a timeout which fires the callback after the next tick,
        // and passes the time to the callback (so the callback code can calculate
        // the elapsed time), and return the timeout ID so it can be canceled
        return w.setTimeout((function () {
            return callback(+(new Date));
        }), targetTime - currentTime);
    });

    // same sort of thing: if cancelAnimationFrame wasn't found, use clearTimeout
    // as fallback.
    w.cancelAnimationFrame || (w.cancelAnimationFrame = function (id) {
        return clearTimeout(id);
    });

    // cross-browser method to find click coordinates from click event, or
    // global event object on IE
    w.findClickPos = function (e) {
        var posx, posy;
        posx = 0;
        posy = 0;
        if (!e) e = window.event;
        if (e.pageX || e.pageY) {
            posx = e.pageX;
            posy = e.pageY;
        } else if (e.clientX || e.clientY) {
            posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
            posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
        }
        return {
            x: posx,
            y: posy
        };
    };

    // get element offset by recursively getting offsets of positioned ancestors
    w.getOffset = function (el) {
        var body, _x, _y;
        body = document.getElementsByTagName("body")[0];
        _x = 0;
        _y = 0;
        // while the element isn't null, and while its offsets are not undefined,
        while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
            // get the position by subtracting the element's document coordinates
            // from the distance the element is scrolled,
            _x += el.offsetLeft - el.scrollLeft;
            _y += el.offsetTop - el.scrollTop;
            // then go up to the next positioned ancestor.
            el = el.offsetParent;
        }
        return {
            top: _y + body.scrollTop,
            left: _x + body.scrollLeft
        };
    };

    // configure the constructor and prototype methods, then return the constructor.
    // this is a nice, clean way to group the code.
    Particle = (function () {

        // setting some instance properties in the constructor,
        function Particle(elem) {
            this.elem = elem;
            this.style = elem.style;
            this.elem.style['zIndex'] = 9999;
            this.transformX = 0;
            this.transformY = 0;
            this.transformRotation = 0;
            this.offsetTop = window.getOffset(this.elem).top;
            this.offsetLeft = window.getOffset(this.elem).left;
            this.velocityX = 0;
            this.velocityY = 0;
        }

        // then defining shared methods by appending to prototype.

        // on tick, given a 'blast' parameter with I'm guessing blast coordinates,
        Particle.prototype.tick = function (blast) {
            var distX, distXS, distY, distYS, distanceWithBlast, force, forceX, forceY, previousRotation, previousStateX, previousStateY, rad, transform;
            // get the last position of this particle
            previousStateX = this.transformX;
            previousStateY = this.transformY;
            previousRotation = this.transformRotation;
            // if the velocity was big enough, pull it towards zero,
            if (this.velocityX > 1.5) {
                this.velocityX -= 1.5;
            } else if (this.velocityX < -1.5) {
                this.velocityX += 1.5;
            // otherwise, if it's between -1.5 and 1.5, null it out.
            } else {
                this.velocityX = 0;
            }
            // ditto for y velocity.
            if (this.velocityY > 1.5) {
                this.velocityY -= 1.5;
            } else if (this.velocityY < -1.5) {
                this.velocityY += 1.5;
            } else {
                this.velocityY = 0;
            }
            // if there was a new blast, add it to the existing forces on the particle.
            if (blast != null) {
                // figure out blast distance from particle
                distX = this.offsetLeft + this.transformX - blast.x;
                distY = this.offsetTop + this.transformY - blast.y;
                // to make it look like stuff scattered by a bomb, use an
                // inverse square law for the force relation: the force is
                // proportional to 1 over distance squared. Ignore the bilinear term
                // in (a+b)^2 = a^2 + b^2 + 2ab. yay physics.
                distXS = distX * distX;
                distYS = distY * distY;
                distanceWithBlast = distXS + distYS;
                force = 100000 / distanceWithBlast;
                // if the force is really huge, cap it at 50
                if (force > 50) force = 50;
                // convert the force into x- and y-direction pieces
                rad = Math.asin(distYS / distanceWithBlast);
                forceY = Math.sin(rad) * force * (distY < 0 ? -1 : 1);
                forceX = Math.cos(rad) * force * (distX < 0 ? -1 : 1);
                // and append the force to whatever the particle's velocity was
                // in the previous tick
                this.velocityX = +forceX;
                this.velocityY = +forceY;
            }
            // ok, now we add the new velocity to the old transform params and set the rotation
            this.transformX = this.transformX + this.velocityX;
            this.transformY = this.transformY + this.velocityY;
            this.transformRotation = this.transformX * -1;
            // if the changes were really small, bail. else, update the transform.
            if ((Math.abs(previousStateX - this.transformX) > 1 || Math.abs(previousStateY - this.transformY) > 1 || Math.abs(previousRotation - this.transformRotation) > 1) && ((this.transformX > 1 || this.transformX < -1) || (this.transformY > 1 || this.transformY < -1))) {
                transform = "translate(" + this.transformX + "px, " + this.transformY + "px) rotate(" + this.transformRotation + "deg)";
                this.style['MozTransform'] = transform;
                this.style['WebkitTransform'] = transform;
                this.style['msTransform'] = transform;
                return this.style['transform'] = transform;
            }
        };

        // finally, return the prepared constructor function.
        return Particle;

    })();

    // the particle constructor is so far only available inside the current
    // self-executing function scope; make it available on the window
    this.Particle = Particle;

    // same deal with the Bomb constructor: looks like we'll set up the constructor
    // and the prototype methods, then return the constructor function, keeping all
    // the code nicely grouped together inside a self-execution function.
    //
    // Bomb is actually the DOM node that shows the countdown, so we'll probably see
    // some DOM wrangling here.
    Bomb = (function () {

        // I'm guessing size of the bomb image in pixels
        Bomb.SIZE = 50;

        function Bomb(x, y) {
            // I confess I'm not sure why you'd need to bind own functions to an object,
            // unless you just don't want to have to explicitly pass __bind(this.foo,this)
            // into callbacks. I don't personally like hiding the closing-over, but whatev,
            // probably a stylistic thing.
            this.countDown = __bind(this.countDown, this);
            this.drop = __bind(this.drop, this);
            // set the bomb's position
            this.pos = {
                x: x,
                y: y
            };
            this.body = document.getElementsByTagName("body")[0];
            // set the bomb to its initial state and countdown to initial count
            this.state = 'planted';
            this.count = 3;
            // then "drop" the bomb to start ticking
            this.drop();
        }

        Bomb.prototype.drop = function () {
            // create a div with the count inside it,
            this.bomb = document.createElement("div");
            this.bomb.innerHTML = this.count;
            // append it to the DOM right away; probably should have waited
            // to set properties on the bomb before appending, as each of
            // these CSS changes will have a DOM update cost. could also just
            // set them all at once using body.style.cssText.
            this.body.appendChild(this.bomb);
            this.bomb.style['zIndex'] = "9999";
            this.bomb.style['fontFamily'] = "verdana";
            // yeah, looks like the SIZE constant is used to set the bomb's size
            this.bomb.style['width'] = "" + Bomb.SIZE + "px";
            this.bomb.style['height'] = "" + Bomb.SIZE + "px";
            this.bomb.style['display'] = 'block';
            // how's it round? the border radius equals the diameter. clever.
            this.bomb.style['borderRadius'] = "" + Bomb.SIZE + "px";
            this.bomb.style['WebkitBorderRadius'] = "" + Bomb.SIZE + "px";
            this.bomb.style['MozBorderRadius'] = "" + Bomb.SIZE + "px";
            this.bomb.style['fontSize'] = '18px';
            this.bomb.style['color'] = '#fff';
            this.bomb.style['lineHeight'] = "" + Bomb.SIZE + "px";
            this.bomb.style['background'] = '#000';
            this.bomb.style['position'] = 'absolute';
            // center it at the click point
            this.bomb.style['top'] = "" + (this.pos.y - Bomb.SIZE / 2) + "px";
            this.bomb.style['left'] = "" + (this.pos.x - Bomb.SIZE / 2) + "px";
            this.bomb.style['textAlign'] = "center";
            // make it unselectable in webkit only, odd. maybe a touch event thing?
            this.bomb.style['WebkitUserSelect'] = 'none';
            this.bomb.style['font-weight'] = 700;
            // after a second, fire countDown
            return setTimeout(this.countDown, 1000);
        };

        // 1 sec after the bomb is planted, this gets fired. this
        // also gets fired recursively until the count runs out.
        Bomb.prototype.countDown = function () {
            // set the state to 'ticking'
            this.state = 'ticking';
            // decrement the count
            this.count--;
            // put the new count number inside the DOM so users can see it
            this.bomb.innerHTML = this.count;
            // if the count hasn't run out, wait another second then do this again
            if (this.count > 0) {
                return setTimeout(this.countDown, 1000);
            // otherwise, "explose"
            } else {
                return this.explose();
            }
        };

        // when you "explose", get rid of the number and toggle state to 'explose'.
        // what's that do? grepping down the file, it looks like Explosion.prototype.tick
        // checks the bomb's state and does stuff if the 'explose' state happens.
        Bomb.prototype.explose = function () {
            this.bomb.innerHTML = '';
            return this.state = 'explose';
        };

        // oh, so if Explosion.prototype.tick finds that the state is 'explose', it
        // calls this function,
        Bomb.prototype.exploded = function () {
            // which toggles the state again, preventing double-fire of the explosion,
            this.state = 'exploded';
            this.bomb.innerHTML = '';
            this.bomb.style['fontSize'] = '12px';
            // then fades the bomb's opacity almost down to nothing
            return this.bomb.style['opacity'] = 0.05;
        };

        // as with particle, return the prepared constructor function
        return Bomb;

    })();

    // and again, explicitly make this thing available on window
    this.Bomb = Bomb;

    // once more: explosion is a self-executing function expression that
    // returns a constructor function.
    // Explosion looks like a bit of cleaned up "main" window-level code;
    // there are some funny things wedged in here.
    Explosion = (function () {

        function Explosion() {
            // bind callbackable methods so you can pass them cleanly into a setTimeout or whatever
            this.tick = __bind(this.tick, this);
            this.dropBomb = __bind(this.dropBomb, this);
            var char, confirmation, style, _ref2,
            _this = this;
            // when you make a new Explosion, bail out here if you've already
            // loaded one Explosion in the life of the current page.
            if (window.FONTBOMB_LOADED) return;
            // if this is the first Explosion call,
            // set the flag to avoid double-loading
            window.FONTBOMB_LOADED = true;

            // idk what this is all abt
            if (!window.FONTBOMB_HIDE_CONFIRMATION) confirmation = true;

            // keep track of the list of currently live bombs
            this.bombs = [];
            this.body = document.getElementsByTagName("body")[0];
            // if this.body isn't null (?)
            if ((_ref2 = this.body) != null) {
                // call dropBomb on every click (sadly, including right-clicks, ah well.)
                // DOM 0 attaching could also be clobbered by any JS code that assigns to
                // the onclick handler--probably would have been better to do attachEvent()
                // and addEventListener, if you want to handle IE cleanly.
                _ref2.onclick = function (event) {
                    return _this.dropBomb(event);
                };
            }
            // hey look, a bit of code to handle touch events.
            this.body.addEventListener("touchstart", function (event) {
                return _this.touchEvent = event;
            });
            // while you're touching and sliding your finger around, moves will keep firing
            this.body.addEventListener("touchmove", function (event) {
                // keep on incrementing the move count
                _this.touchMoveCount || (_this.touchMoveCount = 0);
                return _this.touchMoveCount++;
            });
            this.body.addEventListener("touchend", function (event) {
                // if you stop touching quickly, drop a bomb where the touch started.
                // otherwise, you were sliding around the screen, so don't drop a bomb.
                if (_this.touchMoveCount < 3) _this.dropBomb(_this.touchEvent);
                return _this.touchMoveCount = 0;
            });
            // do something to prepare all the nodes on the page for explosions.
            // ah, I peeked: we wrap every node and non-whitespace char in <particle> els,
            // then wrap words in <word> els.
            this.explosifyNodes(this.body.childNodes);
            this.chars = (function () {
                var _j, _len2, _ref3, _results;
            // for every <particle> in the document,
                _ref3 = document.getElementsByTagName('particle');
                _results = [];
                for (_j = 0, _len2 = _ref3.length; _j < _len2; _j++) {
                    char = _ref3[_j];
                    // actually create a corresponding Particle object and toss it
                    // into the _results list
                    _results.push(new Particle(char, this.body));
                }
                return _results;
            }).call(this);
            // start the animation loop
            this.tick();
            // if we set confirmation to TRUE above, which I think happens on bookmarklet
            // launch but not on the fontbomb website,
            if (confirmation != null) {
                // create a style node and stuff a bunch of fontBomb styles inside it
                style = document.createElement('style');
                style.innerHTML = "div#fontBombConfirmation {\n  position: absolute;\n  top: -200px;\n  left: 0px;\n  right: 0px;\n  bottom: none;\n  width: 100%;\n  padding: 18px;\n  margin: 0px;\n  background: #e8e8e8;\n  text-align: center;\n  font-size: 14px;\n  line-height: 14px;\n  font-family: verdana, sans-serif;\n  color: #000;\n  -webkit-transition: all 1s ease-in-out;\n  -moz-transition: all 1s ease-in-out;\n  -o-transition: all 1s ease-in-out;\n  -ms-transition: all 1s ease-in-out;\n  transition: all 1s ease-in-out;\n  -webkit-box-shadow: 0px 3px 3px rgba(0,0,0,0.20);\n  -moz-box-shadow: 0px 3px 3px rgba(0,0,0,0.20);\n  box-shadow: 0px 3px 3px rgba(0,0,0,0.20);\n  z-index: 100000002;\n}\ndiv#fontBombConfirmation span {\n  color: #fe3a1a;\n}\ndiv#fontBombConfirmation.show {\n  top:0px;\n  display:block;\n}";
                // then append to the document's head (ah, but what if it doesn't have a head? ;-)
                document.head.appendChild(style);
                // create a confirmation div to tell you fontBomb has loaded
                this.confirmation = document.createElement("div");
                this.confirmation.id = 'fontBombConfirmation';
                this.confirmation.innerHTML = "<span style='font-weight:bold;'>fontBomb loaded!</span> Click anywhere to destroy " + (document.title.substring(0, 50));
                // and append it to the body. I sure hope this doesn't execute until
                // the body is done being parsed--otherwise IE will throw a tasty and
                // refreshing Operation Aborted error. In the bookmarklet case, it seems
                // like a pretty safe bet.
                this.body.appendChild(this.confirmation);
                // after 10 msec, show the confirmation
                setTimeout(function () {
                    return _this.confirmation.className = 'show';
                }, 10);
                // and hide the confirmation after 5 seconds
                setTimeout(function () {
                    return _this.confirmation.className = '';
                }, 5000);
            }
        }

        // given a set of nodes,
        Explosion.prototype.explosifyNodes = function (nodes) {
            var node, _j, _len2, _results;
            _results = [];
            for (_j = 0, _len2 = nodes.length; _j < _len2; _j++) {
                node = nodes[_j];
                // call downward to each,
                _results.push(this.explosifyNode(node));
            }
            // then return the list of lists upwards
            return _results;
        };

        Explosion.prototype.explosifyNode = function (node) {
            var newNode;
            switch (node.nodeType) {
            // if it's an element,
            case 1:
                // process its children
                return this.explosifyNodes(node.childNodes);
            // if it's a text node,
            case 3:
                // if it doesn't only contain whitespace,
                if (!/^\s*$/.test(node.nodeValue)) {
                    // if it only has one character in it,
                    if (node.parentNode.childNodes.length === 1) {
                        // set the innerHTML of the text parent to the processed single character
                        return node.parentNode.innerHTML = this.explosifyText(node.nodeValue);
                    // otherwise it has a bunch of characters,
                    } else {
                        // create a new container,
                        newNode = document.createElement("particles");
                        // wrap each of the characters in a particle,
                        newNode.innerHTML = this.explosifyText(node.nodeValue);
                        // and replace the text node with the new container
                        return node.parentNode.replaceChild(newNode, node);
                    }
                }
            }
        };

        Explosion.prototype.explosifyText = function (string) {
            var char, chars, index;
            // split the string, wrap non-whitespace characters in a particle tag,
            // very clever and nice alternative to using a div with particle class,
            // which would be a PITA to find all of them on older IE.
            // anyway, wrap non-whitespace characters in an inline-block displayed
            // element, so it looks the same, and replace whitespace with non-breaking
            // space, again, so text on the page looks the same overall.
            chars = (function () {
                var _len2, _ref2, _results;
                _ref2 = string.split('');
                _results = [];
                for (index = 0, _len2 = _ref2.length; index < _len2; index++) {
                    char = _ref2[index];
                    if (!/^\s*$/.test(char)) {
                        _results.push("<particle style='display:inline-block;'>" + char + "</particle>");
                    } else {
                        _results.push('&nbsp;');
                    }
                }
                return _results;
            })();
            // re-join the split string
            chars = chars.join('');
            // re-split the string on non-breaking spaces.
            // wrap each word (thing not containing whitespace) in a word tag.
            chars = (function () {
                var _len2, _ref2, _results;
                _ref2 = chars.split('&nbsp;');
                _results = [];
                for (index = 0, _len2 = _ref2.length; index < _len2; index++) {
                    char = _ref2[index];
                    if (!/^\s*$/.test(char)) {
                        _results.push("<word style='white-space:nowrap'>" + char + "</word>");
                    } else {
                        _results.push(char);
                    }
                }
                return _results;
            })();
            return chars.join(' ');
        };

        // here's your 'main' method. when a click occurs, the event is passed
        // into dropBomb, which gets the x,y click coords from findClickPos, which
        // we created and oddly tagged onto the window object way up at the top.
        // then, you push the click coords onto the bombs queue.
        Explosion.prototype.dropBomb = function (event) {
            var pos;
            pos = window.findClickPos(event);
            return this.bombs.push(new Bomb(pos.x, pos.y));
        };

        // on tick, the state of the animation advances.
        Explosion.prototype.tick = function () {
            var bomb, char, _j, _k, _l, _len2, _len3, _len4, _ref2, _ref3, _ref4;
            _ref2 = this.bombs;
            // loop over all the bombs.
            for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
                bomb = _ref2[_j];
                // if the bomb's state just advanced to 'explose',
                if (bomb.state === 'explose') {
                    // call exploded() to mark the bomb as handled,
                    bomb.exploded();
                    // then set blast position to the coords of the currently-exploding bomb.
                    // looks like this will cause 2 simultaneously exploding bombs
                    // to only show one blast on the page, which probably is a fine
                    // visual experience, and keeps calculations within a frame simple.
                    this.blast = bomb.pos;
                }
            }
            // if something just exploded,
            if (this.blast != null) {
                _ref3 = this.chars;
                // update all the chars on the page, passing them the blast info.
                for (_k = 0, _len3 = _ref3.length; _k < _len3; _k++) {
                    char = _ref3[_k];
                    char.tick(this.blast);
                }
                // then null out the blast, since it's been processed
                this.blast = null;
            // if nothing exploded,
            } else {
                // update all the chars in the page, but don't pass any args into tick.
                _ref4 = this.chars;
                for (_l = 0, _len4 = _ref4.length; _l < _len4; _l++) {
                    char = _ref4[_l];
                    char.tick();
                }
            }
            // end the tick() method by calling tick() again after a short delay.
            // this causes the animation loop to run forever.
            return requestAnimationFrame(this.tick);
        };

        // finally, return the prepared constructor, even though it's really a singleton
        return Explosion;

    })();

    // end by creating the Explosion singleton, which will prepare the page, by
    // wrapping everything in <particle>s, and then start the animation loop
    new Explosion();

// & voila! it is done.
}).call(this);
