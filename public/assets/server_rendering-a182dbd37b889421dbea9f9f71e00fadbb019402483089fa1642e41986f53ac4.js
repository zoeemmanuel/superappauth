(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __export = (target, all3) => {
    for (var name in all3)
      __defProp(target, name, { get: all3[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));

  // node_modules/react/cjs/react.development.js
  var require_react_development = __commonJS({
    "node_modules/react/cjs/react.development.js"(exports, module) {
      "use strict";
      if (true) {
        (function() {
          "use strict";
          if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ !== "undefined" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart === "function") {
            __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(new Error());
          }
          var ReactVersion = "18.3.1";
          var REACT_ELEMENT_TYPE = Symbol.for("react.element");
          var REACT_PORTAL_TYPE = Symbol.for("react.portal");
          var REACT_FRAGMENT_TYPE = Symbol.for("react.fragment");
          var REACT_STRICT_MODE_TYPE = Symbol.for("react.strict_mode");
          var REACT_PROFILER_TYPE = Symbol.for("react.profiler");
          var REACT_PROVIDER_TYPE = Symbol.for("react.provider");
          var REACT_CONTEXT_TYPE = Symbol.for("react.context");
          var REACT_FORWARD_REF_TYPE = Symbol.for("react.forward_ref");
          var REACT_SUSPENSE_TYPE = Symbol.for("react.suspense");
          var REACT_SUSPENSE_LIST_TYPE = Symbol.for("react.suspense_list");
          var REACT_MEMO_TYPE = Symbol.for("react.memo");
          var REACT_LAZY_TYPE = Symbol.for("react.lazy");
          var REACT_OFFSCREEN_TYPE = Symbol.for("react.offscreen");
          var MAYBE_ITERATOR_SYMBOL = Symbol.iterator;
          var FAUX_ITERATOR_SYMBOL = "@@iterator";
          function getIteratorFn(maybeIterable) {
            if (maybeIterable === null || typeof maybeIterable !== "object") {
              return null;
            }
            var maybeIterator = MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL];
            if (typeof maybeIterator === "function") {
              return maybeIterator;
            }
            return null;
          }
          var ReactCurrentDispatcher = {
            /**
             * @internal
             * @type {ReactComponent}
             */
            current: null
          };
          var ReactCurrentBatchConfig = {
            transition: null
          };
          var ReactCurrentActQueue = {
            current: null,
            // Used to reproduce behavior of `batchedUpdates` in legacy mode.
            isBatchingLegacy: false,
            didScheduleLegacyUpdate: false
          };
          var ReactCurrentOwner = {
            /**
             * @internal
             * @type {ReactComponent}
             */
            current: null
          };
          var ReactDebugCurrentFrame = {};
          var currentExtraStackFrame = null;
          function setExtraStackFrame(stack) {
            {
              currentExtraStackFrame = stack;
            }
          }
          {
            ReactDebugCurrentFrame.setExtraStackFrame = function(stack) {
              {
                currentExtraStackFrame = stack;
              }
            };
            ReactDebugCurrentFrame.getCurrentStack = null;
            ReactDebugCurrentFrame.getStackAddendum = function() {
              var stack = "";
              if (currentExtraStackFrame) {
                stack += currentExtraStackFrame;
              }
              var impl = ReactDebugCurrentFrame.getCurrentStack;
              if (impl) {
                stack += impl() || "";
              }
              return stack;
            };
          }
          var enableScopeAPI = false;
          var enableCacheElement = false;
          var enableTransitionTracing = false;
          var enableLegacyHidden = false;
          var enableDebugTracing = false;
          var ReactSharedInternals = {
            ReactCurrentDispatcher,
            ReactCurrentBatchConfig,
            ReactCurrentOwner
          };
          {
            ReactSharedInternals.ReactDebugCurrentFrame = ReactDebugCurrentFrame;
            ReactSharedInternals.ReactCurrentActQueue = ReactCurrentActQueue;
          }
          function warn(format) {
            {
              {
                for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                  args[_key - 1] = arguments[_key];
                }
                printWarning("warn", format, args);
              }
            }
          }
          function error(format) {
            {
              {
                for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
                  args[_key2 - 1] = arguments[_key2];
                }
                printWarning("error", format, args);
              }
            }
          }
          function printWarning(level, format, args) {
            {
              var ReactDebugCurrentFrame2 = ReactSharedInternals.ReactDebugCurrentFrame;
              var stack = ReactDebugCurrentFrame2.getStackAddendum();
              if (stack !== "") {
                format += "%s";
                args = args.concat([stack]);
              }
              var argsWithFormat = args.map(function(item) {
                return String(item);
              });
              argsWithFormat.unshift("Warning: " + format);
              Function.prototype.apply.call(console[level], console, argsWithFormat);
            }
          }
          var didWarnStateUpdateForUnmountedComponent = {};
          function warnNoop(publicInstance, callerName) {
            {
              var _constructor = publicInstance.constructor;
              var componentName = _constructor && (_constructor.displayName || _constructor.name) || "ReactClass";
              var warningKey = componentName + "." + callerName;
              if (didWarnStateUpdateForUnmountedComponent[warningKey]) {
                return;
              }
              error("Can't call %s on a component that is not yet mounted. This is a no-op, but it might indicate a bug in your application. Instead, assign to `this.state` directly or define a `state = {};` class property with the desired state in the %s component.", callerName, componentName);
              didWarnStateUpdateForUnmountedComponent[warningKey] = true;
            }
          }
          var ReactNoopUpdateQueue = {
            /**
             * Checks whether or not this composite component is mounted.
             * @param {ReactClass} publicInstance The instance we want to test.
             * @return {boolean} True if mounted, false otherwise.
             * @protected
             * @final
             */
            isMounted: function(publicInstance) {
              return false;
            },
            /**
             * Forces an update. This should only be invoked when it is known with
             * certainty that we are **not** in a DOM transaction.
             *
             * You may want to call this when you know that some deeper aspect of the
             * component's state has changed but `setState` was not called.
             *
             * This will not invoke `shouldComponentUpdate`, but it will invoke
             * `componentWillUpdate` and `componentDidUpdate`.
             *
             * @param {ReactClass} publicInstance The instance that should rerender.
             * @param {?function} callback Called after component is updated.
             * @param {?string} callerName name of the calling function in the public API.
             * @internal
             */
            enqueueForceUpdate: function(publicInstance, callback, callerName) {
              warnNoop(publicInstance, "forceUpdate");
            },
            /**
             * Replaces all of the state. Always use this or `setState` to mutate state.
             * You should treat `this.state` as immutable.
             *
             * There is no guarantee that `this.state` will be immediately updated, so
             * accessing `this.state` after calling this method may return the old value.
             *
             * @param {ReactClass} publicInstance The instance that should rerender.
             * @param {object} completeState Next state.
             * @param {?function} callback Called after component is updated.
             * @param {?string} callerName name of the calling function in the public API.
             * @internal
             */
            enqueueReplaceState: function(publicInstance, completeState, callback, callerName) {
              warnNoop(publicInstance, "replaceState");
            },
            /**
             * Sets a subset of the state. This only exists because _pendingState is
             * internal. This provides a merging strategy that is not available to deep
             * properties which is confusing. TODO: Expose pendingState or don't use it
             * during the merge.
             *
             * @param {ReactClass} publicInstance The instance that should rerender.
             * @param {object} partialState Next partial state to be merged with state.
             * @param {?function} callback Called after component is updated.
             * @param {?string} Name of the calling function in the public API.
             * @internal
             */
            enqueueSetState: function(publicInstance, partialState, callback, callerName) {
              warnNoop(publicInstance, "setState");
            }
          };
          var assign = Object.assign;
          var emptyObject = {};
          {
            Object.freeze(emptyObject);
          }
          function Component(props, context, updater) {
            this.props = props;
            this.context = context;
            this.refs = emptyObject;
            this.updater = updater || ReactNoopUpdateQueue;
          }
          Component.prototype.isReactComponent = {};
          Component.prototype.setState = function(partialState, callback) {
            if (typeof partialState !== "object" && typeof partialState !== "function" && partialState != null) {
              throw new Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
            }
            this.updater.enqueueSetState(this, partialState, callback, "setState");
          };
          Component.prototype.forceUpdate = function(callback) {
            this.updater.enqueueForceUpdate(this, callback, "forceUpdate");
          };
          {
            var deprecatedAPIs = {
              isMounted: ["isMounted", "Instead, make sure to clean up subscriptions and pending requests in componentWillUnmount to prevent memory leaks."],
              replaceState: ["replaceState", "Refactor your code to use setState instead (see https://github.com/facebook/react/issues/3236)."]
            };
            var defineDeprecationWarning = function(methodName, info) {
              Object.defineProperty(Component.prototype, methodName, {
                get: function() {
                  warn("%s(...) is deprecated in plain JavaScript React classes. %s", info[0], info[1]);
                  return void 0;
                }
              });
            };
            for (var fnName in deprecatedAPIs) {
              if (deprecatedAPIs.hasOwnProperty(fnName)) {
                defineDeprecationWarning(fnName, deprecatedAPIs[fnName]);
              }
            }
          }
          function ComponentDummy() {
          }
          ComponentDummy.prototype = Component.prototype;
          function PureComponent(props, context, updater) {
            this.props = props;
            this.context = context;
            this.refs = emptyObject;
            this.updater = updater || ReactNoopUpdateQueue;
          }
          var pureComponentPrototype = PureComponent.prototype = new ComponentDummy();
          pureComponentPrototype.constructor = PureComponent;
          assign(pureComponentPrototype, Component.prototype);
          pureComponentPrototype.isPureReactComponent = true;
          function createRef() {
            var refObject = {
              current: null
            };
            {
              Object.seal(refObject);
            }
            return refObject;
          }
          var isArrayImpl = Array.isArray;
          function isArray2(a) {
            return isArrayImpl(a);
          }
          function typeName(value) {
            {
              var hasToStringTag = typeof Symbol === "function" && Symbol.toStringTag;
              var type = hasToStringTag && value[Symbol.toStringTag] || value.constructor.name || "Object";
              return type;
            }
          }
          function willCoercionThrow(value) {
            {
              try {
                testStringCoercion(value);
                return false;
              } catch (e) {
                return true;
              }
            }
          }
          function testStringCoercion(value) {
            return "" + value;
          }
          function checkKeyStringCoercion(value) {
            {
              if (willCoercionThrow(value)) {
                error("The provided key is an unsupported type %s. This value must be coerced to a string before before using it here.", typeName(value));
                return testStringCoercion(value);
              }
            }
          }
          function getWrappedName(outerType, innerType, wrapperName) {
            var displayName = outerType.displayName;
            if (displayName) {
              return displayName;
            }
            var functionName = innerType.displayName || innerType.name || "";
            return functionName !== "" ? wrapperName + "(" + functionName + ")" : wrapperName;
          }
          function getContextName(type) {
            return type.displayName || "Context";
          }
          function getComponentNameFromType(type) {
            if (type == null) {
              return null;
            }
            {
              if (typeof type.tag === "number") {
                error("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue.");
              }
            }
            if (typeof type === "function") {
              return type.displayName || type.name || null;
            }
            if (typeof type === "string") {
              return type;
            }
            switch (type) {
              case REACT_FRAGMENT_TYPE:
                return "Fragment";
              case REACT_PORTAL_TYPE:
                return "Portal";
              case REACT_PROFILER_TYPE:
                return "Profiler";
              case REACT_STRICT_MODE_TYPE:
                return "StrictMode";
              case REACT_SUSPENSE_TYPE:
                return "Suspense";
              case REACT_SUSPENSE_LIST_TYPE:
                return "SuspenseList";
            }
            if (typeof type === "object") {
              switch (type.$$typeof) {
                case REACT_CONTEXT_TYPE:
                  var context = type;
                  return getContextName(context) + ".Consumer";
                case REACT_PROVIDER_TYPE:
                  var provider = type;
                  return getContextName(provider._context) + ".Provider";
                case REACT_FORWARD_REF_TYPE:
                  return getWrappedName(type, type.render, "ForwardRef");
                case REACT_MEMO_TYPE:
                  var outerName = type.displayName || null;
                  if (outerName !== null) {
                    return outerName;
                  }
                  return getComponentNameFromType(type.type) || "Memo";
                case REACT_LAZY_TYPE: {
                  var lazyComponent = type;
                  var payload = lazyComponent._payload;
                  var init = lazyComponent._init;
                  try {
                    return getComponentNameFromType(init(payload));
                  } catch (x) {
                    return null;
                  }
                }
              }
            }
            return null;
          }
          var hasOwnProperty2 = Object.prototype.hasOwnProperty;
          var RESERVED_PROPS = {
            key: true,
            ref: true,
            __self: true,
            __source: true
          };
          var specialPropKeyWarningShown, specialPropRefWarningShown, didWarnAboutStringRefs;
          {
            didWarnAboutStringRefs = {};
          }
          function hasValidRef(config) {
            {
              if (hasOwnProperty2.call(config, "ref")) {
                var getter = Object.getOwnPropertyDescriptor(config, "ref").get;
                if (getter && getter.isReactWarning) {
                  return false;
                }
              }
            }
            return config.ref !== void 0;
          }
          function hasValidKey(config) {
            {
              if (hasOwnProperty2.call(config, "key")) {
                var getter = Object.getOwnPropertyDescriptor(config, "key").get;
                if (getter && getter.isReactWarning) {
                  return false;
                }
              }
            }
            return config.key !== void 0;
          }
          function defineKeyPropWarningGetter(props, displayName) {
            var warnAboutAccessingKey = function() {
              {
                if (!specialPropKeyWarningShown) {
                  specialPropKeyWarningShown = true;
                  error("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", displayName);
                }
              }
            };
            warnAboutAccessingKey.isReactWarning = true;
            Object.defineProperty(props, "key", {
              get: warnAboutAccessingKey,
              configurable: true
            });
          }
          function defineRefPropWarningGetter(props, displayName) {
            var warnAboutAccessingRef = function() {
              {
                if (!specialPropRefWarningShown) {
                  specialPropRefWarningShown = true;
                  error("%s: `ref` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", displayName);
                }
              }
            };
            warnAboutAccessingRef.isReactWarning = true;
            Object.defineProperty(props, "ref", {
              get: warnAboutAccessingRef,
              configurable: true
            });
          }
          function warnIfStringRefCannotBeAutoConverted(config) {
            {
              if (typeof config.ref === "string" && ReactCurrentOwner.current && config.__self && ReactCurrentOwner.current.stateNode !== config.__self) {
                var componentName = getComponentNameFromType(ReactCurrentOwner.current.type);
                if (!didWarnAboutStringRefs[componentName]) {
                  error('Component "%s" contains the string ref "%s". Support for string refs will be removed in a future major release. This case cannot be automatically converted to an arrow function. We ask you to manually fix this case by using useRef() or createRef() instead. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-string-ref', componentName, config.ref);
                  didWarnAboutStringRefs[componentName] = true;
                }
              }
            }
          }
          var ReactElement = function(type, key, ref, self2, source, owner, props) {
            var element = {
              // This tag allows us to uniquely identify this as a React Element
              $$typeof: REACT_ELEMENT_TYPE,
              // Built-in properties that belong on the element
              type,
              key,
              ref,
              props,
              // Record the component responsible for creating this element.
              _owner: owner
            };
            {
              element._store = {};
              Object.defineProperty(element._store, "validated", {
                configurable: false,
                enumerable: false,
                writable: true,
                value: false
              });
              Object.defineProperty(element, "_self", {
                configurable: false,
                enumerable: false,
                writable: false,
                value: self2
              });
              Object.defineProperty(element, "_source", {
                configurable: false,
                enumerable: false,
                writable: false,
                value: source
              });
              if (Object.freeze) {
                Object.freeze(element.props);
                Object.freeze(element);
              }
            }
            return element;
          };
          function createElement2(type, config, children) {
            var propName;
            var props = {};
            var key = null;
            var ref = null;
            var self2 = null;
            var source = null;
            if (config != null) {
              if (hasValidRef(config)) {
                ref = config.ref;
                {
                  warnIfStringRefCannotBeAutoConverted(config);
                }
              }
              if (hasValidKey(config)) {
                {
                  checkKeyStringCoercion(config.key);
                }
                key = "" + config.key;
              }
              self2 = config.__self === void 0 ? null : config.__self;
              source = config.__source === void 0 ? null : config.__source;
              for (propName in config) {
                if (hasOwnProperty2.call(config, propName) && !RESERVED_PROPS.hasOwnProperty(propName)) {
                  props[propName] = config[propName];
                }
              }
            }
            var childrenLength = arguments.length - 2;
            if (childrenLength === 1) {
              props.children = children;
            } else if (childrenLength > 1) {
              var childArray = Array(childrenLength);
              for (var i = 0; i < childrenLength; i++) {
                childArray[i] = arguments[i + 2];
              }
              {
                if (Object.freeze) {
                  Object.freeze(childArray);
                }
              }
              props.children = childArray;
            }
            if (type && type.defaultProps) {
              var defaultProps = type.defaultProps;
              for (propName in defaultProps) {
                if (props[propName] === void 0) {
                  props[propName] = defaultProps[propName];
                }
              }
            }
            {
              if (key || ref) {
                var displayName = typeof type === "function" ? type.displayName || type.name || "Unknown" : type;
                if (key) {
                  defineKeyPropWarningGetter(props, displayName);
                }
                if (ref) {
                  defineRefPropWarningGetter(props, displayName);
                }
              }
            }
            return ReactElement(type, key, ref, self2, source, ReactCurrentOwner.current, props);
          }
          function cloneAndReplaceKey(oldElement, newKey) {
            var newElement = ReactElement(oldElement.type, newKey, oldElement.ref, oldElement._self, oldElement._source, oldElement._owner, oldElement.props);
            return newElement;
          }
          function cloneElement(element, config, children) {
            if (element === null || element === void 0) {
              throw new Error("React.cloneElement(...): The argument must be a React element, but you passed " + element + ".");
            }
            var propName;
            var props = assign({}, element.props);
            var key = element.key;
            var ref = element.ref;
            var self2 = element._self;
            var source = element._source;
            var owner = element._owner;
            if (config != null) {
              if (hasValidRef(config)) {
                ref = config.ref;
                owner = ReactCurrentOwner.current;
              }
              if (hasValidKey(config)) {
                {
                  checkKeyStringCoercion(config.key);
                }
                key = "" + config.key;
              }
              var defaultProps;
              if (element.type && element.type.defaultProps) {
                defaultProps = element.type.defaultProps;
              }
              for (propName in config) {
                if (hasOwnProperty2.call(config, propName) && !RESERVED_PROPS.hasOwnProperty(propName)) {
                  if (config[propName] === void 0 && defaultProps !== void 0) {
                    props[propName] = defaultProps[propName];
                  } else {
                    props[propName] = config[propName];
                  }
                }
              }
            }
            var childrenLength = arguments.length - 2;
            if (childrenLength === 1) {
              props.children = children;
            } else if (childrenLength > 1) {
              var childArray = Array(childrenLength);
              for (var i = 0; i < childrenLength; i++) {
                childArray[i] = arguments[i + 2];
              }
              props.children = childArray;
            }
            return ReactElement(element.type, key, ref, self2, source, owner, props);
          }
          function isValidElement(object) {
            return typeof object === "object" && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
          }
          var SEPARATOR = ".";
          var SUBSEPARATOR = ":";
          function escape(key) {
            var escapeRegex = /[=:]/g;
            var escaperLookup = {
              "=": "=0",
              ":": "=2"
            };
            var escapedString = key.replace(escapeRegex, function(match) {
              return escaperLookup[match];
            });
            return "$" + escapedString;
          }
          var didWarnAboutMaps = false;
          var userProvidedKeyEscapeRegex = /\/+/g;
          function escapeUserProvidedKey(text) {
            return text.replace(userProvidedKeyEscapeRegex, "$&/");
          }
          function getElementKey(element, index) {
            if (typeof element === "object" && element !== null && element.key != null) {
              {
                checkKeyStringCoercion(element.key);
              }
              return escape("" + element.key);
            }
            return index.toString(36);
          }
          function mapIntoArray(children, array, escapedPrefix, nameSoFar, callback) {
            var type = typeof children;
            if (type === "undefined" || type === "boolean") {
              children = null;
            }
            var invokeCallback = false;
            if (children === null) {
              invokeCallback = true;
            } else {
              switch (type) {
                case "string":
                case "number":
                  invokeCallback = true;
                  break;
                case "object":
                  switch (children.$$typeof) {
                    case REACT_ELEMENT_TYPE:
                    case REACT_PORTAL_TYPE:
                      invokeCallback = true;
                  }
              }
            }
            if (invokeCallback) {
              var _child = children;
              var mappedChild = callback(_child);
              var childKey = nameSoFar === "" ? SEPARATOR + getElementKey(_child, 0) : nameSoFar;
              if (isArray2(mappedChild)) {
                var escapedChildKey = "";
                if (childKey != null) {
                  escapedChildKey = escapeUserProvidedKey(childKey) + "/";
                }
                mapIntoArray(mappedChild, array, escapedChildKey, "", function(c) {
                  return c;
                });
              } else if (mappedChild != null) {
                if (isValidElement(mappedChild)) {
                  {
                    if (mappedChild.key && (!_child || _child.key !== mappedChild.key)) {
                      checkKeyStringCoercion(mappedChild.key);
                    }
                  }
                  mappedChild = cloneAndReplaceKey(
                    mappedChild,
                    // Keep both the (mapped) and old keys if they differ, just as
                    // traverseAllChildren used to do for objects as children
                    escapedPrefix + // $FlowFixMe Flow incorrectly thinks React.Portal doesn't have a key
                    (mappedChild.key && (!_child || _child.key !== mappedChild.key) ? (
                      // $FlowFixMe Flow incorrectly thinks existing element's key can be a number
                      // eslint-disable-next-line react-internal/safe-string-coercion
                      escapeUserProvidedKey("" + mappedChild.key) + "/"
                    ) : "") + childKey
                  );
                }
                array.push(mappedChild);
              }
              return 1;
            }
            var child;
            var nextName;
            var subtreeCount = 0;
            var nextNamePrefix = nameSoFar === "" ? SEPARATOR : nameSoFar + SUBSEPARATOR;
            if (isArray2(children)) {
              for (var i = 0; i < children.length; i++) {
                child = children[i];
                nextName = nextNamePrefix + getElementKey(child, i);
                subtreeCount += mapIntoArray(child, array, escapedPrefix, nextName, callback);
              }
            } else {
              var iteratorFn = getIteratorFn(children);
              if (typeof iteratorFn === "function") {
                var iterableChildren = children;
                {
                  if (iteratorFn === iterableChildren.entries) {
                    if (!didWarnAboutMaps) {
                      warn("Using Maps as children is not supported. Use an array of keyed ReactElements instead.");
                    }
                    didWarnAboutMaps = true;
                  }
                }
                var iterator = iteratorFn.call(iterableChildren);
                var step;
                var ii = 0;
                while (!(step = iterator.next()).done) {
                  child = step.value;
                  nextName = nextNamePrefix + getElementKey(child, ii++);
                  subtreeCount += mapIntoArray(child, array, escapedPrefix, nextName, callback);
                }
              } else if (type === "object") {
                var childrenString = String(children);
                throw new Error("Objects are not valid as a React child (found: " + (childrenString === "[object Object]" ? "object with keys {" + Object.keys(children).join(", ") + "}" : childrenString) + "). If you meant to render a collection of children, use an array instead.");
              }
            }
            return subtreeCount;
          }
          function mapChildren(children, func, context) {
            if (children == null) {
              return children;
            }
            var result = [];
            var count = 0;
            mapIntoArray(children, result, "", "", function(child) {
              return func.call(context, child, count++);
            });
            return result;
          }
          function countChildren(children) {
            var n = 0;
            mapChildren(children, function() {
              n++;
            });
            return n;
          }
          function forEachChildren(children, forEachFunc, forEachContext) {
            mapChildren(children, function() {
              forEachFunc.apply(this, arguments);
            }, forEachContext);
          }
          function toArray2(children) {
            return mapChildren(children, function(child) {
              return child;
            }) || [];
          }
          function onlyChild(children) {
            if (!isValidElement(children)) {
              throw new Error("React.Children.only expected to receive a single React element child.");
            }
            return children;
          }
          function createContext(defaultValue) {
            var context = {
              $$typeof: REACT_CONTEXT_TYPE,
              // As a workaround to support multiple concurrent renderers, we categorize
              // some renderers as primary and others as secondary. We only expect
              // there to be two concurrent renderers at most: React Native (primary) and
              // Fabric (secondary); React DOM (primary) and React ART (secondary).
              // Secondary renderers store their context values on separate fields.
              _currentValue: defaultValue,
              _currentValue2: defaultValue,
              // Used to track how many concurrent renderers this context currently
              // supports within in a single renderer. Such as parallel server rendering.
              _threadCount: 0,
              // These are circular
              Provider: null,
              Consumer: null,
              // Add these to use same hidden class in VM as ServerContext
              _defaultValue: null,
              _globalName: null
            };
            context.Provider = {
              $$typeof: REACT_PROVIDER_TYPE,
              _context: context
            };
            var hasWarnedAboutUsingNestedContextConsumers = false;
            var hasWarnedAboutUsingConsumerProvider = false;
            var hasWarnedAboutDisplayNameOnConsumer = false;
            {
              var Consumer = {
                $$typeof: REACT_CONTEXT_TYPE,
                _context: context
              };
              Object.defineProperties(Consumer, {
                Provider: {
                  get: function() {
                    if (!hasWarnedAboutUsingConsumerProvider) {
                      hasWarnedAboutUsingConsumerProvider = true;
                      error("Rendering <Context.Consumer.Provider> is not supported and will be removed in a future major release. Did you mean to render <Context.Provider> instead?");
                    }
                    return context.Provider;
                  },
                  set: function(_Provider) {
                    context.Provider = _Provider;
                  }
                },
                _currentValue: {
                  get: function() {
                    return context._currentValue;
                  },
                  set: function(_currentValue) {
                    context._currentValue = _currentValue;
                  }
                },
                _currentValue2: {
                  get: function() {
                    return context._currentValue2;
                  },
                  set: function(_currentValue2) {
                    context._currentValue2 = _currentValue2;
                  }
                },
                _threadCount: {
                  get: function() {
                    return context._threadCount;
                  },
                  set: function(_threadCount) {
                    context._threadCount = _threadCount;
                  }
                },
                Consumer: {
                  get: function() {
                    if (!hasWarnedAboutUsingNestedContextConsumers) {
                      hasWarnedAboutUsingNestedContextConsumers = true;
                      error("Rendering <Context.Consumer.Consumer> is not supported and will be removed in a future major release. Did you mean to render <Context.Consumer> instead?");
                    }
                    return context.Consumer;
                  }
                },
                displayName: {
                  get: function() {
                    return context.displayName;
                  },
                  set: function(displayName) {
                    if (!hasWarnedAboutDisplayNameOnConsumer) {
                      warn("Setting `displayName` on Context.Consumer has no effect. You should set it directly on the context with Context.displayName = '%s'.", displayName);
                      hasWarnedAboutDisplayNameOnConsumer = true;
                    }
                  }
                }
              });
              context.Consumer = Consumer;
            }
            {
              context._currentRenderer = null;
              context._currentRenderer2 = null;
            }
            return context;
          }
          var Uninitialized = -1;
          var Pending = 0;
          var Resolved = 1;
          var Rejected = 2;
          function lazyInitializer(payload) {
            if (payload._status === Uninitialized) {
              var ctor = payload._result;
              var thenable = ctor();
              thenable.then(function(moduleObject2) {
                if (payload._status === Pending || payload._status === Uninitialized) {
                  var resolved = payload;
                  resolved._status = Resolved;
                  resolved._result = moduleObject2;
                }
              }, function(error2) {
                if (payload._status === Pending || payload._status === Uninitialized) {
                  var rejected = payload;
                  rejected._status = Rejected;
                  rejected._result = error2;
                }
              });
              if (payload._status === Uninitialized) {
                var pending = payload;
                pending._status = Pending;
                pending._result = thenable;
              }
            }
            if (payload._status === Resolved) {
              var moduleObject = payload._result;
              {
                if (moduleObject === void 0) {
                  error("lazy: Expected the result of a dynamic import() call. Instead received: %s\n\nYour code should look like: \n  const MyComponent = lazy(() => import('./MyComponent'))\n\nDid you accidentally put curly braces around the import?", moduleObject);
                }
              }
              {
                if (!("default" in moduleObject)) {
                  error("lazy: Expected the result of a dynamic import() call. Instead received: %s\n\nYour code should look like: \n  const MyComponent = lazy(() => import('./MyComponent'))", moduleObject);
                }
              }
              return moduleObject.default;
            } else {
              throw payload._result;
            }
          }
          function lazy(ctor) {
            var payload = {
              // We use these fields to store the result.
              _status: Uninitialized,
              _result: ctor
            };
            var lazyType = {
              $$typeof: REACT_LAZY_TYPE,
              _payload: payload,
              _init: lazyInitializer
            };
            {
              var defaultProps;
              var propTypes;
              Object.defineProperties(lazyType, {
                defaultProps: {
                  configurable: true,
                  get: function() {
                    return defaultProps;
                  },
                  set: function(newDefaultProps) {
                    error("React.lazy(...): It is not supported to assign `defaultProps` to a lazy component import. Either specify them where the component is defined, or create a wrapping component around it.");
                    defaultProps = newDefaultProps;
                    Object.defineProperty(lazyType, "defaultProps", {
                      enumerable: true
                    });
                  }
                },
                propTypes: {
                  configurable: true,
                  get: function() {
                    return propTypes;
                  },
                  set: function(newPropTypes) {
                    error("React.lazy(...): It is not supported to assign `propTypes` to a lazy component import. Either specify them where the component is defined, or create a wrapping component around it.");
                    propTypes = newPropTypes;
                    Object.defineProperty(lazyType, "propTypes", {
                      enumerable: true
                    });
                  }
                }
              });
            }
            return lazyType;
          }
          function forwardRef2(render) {
            {
              if (render != null && render.$$typeof === REACT_MEMO_TYPE) {
                error("forwardRef requires a render function but received a `memo` component. Instead of forwardRef(memo(...)), use memo(forwardRef(...)).");
              } else if (typeof render !== "function") {
                error("forwardRef requires a render function but was given %s.", render === null ? "null" : typeof render);
              } else {
                if (render.length !== 0 && render.length !== 2) {
                  error("forwardRef render functions accept exactly two parameters: props and ref. %s", render.length === 1 ? "Did you forget to use the ref parameter?" : "Any additional parameter will be undefined.");
                }
              }
              if (render != null) {
                if (render.defaultProps != null || render.propTypes != null) {
                  error("forwardRef render functions do not support propTypes or defaultProps. Did you accidentally pass a React component?");
                }
              }
            }
            var elementType = {
              $$typeof: REACT_FORWARD_REF_TYPE,
              render
            };
            {
              var ownName;
              Object.defineProperty(elementType, "displayName", {
                enumerable: false,
                configurable: true,
                get: function() {
                  return ownName;
                },
                set: function(name) {
                  ownName = name;
                  if (!render.name && !render.displayName) {
                    render.displayName = name;
                  }
                }
              });
            }
            return elementType;
          }
          var REACT_MODULE_REFERENCE;
          {
            REACT_MODULE_REFERENCE = Symbol.for("react.module.reference");
          }
          function isValidElementType(type) {
            if (typeof type === "string" || typeof type === "function") {
              return true;
            }
            if (type === REACT_FRAGMENT_TYPE || type === REACT_PROFILER_TYPE || enableDebugTracing || type === REACT_STRICT_MODE_TYPE || type === REACT_SUSPENSE_TYPE || type === REACT_SUSPENSE_LIST_TYPE || enableLegacyHidden || type === REACT_OFFSCREEN_TYPE || enableScopeAPI || enableCacheElement || enableTransitionTracing) {
              return true;
            }
            if (typeof type === "object" && type !== null) {
              if (type.$$typeof === REACT_LAZY_TYPE || type.$$typeof === REACT_MEMO_TYPE || type.$$typeof === REACT_PROVIDER_TYPE || type.$$typeof === REACT_CONTEXT_TYPE || type.$$typeof === REACT_FORWARD_REF_TYPE || // This needs to include all possible module reference object
              // types supported by any Flight configuration anywhere since
              // we don't know which Flight build this will end up being used
              // with.
              type.$$typeof === REACT_MODULE_REFERENCE || type.getModuleId !== void 0) {
                return true;
              }
            }
            return false;
          }
          function memo(type, compare) {
            {
              if (!isValidElementType(type)) {
                error("memo: The first argument must be a component. Instead received: %s", type === null ? "null" : typeof type);
              }
            }
            var elementType = {
              $$typeof: REACT_MEMO_TYPE,
              type,
              compare: compare === void 0 ? null : compare
            };
            {
              var ownName;
              Object.defineProperty(elementType, "displayName", {
                enumerable: false,
                configurable: true,
                get: function() {
                  return ownName;
                },
                set: function(name) {
                  ownName = name;
                  if (!type.name && !type.displayName) {
                    type.displayName = name;
                  }
                }
              });
            }
            return elementType;
          }
          function resolveDispatcher() {
            var dispatcher = ReactCurrentDispatcher.current;
            {
              if (dispatcher === null) {
                error("Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:\n1. You might have mismatching versions of React and the renderer (such as React DOM)\n2. You might be breaking the Rules of Hooks\n3. You might have more than one copy of React in the same app\nSee https://reactjs.org/link/invalid-hook-call for tips about how to debug and fix this problem.");
              }
            }
            return dispatcher;
          }
          function useContext(Context) {
            var dispatcher = resolveDispatcher();
            {
              if (Context._context !== void 0) {
                var realContext = Context._context;
                if (realContext.Consumer === Context) {
                  error("Calling useContext(Context.Consumer) is not supported, may cause bugs, and will be removed in a future major release. Did you mean to call useContext(Context) instead?");
                } else if (realContext.Provider === Context) {
                  error("Calling useContext(Context.Provider) is not supported. Did you mean to call useContext(Context) instead?");
                }
              }
            }
            return dispatcher.useContext(Context);
          }
          function useState2(initialState) {
            var dispatcher = resolveDispatcher();
            return dispatcher.useState(initialState);
          }
          function useReducer(reducer, initialArg, init) {
            var dispatcher = resolveDispatcher();
            return dispatcher.useReducer(reducer, initialArg, init);
          }
          function useRef2(initialValue) {
            var dispatcher = resolveDispatcher();
            return dispatcher.useRef(initialValue);
          }
          function useEffect2(create, deps) {
            var dispatcher = resolveDispatcher();
            return dispatcher.useEffect(create, deps);
          }
          function useInsertionEffect(create, deps) {
            var dispatcher = resolveDispatcher();
            return dispatcher.useInsertionEffect(create, deps);
          }
          function useLayoutEffect(create, deps) {
            var dispatcher = resolveDispatcher();
            return dispatcher.useLayoutEffect(create, deps);
          }
          function useCallback2(callback, deps) {
            var dispatcher = resolveDispatcher();
            return dispatcher.useCallback(callback, deps);
          }
          function useMemo(create, deps) {
            var dispatcher = resolveDispatcher();
            return dispatcher.useMemo(create, deps);
          }
          function useImperativeHandle(ref, create, deps) {
            var dispatcher = resolveDispatcher();
            return dispatcher.useImperativeHandle(ref, create, deps);
          }
          function useDebugValue(value, formatterFn) {
            {
              var dispatcher = resolveDispatcher();
              return dispatcher.useDebugValue(value, formatterFn);
            }
          }
          function useTransition() {
            var dispatcher = resolveDispatcher();
            return dispatcher.useTransition();
          }
          function useDeferredValue(value) {
            var dispatcher = resolveDispatcher();
            return dispatcher.useDeferredValue(value);
          }
          function useId() {
            var dispatcher = resolveDispatcher();
            return dispatcher.useId();
          }
          function useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot) {
            var dispatcher = resolveDispatcher();
            return dispatcher.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
          }
          var disabledDepth = 0;
          var prevLog;
          var prevInfo;
          var prevWarn;
          var prevError;
          var prevGroup;
          var prevGroupCollapsed;
          var prevGroupEnd;
          function disabledLog() {
          }
          disabledLog.__reactDisabledLog = true;
          function disableLogs() {
            {
              if (disabledDepth === 0) {
                prevLog = console.log;
                prevInfo = console.info;
                prevWarn = console.warn;
                prevError = console.error;
                prevGroup = console.group;
                prevGroupCollapsed = console.groupCollapsed;
                prevGroupEnd = console.groupEnd;
                var props = {
                  configurable: true,
                  enumerable: true,
                  value: disabledLog,
                  writable: true
                };
                Object.defineProperties(console, {
                  info: props,
                  log: props,
                  warn: props,
                  error: props,
                  group: props,
                  groupCollapsed: props,
                  groupEnd: props
                });
              }
              disabledDepth++;
            }
          }
          function reenableLogs() {
            {
              disabledDepth--;
              if (disabledDepth === 0) {
                var props = {
                  configurable: true,
                  enumerable: true,
                  writable: true
                };
                Object.defineProperties(console, {
                  log: assign({}, props, {
                    value: prevLog
                  }),
                  info: assign({}, props, {
                    value: prevInfo
                  }),
                  warn: assign({}, props, {
                    value: prevWarn
                  }),
                  error: assign({}, props, {
                    value: prevError
                  }),
                  group: assign({}, props, {
                    value: prevGroup
                  }),
                  groupCollapsed: assign({}, props, {
                    value: prevGroupCollapsed
                  }),
                  groupEnd: assign({}, props, {
                    value: prevGroupEnd
                  })
                });
              }
              if (disabledDepth < 0) {
                error("disabledDepth fell below zero. This is a bug in React. Please file an issue.");
              }
            }
          }
          var ReactCurrentDispatcher$1 = ReactSharedInternals.ReactCurrentDispatcher;
          var prefix;
          function describeBuiltInComponentFrame(name, source, ownerFn) {
            {
              if (prefix === void 0) {
                try {
                  throw Error();
                } catch (x) {
                  var match = x.stack.trim().match(/\n( *(at )?)/);
                  prefix = match && match[1] || "";
                }
              }
              return "\n" + prefix + name;
            }
          }
          var reentry = false;
          var componentFrameCache;
          {
            var PossiblyWeakMap = typeof WeakMap === "function" ? WeakMap : Map;
            componentFrameCache = new PossiblyWeakMap();
          }
          function describeNativeComponentFrame(fn, construct) {
            if (!fn || reentry) {
              return "";
            }
            {
              var frame = componentFrameCache.get(fn);
              if (frame !== void 0) {
                return frame;
              }
            }
            var control;
            reentry = true;
            var previousPrepareStackTrace = Error.prepareStackTrace;
            Error.prepareStackTrace = void 0;
            var previousDispatcher;
            {
              previousDispatcher = ReactCurrentDispatcher$1.current;
              ReactCurrentDispatcher$1.current = null;
              disableLogs();
            }
            try {
              if (construct) {
                var Fake = function() {
                  throw Error();
                };
                Object.defineProperty(Fake.prototype, "props", {
                  set: function() {
                    throw Error();
                  }
                });
                if (typeof Reflect === "object" && Reflect.construct) {
                  try {
                    Reflect.construct(Fake, []);
                  } catch (x) {
                    control = x;
                  }
                  Reflect.construct(fn, [], Fake);
                } else {
                  try {
                    Fake.call();
                  } catch (x) {
                    control = x;
                  }
                  fn.call(Fake.prototype);
                }
              } else {
                try {
                  throw Error();
                } catch (x) {
                  control = x;
                }
                fn();
              }
            } catch (sample) {
              if (sample && control && typeof sample.stack === "string") {
                var sampleLines = sample.stack.split("\n");
                var controlLines = control.stack.split("\n");
                var s = sampleLines.length - 1;
                var c = controlLines.length - 1;
                while (s >= 1 && c >= 0 && sampleLines[s] !== controlLines[c]) {
                  c--;
                }
                for (; s >= 1 && c >= 0; s--, c--) {
                  if (sampleLines[s] !== controlLines[c]) {
                    if (s !== 1 || c !== 1) {
                      do {
                        s--;
                        c--;
                        if (c < 0 || sampleLines[s] !== controlLines[c]) {
                          var _frame = "\n" + sampleLines[s].replace(" at new ", " at ");
                          if (fn.displayName && _frame.includes("<anonymous>")) {
                            _frame = _frame.replace("<anonymous>", fn.displayName);
                          }
                          {
                            if (typeof fn === "function") {
                              componentFrameCache.set(fn, _frame);
                            }
                          }
                          return _frame;
                        }
                      } while (s >= 1 && c >= 0);
                    }
                    break;
                  }
                }
              }
            } finally {
              reentry = false;
              {
                ReactCurrentDispatcher$1.current = previousDispatcher;
                reenableLogs();
              }
              Error.prepareStackTrace = previousPrepareStackTrace;
            }
            var name = fn ? fn.displayName || fn.name : "";
            var syntheticFrame = name ? describeBuiltInComponentFrame(name) : "";
            {
              if (typeof fn === "function") {
                componentFrameCache.set(fn, syntheticFrame);
              }
            }
            return syntheticFrame;
          }
          function describeFunctionComponentFrame(fn, source, ownerFn) {
            {
              return describeNativeComponentFrame(fn, false);
            }
          }
          function shouldConstruct(Component2) {
            var prototype3 = Component2.prototype;
            return !!(prototype3 && prototype3.isReactComponent);
          }
          function describeUnknownElementTypeFrameInDEV(type, source, ownerFn) {
            if (type == null) {
              return "";
            }
            if (typeof type === "function") {
              {
                return describeNativeComponentFrame(type, shouldConstruct(type));
              }
            }
            if (typeof type === "string") {
              return describeBuiltInComponentFrame(type);
            }
            switch (type) {
              case REACT_SUSPENSE_TYPE:
                return describeBuiltInComponentFrame("Suspense");
              case REACT_SUSPENSE_LIST_TYPE:
                return describeBuiltInComponentFrame("SuspenseList");
            }
            if (typeof type === "object") {
              switch (type.$$typeof) {
                case REACT_FORWARD_REF_TYPE:
                  return describeFunctionComponentFrame(type.render);
                case REACT_MEMO_TYPE:
                  return describeUnknownElementTypeFrameInDEV(type.type, source, ownerFn);
                case REACT_LAZY_TYPE: {
                  var lazyComponent = type;
                  var payload = lazyComponent._payload;
                  var init = lazyComponent._init;
                  try {
                    return describeUnknownElementTypeFrameInDEV(init(payload), source, ownerFn);
                  } catch (x) {
                  }
                }
              }
            }
            return "";
          }
          var loggedTypeFailures = {};
          var ReactDebugCurrentFrame$1 = ReactSharedInternals.ReactDebugCurrentFrame;
          function setCurrentlyValidatingElement(element) {
            {
              if (element) {
                var owner = element._owner;
                var stack = describeUnknownElementTypeFrameInDEV(element.type, element._source, owner ? owner.type : null);
                ReactDebugCurrentFrame$1.setExtraStackFrame(stack);
              } else {
                ReactDebugCurrentFrame$1.setExtraStackFrame(null);
              }
            }
          }
          function checkPropTypes(typeSpecs, values, location, componentName, element) {
            {
              var has = Function.call.bind(hasOwnProperty2);
              for (var typeSpecName in typeSpecs) {
                if (has(typeSpecs, typeSpecName)) {
                  var error$1 = void 0;
                  try {
                    if (typeof typeSpecs[typeSpecName] !== "function") {
                      var err = Error((componentName || "React class") + ": " + location + " type `" + typeSpecName + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + typeof typeSpecs[typeSpecName] + "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.");
                      err.name = "Invariant Violation";
                      throw err;
                    }
                    error$1 = typeSpecs[typeSpecName](values, typeSpecName, componentName, location, null, "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED");
                  } catch (ex) {
                    error$1 = ex;
                  }
                  if (error$1 && !(error$1 instanceof Error)) {
                    setCurrentlyValidatingElement(element);
                    error("%s: type specification of %s `%s` is invalid; the type checker function must return `null` or an `Error` but returned a %s. You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).", componentName || "React class", location, typeSpecName, typeof error$1);
                    setCurrentlyValidatingElement(null);
                  }
                  if (error$1 instanceof Error && !(error$1.message in loggedTypeFailures)) {
                    loggedTypeFailures[error$1.message] = true;
                    setCurrentlyValidatingElement(element);
                    error("Failed %s type: %s", location, error$1.message);
                    setCurrentlyValidatingElement(null);
                  }
                }
              }
            }
          }
          function setCurrentlyValidatingElement$1(element) {
            {
              if (element) {
                var owner = element._owner;
                var stack = describeUnknownElementTypeFrameInDEV(element.type, element._source, owner ? owner.type : null);
                setExtraStackFrame(stack);
              } else {
                setExtraStackFrame(null);
              }
            }
          }
          var propTypesMisspellWarningShown;
          {
            propTypesMisspellWarningShown = false;
          }
          function getDeclarationErrorAddendum() {
            if (ReactCurrentOwner.current) {
              var name = getComponentNameFromType(ReactCurrentOwner.current.type);
              if (name) {
                return "\n\nCheck the render method of `" + name + "`.";
              }
            }
            return "";
          }
          function getSourceInfoErrorAddendum(source) {
            if (source !== void 0) {
              var fileName = source.fileName.replace(/^.*[\\\/]/, "");
              var lineNumber = source.lineNumber;
              return "\n\nCheck your code at " + fileName + ":" + lineNumber + ".";
            }
            return "";
          }
          function getSourceInfoErrorAddendumForProps(elementProps) {
            if (elementProps !== null && elementProps !== void 0) {
              return getSourceInfoErrorAddendum(elementProps.__source);
            }
            return "";
          }
          var ownerHasKeyUseWarning = {};
          function getCurrentComponentErrorInfo(parentType) {
            var info = getDeclarationErrorAddendum();
            if (!info) {
              var parentName = typeof parentType === "string" ? parentType : parentType.displayName || parentType.name;
              if (parentName) {
                info = "\n\nCheck the top-level render call using <" + parentName + ">.";
              }
            }
            return info;
          }
          function validateExplicitKey(element, parentType) {
            if (!element._store || element._store.validated || element.key != null) {
              return;
            }
            element._store.validated = true;
            var currentComponentErrorInfo = getCurrentComponentErrorInfo(parentType);
            if (ownerHasKeyUseWarning[currentComponentErrorInfo]) {
              return;
            }
            ownerHasKeyUseWarning[currentComponentErrorInfo] = true;
            var childOwner = "";
            if (element && element._owner && element._owner !== ReactCurrentOwner.current) {
              childOwner = " It was passed a child from " + getComponentNameFromType(element._owner.type) + ".";
            }
            {
              setCurrentlyValidatingElement$1(element);
              error('Each child in a list should have a unique "key" prop.%s%s See https://reactjs.org/link/warning-keys for more information.', currentComponentErrorInfo, childOwner);
              setCurrentlyValidatingElement$1(null);
            }
          }
          function validateChildKeys(node, parentType) {
            if (typeof node !== "object") {
              return;
            }
            if (isArray2(node)) {
              for (var i = 0; i < node.length; i++) {
                var child = node[i];
                if (isValidElement(child)) {
                  validateExplicitKey(child, parentType);
                }
              }
            } else if (isValidElement(node)) {
              if (node._store) {
                node._store.validated = true;
              }
            } else if (node) {
              var iteratorFn = getIteratorFn(node);
              if (typeof iteratorFn === "function") {
                if (iteratorFn !== node.entries) {
                  var iterator = iteratorFn.call(node);
                  var step;
                  while (!(step = iterator.next()).done) {
                    if (isValidElement(step.value)) {
                      validateExplicitKey(step.value, parentType);
                    }
                  }
                }
              }
            }
          }
          function validatePropTypes(element) {
            {
              var type = element.type;
              if (type === null || type === void 0 || typeof type === "string") {
                return;
              }
              var propTypes;
              if (typeof type === "function") {
                propTypes = type.propTypes;
              } else if (typeof type === "object" && (type.$$typeof === REACT_FORWARD_REF_TYPE || // Note: Memo only checks outer props here.
              // Inner props are checked in the reconciler.
              type.$$typeof === REACT_MEMO_TYPE)) {
                propTypes = type.propTypes;
              } else {
                return;
              }
              if (propTypes) {
                var name = getComponentNameFromType(type);
                checkPropTypes(propTypes, element.props, "prop", name, element);
              } else if (type.PropTypes !== void 0 && !propTypesMisspellWarningShown) {
                propTypesMisspellWarningShown = true;
                var _name = getComponentNameFromType(type);
                error("Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?", _name || "Unknown");
              }
              if (typeof type.getDefaultProps === "function" && !type.getDefaultProps.isReactClassApproved) {
                error("getDefaultProps is only used on classic React.createClass definitions. Use a static property named `defaultProps` instead.");
              }
            }
          }
          function validateFragmentProps(fragment) {
            {
              var keys = Object.keys(fragment.props);
              for (var i = 0; i < keys.length; i++) {
                var key = keys[i];
                if (key !== "children" && key !== "key") {
                  setCurrentlyValidatingElement$1(fragment);
                  error("Invalid prop `%s` supplied to `React.Fragment`. React.Fragment can only have `key` and `children` props.", key);
                  setCurrentlyValidatingElement$1(null);
                  break;
                }
              }
              if (fragment.ref !== null) {
                setCurrentlyValidatingElement$1(fragment);
                error("Invalid attribute `ref` supplied to `React.Fragment`.");
                setCurrentlyValidatingElement$1(null);
              }
            }
          }
          function createElementWithValidation(type, props, children) {
            var validType = isValidElementType(type);
            if (!validType) {
              var info = "";
              if (type === void 0 || typeof type === "object" && type !== null && Object.keys(type).length === 0) {
                info += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.";
              }
              var sourceInfo = getSourceInfoErrorAddendumForProps(props);
              if (sourceInfo) {
                info += sourceInfo;
              } else {
                info += getDeclarationErrorAddendum();
              }
              var typeString;
              if (type === null) {
                typeString = "null";
              } else if (isArray2(type)) {
                typeString = "array";
              } else if (type !== void 0 && type.$$typeof === REACT_ELEMENT_TYPE) {
                typeString = "<" + (getComponentNameFromType(type.type) || "Unknown") + " />";
                info = " Did you accidentally export a JSX literal instead of a component?";
              } else {
                typeString = typeof type;
              }
              {
                error("React.createElement: type is invalid -- expected a string (for built-in components) or a class/function (for composite components) but got: %s.%s", typeString, info);
              }
            }
            var element = createElement2.apply(this, arguments);
            if (element == null) {
              return element;
            }
            if (validType) {
              for (var i = 2; i < arguments.length; i++) {
                validateChildKeys(arguments[i], type);
              }
            }
            if (type === REACT_FRAGMENT_TYPE) {
              validateFragmentProps(element);
            } else {
              validatePropTypes(element);
            }
            return element;
          }
          var didWarnAboutDeprecatedCreateFactory = false;
          function createFactoryWithValidation(type) {
            var validatedFactory = createElementWithValidation.bind(null, type);
            validatedFactory.type = type;
            {
              if (!didWarnAboutDeprecatedCreateFactory) {
                didWarnAboutDeprecatedCreateFactory = true;
                warn("React.createFactory() is deprecated and will be removed in a future major release. Consider using JSX or use React.createElement() directly instead.");
              }
              Object.defineProperty(validatedFactory, "type", {
                enumerable: false,
                get: function() {
                  warn("Factory.type is deprecated. Access the class directly before passing it to createFactory.");
                  Object.defineProperty(this, "type", {
                    value: type
                  });
                  return type;
                }
              });
            }
            return validatedFactory;
          }
          function cloneElementWithValidation(element, props, children) {
            var newElement = cloneElement.apply(this, arguments);
            for (var i = 2; i < arguments.length; i++) {
              validateChildKeys(arguments[i], newElement.type);
            }
            validatePropTypes(newElement);
            return newElement;
          }
          function startTransition(scope, options) {
            var prevTransition = ReactCurrentBatchConfig.transition;
            ReactCurrentBatchConfig.transition = {};
            var currentTransition = ReactCurrentBatchConfig.transition;
            {
              ReactCurrentBatchConfig.transition._updatedFibers = /* @__PURE__ */ new Set();
            }
            try {
              scope();
            } finally {
              ReactCurrentBatchConfig.transition = prevTransition;
              {
                if (prevTransition === null && currentTransition._updatedFibers) {
                  var updatedFibersCount = currentTransition._updatedFibers.size;
                  if (updatedFibersCount > 10) {
                    warn("Detected a large number of updates inside startTransition. If this is due to a subscription please re-write it to use React provided hooks. Otherwise concurrent mode guarantees are off the table.");
                  }
                  currentTransition._updatedFibers.clear();
                }
              }
            }
          }
          var didWarnAboutMessageChannel = false;
          var enqueueTaskImpl = null;
          function enqueueTask(task) {
            if (enqueueTaskImpl === null) {
              try {
                var requireString = ("require" + Math.random()).slice(0, 7);
                var nodeRequire = module && module[requireString];
                enqueueTaskImpl = nodeRequire.call(module, "timers").setImmediate;
              } catch (_err) {
                enqueueTaskImpl = function(callback) {
                  {
                    if (didWarnAboutMessageChannel === false) {
                      didWarnAboutMessageChannel = true;
                      if (typeof MessageChannel === "undefined") {
                        error("This browser does not have a MessageChannel implementation, so enqueuing tasks via await act(async () => ...) will fail. Please file an issue at https://github.com/facebook/react/issues if you encounter this warning.");
                      }
                    }
                  }
                  var channel = new MessageChannel();
                  channel.port1.onmessage = callback;
                  channel.port2.postMessage(void 0);
                };
              }
            }
            return enqueueTaskImpl(task);
          }
          var actScopeDepth = 0;
          var didWarnNoAwaitAct = false;
          function act(callback) {
            {
              var prevActScopeDepth = actScopeDepth;
              actScopeDepth++;
              if (ReactCurrentActQueue.current === null) {
                ReactCurrentActQueue.current = [];
              }
              var prevIsBatchingLegacy = ReactCurrentActQueue.isBatchingLegacy;
              var result;
              try {
                ReactCurrentActQueue.isBatchingLegacy = true;
                result = callback();
                if (!prevIsBatchingLegacy && ReactCurrentActQueue.didScheduleLegacyUpdate) {
                  var queue = ReactCurrentActQueue.current;
                  if (queue !== null) {
                    ReactCurrentActQueue.didScheduleLegacyUpdate = false;
                    flushActQueue(queue);
                  }
                }
              } catch (error2) {
                popActScope(prevActScopeDepth);
                throw error2;
              } finally {
                ReactCurrentActQueue.isBatchingLegacy = prevIsBatchingLegacy;
              }
              if (result !== null && typeof result === "object" && typeof result.then === "function") {
                var thenableResult = result;
                var wasAwaited = false;
                var thenable = {
                  then: function(resolve, reject) {
                    wasAwaited = true;
                    thenableResult.then(function(returnValue2) {
                      popActScope(prevActScopeDepth);
                      if (actScopeDepth === 0) {
                        recursivelyFlushAsyncActWork(returnValue2, resolve, reject);
                      } else {
                        resolve(returnValue2);
                      }
                    }, function(error2) {
                      popActScope(prevActScopeDepth);
                      reject(error2);
                    });
                  }
                };
                {
                  if (!didWarnNoAwaitAct && typeof Promise !== "undefined") {
                    Promise.resolve().then(function() {
                    }).then(function() {
                      if (!wasAwaited) {
                        didWarnNoAwaitAct = true;
                        error("You called act(async () => ...) without await. This could lead to unexpected testing behaviour, interleaving multiple act calls and mixing their scopes. You should - await act(async () => ...);");
                      }
                    });
                  }
                }
                return thenable;
              } else {
                var returnValue = result;
                popActScope(prevActScopeDepth);
                if (actScopeDepth === 0) {
                  var _queue = ReactCurrentActQueue.current;
                  if (_queue !== null) {
                    flushActQueue(_queue);
                    ReactCurrentActQueue.current = null;
                  }
                  var _thenable = {
                    then: function(resolve, reject) {
                      if (ReactCurrentActQueue.current === null) {
                        ReactCurrentActQueue.current = [];
                        recursivelyFlushAsyncActWork(returnValue, resolve, reject);
                      } else {
                        resolve(returnValue);
                      }
                    }
                  };
                  return _thenable;
                } else {
                  var _thenable2 = {
                    then: function(resolve, reject) {
                      resolve(returnValue);
                    }
                  };
                  return _thenable2;
                }
              }
            }
          }
          function popActScope(prevActScopeDepth) {
            {
              if (prevActScopeDepth !== actScopeDepth - 1) {
                error("You seem to have overlapping act() calls, this is not supported. Be sure to await previous act() calls before making a new one. ");
              }
              actScopeDepth = prevActScopeDepth;
            }
          }
          function recursivelyFlushAsyncActWork(returnValue, resolve, reject) {
            {
              var queue = ReactCurrentActQueue.current;
              if (queue !== null) {
                try {
                  flushActQueue(queue);
                  enqueueTask(function() {
                    if (queue.length === 0) {
                      ReactCurrentActQueue.current = null;
                      resolve(returnValue);
                    } else {
                      recursivelyFlushAsyncActWork(returnValue, resolve, reject);
                    }
                  });
                } catch (error2) {
                  reject(error2);
                }
              } else {
                resolve(returnValue);
              }
            }
          }
          var isFlushing = false;
          function flushActQueue(queue) {
            {
              if (!isFlushing) {
                isFlushing = true;
                var i = 0;
                try {
                  for (; i < queue.length; i++) {
                    var callback = queue[i];
                    do {
                      callback = callback(true);
                    } while (callback !== null);
                  }
                  queue.length = 0;
                } catch (error2) {
                  queue = queue.slice(i + 1);
                  throw error2;
                } finally {
                  isFlushing = false;
                }
              }
            }
          }
          var createElement$1 = createElementWithValidation;
          var cloneElement$1 = cloneElementWithValidation;
          var createFactory = createFactoryWithValidation;
          var Children = {
            map: mapChildren,
            forEach: forEachChildren,
            count: countChildren,
            toArray: toArray2,
            only: onlyChild
          };
          exports.Children = Children;
          exports.Component = Component;
          exports.Fragment = REACT_FRAGMENT_TYPE;
          exports.Profiler = REACT_PROFILER_TYPE;
          exports.PureComponent = PureComponent;
          exports.StrictMode = REACT_STRICT_MODE_TYPE;
          exports.Suspense = REACT_SUSPENSE_TYPE;
          exports.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = ReactSharedInternals;
          exports.act = act;
          exports.cloneElement = cloneElement$1;
          exports.createContext = createContext;
          exports.createElement = createElement$1;
          exports.createFactory = createFactory;
          exports.createRef = createRef;
          exports.forwardRef = forwardRef2;
          exports.isValidElement = isValidElement;
          exports.lazy = lazy;
          exports.memo = memo;
          exports.startTransition = startTransition;
          exports.unstable_act = act;
          exports.useCallback = useCallback2;
          exports.useContext = useContext;
          exports.useDebugValue = useDebugValue;
          exports.useDeferredValue = useDeferredValue;
          exports.useEffect = useEffect2;
          exports.useId = useId;
          exports.useImperativeHandle = useImperativeHandle;
          exports.useInsertionEffect = useInsertionEffect;
          exports.useLayoutEffect = useLayoutEffect;
          exports.useMemo = useMemo;
          exports.useReducer = useReducer;
          exports.useRef = useRef2;
          exports.useState = useState2;
          exports.useSyncExternalStore = useSyncExternalStore;
          exports.useTransition = useTransition;
          exports.version = ReactVersion;
          if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ !== "undefined" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop === "function") {
            __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(new Error());
          }
        })();
      }
    }
  });

  // node_modules/react/index.js
  var require_react = __commonJS({
    "node_modules/react/index.js"(exports, module) {
      "use strict";
      if (false) {
        module.exports = null;
      } else {
        module.exports = require_react_development();
      }
    }
  });

  // node_modules/react-dom/cjs/react-dom-server-legacy.browser.development.js
  var require_react_dom_server_legacy_browser_development = __commonJS({
    "node_modules/react-dom/cjs/react-dom-server-legacy.browser.development.js"(exports) {
      "use strict";
      if (true) {
        (function() {
          "use strict";
          var React3 = require_react();
          var ReactVersion = "18.3.1";
          var ReactSharedInternals = React3.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
          function warn(format) {
            {
              {
                for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                  args[_key - 1] = arguments[_key];
                }
                printWarning("warn", format, args);
              }
            }
          }
          function error(format) {
            {
              {
                for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
                  args[_key2 - 1] = arguments[_key2];
                }
                printWarning("error", format, args);
              }
            }
          }
          function printWarning(level, format, args) {
            {
              var ReactDebugCurrentFrame2 = ReactSharedInternals.ReactDebugCurrentFrame;
              var stack = ReactDebugCurrentFrame2.getStackAddendum();
              if (stack !== "") {
                format += "%s";
                args = args.concat([stack]);
              }
              var argsWithFormat = args.map(function(item) {
                return String(item);
              });
              argsWithFormat.unshift("Warning: " + format);
              Function.prototype.apply.call(console[level], console, argsWithFormat);
            }
          }
          function scheduleWork(callback) {
            callback();
          }
          function beginWriting(destination) {
          }
          function writeChunk(destination, chunk) {
            writeChunkAndReturn(destination, chunk);
          }
          function writeChunkAndReturn(destination, chunk) {
            return destination.push(chunk);
          }
          function completeWriting(destination) {
          }
          function close(destination) {
            destination.push(null);
          }
          function stringToChunk(content) {
            return content;
          }
          function stringToPrecomputedChunk(content) {
            return content;
          }
          function closeWithError(destination, error2) {
            destination.destroy(error2);
          }
          function typeName(value) {
            {
              var hasToStringTag = typeof Symbol === "function" && Symbol.toStringTag;
              var type = hasToStringTag && value[Symbol.toStringTag] || value.constructor.name || "Object";
              return type;
            }
          }
          function willCoercionThrow(value) {
            {
              try {
                testStringCoercion(value);
                return false;
              } catch (e) {
                return true;
              }
            }
          }
          function testStringCoercion(value) {
            return "" + value;
          }
          function checkAttributeStringCoercion(value, attributeName) {
            {
              if (willCoercionThrow(value)) {
                error("The provided `%s` attribute is an unsupported type %s. This value must be coerced to a string before before using it here.", attributeName, typeName(value));
                return testStringCoercion(value);
              }
            }
          }
          function checkCSSPropertyStringCoercion(value, propName) {
            {
              if (willCoercionThrow(value)) {
                error("The provided `%s` CSS property is an unsupported type %s. This value must be coerced to a string before before using it here.", propName, typeName(value));
                return testStringCoercion(value);
              }
            }
          }
          function checkHtmlStringCoercion(value) {
            {
              if (willCoercionThrow(value)) {
                error("The provided HTML markup uses a value of unsupported type %s. This value must be coerced to a string before before using it here.", typeName(value));
                return testStringCoercion(value);
              }
            }
          }
          var hasOwnProperty2 = Object.prototype.hasOwnProperty;
          var RESERVED = 0;
          var STRING = 1;
          var BOOLEANISH_STRING = 2;
          var BOOLEAN = 3;
          var OVERLOADED_BOOLEAN = 4;
          var NUMERIC = 5;
          var POSITIVE_NUMERIC = 6;
          var ATTRIBUTE_NAME_START_CHAR = ":A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD";
          var ATTRIBUTE_NAME_CHAR = ATTRIBUTE_NAME_START_CHAR + "\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040";
          var VALID_ATTRIBUTE_NAME_REGEX = new RegExp("^[" + ATTRIBUTE_NAME_START_CHAR + "][" + ATTRIBUTE_NAME_CHAR + "]*$");
          var illegalAttributeNameCache = {};
          var validatedAttributeNameCache = {};
          function isAttributeNameSafe(attributeName) {
            if (hasOwnProperty2.call(validatedAttributeNameCache, attributeName)) {
              return true;
            }
            if (hasOwnProperty2.call(illegalAttributeNameCache, attributeName)) {
              return false;
            }
            if (VALID_ATTRIBUTE_NAME_REGEX.test(attributeName)) {
              validatedAttributeNameCache[attributeName] = true;
              return true;
            }
            illegalAttributeNameCache[attributeName] = true;
            {
              error("Invalid attribute name: `%s`", attributeName);
            }
            return false;
          }
          function shouldRemoveAttributeWithWarning(name, value, propertyInfo, isCustomComponentTag) {
            if (propertyInfo !== null && propertyInfo.type === RESERVED) {
              return false;
            }
            switch (typeof value) {
              case "function":
              case "symbol":
                return true;
              case "boolean": {
                if (isCustomComponentTag) {
                  return false;
                }
                if (propertyInfo !== null) {
                  return !propertyInfo.acceptsBooleans;
                } else {
                  var prefix2 = name.toLowerCase().slice(0, 5);
                  return prefix2 !== "data-" && prefix2 !== "aria-";
                }
              }
              default:
                return false;
            }
          }
          function getPropertyInfo(name) {
            return properties.hasOwnProperty(name) ? properties[name] : null;
          }
          function PropertyInfoRecord(name, type, mustUseProperty, attributeName, attributeNamespace, sanitizeURL2, removeEmptyString) {
            this.acceptsBooleans = type === BOOLEANISH_STRING || type === BOOLEAN || type === OVERLOADED_BOOLEAN;
            this.attributeName = attributeName;
            this.attributeNamespace = attributeNamespace;
            this.mustUseProperty = mustUseProperty;
            this.propertyName = name;
            this.type = type;
            this.sanitizeURL = sanitizeURL2;
            this.removeEmptyString = removeEmptyString;
          }
          var properties = {};
          var reservedProps = [
            "children",
            "dangerouslySetInnerHTML",
            // TODO: This prevents the assignment of defaultValue to regular
            // elements (not just inputs). Now that ReactDOMInput assigns to the
            // defaultValue property -- do we need this?
            "defaultValue",
            "defaultChecked",
            "innerHTML",
            "suppressContentEditableWarning",
            "suppressHydrationWarning",
            "style"
          ];
          reservedProps.forEach(function(name) {
            properties[name] = new PropertyInfoRecord(
              name,
              RESERVED,
              false,
              // mustUseProperty
              name,
              // attributeName
              null,
              // attributeNamespace
              false,
              // sanitizeURL
              false
            );
          });
          [["acceptCharset", "accept-charset"], ["className", "class"], ["htmlFor", "for"], ["httpEquiv", "http-equiv"]].forEach(function(_ref) {
            var name = _ref[0], attributeName = _ref[1];
            properties[name] = new PropertyInfoRecord(
              name,
              STRING,
              false,
              // mustUseProperty
              attributeName,
              // attributeName
              null,
              // attributeNamespace
              false,
              // sanitizeURL
              false
            );
          });
          ["contentEditable", "draggable", "spellCheck", "value"].forEach(function(name) {
            properties[name] = new PropertyInfoRecord(
              name,
              BOOLEANISH_STRING,
              false,
              // mustUseProperty
              name.toLowerCase(),
              // attributeName
              null,
              // attributeNamespace
              false,
              // sanitizeURL
              false
            );
          });
          ["autoReverse", "externalResourcesRequired", "focusable", "preserveAlpha"].forEach(function(name) {
            properties[name] = new PropertyInfoRecord(
              name,
              BOOLEANISH_STRING,
              false,
              // mustUseProperty
              name,
              // attributeName
              null,
              // attributeNamespace
              false,
              // sanitizeURL
              false
            );
          });
          [
            "allowFullScreen",
            "async",
            // Note: there is a special case that prevents it from being written to the DOM
            // on the client side because the browsers are inconsistent. Instead we call focus().
            "autoFocus",
            "autoPlay",
            "controls",
            "default",
            "defer",
            "disabled",
            "disablePictureInPicture",
            "disableRemotePlayback",
            "formNoValidate",
            "hidden",
            "loop",
            "noModule",
            "noValidate",
            "open",
            "playsInline",
            "readOnly",
            "required",
            "reversed",
            "scoped",
            "seamless",
            // Microdata
            "itemScope"
          ].forEach(function(name) {
            properties[name] = new PropertyInfoRecord(
              name,
              BOOLEAN,
              false,
              // mustUseProperty
              name.toLowerCase(),
              // attributeName
              null,
              // attributeNamespace
              false,
              // sanitizeURL
              false
            );
          });
          [
            "checked",
            // Note: `option.selected` is not updated if `select.multiple` is
            // disabled with `removeAttribute`. We have special logic for handling this.
            "multiple",
            "muted",
            "selected"
            // NOTE: if you add a camelCased prop to this list,
            // you'll need to set attributeName to name.toLowerCase()
            // instead in the assignment below.
          ].forEach(function(name) {
            properties[name] = new PropertyInfoRecord(
              name,
              BOOLEAN,
              true,
              // mustUseProperty
              name,
              // attributeName
              null,
              // attributeNamespace
              false,
              // sanitizeURL
              false
            );
          });
          [
            "capture",
            "download"
            // NOTE: if you add a camelCased prop to this list,
            // you'll need to set attributeName to name.toLowerCase()
            // instead in the assignment below.
          ].forEach(function(name) {
            properties[name] = new PropertyInfoRecord(
              name,
              OVERLOADED_BOOLEAN,
              false,
              // mustUseProperty
              name,
              // attributeName
              null,
              // attributeNamespace
              false,
              // sanitizeURL
              false
            );
          });
          [
            "cols",
            "rows",
            "size",
            "span"
            // NOTE: if you add a camelCased prop to this list,
            // you'll need to set attributeName to name.toLowerCase()
            // instead in the assignment below.
          ].forEach(function(name) {
            properties[name] = new PropertyInfoRecord(
              name,
              POSITIVE_NUMERIC,
              false,
              // mustUseProperty
              name,
              // attributeName
              null,
              // attributeNamespace
              false,
              // sanitizeURL
              false
            );
          });
          ["rowSpan", "start"].forEach(function(name) {
            properties[name] = new PropertyInfoRecord(
              name,
              NUMERIC,
              false,
              // mustUseProperty
              name.toLowerCase(),
              // attributeName
              null,
              // attributeNamespace
              false,
              // sanitizeURL
              false
            );
          });
          var CAMELIZE = /[\-\:]([a-z])/g;
          var capitalize = function(token) {
            return token[1].toUpperCase();
          };
          [
            "accent-height",
            "alignment-baseline",
            "arabic-form",
            "baseline-shift",
            "cap-height",
            "clip-path",
            "clip-rule",
            "color-interpolation",
            "color-interpolation-filters",
            "color-profile",
            "color-rendering",
            "dominant-baseline",
            "enable-background",
            "fill-opacity",
            "fill-rule",
            "flood-color",
            "flood-opacity",
            "font-family",
            "font-size",
            "font-size-adjust",
            "font-stretch",
            "font-style",
            "font-variant",
            "font-weight",
            "glyph-name",
            "glyph-orientation-horizontal",
            "glyph-orientation-vertical",
            "horiz-adv-x",
            "horiz-origin-x",
            "image-rendering",
            "letter-spacing",
            "lighting-color",
            "marker-end",
            "marker-mid",
            "marker-start",
            "overline-position",
            "overline-thickness",
            "paint-order",
            "panose-1",
            "pointer-events",
            "rendering-intent",
            "shape-rendering",
            "stop-color",
            "stop-opacity",
            "strikethrough-position",
            "strikethrough-thickness",
            "stroke-dasharray",
            "stroke-dashoffset",
            "stroke-linecap",
            "stroke-linejoin",
            "stroke-miterlimit",
            "stroke-opacity",
            "stroke-width",
            "text-anchor",
            "text-decoration",
            "text-rendering",
            "underline-position",
            "underline-thickness",
            "unicode-bidi",
            "unicode-range",
            "units-per-em",
            "v-alphabetic",
            "v-hanging",
            "v-ideographic",
            "v-mathematical",
            "vector-effect",
            "vert-adv-y",
            "vert-origin-x",
            "vert-origin-y",
            "word-spacing",
            "writing-mode",
            "xmlns:xlink",
            "x-height"
            // NOTE: if you add a camelCased prop to this list,
            // you'll need to set attributeName to name.toLowerCase()
            // instead in the assignment below.
          ].forEach(function(attributeName) {
            var name = attributeName.replace(CAMELIZE, capitalize);
            properties[name] = new PropertyInfoRecord(
              name,
              STRING,
              false,
              // mustUseProperty
              attributeName,
              null,
              // attributeNamespace
              false,
              // sanitizeURL
              false
            );
          });
          [
            "xlink:actuate",
            "xlink:arcrole",
            "xlink:role",
            "xlink:show",
            "xlink:title",
            "xlink:type"
            // NOTE: if you add a camelCased prop to this list,
            // you'll need to set attributeName to name.toLowerCase()
            // instead in the assignment below.
          ].forEach(function(attributeName) {
            var name = attributeName.replace(CAMELIZE, capitalize);
            properties[name] = new PropertyInfoRecord(
              name,
              STRING,
              false,
              // mustUseProperty
              attributeName,
              "http://www.w3.org/1999/xlink",
              false,
              // sanitizeURL
              false
            );
          });
          [
            "xml:base",
            "xml:lang",
            "xml:space"
            // NOTE: if you add a camelCased prop to this list,
            // you'll need to set attributeName to name.toLowerCase()
            // instead in the assignment below.
          ].forEach(function(attributeName) {
            var name = attributeName.replace(CAMELIZE, capitalize);
            properties[name] = new PropertyInfoRecord(
              name,
              STRING,
              false,
              // mustUseProperty
              attributeName,
              "http://www.w3.org/XML/1998/namespace",
              false,
              // sanitizeURL
              false
            );
          });
          ["tabIndex", "crossOrigin"].forEach(function(attributeName) {
            properties[attributeName] = new PropertyInfoRecord(
              attributeName,
              STRING,
              false,
              // mustUseProperty
              attributeName.toLowerCase(),
              // attributeName
              null,
              // attributeNamespace
              false,
              // sanitizeURL
              false
            );
          });
          var xlinkHref = "xlinkHref";
          properties[xlinkHref] = new PropertyInfoRecord(
            "xlinkHref",
            STRING,
            false,
            // mustUseProperty
            "xlink:href",
            "http://www.w3.org/1999/xlink",
            true,
            // sanitizeURL
            false
          );
          ["src", "href", "action", "formAction"].forEach(function(attributeName) {
            properties[attributeName] = new PropertyInfoRecord(
              attributeName,
              STRING,
              false,
              // mustUseProperty
              attributeName.toLowerCase(),
              // attributeName
              null,
              // attributeNamespace
              true,
              // sanitizeURL
              true
            );
          });
          var isUnitlessNumber = {
            animationIterationCount: true,
            aspectRatio: true,
            borderImageOutset: true,
            borderImageSlice: true,
            borderImageWidth: true,
            boxFlex: true,
            boxFlexGroup: true,
            boxOrdinalGroup: true,
            columnCount: true,
            columns: true,
            flex: true,
            flexGrow: true,
            flexPositive: true,
            flexShrink: true,
            flexNegative: true,
            flexOrder: true,
            gridArea: true,
            gridRow: true,
            gridRowEnd: true,
            gridRowSpan: true,
            gridRowStart: true,
            gridColumn: true,
            gridColumnEnd: true,
            gridColumnSpan: true,
            gridColumnStart: true,
            fontWeight: true,
            lineClamp: true,
            lineHeight: true,
            opacity: true,
            order: true,
            orphans: true,
            tabSize: true,
            widows: true,
            zIndex: true,
            zoom: true,
            // SVG-related properties
            fillOpacity: true,
            floodOpacity: true,
            stopOpacity: true,
            strokeDasharray: true,
            strokeDashoffset: true,
            strokeMiterlimit: true,
            strokeOpacity: true,
            strokeWidth: true
          };
          function prefixKey(prefix2, key) {
            return prefix2 + key.charAt(0).toUpperCase() + key.substring(1);
          }
          var prefixes = ["Webkit", "ms", "Moz", "O"];
          Object.keys(isUnitlessNumber).forEach(function(prop) {
            prefixes.forEach(function(prefix2) {
              isUnitlessNumber[prefixKey(prefix2, prop)] = isUnitlessNumber[prop];
            });
          });
          var hasReadOnlyValue = {
            button: true,
            checkbox: true,
            image: true,
            hidden: true,
            radio: true,
            reset: true,
            submit: true
          };
          function checkControlledValueProps(tagName, props) {
            {
              if (!(hasReadOnlyValue[props.type] || props.onChange || props.onInput || props.readOnly || props.disabled || props.value == null)) {
                error("You provided a `value` prop to a form field without an `onChange` handler. This will render a read-only field. If the field should be mutable use `defaultValue`. Otherwise, set either `onChange` or `readOnly`.");
              }
              if (!(props.onChange || props.readOnly || props.disabled || props.checked == null)) {
                error("You provided a `checked` prop to a form field without an `onChange` handler. This will render a read-only field. If the field should be mutable use `defaultChecked`. Otherwise, set either `onChange` or `readOnly`.");
              }
            }
          }
          function isCustomComponent(tagName, props) {
            if (tagName.indexOf("-") === -1) {
              return typeof props.is === "string";
            }
            switch (tagName) {
              case "annotation-xml":
              case "color-profile":
              case "font-face":
              case "font-face-src":
              case "font-face-uri":
              case "font-face-format":
              case "font-face-name":
              case "missing-glyph":
                return false;
              default:
                return true;
            }
          }
          var ariaProperties = {
            "aria-current": 0,
            // state
            "aria-description": 0,
            "aria-details": 0,
            "aria-disabled": 0,
            // state
            "aria-hidden": 0,
            // state
            "aria-invalid": 0,
            // state
            "aria-keyshortcuts": 0,
            "aria-label": 0,
            "aria-roledescription": 0,
            // Widget Attributes
            "aria-autocomplete": 0,
            "aria-checked": 0,
            "aria-expanded": 0,
            "aria-haspopup": 0,
            "aria-level": 0,
            "aria-modal": 0,
            "aria-multiline": 0,
            "aria-multiselectable": 0,
            "aria-orientation": 0,
            "aria-placeholder": 0,
            "aria-pressed": 0,
            "aria-readonly": 0,
            "aria-required": 0,
            "aria-selected": 0,
            "aria-sort": 0,
            "aria-valuemax": 0,
            "aria-valuemin": 0,
            "aria-valuenow": 0,
            "aria-valuetext": 0,
            // Live Region Attributes
            "aria-atomic": 0,
            "aria-busy": 0,
            "aria-live": 0,
            "aria-relevant": 0,
            // Drag-and-Drop Attributes
            "aria-dropeffect": 0,
            "aria-grabbed": 0,
            // Relationship Attributes
            "aria-activedescendant": 0,
            "aria-colcount": 0,
            "aria-colindex": 0,
            "aria-colspan": 0,
            "aria-controls": 0,
            "aria-describedby": 0,
            "aria-errormessage": 0,
            "aria-flowto": 0,
            "aria-labelledby": 0,
            "aria-owns": 0,
            "aria-posinset": 0,
            "aria-rowcount": 0,
            "aria-rowindex": 0,
            "aria-rowspan": 0,
            "aria-setsize": 0
          };
          var warnedProperties = {};
          var rARIA = new RegExp("^(aria)-[" + ATTRIBUTE_NAME_CHAR + "]*$");
          var rARIACamel = new RegExp("^(aria)[A-Z][" + ATTRIBUTE_NAME_CHAR + "]*$");
          function validateProperty(tagName, name) {
            {
              if (hasOwnProperty2.call(warnedProperties, name) && warnedProperties[name]) {
                return true;
              }
              if (rARIACamel.test(name)) {
                var ariaName = "aria-" + name.slice(4).toLowerCase();
                var correctName = ariaProperties.hasOwnProperty(ariaName) ? ariaName : null;
                if (correctName == null) {
                  error("Invalid ARIA attribute `%s`. ARIA attributes follow the pattern aria-* and must be lowercase.", name);
                  warnedProperties[name] = true;
                  return true;
                }
                if (name !== correctName) {
                  error("Invalid ARIA attribute `%s`. Did you mean `%s`?", name, correctName);
                  warnedProperties[name] = true;
                  return true;
                }
              }
              if (rARIA.test(name)) {
                var lowerCasedName = name.toLowerCase();
                var standardName = ariaProperties.hasOwnProperty(lowerCasedName) ? lowerCasedName : null;
                if (standardName == null) {
                  warnedProperties[name] = true;
                  return false;
                }
                if (name !== standardName) {
                  error("Unknown ARIA attribute `%s`. Did you mean `%s`?", name, standardName);
                  warnedProperties[name] = true;
                  return true;
                }
              }
            }
            return true;
          }
          function warnInvalidARIAProps(type, props) {
            {
              var invalidProps = [];
              for (var key in props) {
                var isValid = validateProperty(type, key);
                if (!isValid) {
                  invalidProps.push(key);
                }
              }
              var unknownPropString = invalidProps.map(function(prop) {
                return "`" + prop + "`";
              }).join(", ");
              if (invalidProps.length === 1) {
                error("Invalid aria prop %s on <%s> tag. For details, see https://reactjs.org/link/invalid-aria-props", unknownPropString, type);
              } else if (invalidProps.length > 1) {
                error("Invalid aria props %s on <%s> tag. For details, see https://reactjs.org/link/invalid-aria-props", unknownPropString, type);
              }
            }
          }
          function validateProperties(type, props) {
            if (isCustomComponent(type, props)) {
              return;
            }
            warnInvalidARIAProps(type, props);
          }
          var didWarnValueNull = false;
          function validateProperties$1(type, props) {
            {
              if (type !== "input" && type !== "textarea" && type !== "select") {
                return;
              }
              if (props != null && props.value === null && !didWarnValueNull) {
                didWarnValueNull = true;
                if (type === "select" && props.multiple) {
                  error("`value` prop on `%s` should not be null. Consider using an empty array when `multiple` is set to `true` to clear the component or `undefined` for uncontrolled components.", type);
                } else {
                  error("`value` prop on `%s` should not be null. Consider using an empty string to clear the component or `undefined` for uncontrolled components.", type);
                }
              }
            }
          }
          var possibleStandardNames = {
            // HTML
            accept: "accept",
            acceptcharset: "acceptCharset",
            "accept-charset": "acceptCharset",
            accesskey: "accessKey",
            action: "action",
            allowfullscreen: "allowFullScreen",
            alt: "alt",
            as: "as",
            async: "async",
            autocapitalize: "autoCapitalize",
            autocomplete: "autoComplete",
            autocorrect: "autoCorrect",
            autofocus: "autoFocus",
            autoplay: "autoPlay",
            autosave: "autoSave",
            capture: "capture",
            cellpadding: "cellPadding",
            cellspacing: "cellSpacing",
            challenge: "challenge",
            charset: "charSet",
            checked: "checked",
            children: "children",
            cite: "cite",
            class: "className",
            classid: "classID",
            classname: "className",
            cols: "cols",
            colspan: "colSpan",
            content: "content",
            contenteditable: "contentEditable",
            contextmenu: "contextMenu",
            controls: "controls",
            controlslist: "controlsList",
            coords: "coords",
            crossorigin: "crossOrigin",
            dangerouslysetinnerhtml: "dangerouslySetInnerHTML",
            data: "data",
            datetime: "dateTime",
            default: "default",
            defaultchecked: "defaultChecked",
            defaultvalue: "defaultValue",
            defer: "defer",
            dir: "dir",
            disabled: "disabled",
            disablepictureinpicture: "disablePictureInPicture",
            disableremoteplayback: "disableRemotePlayback",
            download: "download",
            draggable: "draggable",
            enctype: "encType",
            enterkeyhint: "enterKeyHint",
            for: "htmlFor",
            form: "form",
            formmethod: "formMethod",
            formaction: "formAction",
            formenctype: "formEncType",
            formnovalidate: "formNoValidate",
            formtarget: "formTarget",
            frameborder: "frameBorder",
            headers: "headers",
            height: "height",
            hidden: "hidden",
            high: "high",
            href: "href",
            hreflang: "hrefLang",
            htmlfor: "htmlFor",
            httpequiv: "httpEquiv",
            "http-equiv": "httpEquiv",
            icon: "icon",
            id: "id",
            imagesizes: "imageSizes",
            imagesrcset: "imageSrcSet",
            innerhtml: "innerHTML",
            inputmode: "inputMode",
            integrity: "integrity",
            is: "is",
            itemid: "itemID",
            itemprop: "itemProp",
            itemref: "itemRef",
            itemscope: "itemScope",
            itemtype: "itemType",
            keyparams: "keyParams",
            keytype: "keyType",
            kind: "kind",
            label: "label",
            lang: "lang",
            list: "list",
            loop: "loop",
            low: "low",
            manifest: "manifest",
            marginwidth: "marginWidth",
            marginheight: "marginHeight",
            max: "max",
            maxlength: "maxLength",
            media: "media",
            mediagroup: "mediaGroup",
            method: "method",
            min: "min",
            minlength: "minLength",
            multiple: "multiple",
            muted: "muted",
            name: "name",
            nomodule: "noModule",
            nonce: "nonce",
            novalidate: "noValidate",
            open: "open",
            optimum: "optimum",
            pattern: "pattern",
            placeholder: "placeholder",
            playsinline: "playsInline",
            poster: "poster",
            preload: "preload",
            profile: "profile",
            radiogroup: "radioGroup",
            readonly: "readOnly",
            referrerpolicy: "referrerPolicy",
            rel: "rel",
            required: "required",
            reversed: "reversed",
            role: "role",
            rows: "rows",
            rowspan: "rowSpan",
            sandbox: "sandbox",
            scope: "scope",
            scoped: "scoped",
            scrolling: "scrolling",
            seamless: "seamless",
            selected: "selected",
            shape: "shape",
            size: "size",
            sizes: "sizes",
            span: "span",
            spellcheck: "spellCheck",
            src: "src",
            srcdoc: "srcDoc",
            srclang: "srcLang",
            srcset: "srcSet",
            start: "start",
            step: "step",
            style: "style",
            summary: "summary",
            tabindex: "tabIndex",
            target: "target",
            title: "title",
            type: "type",
            usemap: "useMap",
            value: "value",
            width: "width",
            wmode: "wmode",
            wrap: "wrap",
            // SVG
            about: "about",
            accentheight: "accentHeight",
            "accent-height": "accentHeight",
            accumulate: "accumulate",
            additive: "additive",
            alignmentbaseline: "alignmentBaseline",
            "alignment-baseline": "alignmentBaseline",
            allowreorder: "allowReorder",
            alphabetic: "alphabetic",
            amplitude: "amplitude",
            arabicform: "arabicForm",
            "arabic-form": "arabicForm",
            ascent: "ascent",
            attributename: "attributeName",
            attributetype: "attributeType",
            autoreverse: "autoReverse",
            azimuth: "azimuth",
            basefrequency: "baseFrequency",
            baselineshift: "baselineShift",
            "baseline-shift": "baselineShift",
            baseprofile: "baseProfile",
            bbox: "bbox",
            begin: "begin",
            bias: "bias",
            by: "by",
            calcmode: "calcMode",
            capheight: "capHeight",
            "cap-height": "capHeight",
            clip: "clip",
            clippath: "clipPath",
            "clip-path": "clipPath",
            clippathunits: "clipPathUnits",
            cliprule: "clipRule",
            "clip-rule": "clipRule",
            color: "color",
            colorinterpolation: "colorInterpolation",
            "color-interpolation": "colorInterpolation",
            colorinterpolationfilters: "colorInterpolationFilters",
            "color-interpolation-filters": "colorInterpolationFilters",
            colorprofile: "colorProfile",
            "color-profile": "colorProfile",
            colorrendering: "colorRendering",
            "color-rendering": "colorRendering",
            contentscripttype: "contentScriptType",
            contentstyletype: "contentStyleType",
            cursor: "cursor",
            cx: "cx",
            cy: "cy",
            d: "d",
            datatype: "datatype",
            decelerate: "decelerate",
            descent: "descent",
            diffuseconstant: "diffuseConstant",
            direction: "direction",
            display: "display",
            divisor: "divisor",
            dominantbaseline: "dominantBaseline",
            "dominant-baseline": "dominantBaseline",
            dur: "dur",
            dx: "dx",
            dy: "dy",
            edgemode: "edgeMode",
            elevation: "elevation",
            enablebackground: "enableBackground",
            "enable-background": "enableBackground",
            end: "end",
            exponent: "exponent",
            externalresourcesrequired: "externalResourcesRequired",
            fill: "fill",
            fillopacity: "fillOpacity",
            "fill-opacity": "fillOpacity",
            fillrule: "fillRule",
            "fill-rule": "fillRule",
            filter: "filter",
            filterres: "filterRes",
            filterunits: "filterUnits",
            floodopacity: "floodOpacity",
            "flood-opacity": "floodOpacity",
            floodcolor: "floodColor",
            "flood-color": "floodColor",
            focusable: "focusable",
            fontfamily: "fontFamily",
            "font-family": "fontFamily",
            fontsize: "fontSize",
            "font-size": "fontSize",
            fontsizeadjust: "fontSizeAdjust",
            "font-size-adjust": "fontSizeAdjust",
            fontstretch: "fontStretch",
            "font-stretch": "fontStretch",
            fontstyle: "fontStyle",
            "font-style": "fontStyle",
            fontvariant: "fontVariant",
            "font-variant": "fontVariant",
            fontweight: "fontWeight",
            "font-weight": "fontWeight",
            format: "format",
            from: "from",
            fx: "fx",
            fy: "fy",
            g1: "g1",
            g2: "g2",
            glyphname: "glyphName",
            "glyph-name": "glyphName",
            glyphorientationhorizontal: "glyphOrientationHorizontal",
            "glyph-orientation-horizontal": "glyphOrientationHorizontal",
            glyphorientationvertical: "glyphOrientationVertical",
            "glyph-orientation-vertical": "glyphOrientationVertical",
            glyphref: "glyphRef",
            gradienttransform: "gradientTransform",
            gradientunits: "gradientUnits",
            hanging: "hanging",
            horizadvx: "horizAdvX",
            "horiz-adv-x": "horizAdvX",
            horizoriginx: "horizOriginX",
            "horiz-origin-x": "horizOriginX",
            ideographic: "ideographic",
            imagerendering: "imageRendering",
            "image-rendering": "imageRendering",
            in2: "in2",
            in: "in",
            inlist: "inlist",
            intercept: "intercept",
            k1: "k1",
            k2: "k2",
            k3: "k3",
            k4: "k4",
            k: "k",
            kernelmatrix: "kernelMatrix",
            kernelunitlength: "kernelUnitLength",
            kerning: "kerning",
            keypoints: "keyPoints",
            keysplines: "keySplines",
            keytimes: "keyTimes",
            lengthadjust: "lengthAdjust",
            letterspacing: "letterSpacing",
            "letter-spacing": "letterSpacing",
            lightingcolor: "lightingColor",
            "lighting-color": "lightingColor",
            limitingconeangle: "limitingConeAngle",
            local: "local",
            markerend: "markerEnd",
            "marker-end": "markerEnd",
            markerheight: "markerHeight",
            markermid: "markerMid",
            "marker-mid": "markerMid",
            markerstart: "markerStart",
            "marker-start": "markerStart",
            markerunits: "markerUnits",
            markerwidth: "markerWidth",
            mask: "mask",
            maskcontentunits: "maskContentUnits",
            maskunits: "maskUnits",
            mathematical: "mathematical",
            mode: "mode",
            numoctaves: "numOctaves",
            offset: "offset",
            opacity: "opacity",
            operator: "operator",
            order: "order",
            orient: "orient",
            orientation: "orientation",
            origin: "origin",
            overflow: "overflow",
            overlineposition: "overlinePosition",
            "overline-position": "overlinePosition",
            overlinethickness: "overlineThickness",
            "overline-thickness": "overlineThickness",
            paintorder: "paintOrder",
            "paint-order": "paintOrder",
            panose1: "panose1",
            "panose-1": "panose1",
            pathlength: "pathLength",
            patterncontentunits: "patternContentUnits",
            patterntransform: "patternTransform",
            patternunits: "patternUnits",
            pointerevents: "pointerEvents",
            "pointer-events": "pointerEvents",
            points: "points",
            pointsatx: "pointsAtX",
            pointsaty: "pointsAtY",
            pointsatz: "pointsAtZ",
            prefix: "prefix",
            preservealpha: "preserveAlpha",
            preserveaspectratio: "preserveAspectRatio",
            primitiveunits: "primitiveUnits",
            property: "property",
            r: "r",
            radius: "radius",
            refx: "refX",
            refy: "refY",
            renderingintent: "renderingIntent",
            "rendering-intent": "renderingIntent",
            repeatcount: "repeatCount",
            repeatdur: "repeatDur",
            requiredextensions: "requiredExtensions",
            requiredfeatures: "requiredFeatures",
            resource: "resource",
            restart: "restart",
            result: "result",
            results: "results",
            rotate: "rotate",
            rx: "rx",
            ry: "ry",
            scale: "scale",
            security: "security",
            seed: "seed",
            shaperendering: "shapeRendering",
            "shape-rendering": "shapeRendering",
            slope: "slope",
            spacing: "spacing",
            specularconstant: "specularConstant",
            specularexponent: "specularExponent",
            speed: "speed",
            spreadmethod: "spreadMethod",
            startoffset: "startOffset",
            stddeviation: "stdDeviation",
            stemh: "stemh",
            stemv: "stemv",
            stitchtiles: "stitchTiles",
            stopcolor: "stopColor",
            "stop-color": "stopColor",
            stopopacity: "stopOpacity",
            "stop-opacity": "stopOpacity",
            strikethroughposition: "strikethroughPosition",
            "strikethrough-position": "strikethroughPosition",
            strikethroughthickness: "strikethroughThickness",
            "strikethrough-thickness": "strikethroughThickness",
            string: "string",
            stroke: "stroke",
            strokedasharray: "strokeDasharray",
            "stroke-dasharray": "strokeDasharray",
            strokedashoffset: "strokeDashoffset",
            "stroke-dashoffset": "strokeDashoffset",
            strokelinecap: "strokeLinecap",
            "stroke-linecap": "strokeLinecap",
            strokelinejoin: "strokeLinejoin",
            "stroke-linejoin": "strokeLinejoin",
            strokemiterlimit: "strokeMiterlimit",
            "stroke-miterlimit": "strokeMiterlimit",
            strokewidth: "strokeWidth",
            "stroke-width": "strokeWidth",
            strokeopacity: "strokeOpacity",
            "stroke-opacity": "strokeOpacity",
            suppresscontenteditablewarning: "suppressContentEditableWarning",
            suppresshydrationwarning: "suppressHydrationWarning",
            surfacescale: "surfaceScale",
            systemlanguage: "systemLanguage",
            tablevalues: "tableValues",
            targetx: "targetX",
            targety: "targetY",
            textanchor: "textAnchor",
            "text-anchor": "textAnchor",
            textdecoration: "textDecoration",
            "text-decoration": "textDecoration",
            textlength: "textLength",
            textrendering: "textRendering",
            "text-rendering": "textRendering",
            to: "to",
            transform: "transform",
            typeof: "typeof",
            u1: "u1",
            u2: "u2",
            underlineposition: "underlinePosition",
            "underline-position": "underlinePosition",
            underlinethickness: "underlineThickness",
            "underline-thickness": "underlineThickness",
            unicode: "unicode",
            unicodebidi: "unicodeBidi",
            "unicode-bidi": "unicodeBidi",
            unicoderange: "unicodeRange",
            "unicode-range": "unicodeRange",
            unitsperem: "unitsPerEm",
            "units-per-em": "unitsPerEm",
            unselectable: "unselectable",
            valphabetic: "vAlphabetic",
            "v-alphabetic": "vAlphabetic",
            values: "values",
            vectoreffect: "vectorEffect",
            "vector-effect": "vectorEffect",
            version: "version",
            vertadvy: "vertAdvY",
            "vert-adv-y": "vertAdvY",
            vertoriginx: "vertOriginX",
            "vert-origin-x": "vertOriginX",
            vertoriginy: "vertOriginY",
            "vert-origin-y": "vertOriginY",
            vhanging: "vHanging",
            "v-hanging": "vHanging",
            videographic: "vIdeographic",
            "v-ideographic": "vIdeographic",
            viewbox: "viewBox",
            viewtarget: "viewTarget",
            visibility: "visibility",
            vmathematical: "vMathematical",
            "v-mathematical": "vMathematical",
            vocab: "vocab",
            widths: "widths",
            wordspacing: "wordSpacing",
            "word-spacing": "wordSpacing",
            writingmode: "writingMode",
            "writing-mode": "writingMode",
            x1: "x1",
            x2: "x2",
            x: "x",
            xchannelselector: "xChannelSelector",
            xheight: "xHeight",
            "x-height": "xHeight",
            xlinkactuate: "xlinkActuate",
            "xlink:actuate": "xlinkActuate",
            xlinkarcrole: "xlinkArcrole",
            "xlink:arcrole": "xlinkArcrole",
            xlinkhref: "xlinkHref",
            "xlink:href": "xlinkHref",
            xlinkrole: "xlinkRole",
            "xlink:role": "xlinkRole",
            xlinkshow: "xlinkShow",
            "xlink:show": "xlinkShow",
            xlinktitle: "xlinkTitle",
            "xlink:title": "xlinkTitle",
            xlinktype: "xlinkType",
            "xlink:type": "xlinkType",
            xmlbase: "xmlBase",
            "xml:base": "xmlBase",
            xmllang: "xmlLang",
            "xml:lang": "xmlLang",
            xmlns: "xmlns",
            "xml:space": "xmlSpace",
            xmlnsxlink: "xmlnsXlink",
            "xmlns:xlink": "xmlnsXlink",
            xmlspace: "xmlSpace",
            y1: "y1",
            y2: "y2",
            y: "y",
            ychannelselector: "yChannelSelector",
            z: "z",
            zoomandpan: "zoomAndPan"
          };
          var validateProperty$1 = function() {
          };
          {
            var warnedProperties$1 = {};
            var EVENT_NAME_REGEX = /^on./;
            var INVALID_EVENT_NAME_REGEX = /^on[^A-Z]/;
            var rARIA$1 = new RegExp("^(aria)-[" + ATTRIBUTE_NAME_CHAR + "]*$");
            var rARIACamel$1 = new RegExp("^(aria)[A-Z][" + ATTRIBUTE_NAME_CHAR + "]*$");
            validateProperty$1 = function(tagName, name, value, eventRegistry) {
              if (hasOwnProperty2.call(warnedProperties$1, name) && warnedProperties$1[name]) {
                return true;
              }
              var lowerCasedName = name.toLowerCase();
              if (lowerCasedName === "onfocusin" || lowerCasedName === "onfocusout") {
                error("React uses onFocus and onBlur instead of onFocusIn and onFocusOut. All React events are normalized to bubble, so onFocusIn and onFocusOut are not needed/supported by React.");
                warnedProperties$1[name] = true;
                return true;
              }
              if (eventRegistry != null) {
                var registrationNameDependencies = eventRegistry.registrationNameDependencies, possibleRegistrationNames = eventRegistry.possibleRegistrationNames;
                if (registrationNameDependencies.hasOwnProperty(name)) {
                  return true;
                }
                var registrationName = possibleRegistrationNames.hasOwnProperty(lowerCasedName) ? possibleRegistrationNames[lowerCasedName] : null;
                if (registrationName != null) {
                  error("Invalid event handler property `%s`. Did you mean `%s`?", name, registrationName);
                  warnedProperties$1[name] = true;
                  return true;
                }
                if (EVENT_NAME_REGEX.test(name)) {
                  error("Unknown event handler property `%s`. It will be ignored.", name);
                  warnedProperties$1[name] = true;
                  return true;
                }
              } else if (EVENT_NAME_REGEX.test(name)) {
                if (INVALID_EVENT_NAME_REGEX.test(name)) {
                  error("Invalid event handler property `%s`. React events use the camelCase naming convention, for example `onClick`.", name);
                }
                warnedProperties$1[name] = true;
                return true;
              }
              if (rARIA$1.test(name) || rARIACamel$1.test(name)) {
                return true;
              }
              if (lowerCasedName === "innerhtml") {
                error("Directly setting property `innerHTML` is not permitted. For more information, lookup documentation on `dangerouslySetInnerHTML`.");
                warnedProperties$1[name] = true;
                return true;
              }
              if (lowerCasedName === "aria") {
                error("The `aria` attribute is reserved for future use in React. Pass individual `aria-` attributes instead.");
                warnedProperties$1[name] = true;
                return true;
              }
              if (lowerCasedName === "is" && value !== null && value !== void 0 && typeof value !== "string") {
                error("Received a `%s` for a string attribute `is`. If this is expected, cast the value to a string.", typeof value);
                warnedProperties$1[name] = true;
                return true;
              }
              if (typeof value === "number" && isNaN(value)) {
                error("Received NaN for the `%s` attribute. If this is expected, cast the value to a string.", name);
                warnedProperties$1[name] = true;
                return true;
              }
              var propertyInfo = getPropertyInfo(name);
              var isReserved = propertyInfo !== null && propertyInfo.type === RESERVED;
              if (possibleStandardNames.hasOwnProperty(lowerCasedName)) {
                var standardName = possibleStandardNames[lowerCasedName];
                if (standardName !== name) {
                  error("Invalid DOM property `%s`. Did you mean `%s`?", name, standardName);
                  warnedProperties$1[name] = true;
                  return true;
                }
              } else if (!isReserved && name !== lowerCasedName) {
                error("React does not recognize the `%s` prop on a DOM element. If you intentionally want it to appear in the DOM as a custom attribute, spell it as lowercase `%s` instead. If you accidentally passed it from a parent component, remove it from the DOM element.", name, lowerCasedName);
                warnedProperties$1[name] = true;
                return true;
              }
              if (typeof value === "boolean" && shouldRemoveAttributeWithWarning(name, value, propertyInfo, false)) {
                if (value) {
                  error('Received `%s` for a non-boolean attribute `%s`.\n\nIf you want to write it to the DOM, pass a string instead: %s="%s" or %s={value.toString()}.', value, name, name, value, name);
                } else {
                  error('Received `%s` for a non-boolean attribute `%s`.\n\nIf you want to write it to the DOM, pass a string instead: %s="%s" or %s={value.toString()}.\n\nIf you used to conditionally omit it with %s={condition && value}, pass %s={condition ? value : undefined} instead.', value, name, name, value, name, name, name);
                }
                warnedProperties$1[name] = true;
                return true;
              }
              if (isReserved) {
                return true;
              }
              if (shouldRemoveAttributeWithWarning(name, value, propertyInfo, false)) {
                warnedProperties$1[name] = true;
                return false;
              }
              if ((value === "false" || value === "true") && propertyInfo !== null && propertyInfo.type === BOOLEAN) {
                error("Received the string `%s` for the boolean attribute `%s`. %s Did you mean %s={%s}?", value, name, value === "false" ? "The browser will interpret it as a truthy value." : 'Although this works, it will not work as expected if you pass the string "false".', name, value);
                warnedProperties$1[name] = true;
                return true;
              }
              return true;
            };
          }
          var warnUnknownProperties = function(type, props, eventRegistry) {
            {
              var unknownProps = [];
              for (var key in props) {
                var isValid = validateProperty$1(type, key, props[key], eventRegistry);
                if (!isValid) {
                  unknownProps.push(key);
                }
              }
              var unknownPropString = unknownProps.map(function(prop) {
                return "`" + prop + "`";
              }).join(", ");
              if (unknownProps.length === 1) {
                error("Invalid value for prop %s on <%s> tag. Either remove it from the element, or pass a string or number value to keep it in the DOM. For details, see https://reactjs.org/link/attribute-behavior ", unknownPropString, type);
              } else if (unknownProps.length > 1) {
                error("Invalid values for props %s on <%s> tag. Either remove them from the element, or pass a string or number value to keep them in the DOM. For details, see https://reactjs.org/link/attribute-behavior ", unknownPropString, type);
              }
            }
          };
          function validateProperties$2(type, props, eventRegistry) {
            if (isCustomComponent(type, props)) {
              return;
            }
            warnUnknownProperties(type, props, eventRegistry);
          }
          var warnValidStyle = function() {
          };
          {
            var badVendoredStyleNamePattern = /^(?:webkit|moz|o)[A-Z]/;
            var msPattern = /^-ms-/;
            var hyphenPattern = /-(.)/g;
            var badStyleValueWithSemicolonPattern = /;\s*$/;
            var warnedStyleNames = {};
            var warnedStyleValues = {};
            var warnedForNaNValue = false;
            var warnedForInfinityValue = false;
            var camelize = function(string) {
              return string.replace(hyphenPattern, function(_, character) {
                return character.toUpperCase();
              });
            };
            var warnHyphenatedStyleName = function(name) {
              if (warnedStyleNames.hasOwnProperty(name) && warnedStyleNames[name]) {
                return;
              }
              warnedStyleNames[name] = true;
              error(
                "Unsupported style property %s. Did you mean %s?",
                name,
                // As Andi Smith suggests
                // (http://www.andismith.com/blog/2012/02/modernizr-prefixed/), an `-ms` prefix
                // is converted to lowercase `ms`.
                camelize(name.replace(msPattern, "ms-"))
              );
            };
            var warnBadVendoredStyleName = function(name) {
              if (warnedStyleNames.hasOwnProperty(name) && warnedStyleNames[name]) {
                return;
              }
              warnedStyleNames[name] = true;
              error("Unsupported vendor-prefixed style property %s. Did you mean %s?", name, name.charAt(0).toUpperCase() + name.slice(1));
            };
            var warnStyleValueWithSemicolon = function(name, value) {
              if (warnedStyleValues.hasOwnProperty(value) && warnedStyleValues[value]) {
                return;
              }
              warnedStyleValues[value] = true;
              error(`Style property values shouldn't contain a semicolon. Try "%s: %s" instead.`, name, value.replace(badStyleValueWithSemicolonPattern, ""));
            };
            var warnStyleValueIsNaN = function(name, value) {
              if (warnedForNaNValue) {
                return;
              }
              warnedForNaNValue = true;
              error("`NaN` is an invalid value for the `%s` css style property.", name);
            };
            var warnStyleValueIsInfinity = function(name, value) {
              if (warnedForInfinityValue) {
                return;
              }
              warnedForInfinityValue = true;
              error("`Infinity` is an invalid value for the `%s` css style property.", name);
            };
            warnValidStyle = function(name, value) {
              if (name.indexOf("-") > -1) {
                warnHyphenatedStyleName(name);
              } else if (badVendoredStyleNamePattern.test(name)) {
                warnBadVendoredStyleName(name);
              } else if (badStyleValueWithSemicolonPattern.test(value)) {
                warnStyleValueWithSemicolon(name, value);
              }
              if (typeof value === "number") {
                if (isNaN(value)) {
                  warnStyleValueIsNaN(name, value);
                } else if (!isFinite(value)) {
                  warnStyleValueIsInfinity(name, value);
                }
              }
            };
          }
          var warnValidStyle$1 = warnValidStyle;
          var matchHtmlRegExp = /["'&<>]/;
          function escapeHtml(string) {
            {
              checkHtmlStringCoercion(string);
            }
            var str = "" + string;
            var match = matchHtmlRegExp.exec(str);
            if (!match) {
              return str;
            }
            var escape;
            var html = "";
            var index;
            var lastIndex = 0;
            for (index = match.index; index < str.length; index++) {
              switch (str.charCodeAt(index)) {
                case 34:
                  escape = "&quot;";
                  break;
                case 38:
                  escape = "&amp;";
                  break;
                case 39:
                  escape = "&#x27;";
                  break;
                case 60:
                  escape = "&lt;";
                  break;
                case 62:
                  escape = "&gt;";
                  break;
                default:
                  continue;
              }
              if (lastIndex !== index) {
                html += str.substring(lastIndex, index);
              }
              lastIndex = index + 1;
              html += escape;
            }
            return lastIndex !== index ? html + str.substring(lastIndex, index) : html;
          }
          function escapeTextForBrowser(text) {
            if (typeof text === "boolean" || typeof text === "number") {
              return "" + text;
            }
            return escapeHtml(text);
          }
          var uppercasePattern = /([A-Z])/g;
          var msPattern$1 = /^ms-/;
          function hyphenateStyleName(name) {
            return name.replace(uppercasePattern, "-$1").toLowerCase().replace(msPattern$1, "-ms-");
          }
          var isJavaScriptProtocol = /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*\:/i;
          var didWarn = false;
          function sanitizeURL(url) {
            {
              if (!didWarn && isJavaScriptProtocol.test(url)) {
                didWarn = true;
                error("A future version of React will block javascript: URLs as a security precaution. Use event handlers instead if you can. If you need to generate unsafe HTML try using dangerouslySetInnerHTML instead. React was passed %s.", JSON.stringify(url));
              }
            }
          }
          var isArrayImpl = Array.isArray;
          function isArray2(a) {
            return isArrayImpl(a);
          }
          var startInlineScript = stringToPrecomputedChunk("<script>");
          var endInlineScript = stringToPrecomputedChunk("<\/script>");
          var startScriptSrc = stringToPrecomputedChunk('<script src="');
          var startModuleSrc = stringToPrecomputedChunk('<script type="module" src="');
          var endAsyncScript = stringToPrecomputedChunk('" async=""><\/script>');
          function escapeBootstrapScriptContent(scriptText) {
            {
              checkHtmlStringCoercion(scriptText);
            }
            return ("" + scriptText).replace(scriptRegex, scriptReplacer);
          }
          var scriptRegex = /(<\/|<)(s)(cript)/gi;
          var scriptReplacer = function(match, prefix2, s, suffix) {
            return "" + prefix2 + (s === "s" ? "\\u0073" : "\\u0053") + suffix;
          };
          function createResponseState(identifierPrefix, nonce, bootstrapScriptContent, bootstrapScripts, bootstrapModules) {
            var idPrefix = identifierPrefix === void 0 ? "" : identifierPrefix;
            var inlineScriptWithNonce = nonce === void 0 ? startInlineScript : stringToPrecomputedChunk('<script nonce="' + escapeTextForBrowser(nonce) + '">');
            var bootstrapChunks = [];
            if (bootstrapScriptContent !== void 0) {
              bootstrapChunks.push(inlineScriptWithNonce, stringToChunk(escapeBootstrapScriptContent(bootstrapScriptContent)), endInlineScript);
            }
            if (bootstrapScripts !== void 0) {
              for (var i = 0; i < bootstrapScripts.length; i++) {
                bootstrapChunks.push(startScriptSrc, stringToChunk(escapeTextForBrowser(bootstrapScripts[i])), endAsyncScript);
              }
            }
            if (bootstrapModules !== void 0) {
              for (var _i = 0; _i < bootstrapModules.length; _i++) {
                bootstrapChunks.push(startModuleSrc, stringToChunk(escapeTextForBrowser(bootstrapModules[_i])), endAsyncScript);
              }
            }
            return {
              bootstrapChunks,
              startInlineScript: inlineScriptWithNonce,
              placeholderPrefix: stringToPrecomputedChunk(idPrefix + "P:"),
              segmentPrefix: stringToPrecomputedChunk(idPrefix + "S:"),
              boundaryPrefix: idPrefix + "B:",
              idPrefix,
              nextSuspenseID: 0,
              sentCompleteSegmentFunction: false,
              sentCompleteBoundaryFunction: false,
              sentClientRenderFunction: false
            };
          }
          var ROOT_HTML_MODE = 0;
          var HTML_MODE = 1;
          var SVG_MODE = 2;
          var MATHML_MODE = 3;
          var HTML_TABLE_MODE = 4;
          var HTML_TABLE_BODY_MODE = 5;
          var HTML_TABLE_ROW_MODE = 6;
          var HTML_COLGROUP_MODE = 7;
          function createFormatContext(insertionMode, selectedValue) {
            return {
              insertionMode,
              selectedValue
            };
          }
          function getChildFormatContext(parentContext, type, props) {
            switch (type) {
              case "select":
                return createFormatContext(HTML_MODE, props.value != null ? props.value : props.defaultValue);
              case "svg":
                return createFormatContext(SVG_MODE, null);
              case "math":
                return createFormatContext(MATHML_MODE, null);
              case "foreignObject":
                return createFormatContext(HTML_MODE, null);
              case "table":
                return createFormatContext(HTML_TABLE_MODE, null);
              case "thead":
              case "tbody":
              case "tfoot":
                return createFormatContext(HTML_TABLE_BODY_MODE, null);
              case "colgroup":
                return createFormatContext(HTML_COLGROUP_MODE, null);
              case "tr":
                return createFormatContext(HTML_TABLE_ROW_MODE, null);
            }
            if (parentContext.insertionMode >= HTML_TABLE_MODE) {
              return createFormatContext(HTML_MODE, null);
            }
            if (parentContext.insertionMode === ROOT_HTML_MODE) {
              return createFormatContext(HTML_MODE, null);
            }
            return parentContext;
          }
          var UNINITIALIZED_SUSPENSE_BOUNDARY_ID = null;
          function assignSuspenseBoundaryID(responseState) {
            var generatedID = responseState.nextSuspenseID++;
            return stringToPrecomputedChunk(responseState.boundaryPrefix + generatedID.toString(16));
          }
          function makeId(responseState, treeId, localId) {
            var idPrefix = responseState.idPrefix;
            var id = ":" + idPrefix + "R" + treeId;
            if (localId > 0) {
              id += "H" + localId.toString(32);
            }
            return id + ":";
          }
          function encodeHTMLTextNode(text) {
            return escapeTextForBrowser(text);
          }
          var textSeparator = stringToPrecomputedChunk("<!-- -->");
          function pushTextInstance(target, text, responseState, textEmbedded) {
            if (text === "") {
              return textEmbedded;
            }
            if (textEmbedded) {
              target.push(textSeparator);
            }
            target.push(stringToChunk(encodeHTMLTextNode(text)));
            return true;
          }
          function pushSegmentFinale(target, responseState, lastPushedText, textEmbedded) {
            if (lastPushedText && textEmbedded) {
              target.push(textSeparator);
            }
          }
          var styleNameCache = /* @__PURE__ */ new Map();
          function processStyleName(styleName) {
            var chunk = styleNameCache.get(styleName);
            if (chunk !== void 0) {
              return chunk;
            }
            var result = stringToPrecomputedChunk(escapeTextForBrowser(hyphenateStyleName(styleName)));
            styleNameCache.set(styleName, result);
            return result;
          }
          var styleAttributeStart = stringToPrecomputedChunk(' style="');
          var styleAssign = stringToPrecomputedChunk(":");
          var styleSeparator = stringToPrecomputedChunk(";");
          function pushStyle(target, responseState, style) {
            if (typeof style !== "object") {
              throw new Error("The `style` prop expects a mapping from style properties to values, not a string. For example, style={{marginRight: spacing + 'em'}} when using JSX.");
            }
            var isFirst = true;
            for (var styleName in style) {
              if (!hasOwnProperty2.call(style, styleName)) {
                continue;
              }
              var styleValue = style[styleName];
              if (styleValue == null || typeof styleValue === "boolean" || styleValue === "") {
                continue;
              }
              var nameChunk = void 0;
              var valueChunk = void 0;
              var isCustomProperty = styleName.indexOf("--") === 0;
              if (isCustomProperty) {
                nameChunk = stringToChunk(escapeTextForBrowser(styleName));
                {
                  checkCSSPropertyStringCoercion(styleValue, styleName);
                }
                valueChunk = stringToChunk(escapeTextForBrowser(("" + styleValue).trim()));
              } else {
                {
                  warnValidStyle$1(styleName, styleValue);
                }
                nameChunk = processStyleName(styleName);
                if (typeof styleValue === "number") {
                  if (styleValue !== 0 && !hasOwnProperty2.call(isUnitlessNumber, styleName)) {
                    valueChunk = stringToChunk(styleValue + "px");
                  } else {
                    valueChunk = stringToChunk("" + styleValue);
                  }
                } else {
                  {
                    checkCSSPropertyStringCoercion(styleValue, styleName);
                  }
                  valueChunk = stringToChunk(escapeTextForBrowser(("" + styleValue).trim()));
                }
              }
              if (isFirst) {
                isFirst = false;
                target.push(styleAttributeStart, nameChunk, styleAssign, valueChunk);
              } else {
                target.push(styleSeparator, nameChunk, styleAssign, valueChunk);
              }
            }
            if (!isFirst) {
              target.push(attributeEnd);
            }
          }
          var attributeSeparator = stringToPrecomputedChunk(" ");
          var attributeAssign = stringToPrecomputedChunk('="');
          var attributeEnd = stringToPrecomputedChunk('"');
          var attributeEmptyString = stringToPrecomputedChunk('=""');
          function pushAttribute(target, responseState, name, value) {
            switch (name) {
              case "style": {
                pushStyle(target, responseState, value);
                return;
              }
              case "defaultValue":
              case "defaultChecked":
              case "innerHTML":
              case "suppressContentEditableWarning":
              case "suppressHydrationWarning":
                return;
            }
            if (
              // shouldIgnoreAttribute
              // We have already filtered out null/undefined and reserved words.
              name.length > 2 && (name[0] === "o" || name[0] === "O") && (name[1] === "n" || name[1] === "N")
            ) {
              return;
            }
            var propertyInfo = getPropertyInfo(name);
            if (propertyInfo !== null) {
              switch (typeof value) {
                case "function":
                case "symbol":
                  return;
                case "boolean": {
                  if (!propertyInfo.acceptsBooleans) {
                    return;
                  }
                }
              }
              var attributeName = propertyInfo.attributeName;
              var attributeNameChunk = stringToChunk(attributeName);
              switch (propertyInfo.type) {
                case BOOLEAN:
                  if (value) {
                    target.push(attributeSeparator, attributeNameChunk, attributeEmptyString);
                  }
                  return;
                case OVERLOADED_BOOLEAN:
                  if (value === true) {
                    target.push(attributeSeparator, attributeNameChunk, attributeEmptyString);
                  } else if (value === false)
                    ;
                  else {
                    target.push(attributeSeparator, attributeNameChunk, attributeAssign, stringToChunk(escapeTextForBrowser(value)), attributeEnd);
                  }
                  return;
                case NUMERIC:
                  if (!isNaN(value)) {
                    target.push(attributeSeparator, attributeNameChunk, attributeAssign, stringToChunk(escapeTextForBrowser(value)), attributeEnd);
                  }
                  break;
                case POSITIVE_NUMERIC:
                  if (!isNaN(value) && value >= 1) {
                    target.push(attributeSeparator, attributeNameChunk, attributeAssign, stringToChunk(escapeTextForBrowser(value)), attributeEnd);
                  }
                  break;
                default:
                  if (propertyInfo.sanitizeURL) {
                    {
                      checkAttributeStringCoercion(value, attributeName);
                    }
                    value = "" + value;
                    sanitizeURL(value);
                  }
                  target.push(attributeSeparator, attributeNameChunk, attributeAssign, stringToChunk(escapeTextForBrowser(value)), attributeEnd);
              }
            } else if (isAttributeNameSafe(name)) {
              switch (typeof value) {
                case "function":
                case "symbol":
                  return;
                case "boolean": {
                  var prefix2 = name.toLowerCase().slice(0, 5);
                  if (prefix2 !== "data-" && prefix2 !== "aria-") {
                    return;
                  }
                }
              }
              target.push(attributeSeparator, stringToChunk(name), attributeAssign, stringToChunk(escapeTextForBrowser(value)), attributeEnd);
            }
          }
          var endOfStartTag = stringToPrecomputedChunk(">");
          var endOfStartTagSelfClosing = stringToPrecomputedChunk("/>");
          function pushInnerHTML(target, innerHTML, children) {
            if (innerHTML != null) {
              if (children != null) {
                throw new Error("Can only set one of `children` or `props.dangerouslySetInnerHTML`.");
              }
              if (typeof innerHTML !== "object" || !("__html" in innerHTML)) {
                throw new Error("`props.dangerouslySetInnerHTML` must be in the form `{__html: ...}`. Please visit https://reactjs.org/link/dangerously-set-inner-html for more information.");
              }
              var html = innerHTML.__html;
              if (html !== null && html !== void 0) {
                {
                  checkHtmlStringCoercion(html);
                }
                target.push(stringToChunk("" + html));
              }
            }
          }
          var didWarnDefaultInputValue = false;
          var didWarnDefaultChecked = false;
          var didWarnDefaultSelectValue = false;
          var didWarnDefaultTextareaValue = false;
          var didWarnInvalidOptionChildren = false;
          var didWarnInvalidOptionInnerHTML = false;
          var didWarnSelectedSetOnOption = false;
          function checkSelectProp(props, propName) {
            {
              var value = props[propName];
              if (value != null) {
                var array = isArray2(value);
                if (props.multiple && !array) {
                  error("The `%s` prop supplied to <select> must be an array if `multiple` is true.", propName);
                } else if (!props.multiple && array) {
                  error("The `%s` prop supplied to <select> must be a scalar value if `multiple` is false.", propName);
                }
              }
            }
          }
          function pushStartSelect(target, props, responseState) {
            {
              checkControlledValueProps("select", props);
              checkSelectProp(props, "value");
              checkSelectProp(props, "defaultValue");
              if (props.value !== void 0 && props.defaultValue !== void 0 && !didWarnDefaultSelectValue) {
                error("Select elements must be either controlled or uncontrolled (specify either the value prop, or the defaultValue prop, but not both). Decide between using a controlled or uncontrolled select element and remove one of these props. More info: https://reactjs.org/link/controlled-components");
                didWarnDefaultSelectValue = true;
              }
            }
            target.push(startChunkForTag("select"));
            var children = null;
            var innerHTML = null;
            for (var propKey in props) {
              if (hasOwnProperty2.call(props, propKey)) {
                var propValue = props[propKey];
                if (propValue == null) {
                  continue;
                }
                switch (propKey) {
                  case "children":
                    children = propValue;
                    break;
                  case "dangerouslySetInnerHTML":
                    innerHTML = propValue;
                    break;
                  case "defaultValue":
                  case "value":
                    break;
                  default:
                    pushAttribute(target, responseState, propKey, propValue);
                    break;
                }
              }
            }
            target.push(endOfStartTag);
            pushInnerHTML(target, innerHTML, children);
            return children;
          }
          function flattenOptionChildren(children) {
            var content = "";
            React3.Children.forEach(children, function(child) {
              if (child == null) {
                return;
              }
              content += child;
              {
                if (!didWarnInvalidOptionChildren && typeof child !== "string" && typeof child !== "number") {
                  didWarnInvalidOptionChildren = true;
                  error("Cannot infer the option value of complex children. Pass a `value` prop or use a plain string as children to <option>.");
                }
              }
            });
            return content;
          }
          var selectedMarkerAttribute = stringToPrecomputedChunk(' selected=""');
          function pushStartOption(target, props, responseState, formatContext) {
            var selectedValue = formatContext.selectedValue;
            target.push(startChunkForTag("option"));
            var children = null;
            var value = null;
            var selected = null;
            var innerHTML = null;
            for (var propKey in props) {
              if (hasOwnProperty2.call(props, propKey)) {
                var propValue = props[propKey];
                if (propValue == null) {
                  continue;
                }
                switch (propKey) {
                  case "children":
                    children = propValue;
                    break;
                  case "selected":
                    selected = propValue;
                    {
                      if (!didWarnSelectedSetOnOption) {
                        error("Use the `defaultValue` or `value` props on <select> instead of setting `selected` on <option>.");
                        didWarnSelectedSetOnOption = true;
                      }
                    }
                    break;
                  case "dangerouslySetInnerHTML":
                    innerHTML = propValue;
                    break;
                  case "value":
                    value = propValue;
                  default:
                    pushAttribute(target, responseState, propKey, propValue);
                    break;
                }
              }
            }
            if (selectedValue != null) {
              var stringValue;
              if (value !== null) {
                {
                  checkAttributeStringCoercion(value, "value");
                }
                stringValue = "" + value;
              } else {
                {
                  if (innerHTML !== null) {
                    if (!didWarnInvalidOptionInnerHTML) {
                      didWarnInvalidOptionInnerHTML = true;
                      error("Pass a `value` prop if you set dangerouslyInnerHTML so React knows which value should be selected.");
                    }
                  }
                }
                stringValue = flattenOptionChildren(children);
              }
              if (isArray2(selectedValue)) {
                for (var i = 0; i < selectedValue.length; i++) {
                  {
                    checkAttributeStringCoercion(selectedValue[i], "value");
                  }
                  var v = "" + selectedValue[i];
                  if (v === stringValue) {
                    target.push(selectedMarkerAttribute);
                    break;
                  }
                }
              } else {
                {
                  checkAttributeStringCoercion(selectedValue, "select.value");
                }
                if ("" + selectedValue === stringValue) {
                  target.push(selectedMarkerAttribute);
                }
              }
            } else if (selected) {
              target.push(selectedMarkerAttribute);
            }
            target.push(endOfStartTag);
            pushInnerHTML(target, innerHTML, children);
            return children;
          }
          function pushInput(target, props, responseState) {
            {
              checkControlledValueProps("input", props);
              if (props.checked !== void 0 && props.defaultChecked !== void 0 && !didWarnDefaultChecked) {
                error("%s contains an input of type %s with both checked and defaultChecked props. Input elements must be either controlled or uncontrolled (specify either the checked prop, or the defaultChecked prop, but not both). Decide between using a controlled or uncontrolled input element and remove one of these props. More info: https://reactjs.org/link/controlled-components", "A component", props.type);
                didWarnDefaultChecked = true;
              }
              if (props.value !== void 0 && props.defaultValue !== void 0 && !didWarnDefaultInputValue) {
                error("%s contains an input of type %s with both value and defaultValue props. Input elements must be either controlled or uncontrolled (specify either the value prop, or the defaultValue prop, but not both). Decide between using a controlled or uncontrolled input element and remove one of these props. More info: https://reactjs.org/link/controlled-components", "A component", props.type);
                didWarnDefaultInputValue = true;
              }
            }
            target.push(startChunkForTag("input"));
            var value = null;
            var defaultValue = null;
            var checked = null;
            var defaultChecked = null;
            for (var propKey in props) {
              if (hasOwnProperty2.call(props, propKey)) {
                var propValue = props[propKey];
                if (propValue == null) {
                  continue;
                }
                switch (propKey) {
                  case "children":
                  case "dangerouslySetInnerHTML":
                    throw new Error("input is a self-closing tag and must neither have `children` nor use `dangerouslySetInnerHTML`.");
                  case "defaultChecked":
                    defaultChecked = propValue;
                    break;
                  case "defaultValue":
                    defaultValue = propValue;
                    break;
                  case "checked":
                    checked = propValue;
                    break;
                  case "value":
                    value = propValue;
                    break;
                  default:
                    pushAttribute(target, responseState, propKey, propValue);
                    break;
                }
              }
            }
            if (checked !== null) {
              pushAttribute(target, responseState, "checked", checked);
            } else if (defaultChecked !== null) {
              pushAttribute(target, responseState, "checked", defaultChecked);
            }
            if (value !== null) {
              pushAttribute(target, responseState, "value", value);
            } else if (defaultValue !== null) {
              pushAttribute(target, responseState, "value", defaultValue);
            }
            target.push(endOfStartTagSelfClosing);
            return null;
          }
          function pushStartTextArea(target, props, responseState) {
            {
              checkControlledValueProps("textarea", props);
              if (props.value !== void 0 && props.defaultValue !== void 0 && !didWarnDefaultTextareaValue) {
                error("Textarea elements must be either controlled or uncontrolled (specify either the value prop, or the defaultValue prop, but not both). Decide between using a controlled or uncontrolled textarea and remove one of these props. More info: https://reactjs.org/link/controlled-components");
                didWarnDefaultTextareaValue = true;
              }
            }
            target.push(startChunkForTag("textarea"));
            var value = null;
            var defaultValue = null;
            var children = null;
            for (var propKey in props) {
              if (hasOwnProperty2.call(props, propKey)) {
                var propValue = props[propKey];
                if (propValue == null) {
                  continue;
                }
                switch (propKey) {
                  case "children":
                    children = propValue;
                    break;
                  case "value":
                    value = propValue;
                    break;
                  case "defaultValue":
                    defaultValue = propValue;
                    break;
                  case "dangerouslySetInnerHTML":
                    throw new Error("`dangerouslySetInnerHTML` does not make sense on <textarea>.");
                  default:
                    pushAttribute(target, responseState, propKey, propValue);
                    break;
                }
              }
            }
            if (value === null && defaultValue !== null) {
              value = defaultValue;
            }
            target.push(endOfStartTag);
            if (children != null) {
              {
                error("Use the `defaultValue` or `value` props instead of setting children on <textarea>.");
              }
              if (value != null) {
                throw new Error("If you supply `defaultValue` on a <textarea>, do not pass children.");
              }
              if (isArray2(children)) {
                if (children.length > 1) {
                  throw new Error("<textarea> can only have at most one child.");
                }
                {
                  checkHtmlStringCoercion(children[0]);
                }
                value = "" + children[0];
              }
              {
                checkHtmlStringCoercion(children);
              }
              value = "" + children;
            }
            if (typeof value === "string" && value[0] === "\n") {
              target.push(leadingNewline);
            }
            if (value !== null) {
              {
                checkAttributeStringCoercion(value, "value");
              }
              target.push(stringToChunk(encodeHTMLTextNode("" + value)));
            }
            return null;
          }
          function pushSelfClosing(target, props, tag, responseState) {
            target.push(startChunkForTag(tag));
            for (var propKey in props) {
              if (hasOwnProperty2.call(props, propKey)) {
                var propValue = props[propKey];
                if (propValue == null) {
                  continue;
                }
                switch (propKey) {
                  case "children":
                  case "dangerouslySetInnerHTML":
                    throw new Error(tag + " is a self-closing tag and must neither have `children` nor use `dangerouslySetInnerHTML`.");
                  default:
                    pushAttribute(target, responseState, propKey, propValue);
                    break;
                }
              }
            }
            target.push(endOfStartTagSelfClosing);
            return null;
          }
          function pushStartMenuItem(target, props, responseState) {
            target.push(startChunkForTag("menuitem"));
            for (var propKey in props) {
              if (hasOwnProperty2.call(props, propKey)) {
                var propValue = props[propKey];
                if (propValue == null) {
                  continue;
                }
                switch (propKey) {
                  case "children":
                  case "dangerouslySetInnerHTML":
                    throw new Error("menuitems cannot have `children` nor `dangerouslySetInnerHTML`.");
                  default:
                    pushAttribute(target, responseState, propKey, propValue);
                    break;
                }
              }
            }
            target.push(endOfStartTag);
            return null;
          }
          function pushStartTitle(target, props, responseState) {
            target.push(startChunkForTag("title"));
            var children = null;
            for (var propKey in props) {
              if (hasOwnProperty2.call(props, propKey)) {
                var propValue = props[propKey];
                if (propValue == null) {
                  continue;
                }
                switch (propKey) {
                  case "children":
                    children = propValue;
                    break;
                  case "dangerouslySetInnerHTML":
                    throw new Error("`dangerouslySetInnerHTML` does not make sense on <title>.");
                  default:
                    pushAttribute(target, responseState, propKey, propValue);
                    break;
                }
              }
            }
            target.push(endOfStartTag);
            {
              var child = Array.isArray(children) && children.length < 2 ? children[0] || null : children;
              if (Array.isArray(children) && children.length > 1) {
                error("A title element received an array with more than 1 element as children. In browsers title Elements can only have Text Nodes as children. If the children being rendered output more than a single text node in aggregate the browser will display markup and comments as text in the title and hydration will likely fail and fall back to client rendering");
              } else if (child != null && child.$$typeof != null) {
                error("A title element received a React element for children. In the browser title Elements can only have Text Nodes as children. If the children being rendered output more than a single text node in aggregate the browser will display markup and comments as text in the title and hydration will likely fail and fall back to client rendering");
              } else if (child != null && typeof child !== "string" && typeof child !== "number") {
                error("A title element received a value that was not a string or number for children. In the browser title Elements can only have Text Nodes as children. If the children being rendered output more than a single text node in aggregate the browser will display markup and comments as text in the title and hydration will likely fail and fall back to client rendering");
              }
            }
            return children;
          }
          function pushStartGenericElement(target, props, tag, responseState) {
            target.push(startChunkForTag(tag));
            var children = null;
            var innerHTML = null;
            for (var propKey in props) {
              if (hasOwnProperty2.call(props, propKey)) {
                var propValue = props[propKey];
                if (propValue == null) {
                  continue;
                }
                switch (propKey) {
                  case "children":
                    children = propValue;
                    break;
                  case "dangerouslySetInnerHTML":
                    innerHTML = propValue;
                    break;
                  default:
                    pushAttribute(target, responseState, propKey, propValue);
                    break;
                }
              }
            }
            target.push(endOfStartTag);
            pushInnerHTML(target, innerHTML, children);
            if (typeof children === "string") {
              target.push(stringToChunk(encodeHTMLTextNode(children)));
              return null;
            }
            return children;
          }
          function pushStartCustomElement(target, props, tag, responseState) {
            target.push(startChunkForTag(tag));
            var children = null;
            var innerHTML = null;
            for (var propKey in props) {
              if (hasOwnProperty2.call(props, propKey)) {
                var propValue = props[propKey];
                if (propValue == null) {
                  continue;
                }
                switch (propKey) {
                  case "children":
                    children = propValue;
                    break;
                  case "dangerouslySetInnerHTML":
                    innerHTML = propValue;
                    break;
                  case "style":
                    pushStyle(target, responseState, propValue);
                    break;
                  case "suppressContentEditableWarning":
                  case "suppressHydrationWarning":
                    break;
                  default:
                    if (isAttributeNameSafe(propKey) && typeof propValue !== "function" && typeof propValue !== "symbol") {
                      target.push(attributeSeparator, stringToChunk(propKey), attributeAssign, stringToChunk(escapeTextForBrowser(propValue)), attributeEnd);
                    }
                    break;
                }
              }
            }
            target.push(endOfStartTag);
            pushInnerHTML(target, innerHTML, children);
            return children;
          }
          var leadingNewline = stringToPrecomputedChunk("\n");
          function pushStartPreformattedElement(target, props, tag, responseState) {
            target.push(startChunkForTag(tag));
            var children = null;
            var innerHTML = null;
            for (var propKey in props) {
              if (hasOwnProperty2.call(props, propKey)) {
                var propValue = props[propKey];
                if (propValue == null) {
                  continue;
                }
                switch (propKey) {
                  case "children":
                    children = propValue;
                    break;
                  case "dangerouslySetInnerHTML":
                    innerHTML = propValue;
                    break;
                  default:
                    pushAttribute(target, responseState, propKey, propValue);
                    break;
                }
              }
            }
            target.push(endOfStartTag);
            if (innerHTML != null) {
              if (children != null) {
                throw new Error("Can only set one of `children` or `props.dangerouslySetInnerHTML`.");
              }
              if (typeof innerHTML !== "object" || !("__html" in innerHTML)) {
                throw new Error("`props.dangerouslySetInnerHTML` must be in the form `{__html: ...}`. Please visit https://reactjs.org/link/dangerously-set-inner-html for more information.");
              }
              var html = innerHTML.__html;
              if (html !== null && html !== void 0) {
                if (typeof html === "string" && html.length > 0 && html[0] === "\n") {
                  target.push(leadingNewline, stringToChunk(html));
                } else {
                  {
                    checkHtmlStringCoercion(html);
                  }
                  target.push(stringToChunk("" + html));
                }
              }
            }
            if (typeof children === "string" && children[0] === "\n") {
              target.push(leadingNewline);
            }
            return children;
          }
          var VALID_TAG_REGEX = /^[a-zA-Z][a-zA-Z:_\.\-\d]*$/;
          var validatedTagCache = /* @__PURE__ */ new Map();
          function startChunkForTag(tag) {
            var tagStartChunk = validatedTagCache.get(tag);
            if (tagStartChunk === void 0) {
              if (!VALID_TAG_REGEX.test(tag)) {
                throw new Error("Invalid tag: " + tag);
              }
              tagStartChunk = stringToPrecomputedChunk("<" + tag);
              validatedTagCache.set(tag, tagStartChunk);
            }
            return tagStartChunk;
          }
          var DOCTYPE = stringToPrecomputedChunk("<!DOCTYPE html>");
          function pushStartInstance(target, type, props, responseState, formatContext) {
            {
              validateProperties(type, props);
              validateProperties$1(type, props);
              validateProperties$2(type, props, null);
              if (!props.suppressContentEditableWarning && props.contentEditable && props.children != null) {
                error("A component is `contentEditable` and contains `children` managed by React. It is now your responsibility to guarantee that none of those nodes are unexpectedly modified or duplicated. This is probably not intentional.");
              }
              if (formatContext.insertionMode !== SVG_MODE && formatContext.insertionMode !== MATHML_MODE) {
                if (type.indexOf("-") === -1 && typeof props.is !== "string" && type.toLowerCase() !== type) {
                  error("<%s /> is using incorrect casing. Use PascalCase for React components, or lowercase for HTML elements.", type);
                }
              }
            }
            switch (type) {
              case "select":
                return pushStartSelect(target, props, responseState);
              case "option":
                return pushStartOption(target, props, responseState, formatContext);
              case "textarea":
                return pushStartTextArea(target, props, responseState);
              case "input":
                return pushInput(target, props, responseState);
              case "menuitem":
                return pushStartMenuItem(target, props, responseState);
              case "title":
                return pushStartTitle(target, props, responseState);
              case "listing":
              case "pre": {
                return pushStartPreformattedElement(target, props, type, responseState);
              }
              case "area":
              case "base":
              case "br":
              case "col":
              case "embed":
              case "hr":
              case "img":
              case "keygen":
              case "link":
              case "meta":
              case "param":
              case "source":
              case "track":
              case "wbr": {
                return pushSelfClosing(target, props, type, responseState);
              }
              case "annotation-xml":
              case "color-profile":
              case "font-face":
              case "font-face-src":
              case "font-face-uri":
              case "font-face-format":
              case "font-face-name":
              case "missing-glyph": {
                return pushStartGenericElement(target, props, type, responseState);
              }
              case "html": {
                if (formatContext.insertionMode === ROOT_HTML_MODE) {
                  target.push(DOCTYPE);
                }
                return pushStartGenericElement(target, props, type, responseState);
              }
              default: {
                if (type.indexOf("-") === -1 && typeof props.is !== "string") {
                  return pushStartGenericElement(target, props, type, responseState);
                } else {
                  return pushStartCustomElement(target, props, type, responseState);
                }
              }
            }
          }
          var endTag1 = stringToPrecomputedChunk("</");
          var endTag2 = stringToPrecomputedChunk(">");
          function pushEndInstance(target, type, props) {
            switch (type) {
              case "area":
              case "base":
              case "br":
              case "col":
              case "embed":
              case "hr":
              case "img":
              case "input":
              case "keygen":
              case "link":
              case "meta":
              case "param":
              case "source":
              case "track":
              case "wbr": {
                break;
              }
              default: {
                target.push(endTag1, stringToChunk(type), endTag2);
              }
            }
          }
          function writeCompletedRoot(destination, responseState) {
            var bootstrapChunks = responseState.bootstrapChunks;
            var i = 0;
            for (; i < bootstrapChunks.length - 1; i++) {
              writeChunk(destination, bootstrapChunks[i]);
            }
            if (i < bootstrapChunks.length) {
              return writeChunkAndReturn(destination, bootstrapChunks[i]);
            }
            return true;
          }
          var placeholder1 = stringToPrecomputedChunk('<template id="');
          var placeholder2 = stringToPrecomputedChunk('"></template>');
          function writePlaceholder(destination, responseState, id) {
            writeChunk(destination, placeholder1);
            writeChunk(destination, responseState.placeholderPrefix);
            var formattedID = stringToChunk(id.toString(16));
            writeChunk(destination, formattedID);
            return writeChunkAndReturn(destination, placeholder2);
          }
          var startCompletedSuspenseBoundary = stringToPrecomputedChunk("<!--$-->");
          var startPendingSuspenseBoundary1 = stringToPrecomputedChunk('<!--$?--><template id="');
          var startPendingSuspenseBoundary2 = stringToPrecomputedChunk('"></template>');
          var startClientRenderedSuspenseBoundary = stringToPrecomputedChunk("<!--$!-->");
          var endSuspenseBoundary = stringToPrecomputedChunk("<!--/$-->");
          var clientRenderedSuspenseBoundaryError1 = stringToPrecomputedChunk("<template");
          var clientRenderedSuspenseBoundaryErrorAttrInterstitial = stringToPrecomputedChunk('"');
          var clientRenderedSuspenseBoundaryError1A = stringToPrecomputedChunk(' data-dgst="');
          var clientRenderedSuspenseBoundaryError1B = stringToPrecomputedChunk(' data-msg="');
          var clientRenderedSuspenseBoundaryError1C = stringToPrecomputedChunk(' data-stck="');
          var clientRenderedSuspenseBoundaryError2 = stringToPrecomputedChunk("></template>");
          function writeStartCompletedSuspenseBoundary(destination, responseState) {
            return writeChunkAndReturn(destination, startCompletedSuspenseBoundary);
          }
          function writeStartPendingSuspenseBoundary(destination, responseState, id) {
            writeChunk(destination, startPendingSuspenseBoundary1);
            if (id === null) {
              throw new Error("An ID must have been assigned before we can complete the boundary.");
            }
            writeChunk(destination, id);
            return writeChunkAndReturn(destination, startPendingSuspenseBoundary2);
          }
          function writeStartClientRenderedSuspenseBoundary(destination, responseState, errorDigest, errorMesssage, errorComponentStack) {
            var result;
            result = writeChunkAndReturn(destination, startClientRenderedSuspenseBoundary);
            writeChunk(destination, clientRenderedSuspenseBoundaryError1);
            if (errorDigest) {
              writeChunk(destination, clientRenderedSuspenseBoundaryError1A);
              writeChunk(destination, stringToChunk(escapeTextForBrowser(errorDigest)));
              writeChunk(destination, clientRenderedSuspenseBoundaryErrorAttrInterstitial);
            }
            {
              if (errorMesssage) {
                writeChunk(destination, clientRenderedSuspenseBoundaryError1B);
                writeChunk(destination, stringToChunk(escapeTextForBrowser(errorMesssage)));
                writeChunk(destination, clientRenderedSuspenseBoundaryErrorAttrInterstitial);
              }
              if (errorComponentStack) {
                writeChunk(destination, clientRenderedSuspenseBoundaryError1C);
                writeChunk(destination, stringToChunk(escapeTextForBrowser(errorComponentStack)));
                writeChunk(destination, clientRenderedSuspenseBoundaryErrorAttrInterstitial);
              }
            }
            result = writeChunkAndReturn(destination, clientRenderedSuspenseBoundaryError2);
            return result;
          }
          function writeEndCompletedSuspenseBoundary(destination, responseState) {
            return writeChunkAndReturn(destination, endSuspenseBoundary);
          }
          function writeEndPendingSuspenseBoundary(destination, responseState) {
            return writeChunkAndReturn(destination, endSuspenseBoundary);
          }
          function writeEndClientRenderedSuspenseBoundary(destination, responseState) {
            return writeChunkAndReturn(destination, endSuspenseBoundary);
          }
          var startSegmentHTML = stringToPrecomputedChunk('<div hidden id="');
          var startSegmentHTML2 = stringToPrecomputedChunk('">');
          var endSegmentHTML = stringToPrecomputedChunk("</div>");
          var startSegmentSVG = stringToPrecomputedChunk('<svg aria-hidden="true" style="display:none" id="');
          var startSegmentSVG2 = stringToPrecomputedChunk('">');
          var endSegmentSVG = stringToPrecomputedChunk("</svg>");
          var startSegmentMathML = stringToPrecomputedChunk('<math aria-hidden="true" style="display:none" id="');
          var startSegmentMathML2 = stringToPrecomputedChunk('">');
          var endSegmentMathML = stringToPrecomputedChunk("</math>");
          var startSegmentTable = stringToPrecomputedChunk('<table hidden id="');
          var startSegmentTable2 = stringToPrecomputedChunk('">');
          var endSegmentTable = stringToPrecomputedChunk("</table>");
          var startSegmentTableBody = stringToPrecomputedChunk('<table hidden><tbody id="');
          var startSegmentTableBody2 = stringToPrecomputedChunk('">');
          var endSegmentTableBody = stringToPrecomputedChunk("</tbody></table>");
          var startSegmentTableRow = stringToPrecomputedChunk('<table hidden><tr id="');
          var startSegmentTableRow2 = stringToPrecomputedChunk('">');
          var endSegmentTableRow = stringToPrecomputedChunk("</tr></table>");
          var startSegmentColGroup = stringToPrecomputedChunk('<table hidden><colgroup id="');
          var startSegmentColGroup2 = stringToPrecomputedChunk('">');
          var endSegmentColGroup = stringToPrecomputedChunk("</colgroup></table>");
          function writeStartSegment(destination, responseState, formatContext, id) {
            switch (formatContext.insertionMode) {
              case ROOT_HTML_MODE:
              case HTML_MODE: {
                writeChunk(destination, startSegmentHTML);
                writeChunk(destination, responseState.segmentPrefix);
                writeChunk(destination, stringToChunk(id.toString(16)));
                return writeChunkAndReturn(destination, startSegmentHTML2);
              }
              case SVG_MODE: {
                writeChunk(destination, startSegmentSVG);
                writeChunk(destination, responseState.segmentPrefix);
                writeChunk(destination, stringToChunk(id.toString(16)));
                return writeChunkAndReturn(destination, startSegmentSVG2);
              }
              case MATHML_MODE: {
                writeChunk(destination, startSegmentMathML);
                writeChunk(destination, responseState.segmentPrefix);
                writeChunk(destination, stringToChunk(id.toString(16)));
                return writeChunkAndReturn(destination, startSegmentMathML2);
              }
              case HTML_TABLE_MODE: {
                writeChunk(destination, startSegmentTable);
                writeChunk(destination, responseState.segmentPrefix);
                writeChunk(destination, stringToChunk(id.toString(16)));
                return writeChunkAndReturn(destination, startSegmentTable2);
              }
              case HTML_TABLE_BODY_MODE: {
                writeChunk(destination, startSegmentTableBody);
                writeChunk(destination, responseState.segmentPrefix);
                writeChunk(destination, stringToChunk(id.toString(16)));
                return writeChunkAndReturn(destination, startSegmentTableBody2);
              }
              case HTML_TABLE_ROW_MODE: {
                writeChunk(destination, startSegmentTableRow);
                writeChunk(destination, responseState.segmentPrefix);
                writeChunk(destination, stringToChunk(id.toString(16)));
                return writeChunkAndReturn(destination, startSegmentTableRow2);
              }
              case HTML_COLGROUP_MODE: {
                writeChunk(destination, startSegmentColGroup);
                writeChunk(destination, responseState.segmentPrefix);
                writeChunk(destination, stringToChunk(id.toString(16)));
                return writeChunkAndReturn(destination, startSegmentColGroup2);
              }
              default: {
                throw new Error("Unknown insertion mode. This is a bug in React.");
              }
            }
          }
          function writeEndSegment(destination, formatContext) {
            switch (formatContext.insertionMode) {
              case ROOT_HTML_MODE:
              case HTML_MODE: {
                return writeChunkAndReturn(destination, endSegmentHTML);
              }
              case SVG_MODE: {
                return writeChunkAndReturn(destination, endSegmentSVG);
              }
              case MATHML_MODE: {
                return writeChunkAndReturn(destination, endSegmentMathML);
              }
              case HTML_TABLE_MODE: {
                return writeChunkAndReturn(destination, endSegmentTable);
              }
              case HTML_TABLE_BODY_MODE: {
                return writeChunkAndReturn(destination, endSegmentTableBody);
              }
              case HTML_TABLE_ROW_MODE: {
                return writeChunkAndReturn(destination, endSegmentTableRow);
              }
              case HTML_COLGROUP_MODE: {
                return writeChunkAndReturn(destination, endSegmentColGroup);
              }
              default: {
                throw new Error("Unknown insertion mode. This is a bug in React.");
              }
            }
          }
          var completeSegmentFunction = "function $RS(a,b){a=document.getElementById(a);b=document.getElementById(b);for(a.parentNode.removeChild(a);a.firstChild;)b.parentNode.insertBefore(a.firstChild,b);b.parentNode.removeChild(b)}";
          var completeBoundaryFunction = 'function $RC(a,b){a=document.getElementById(a);b=document.getElementById(b);b.parentNode.removeChild(b);if(a){a=a.previousSibling;var f=a.parentNode,c=a.nextSibling,e=0;do{if(c&&8===c.nodeType){var d=c.data;if("/$"===d)if(0===e)break;else e--;else"$"!==d&&"$?"!==d&&"$!"!==d||e++}d=c.nextSibling;f.removeChild(c);c=d}while(c);for(;b.firstChild;)f.insertBefore(b.firstChild,c);a.data="$";a._reactRetry&&a._reactRetry()}}';
          var clientRenderFunction = 'function $RX(b,c,d,e){var a=document.getElementById(b);a&&(b=a.previousSibling,b.data="$!",a=a.dataset,c&&(a.dgst=c),d&&(a.msg=d),e&&(a.stck=e),b._reactRetry&&b._reactRetry())}';
          var completeSegmentScript1Full = stringToPrecomputedChunk(completeSegmentFunction + ';$RS("');
          var completeSegmentScript1Partial = stringToPrecomputedChunk('$RS("');
          var completeSegmentScript2 = stringToPrecomputedChunk('","');
          var completeSegmentScript3 = stringToPrecomputedChunk('")<\/script>');
          function writeCompletedSegmentInstruction(destination, responseState, contentSegmentID) {
            writeChunk(destination, responseState.startInlineScript);
            if (!responseState.sentCompleteSegmentFunction) {
              responseState.sentCompleteSegmentFunction = true;
              writeChunk(destination, completeSegmentScript1Full);
            } else {
              writeChunk(destination, completeSegmentScript1Partial);
            }
            writeChunk(destination, responseState.segmentPrefix);
            var formattedID = stringToChunk(contentSegmentID.toString(16));
            writeChunk(destination, formattedID);
            writeChunk(destination, completeSegmentScript2);
            writeChunk(destination, responseState.placeholderPrefix);
            writeChunk(destination, formattedID);
            return writeChunkAndReturn(destination, completeSegmentScript3);
          }
          var completeBoundaryScript1Full = stringToPrecomputedChunk(completeBoundaryFunction + ';$RC("');
          var completeBoundaryScript1Partial = stringToPrecomputedChunk('$RC("');
          var completeBoundaryScript2 = stringToPrecomputedChunk('","');
          var completeBoundaryScript3 = stringToPrecomputedChunk('")<\/script>');
          function writeCompletedBoundaryInstruction(destination, responseState, boundaryID, contentSegmentID) {
            writeChunk(destination, responseState.startInlineScript);
            if (!responseState.sentCompleteBoundaryFunction) {
              responseState.sentCompleteBoundaryFunction = true;
              writeChunk(destination, completeBoundaryScript1Full);
            } else {
              writeChunk(destination, completeBoundaryScript1Partial);
            }
            if (boundaryID === null) {
              throw new Error("An ID must have been assigned before we can complete the boundary.");
            }
            var formattedContentID = stringToChunk(contentSegmentID.toString(16));
            writeChunk(destination, boundaryID);
            writeChunk(destination, completeBoundaryScript2);
            writeChunk(destination, responseState.segmentPrefix);
            writeChunk(destination, formattedContentID);
            return writeChunkAndReturn(destination, completeBoundaryScript3);
          }
          var clientRenderScript1Full = stringToPrecomputedChunk(clientRenderFunction + ';$RX("');
          var clientRenderScript1Partial = stringToPrecomputedChunk('$RX("');
          var clientRenderScript1A = stringToPrecomputedChunk('"');
          var clientRenderScript2 = stringToPrecomputedChunk(")<\/script>");
          var clientRenderErrorScriptArgInterstitial = stringToPrecomputedChunk(",");
          function writeClientRenderBoundaryInstruction(destination, responseState, boundaryID, errorDigest, errorMessage, errorComponentStack) {
            writeChunk(destination, responseState.startInlineScript);
            if (!responseState.sentClientRenderFunction) {
              responseState.sentClientRenderFunction = true;
              writeChunk(destination, clientRenderScript1Full);
            } else {
              writeChunk(destination, clientRenderScript1Partial);
            }
            if (boundaryID === null) {
              throw new Error("An ID must have been assigned before we can complete the boundary.");
            }
            writeChunk(destination, boundaryID);
            writeChunk(destination, clientRenderScript1A);
            if (errorDigest || errorMessage || errorComponentStack) {
              writeChunk(destination, clientRenderErrorScriptArgInterstitial);
              writeChunk(destination, stringToChunk(escapeJSStringsForInstructionScripts(errorDigest || "")));
            }
            if (errorMessage || errorComponentStack) {
              writeChunk(destination, clientRenderErrorScriptArgInterstitial);
              writeChunk(destination, stringToChunk(escapeJSStringsForInstructionScripts(errorMessage || "")));
            }
            if (errorComponentStack) {
              writeChunk(destination, clientRenderErrorScriptArgInterstitial);
              writeChunk(destination, stringToChunk(escapeJSStringsForInstructionScripts(errorComponentStack)));
            }
            return writeChunkAndReturn(destination, clientRenderScript2);
          }
          var regexForJSStringsInScripts = /[<\u2028\u2029]/g;
          function escapeJSStringsForInstructionScripts(input) {
            var escaped = JSON.stringify(input);
            return escaped.replace(regexForJSStringsInScripts, function(match) {
              switch (match) {
                case "<":
                  return "\\u003c";
                case "\u2028":
                  return "\\u2028";
                case "\u2029":
                  return "\\u2029";
                default: {
                  throw new Error("escapeJSStringsForInstructionScripts encountered a match it does not know how to replace. this means the match regex and the replacement characters are no longer in sync. This is a bug in React");
                }
              }
            });
          }
          function createResponseState$1(generateStaticMarkup, identifierPrefix) {
            var responseState = createResponseState(identifierPrefix, void 0);
            return {
              // Keep this in sync with ReactDOMServerFormatConfig
              bootstrapChunks: responseState.bootstrapChunks,
              startInlineScript: responseState.startInlineScript,
              placeholderPrefix: responseState.placeholderPrefix,
              segmentPrefix: responseState.segmentPrefix,
              boundaryPrefix: responseState.boundaryPrefix,
              idPrefix: responseState.idPrefix,
              nextSuspenseID: responseState.nextSuspenseID,
              sentCompleteSegmentFunction: responseState.sentCompleteSegmentFunction,
              sentCompleteBoundaryFunction: responseState.sentCompleteBoundaryFunction,
              sentClientRenderFunction: responseState.sentClientRenderFunction,
              // This is an extra field for the legacy renderer
              generateStaticMarkup
            };
          }
          function createRootFormatContext() {
            return {
              insertionMode: HTML_MODE,
              // We skip the root mode because we don't want to emit the DOCTYPE in legacy mode.
              selectedValue: null
            };
          }
          function pushTextInstance$1(target, text, responseState, textEmbedded) {
            if (responseState.generateStaticMarkup) {
              target.push(stringToChunk(escapeTextForBrowser(text)));
              return false;
            } else {
              return pushTextInstance(target, text, responseState, textEmbedded);
            }
          }
          function pushSegmentFinale$1(target, responseState, lastPushedText, textEmbedded) {
            if (responseState.generateStaticMarkup) {
              return;
            } else {
              return pushSegmentFinale(target, responseState, lastPushedText, textEmbedded);
            }
          }
          function writeStartCompletedSuspenseBoundary$1(destination, responseState) {
            if (responseState.generateStaticMarkup) {
              return true;
            }
            return writeStartCompletedSuspenseBoundary(destination);
          }
          function writeStartClientRenderedSuspenseBoundary$1(destination, responseState, errorDigest, errorMessage, errorComponentStack) {
            if (responseState.generateStaticMarkup) {
              return true;
            }
            return writeStartClientRenderedSuspenseBoundary(destination, responseState, errorDigest, errorMessage, errorComponentStack);
          }
          function writeEndCompletedSuspenseBoundary$1(destination, responseState) {
            if (responseState.generateStaticMarkup) {
              return true;
            }
            return writeEndCompletedSuspenseBoundary(destination);
          }
          function writeEndClientRenderedSuspenseBoundary$1(destination, responseState) {
            if (responseState.generateStaticMarkup) {
              return true;
            }
            return writeEndClientRenderedSuspenseBoundary(destination);
          }
          var assign = Object.assign;
          var REACT_ELEMENT_TYPE = Symbol.for("react.element");
          var REACT_PORTAL_TYPE = Symbol.for("react.portal");
          var REACT_FRAGMENT_TYPE = Symbol.for("react.fragment");
          var REACT_STRICT_MODE_TYPE = Symbol.for("react.strict_mode");
          var REACT_PROFILER_TYPE = Symbol.for("react.profiler");
          var REACT_PROVIDER_TYPE = Symbol.for("react.provider");
          var REACT_CONTEXT_TYPE = Symbol.for("react.context");
          var REACT_FORWARD_REF_TYPE = Symbol.for("react.forward_ref");
          var REACT_SUSPENSE_TYPE = Symbol.for("react.suspense");
          var REACT_SUSPENSE_LIST_TYPE = Symbol.for("react.suspense_list");
          var REACT_MEMO_TYPE = Symbol.for("react.memo");
          var REACT_LAZY_TYPE = Symbol.for("react.lazy");
          var REACT_SCOPE_TYPE = Symbol.for("react.scope");
          var REACT_DEBUG_TRACING_MODE_TYPE = Symbol.for("react.debug_trace_mode");
          var REACT_LEGACY_HIDDEN_TYPE = Symbol.for("react.legacy_hidden");
          var REACT_SERVER_CONTEXT_DEFAULT_VALUE_NOT_LOADED = Symbol.for("react.default_value");
          var MAYBE_ITERATOR_SYMBOL = Symbol.iterator;
          var FAUX_ITERATOR_SYMBOL = "@@iterator";
          function getIteratorFn(maybeIterable) {
            if (maybeIterable === null || typeof maybeIterable !== "object") {
              return null;
            }
            var maybeIterator = MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL];
            if (typeof maybeIterator === "function") {
              return maybeIterator;
            }
            return null;
          }
          function getWrappedName(outerType, innerType, wrapperName) {
            var displayName = outerType.displayName;
            if (displayName) {
              return displayName;
            }
            var functionName = innerType.displayName || innerType.name || "";
            return functionName !== "" ? wrapperName + "(" + functionName + ")" : wrapperName;
          }
          function getContextName(type) {
            return type.displayName || "Context";
          }
          function getComponentNameFromType(type) {
            if (type == null) {
              return null;
            }
            {
              if (typeof type.tag === "number") {
                error("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue.");
              }
            }
            if (typeof type === "function") {
              return type.displayName || type.name || null;
            }
            if (typeof type === "string") {
              return type;
            }
            switch (type) {
              case REACT_FRAGMENT_TYPE:
                return "Fragment";
              case REACT_PORTAL_TYPE:
                return "Portal";
              case REACT_PROFILER_TYPE:
                return "Profiler";
              case REACT_STRICT_MODE_TYPE:
                return "StrictMode";
              case REACT_SUSPENSE_TYPE:
                return "Suspense";
              case REACT_SUSPENSE_LIST_TYPE:
                return "SuspenseList";
            }
            if (typeof type === "object") {
              switch (type.$$typeof) {
                case REACT_CONTEXT_TYPE:
                  var context = type;
                  return getContextName(context) + ".Consumer";
                case REACT_PROVIDER_TYPE:
                  var provider = type;
                  return getContextName(provider._context) + ".Provider";
                case REACT_FORWARD_REF_TYPE:
                  return getWrappedName(type, type.render, "ForwardRef");
                case REACT_MEMO_TYPE:
                  var outerName = type.displayName || null;
                  if (outerName !== null) {
                    return outerName;
                  }
                  return getComponentNameFromType(type.type) || "Memo";
                case REACT_LAZY_TYPE: {
                  var lazyComponent = type;
                  var payload = lazyComponent._payload;
                  var init = lazyComponent._init;
                  try {
                    return getComponentNameFromType(init(payload));
                  } catch (x) {
                    return null;
                  }
                }
              }
            }
            return null;
          }
          var disabledDepth = 0;
          var prevLog;
          var prevInfo;
          var prevWarn;
          var prevError;
          var prevGroup;
          var prevGroupCollapsed;
          var prevGroupEnd;
          function disabledLog() {
          }
          disabledLog.__reactDisabledLog = true;
          function disableLogs() {
            {
              if (disabledDepth === 0) {
                prevLog = console.log;
                prevInfo = console.info;
                prevWarn = console.warn;
                prevError = console.error;
                prevGroup = console.group;
                prevGroupCollapsed = console.groupCollapsed;
                prevGroupEnd = console.groupEnd;
                var props = {
                  configurable: true,
                  enumerable: true,
                  value: disabledLog,
                  writable: true
                };
                Object.defineProperties(console, {
                  info: props,
                  log: props,
                  warn: props,
                  error: props,
                  group: props,
                  groupCollapsed: props,
                  groupEnd: props
                });
              }
              disabledDepth++;
            }
          }
          function reenableLogs() {
            {
              disabledDepth--;
              if (disabledDepth === 0) {
                var props = {
                  configurable: true,
                  enumerable: true,
                  writable: true
                };
                Object.defineProperties(console, {
                  log: assign({}, props, {
                    value: prevLog
                  }),
                  info: assign({}, props, {
                    value: prevInfo
                  }),
                  warn: assign({}, props, {
                    value: prevWarn
                  }),
                  error: assign({}, props, {
                    value: prevError
                  }),
                  group: assign({}, props, {
                    value: prevGroup
                  }),
                  groupCollapsed: assign({}, props, {
                    value: prevGroupCollapsed
                  }),
                  groupEnd: assign({}, props, {
                    value: prevGroupEnd
                  })
                });
              }
              if (disabledDepth < 0) {
                error("disabledDepth fell below zero. This is a bug in React. Please file an issue.");
              }
            }
          }
          var ReactCurrentDispatcher = ReactSharedInternals.ReactCurrentDispatcher;
          var prefix;
          function describeBuiltInComponentFrame(name, source, ownerFn) {
            {
              if (prefix === void 0) {
                try {
                  throw Error();
                } catch (x) {
                  var match = x.stack.trim().match(/\n( *(at )?)/);
                  prefix = match && match[1] || "";
                }
              }
              return "\n" + prefix + name;
            }
          }
          var reentry = false;
          var componentFrameCache;
          {
            var PossiblyWeakMap = typeof WeakMap === "function" ? WeakMap : Map;
            componentFrameCache = new PossiblyWeakMap();
          }
          function describeNativeComponentFrame(fn, construct) {
            if (!fn || reentry) {
              return "";
            }
            {
              var frame = componentFrameCache.get(fn);
              if (frame !== void 0) {
                return frame;
              }
            }
            var control;
            reentry = true;
            var previousPrepareStackTrace = Error.prepareStackTrace;
            Error.prepareStackTrace = void 0;
            var previousDispatcher;
            {
              previousDispatcher = ReactCurrentDispatcher.current;
              ReactCurrentDispatcher.current = null;
              disableLogs();
            }
            try {
              if (construct) {
                var Fake = function() {
                  throw Error();
                };
                Object.defineProperty(Fake.prototype, "props", {
                  set: function() {
                    throw Error();
                  }
                });
                if (typeof Reflect === "object" && Reflect.construct) {
                  try {
                    Reflect.construct(Fake, []);
                  } catch (x) {
                    control = x;
                  }
                  Reflect.construct(fn, [], Fake);
                } else {
                  try {
                    Fake.call();
                  } catch (x) {
                    control = x;
                  }
                  fn.call(Fake.prototype);
                }
              } else {
                try {
                  throw Error();
                } catch (x) {
                  control = x;
                }
                fn();
              }
            } catch (sample) {
              if (sample && control && typeof sample.stack === "string") {
                var sampleLines = sample.stack.split("\n");
                var controlLines = control.stack.split("\n");
                var s = sampleLines.length - 1;
                var c = controlLines.length - 1;
                while (s >= 1 && c >= 0 && sampleLines[s] !== controlLines[c]) {
                  c--;
                }
                for (; s >= 1 && c >= 0; s--, c--) {
                  if (sampleLines[s] !== controlLines[c]) {
                    if (s !== 1 || c !== 1) {
                      do {
                        s--;
                        c--;
                        if (c < 0 || sampleLines[s] !== controlLines[c]) {
                          var _frame = "\n" + sampleLines[s].replace(" at new ", " at ");
                          if (fn.displayName && _frame.includes("<anonymous>")) {
                            _frame = _frame.replace("<anonymous>", fn.displayName);
                          }
                          {
                            if (typeof fn === "function") {
                              componentFrameCache.set(fn, _frame);
                            }
                          }
                          return _frame;
                        }
                      } while (s >= 1 && c >= 0);
                    }
                    break;
                  }
                }
              }
            } finally {
              reentry = false;
              {
                ReactCurrentDispatcher.current = previousDispatcher;
                reenableLogs();
              }
              Error.prepareStackTrace = previousPrepareStackTrace;
            }
            var name = fn ? fn.displayName || fn.name : "";
            var syntheticFrame = name ? describeBuiltInComponentFrame(name) : "";
            {
              if (typeof fn === "function") {
                componentFrameCache.set(fn, syntheticFrame);
              }
            }
            return syntheticFrame;
          }
          function describeClassComponentFrame(ctor, source, ownerFn) {
            {
              return describeNativeComponentFrame(ctor, true);
            }
          }
          function describeFunctionComponentFrame(fn, source, ownerFn) {
            {
              return describeNativeComponentFrame(fn, false);
            }
          }
          function shouldConstruct(Component) {
            var prototype3 = Component.prototype;
            return !!(prototype3 && prototype3.isReactComponent);
          }
          function describeUnknownElementTypeFrameInDEV(type, source, ownerFn) {
            if (type == null) {
              return "";
            }
            if (typeof type === "function") {
              {
                return describeNativeComponentFrame(type, shouldConstruct(type));
              }
            }
            if (typeof type === "string") {
              return describeBuiltInComponentFrame(type);
            }
            switch (type) {
              case REACT_SUSPENSE_TYPE:
                return describeBuiltInComponentFrame("Suspense");
              case REACT_SUSPENSE_LIST_TYPE:
                return describeBuiltInComponentFrame("SuspenseList");
            }
            if (typeof type === "object") {
              switch (type.$$typeof) {
                case REACT_FORWARD_REF_TYPE:
                  return describeFunctionComponentFrame(type.render);
                case REACT_MEMO_TYPE:
                  return describeUnknownElementTypeFrameInDEV(type.type, source, ownerFn);
                case REACT_LAZY_TYPE: {
                  var lazyComponent = type;
                  var payload = lazyComponent._payload;
                  var init = lazyComponent._init;
                  try {
                    return describeUnknownElementTypeFrameInDEV(init(payload), source, ownerFn);
                  } catch (x) {
                  }
                }
              }
            }
            return "";
          }
          var loggedTypeFailures = {};
          var ReactDebugCurrentFrame = ReactSharedInternals.ReactDebugCurrentFrame;
          function setCurrentlyValidatingElement(element) {
            {
              if (element) {
                var owner = element._owner;
                var stack = describeUnknownElementTypeFrameInDEV(element.type, element._source, owner ? owner.type : null);
                ReactDebugCurrentFrame.setExtraStackFrame(stack);
              } else {
                ReactDebugCurrentFrame.setExtraStackFrame(null);
              }
            }
          }
          function checkPropTypes(typeSpecs, values, location, componentName, element) {
            {
              var has = Function.call.bind(hasOwnProperty2);
              for (var typeSpecName in typeSpecs) {
                if (has(typeSpecs, typeSpecName)) {
                  var error$1 = void 0;
                  try {
                    if (typeof typeSpecs[typeSpecName] !== "function") {
                      var err = Error((componentName || "React class") + ": " + location + " type `" + typeSpecName + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + typeof typeSpecs[typeSpecName] + "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.");
                      err.name = "Invariant Violation";
                      throw err;
                    }
                    error$1 = typeSpecs[typeSpecName](values, typeSpecName, componentName, location, null, "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED");
                  } catch (ex) {
                    error$1 = ex;
                  }
                  if (error$1 && !(error$1 instanceof Error)) {
                    setCurrentlyValidatingElement(element);
                    error("%s: type specification of %s `%s` is invalid; the type checker function must return `null` or an `Error` but returned a %s. You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).", componentName || "React class", location, typeSpecName, typeof error$1);
                    setCurrentlyValidatingElement(null);
                  }
                  if (error$1 instanceof Error && !(error$1.message in loggedTypeFailures)) {
                    loggedTypeFailures[error$1.message] = true;
                    setCurrentlyValidatingElement(element);
                    error("Failed %s type: %s", location, error$1.message);
                    setCurrentlyValidatingElement(null);
                  }
                }
              }
            }
          }
          var warnedAboutMissingGetChildContext;
          {
            warnedAboutMissingGetChildContext = {};
          }
          var emptyContextObject = {};
          {
            Object.freeze(emptyContextObject);
          }
          function getMaskedContext(type, unmaskedContext) {
            {
              var contextTypes = type.contextTypes;
              if (!contextTypes) {
                return emptyContextObject;
              }
              var context = {};
              for (var key in contextTypes) {
                context[key] = unmaskedContext[key];
              }
              {
                var name = getComponentNameFromType(type) || "Unknown";
                checkPropTypes(contextTypes, context, "context", name);
              }
              return context;
            }
          }
          function processChildContext(instance2, type, parentContext, childContextTypes) {
            {
              if (typeof instance2.getChildContext !== "function") {
                {
                  var componentName = getComponentNameFromType(type) || "Unknown";
                  if (!warnedAboutMissingGetChildContext[componentName]) {
                    warnedAboutMissingGetChildContext[componentName] = true;
                    error("%s.childContextTypes is specified but there is no getChildContext() method on the instance. You can either define getChildContext() on %s or remove childContextTypes from it.", componentName, componentName);
                  }
                }
                return parentContext;
              }
              var childContext = instance2.getChildContext();
              for (var contextKey in childContext) {
                if (!(contextKey in childContextTypes)) {
                  throw new Error((getComponentNameFromType(type) || "Unknown") + '.getChildContext(): key "' + contextKey + '" is not defined in childContextTypes.');
                }
              }
              {
                var name = getComponentNameFromType(type) || "Unknown";
                checkPropTypes(childContextTypes, childContext, "child context", name);
              }
              return assign({}, parentContext, childContext);
            }
          }
          var rendererSigil;
          {
            rendererSigil = {};
          }
          var rootContextSnapshot = null;
          var currentActiveSnapshot = null;
          function popNode(prev) {
            {
              prev.context._currentValue2 = prev.parentValue;
            }
          }
          function pushNode(next) {
            {
              next.context._currentValue2 = next.value;
            }
          }
          function popToNearestCommonAncestor(prev, next) {
            if (prev === next)
              ;
            else {
              popNode(prev);
              var parentPrev = prev.parent;
              var parentNext = next.parent;
              if (parentPrev === null) {
                if (parentNext !== null) {
                  throw new Error("The stacks must reach the root at the same time. This is a bug in React.");
                }
              } else {
                if (parentNext === null) {
                  throw new Error("The stacks must reach the root at the same time. This is a bug in React.");
                }
                popToNearestCommonAncestor(parentPrev, parentNext);
              }
              pushNode(next);
            }
          }
          function popAllPrevious(prev) {
            popNode(prev);
            var parentPrev = prev.parent;
            if (parentPrev !== null) {
              popAllPrevious(parentPrev);
            }
          }
          function pushAllNext(next) {
            var parentNext = next.parent;
            if (parentNext !== null) {
              pushAllNext(parentNext);
            }
            pushNode(next);
          }
          function popPreviousToCommonLevel(prev, next) {
            popNode(prev);
            var parentPrev = prev.parent;
            if (parentPrev === null) {
              throw new Error("The depth must equal at least at zero before reaching the root. This is a bug in React.");
            }
            if (parentPrev.depth === next.depth) {
              popToNearestCommonAncestor(parentPrev, next);
            } else {
              popPreviousToCommonLevel(parentPrev, next);
            }
          }
          function popNextToCommonLevel(prev, next) {
            var parentNext = next.parent;
            if (parentNext === null) {
              throw new Error("The depth must equal at least at zero before reaching the root. This is a bug in React.");
            }
            if (prev.depth === parentNext.depth) {
              popToNearestCommonAncestor(prev, parentNext);
            } else {
              popNextToCommonLevel(prev, parentNext);
            }
            pushNode(next);
          }
          function switchContext(newSnapshot) {
            var prev = currentActiveSnapshot;
            var next = newSnapshot;
            if (prev !== next) {
              if (prev === null) {
                pushAllNext(next);
              } else if (next === null) {
                popAllPrevious(prev);
              } else if (prev.depth === next.depth) {
                popToNearestCommonAncestor(prev, next);
              } else if (prev.depth > next.depth) {
                popPreviousToCommonLevel(prev, next);
              } else {
                popNextToCommonLevel(prev, next);
              }
              currentActiveSnapshot = next;
            }
          }
          function pushProvider(context, nextValue) {
            var prevValue;
            {
              prevValue = context._currentValue2;
              context._currentValue2 = nextValue;
              {
                if (context._currentRenderer2 !== void 0 && context._currentRenderer2 !== null && context._currentRenderer2 !== rendererSigil) {
                  error("Detected multiple renderers concurrently rendering the same context provider. This is currently unsupported.");
                }
                context._currentRenderer2 = rendererSigil;
              }
            }
            var prevNode = currentActiveSnapshot;
            var newNode = {
              parent: prevNode,
              depth: prevNode === null ? 0 : prevNode.depth + 1,
              context,
              parentValue: prevValue,
              value: nextValue
            };
            currentActiveSnapshot = newNode;
            return newNode;
          }
          function popProvider(context) {
            var prevSnapshot = currentActiveSnapshot;
            if (prevSnapshot === null) {
              throw new Error("Tried to pop a Context at the root of the app. This is a bug in React.");
            }
            {
              if (prevSnapshot.context !== context) {
                error("The parent context is not the expected context. This is probably a bug in React.");
              }
            }
            {
              var _value = prevSnapshot.parentValue;
              if (_value === REACT_SERVER_CONTEXT_DEFAULT_VALUE_NOT_LOADED) {
                prevSnapshot.context._currentValue2 = prevSnapshot.context._defaultValue;
              } else {
                prevSnapshot.context._currentValue2 = _value;
              }
              {
                if (context._currentRenderer2 !== void 0 && context._currentRenderer2 !== null && context._currentRenderer2 !== rendererSigil) {
                  error("Detected multiple renderers concurrently rendering the same context provider. This is currently unsupported.");
                }
                context._currentRenderer2 = rendererSigil;
              }
            }
            return currentActiveSnapshot = prevSnapshot.parent;
          }
          function getActiveContext() {
            return currentActiveSnapshot;
          }
          function readContext(context) {
            var value = context._currentValue2;
            return value;
          }
          function get(key) {
            return key._reactInternals;
          }
          function set(key, value) {
            key._reactInternals = value;
          }
          var didWarnAboutNoopUpdateForComponent = {};
          var didWarnAboutDeprecatedWillMount = {};
          var didWarnAboutUninitializedState;
          var didWarnAboutGetSnapshotBeforeUpdateWithoutDidUpdate;
          var didWarnAboutLegacyLifecyclesAndDerivedState;
          var didWarnAboutUndefinedDerivedState;
          var warnOnUndefinedDerivedState;
          var warnOnInvalidCallback;
          var didWarnAboutDirectlyAssigningPropsToState;
          var didWarnAboutContextTypeAndContextTypes;
          var didWarnAboutInvalidateContextType;
          {
            didWarnAboutUninitializedState = /* @__PURE__ */ new Set();
            didWarnAboutGetSnapshotBeforeUpdateWithoutDidUpdate = /* @__PURE__ */ new Set();
            didWarnAboutLegacyLifecyclesAndDerivedState = /* @__PURE__ */ new Set();
            didWarnAboutDirectlyAssigningPropsToState = /* @__PURE__ */ new Set();
            didWarnAboutUndefinedDerivedState = /* @__PURE__ */ new Set();
            didWarnAboutContextTypeAndContextTypes = /* @__PURE__ */ new Set();
            didWarnAboutInvalidateContextType = /* @__PURE__ */ new Set();
            var didWarnOnInvalidCallback = /* @__PURE__ */ new Set();
            warnOnInvalidCallback = function(callback, callerName) {
              if (callback === null || typeof callback === "function") {
                return;
              }
              var key = callerName + "_" + callback;
              if (!didWarnOnInvalidCallback.has(key)) {
                didWarnOnInvalidCallback.add(key);
                error("%s(...): Expected the last optional `callback` argument to be a function. Instead received: %s.", callerName, callback);
              }
            };
            warnOnUndefinedDerivedState = function(type, partialState) {
              if (partialState === void 0) {
                var componentName = getComponentNameFromType(type) || "Component";
                if (!didWarnAboutUndefinedDerivedState.has(componentName)) {
                  didWarnAboutUndefinedDerivedState.add(componentName);
                  error("%s.getDerivedStateFromProps(): A valid state object (or null) must be returned. You have returned undefined.", componentName);
                }
              }
            };
          }
          function warnNoop(publicInstance, callerName) {
            {
              var _constructor = publicInstance.constructor;
              var componentName = _constructor && getComponentNameFromType(_constructor) || "ReactClass";
              var warningKey = componentName + "." + callerName;
              if (didWarnAboutNoopUpdateForComponent[warningKey]) {
                return;
              }
              error("%s(...): Can only update a mounting component. This usually means you called %s() outside componentWillMount() on the server. This is a no-op.\n\nPlease check the code for the %s component.", callerName, callerName, componentName);
              didWarnAboutNoopUpdateForComponent[warningKey] = true;
            }
          }
          var classComponentUpdater = {
            isMounted: function(inst) {
              return false;
            },
            enqueueSetState: function(inst, payload, callback) {
              var internals = get(inst);
              if (internals.queue === null) {
                warnNoop(inst, "setState");
              } else {
                internals.queue.push(payload);
                {
                  if (callback !== void 0 && callback !== null) {
                    warnOnInvalidCallback(callback, "setState");
                  }
                }
              }
            },
            enqueueReplaceState: function(inst, payload, callback) {
              var internals = get(inst);
              internals.replace = true;
              internals.queue = [payload];
              {
                if (callback !== void 0 && callback !== null) {
                  warnOnInvalidCallback(callback, "setState");
                }
              }
            },
            enqueueForceUpdate: function(inst, callback) {
              var internals = get(inst);
              if (internals.queue === null) {
                warnNoop(inst, "forceUpdate");
              } else {
                {
                  if (callback !== void 0 && callback !== null) {
                    warnOnInvalidCallback(callback, "setState");
                  }
                }
              }
            }
          };
          function applyDerivedStateFromProps(instance2, ctor, getDerivedStateFromProps, prevState, nextProps) {
            var partialState = getDerivedStateFromProps(nextProps, prevState);
            {
              warnOnUndefinedDerivedState(ctor, partialState);
            }
            var newState = partialState === null || partialState === void 0 ? prevState : assign({}, prevState, partialState);
            return newState;
          }
          function constructClassInstance(ctor, props, maskedLegacyContext) {
            var context = emptyContextObject;
            var contextType = ctor.contextType;
            {
              if ("contextType" in ctor) {
                var isValid = (
                  // Allow null for conditional declaration
                  contextType === null || contextType !== void 0 && contextType.$$typeof === REACT_CONTEXT_TYPE && contextType._context === void 0
                );
                if (!isValid && !didWarnAboutInvalidateContextType.has(ctor)) {
                  didWarnAboutInvalidateContextType.add(ctor);
                  var addendum = "";
                  if (contextType === void 0) {
                    addendum = " However, it is set to undefined. This can be caused by a typo or by mixing up named and default imports. This can also happen due to a circular dependency, so try moving the createContext() call to a separate file.";
                  } else if (typeof contextType !== "object") {
                    addendum = " However, it is set to a " + typeof contextType + ".";
                  } else if (contextType.$$typeof === REACT_PROVIDER_TYPE) {
                    addendum = " Did you accidentally pass the Context.Provider instead?";
                  } else if (contextType._context !== void 0) {
                    addendum = " Did you accidentally pass the Context.Consumer instead?";
                  } else {
                    addendum = " However, it is set to an object with keys {" + Object.keys(contextType).join(", ") + "}.";
                  }
                  error("%s defines an invalid contextType. contextType should point to the Context object returned by React.createContext().%s", getComponentNameFromType(ctor) || "Component", addendum);
                }
              }
            }
            if (typeof contextType === "object" && contextType !== null) {
              context = readContext(contextType);
            } else {
              context = maskedLegacyContext;
            }
            var instance2 = new ctor(props, context);
            {
              if (typeof ctor.getDerivedStateFromProps === "function" && (instance2.state === null || instance2.state === void 0)) {
                var componentName = getComponentNameFromType(ctor) || "Component";
                if (!didWarnAboutUninitializedState.has(componentName)) {
                  didWarnAboutUninitializedState.add(componentName);
                  error("`%s` uses `getDerivedStateFromProps` but its initial state is %s. This is not recommended. Instead, define the initial state by assigning an object to `this.state` in the constructor of `%s`. This ensures that `getDerivedStateFromProps` arguments have a consistent shape.", componentName, instance2.state === null ? "null" : "undefined", componentName);
                }
              }
              if (typeof ctor.getDerivedStateFromProps === "function" || typeof instance2.getSnapshotBeforeUpdate === "function") {
                var foundWillMountName = null;
                var foundWillReceivePropsName = null;
                var foundWillUpdateName = null;
                if (typeof instance2.componentWillMount === "function" && instance2.componentWillMount.__suppressDeprecationWarning !== true) {
                  foundWillMountName = "componentWillMount";
                } else if (typeof instance2.UNSAFE_componentWillMount === "function") {
                  foundWillMountName = "UNSAFE_componentWillMount";
                }
                if (typeof instance2.componentWillReceiveProps === "function" && instance2.componentWillReceiveProps.__suppressDeprecationWarning !== true) {
                  foundWillReceivePropsName = "componentWillReceiveProps";
                } else if (typeof instance2.UNSAFE_componentWillReceiveProps === "function") {
                  foundWillReceivePropsName = "UNSAFE_componentWillReceiveProps";
                }
                if (typeof instance2.componentWillUpdate === "function" && instance2.componentWillUpdate.__suppressDeprecationWarning !== true) {
                  foundWillUpdateName = "componentWillUpdate";
                } else if (typeof instance2.UNSAFE_componentWillUpdate === "function") {
                  foundWillUpdateName = "UNSAFE_componentWillUpdate";
                }
                if (foundWillMountName !== null || foundWillReceivePropsName !== null || foundWillUpdateName !== null) {
                  var _componentName = getComponentNameFromType(ctor) || "Component";
                  var newApiName = typeof ctor.getDerivedStateFromProps === "function" ? "getDerivedStateFromProps()" : "getSnapshotBeforeUpdate()";
                  if (!didWarnAboutLegacyLifecyclesAndDerivedState.has(_componentName)) {
                    didWarnAboutLegacyLifecyclesAndDerivedState.add(_componentName);
                    error("Unsafe legacy lifecycles will not be called for components using new component APIs.\n\n%s uses %s but also contains the following legacy lifecycles:%s%s%s\n\nThe above lifecycles should be removed. Learn more about this warning here:\nhttps://reactjs.org/link/unsafe-component-lifecycles", _componentName, newApiName, foundWillMountName !== null ? "\n  " + foundWillMountName : "", foundWillReceivePropsName !== null ? "\n  " + foundWillReceivePropsName : "", foundWillUpdateName !== null ? "\n  " + foundWillUpdateName : "");
                  }
                }
              }
            }
            return instance2;
          }
          function checkClassInstance(instance2, ctor, newProps) {
            {
              var name = getComponentNameFromType(ctor) || "Component";
              var renderPresent = instance2.render;
              if (!renderPresent) {
                if (ctor.prototype && typeof ctor.prototype.render === "function") {
                  error("%s(...): No `render` method found on the returned component instance: did you accidentally return an object from the constructor?", name);
                } else {
                  error("%s(...): No `render` method found on the returned component instance: you may have forgotten to define `render`.", name);
                }
              }
              if (instance2.getInitialState && !instance2.getInitialState.isReactClassApproved && !instance2.state) {
                error("getInitialState was defined on %s, a plain JavaScript class. This is only supported for classes created using React.createClass. Did you mean to define a state property instead?", name);
              }
              if (instance2.getDefaultProps && !instance2.getDefaultProps.isReactClassApproved) {
                error("getDefaultProps was defined on %s, a plain JavaScript class. This is only supported for classes created using React.createClass. Use a static property to define defaultProps instead.", name);
              }
              if (instance2.propTypes) {
                error("propTypes was defined as an instance property on %s. Use a static property to define propTypes instead.", name);
              }
              if (instance2.contextType) {
                error("contextType was defined as an instance property on %s. Use a static property to define contextType instead.", name);
              }
              {
                if (instance2.contextTypes) {
                  error("contextTypes was defined as an instance property on %s. Use a static property to define contextTypes instead.", name);
                }
                if (ctor.contextType && ctor.contextTypes && !didWarnAboutContextTypeAndContextTypes.has(ctor)) {
                  didWarnAboutContextTypeAndContextTypes.add(ctor);
                  error("%s declares both contextTypes and contextType static properties. The legacy contextTypes property will be ignored.", name);
                }
              }
              if (typeof instance2.componentShouldUpdate === "function") {
                error("%s has a method called componentShouldUpdate(). Did you mean shouldComponentUpdate()? The name is phrased as a question because the function is expected to return a value.", name);
              }
              if (ctor.prototype && ctor.prototype.isPureReactComponent && typeof instance2.shouldComponentUpdate !== "undefined") {
                error("%s has a method called shouldComponentUpdate(). shouldComponentUpdate should not be used when extending React.PureComponent. Please extend React.Component if shouldComponentUpdate is used.", getComponentNameFromType(ctor) || "A pure component");
              }
              if (typeof instance2.componentDidUnmount === "function") {
                error("%s has a method called componentDidUnmount(). But there is no such lifecycle method. Did you mean componentWillUnmount()?", name);
              }
              if (typeof instance2.componentDidReceiveProps === "function") {
                error("%s has a method called componentDidReceiveProps(). But there is no such lifecycle method. If you meant to update the state in response to changing props, use componentWillReceiveProps(). If you meant to fetch data or run side-effects or mutations after React has updated the UI, use componentDidUpdate().", name);
              }
              if (typeof instance2.componentWillRecieveProps === "function") {
                error("%s has a method called componentWillRecieveProps(). Did you mean componentWillReceiveProps()?", name);
              }
              if (typeof instance2.UNSAFE_componentWillRecieveProps === "function") {
                error("%s has a method called UNSAFE_componentWillRecieveProps(). Did you mean UNSAFE_componentWillReceiveProps()?", name);
              }
              var hasMutatedProps = instance2.props !== newProps;
              if (instance2.props !== void 0 && hasMutatedProps) {
                error("%s(...): When calling super() in `%s`, make sure to pass up the same props that your component's constructor was passed.", name, name);
              }
              if (instance2.defaultProps) {
                error("Setting defaultProps as an instance property on %s is not supported and will be ignored. Instead, define defaultProps as a static property on %s.", name, name);
              }
              if (typeof instance2.getSnapshotBeforeUpdate === "function" && typeof instance2.componentDidUpdate !== "function" && !didWarnAboutGetSnapshotBeforeUpdateWithoutDidUpdate.has(ctor)) {
                didWarnAboutGetSnapshotBeforeUpdateWithoutDidUpdate.add(ctor);
                error("%s: getSnapshotBeforeUpdate() should be used with componentDidUpdate(). This component defines getSnapshotBeforeUpdate() only.", getComponentNameFromType(ctor));
              }
              if (typeof instance2.getDerivedStateFromProps === "function") {
                error("%s: getDerivedStateFromProps() is defined as an instance method and will be ignored. Instead, declare it as a static method.", name);
              }
              if (typeof instance2.getDerivedStateFromError === "function") {
                error("%s: getDerivedStateFromError() is defined as an instance method and will be ignored. Instead, declare it as a static method.", name);
              }
              if (typeof ctor.getSnapshotBeforeUpdate === "function") {
                error("%s: getSnapshotBeforeUpdate() is defined as a static method and will be ignored. Instead, declare it as an instance method.", name);
              }
              var _state = instance2.state;
              if (_state && (typeof _state !== "object" || isArray2(_state))) {
                error("%s.state: must be set to an object or null", name);
              }
              if (typeof instance2.getChildContext === "function" && typeof ctor.childContextTypes !== "object") {
                error("%s.getChildContext(): childContextTypes must be defined in order to use getChildContext().", name);
              }
            }
          }
          function callComponentWillMount(type, instance2) {
            var oldState = instance2.state;
            if (typeof instance2.componentWillMount === "function") {
              {
                if (instance2.componentWillMount.__suppressDeprecationWarning !== true) {
                  var componentName = getComponentNameFromType(type) || "Unknown";
                  if (!didWarnAboutDeprecatedWillMount[componentName]) {
                    warn(
                      // keep this warning in sync with ReactStrictModeWarning.js
                      "componentWillMount has been renamed, and is not recommended for use. See https://reactjs.org/link/unsafe-component-lifecycles for details.\n\n* Move code from componentWillMount to componentDidMount (preferred in most cases) or the constructor.\n\nPlease update the following components: %s",
                      componentName
                    );
                    didWarnAboutDeprecatedWillMount[componentName] = true;
                  }
                }
              }
              instance2.componentWillMount();
            }
            if (typeof instance2.UNSAFE_componentWillMount === "function") {
              instance2.UNSAFE_componentWillMount();
            }
            if (oldState !== instance2.state) {
              {
                error("%s.componentWillMount(): Assigning directly to this.state is deprecated (except inside a component's constructor). Use setState instead.", getComponentNameFromType(type) || "Component");
              }
              classComponentUpdater.enqueueReplaceState(instance2, instance2.state, null);
            }
          }
          function processUpdateQueue(internalInstance, inst, props, maskedLegacyContext) {
            if (internalInstance.queue !== null && internalInstance.queue.length > 0) {
              var oldQueue = internalInstance.queue;
              var oldReplace = internalInstance.replace;
              internalInstance.queue = null;
              internalInstance.replace = false;
              if (oldReplace && oldQueue.length === 1) {
                inst.state = oldQueue[0];
              } else {
                var nextState = oldReplace ? oldQueue[0] : inst.state;
                var dontMutate = true;
                for (var i = oldReplace ? 1 : 0; i < oldQueue.length; i++) {
                  var partial = oldQueue[i];
                  var partialState = typeof partial === "function" ? partial.call(inst, nextState, props, maskedLegacyContext) : partial;
                  if (partialState != null) {
                    if (dontMutate) {
                      dontMutate = false;
                      nextState = assign({}, nextState, partialState);
                    } else {
                      assign(nextState, partialState);
                    }
                  }
                }
                inst.state = nextState;
              }
            } else {
              internalInstance.queue = null;
            }
          }
          function mountClassInstance(instance2, ctor, newProps, maskedLegacyContext) {
            {
              checkClassInstance(instance2, ctor, newProps);
            }
            var initialState = instance2.state !== void 0 ? instance2.state : null;
            instance2.updater = classComponentUpdater;
            instance2.props = newProps;
            instance2.state = initialState;
            var internalInstance = {
              queue: [],
              replace: false
            };
            set(instance2, internalInstance);
            var contextType = ctor.contextType;
            if (typeof contextType === "object" && contextType !== null) {
              instance2.context = readContext(contextType);
            } else {
              instance2.context = maskedLegacyContext;
            }
            {
              if (instance2.state === newProps) {
                var componentName = getComponentNameFromType(ctor) || "Component";
                if (!didWarnAboutDirectlyAssigningPropsToState.has(componentName)) {
                  didWarnAboutDirectlyAssigningPropsToState.add(componentName);
                  error("%s: It is not recommended to assign props directly to state because updates to props won't be reflected in state. In most cases, it is better to use props directly.", componentName);
                }
              }
            }
            var getDerivedStateFromProps = ctor.getDerivedStateFromProps;
            if (typeof getDerivedStateFromProps === "function") {
              instance2.state = applyDerivedStateFromProps(instance2, ctor, getDerivedStateFromProps, initialState, newProps);
            }
            if (typeof ctor.getDerivedStateFromProps !== "function" && typeof instance2.getSnapshotBeforeUpdate !== "function" && (typeof instance2.UNSAFE_componentWillMount === "function" || typeof instance2.componentWillMount === "function")) {
              callComponentWillMount(ctor, instance2);
              processUpdateQueue(internalInstance, instance2, newProps, maskedLegacyContext);
            }
          }
          var emptyTreeContext = {
            id: 1,
            overflow: ""
          };
          function getTreeId(context) {
            var overflow = context.overflow;
            var idWithLeadingBit = context.id;
            var id = idWithLeadingBit & ~getLeadingBit(idWithLeadingBit);
            return id.toString(32) + overflow;
          }
          function pushTreeContext(baseContext, totalChildren, index) {
            var baseIdWithLeadingBit = baseContext.id;
            var baseOverflow = baseContext.overflow;
            var baseLength = getBitLength(baseIdWithLeadingBit) - 1;
            var baseId = baseIdWithLeadingBit & ~(1 << baseLength);
            var slot = index + 1;
            var length = getBitLength(totalChildren) + baseLength;
            if (length > 30) {
              var numberOfOverflowBits = baseLength - baseLength % 5;
              var newOverflowBits = (1 << numberOfOverflowBits) - 1;
              var newOverflow = (baseId & newOverflowBits).toString(32);
              var restOfBaseId = baseId >> numberOfOverflowBits;
              var restOfBaseLength = baseLength - numberOfOverflowBits;
              var restOfLength = getBitLength(totalChildren) + restOfBaseLength;
              var restOfNewBits = slot << restOfBaseLength;
              var id = restOfNewBits | restOfBaseId;
              var overflow = newOverflow + baseOverflow;
              return {
                id: 1 << restOfLength | id,
                overflow
              };
            } else {
              var newBits = slot << baseLength;
              var _id = newBits | baseId;
              var _overflow = baseOverflow;
              return {
                id: 1 << length | _id,
                overflow: _overflow
              };
            }
          }
          function getBitLength(number) {
            return 32 - clz32(number);
          }
          function getLeadingBit(id) {
            return 1 << getBitLength(id) - 1;
          }
          var clz32 = Math.clz32 ? Math.clz32 : clz32Fallback;
          var log = Math.log;
          var LN2 = Math.LN2;
          function clz32Fallback(x) {
            var asUint = x >>> 0;
            if (asUint === 0) {
              return 32;
            }
            return 31 - (log(asUint) / LN2 | 0) | 0;
          }
          function is(x, y) {
            return x === y && (x !== 0 || 1 / x === 1 / y) || x !== x && y !== y;
          }
          var objectIs = typeof Object.is === "function" ? Object.is : is;
          var currentlyRenderingComponent = null;
          var currentlyRenderingTask = null;
          var firstWorkInProgressHook = null;
          var workInProgressHook = null;
          var isReRender = false;
          var didScheduleRenderPhaseUpdate = false;
          var localIdCounter = 0;
          var renderPhaseUpdates = null;
          var numberOfReRenders = 0;
          var RE_RENDER_LIMIT = 25;
          var isInHookUserCodeInDev = false;
          var currentHookNameInDev;
          function resolveCurrentlyRenderingComponent() {
            if (currentlyRenderingComponent === null) {
              throw new Error("Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:\n1. You might have mismatching versions of React and the renderer (such as React DOM)\n2. You might be breaking the Rules of Hooks\n3. You might have more than one copy of React in the same app\nSee https://reactjs.org/link/invalid-hook-call for tips about how to debug and fix this problem.");
            }
            {
              if (isInHookUserCodeInDev) {
                error("Do not call Hooks inside useEffect(...), useMemo(...), or other built-in Hooks. You can only call Hooks at the top level of your React function. For more information, see https://reactjs.org/link/rules-of-hooks");
              }
            }
            return currentlyRenderingComponent;
          }
          function areHookInputsEqual(nextDeps, prevDeps) {
            if (prevDeps === null) {
              {
                error("%s received a final argument during this render, but not during the previous render. Even though the final argument is optional, its type cannot change between renders.", currentHookNameInDev);
              }
              return false;
            }
            {
              if (nextDeps.length !== prevDeps.length) {
                error("The final argument passed to %s changed size between renders. The order and size of this array must remain constant.\n\nPrevious: %s\nIncoming: %s", currentHookNameInDev, "[" + nextDeps.join(", ") + "]", "[" + prevDeps.join(", ") + "]");
              }
            }
            for (var i = 0; i < prevDeps.length && i < nextDeps.length; i++) {
              if (objectIs(nextDeps[i], prevDeps[i])) {
                continue;
              }
              return false;
            }
            return true;
          }
          function createHook() {
            if (numberOfReRenders > 0) {
              throw new Error("Rendered more hooks than during the previous render");
            }
            return {
              memoizedState: null,
              queue: null,
              next: null
            };
          }
          function createWorkInProgressHook() {
            if (workInProgressHook === null) {
              if (firstWorkInProgressHook === null) {
                isReRender = false;
                firstWorkInProgressHook = workInProgressHook = createHook();
              } else {
                isReRender = true;
                workInProgressHook = firstWorkInProgressHook;
              }
            } else {
              if (workInProgressHook.next === null) {
                isReRender = false;
                workInProgressHook = workInProgressHook.next = createHook();
              } else {
                isReRender = true;
                workInProgressHook = workInProgressHook.next;
              }
            }
            return workInProgressHook;
          }
          function prepareToUseHooks(task, componentIdentity) {
            currentlyRenderingComponent = componentIdentity;
            currentlyRenderingTask = task;
            {
              isInHookUserCodeInDev = false;
            }
            localIdCounter = 0;
          }
          function finishHooks(Component, props, children, refOrContext) {
            while (didScheduleRenderPhaseUpdate) {
              didScheduleRenderPhaseUpdate = false;
              localIdCounter = 0;
              numberOfReRenders += 1;
              workInProgressHook = null;
              children = Component(props, refOrContext);
            }
            resetHooksState();
            return children;
          }
          function checkDidRenderIdHook() {
            var didRenderIdHook = localIdCounter !== 0;
            return didRenderIdHook;
          }
          function resetHooksState() {
            {
              isInHookUserCodeInDev = false;
            }
            currentlyRenderingComponent = null;
            currentlyRenderingTask = null;
            didScheduleRenderPhaseUpdate = false;
            firstWorkInProgressHook = null;
            numberOfReRenders = 0;
            renderPhaseUpdates = null;
            workInProgressHook = null;
          }
          function readContext$1(context) {
            {
              if (isInHookUserCodeInDev) {
                error("Context can only be read while React is rendering. In classes, you can read it in the render method or getDerivedStateFromProps. In function components, you can read it directly in the function body, but not inside Hooks like useReducer() or useMemo().");
              }
            }
            return readContext(context);
          }
          function useContext(context) {
            {
              currentHookNameInDev = "useContext";
            }
            resolveCurrentlyRenderingComponent();
            return readContext(context);
          }
          function basicStateReducer(state, action) {
            return typeof action === "function" ? action(state) : action;
          }
          function useState2(initialState) {
            {
              currentHookNameInDev = "useState";
            }
            return useReducer(
              basicStateReducer,
              // useReducer has a special case to support lazy useState initializers
              initialState
            );
          }
          function useReducer(reducer, initialArg, init) {
            {
              if (reducer !== basicStateReducer) {
                currentHookNameInDev = "useReducer";
              }
            }
            currentlyRenderingComponent = resolveCurrentlyRenderingComponent();
            workInProgressHook = createWorkInProgressHook();
            if (isReRender) {
              var queue = workInProgressHook.queue;
              var dispatch = queue.dispatch;
              if (renderPhaseUpdates !== null) {
                var firstRenderPhaseUpdate = renderPhaseUpdates.get(queue);
                if (firstRenderPhaseUpdate !== void 0) {
                  renderPhaseUpdates.delete(queue);
                  var newState = workInProgressHook.memoizedState;
                  var update = firstRenderPhaseUpdate;
                  do {
                    var action = update.action;
                    {
                      isInHookUserCodeInDev = true;
                    }
                    newState = reducer(newState, action);
                    {
                      isInHookUserCodeInDev = false;
                    }
                    update = update.next;
                  } while (update !== null);
                  workInProgressHook.memoizedState = newState;
                  return [newState, dispatch];
                }
              }
              return [workInProgressHook.memoizedState, dispatch];
            } else {
              {
                isInHookUserCodeInDev = true;
              }
              var initialState;
              if (reducer === basicStateReducer) {
                initialState = typeof initialArg === "function" ? initialArg() : initialArg;
              } else {
                initialState = init !== void 0 ? init(initialArg) : initialArg;
              }
              {
                isInHookUserCodeInDev = false;
              }
              workInProgressHook.memoizedState = initialState;
              var _queue = workInProgressHook.queue = {
                last: null,
                dispatch: null
              };
              var _dispatch = _queue.dispatch = dispatchAction.bind(null, currentlyRenderingComponent, _queue);
              return [workInProgressHook.memoizedState, _dispatch];
            }
          }
          function useMemo(nextCreate, deps) {
            currentlyRenderingComponent = resolveCurrentlyRenderingComponent();
            workInProgressHook = createWorkInProgressHook();
            var nextDeps = deps === void 0 ? null : deps;
            if (workInProgressHook !== null) {
              var prevState = workInProgressHook.memoizedState;
              if (prevState !== null) {
                if (nextDeps !== null) {
                  var prevDeps = prevState[1];
                  if (areHookInputsEqual(nextDeps, prevDeps)) {
                    return prevState[0];
                  }
                }
              }
            }
            {
              isInHookUserCodeInDev = true;
            }
            var nextValue = nextCreate();
            {
              isInHookUserCodeInDev = false;
            }
            workInProgressHook.memoizedState = [nextValue, nextDeps];
            return nextValue;
          }
          function useRef2(initialValue) {
            currentlyRenderingComponent = resolveCurrentlyRenderingComponent();
            workInProgressHook = createWorkInProgressHook();
            var previousRef = workInProgressHook.memoizedState;
            if (previousRef === null) {
              var ref = {
                current: initialValue
              };
              {
                Object.seal(ref);
              }
              workInProgressHook.memoizedState = ref;
              return ref;
            } else {
              return previousRef;
            }
          }
          function useLayoutEffect(create, inputs) {
            {
              currentHookNameInDev = "useLayoutEffect";
              error("useLayoutEffect does nothing on the server, because its effect cannot be encoded into the server renderer's output format. This will lead to a mismatch between the initial, non-hydrated UI and the intended UI. To avoid this, useLayoutEffect should only be used in components that render exclusively on the client. See https://reactjs.org/link/uselayouteffect-ssr for common fixes.");
            }
          }
          function dispatchAction(componentIdentity, queue, action) {
            if (numberOfReRenders >= RE_RENDER_LIMIT) {
              throw new Error("Too many re-renders. React limits the number of renders to prevent an infinite loop.");
            }
            if (componentIdentity === currentlyRenderingComponent) {
              didScheduleRenderPhaseUpdate = true;
              var update = {
                action,
                next: null
              };
              if (renderPhaseUpdates === null) {
                renderPhaseUpdates = /* @__PURE__ */ new Map();
              }
              var firstRenderPhaseUpdate = renderPhaseUpdates.get(queue);
              if (firstRenderPhaseUpdate === void 0) {
                renderPhaseUpdates.set(queue, update);
              } else {
                var lastRenderPhaseUpdate = firstRenderPhaseUpdate;
                while (lastRenderPhaseUpdate.next !== null) {
                  lastRenderPhaseUpdate = lastRenderPhaseUpdate.next;
                }
                lastRenderPhaseUpdate.next = update;
              }
            }
          }
          function useCallback2(callback, deps) {
            return useMemo(function() {
              return callback;
            }, deps);
          }
          function useMutableSource(source, getSnapshot, subscribe) {
            resolveCurrentlyRenderingComponent();
            return getSnapshot(source._source);
          }
          function useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot) {
            if (getServerSnapshot === void 0) {
              throw new Error("Missing getServerSnapshot, which is required for server-rendered content. Will revert to client rendering.");
            }
            return getServerSnapshot();
          }
          function useDeferredValue(value) {
            resolveCurrentlyRenderingComponent();
            return value;
          }
          function unsupportedStartTransition() {
            throw new Error("startTransition cannot be called during server rendering.");
          }
          function useTransition() {
            resolveCurrentlyRenderingComponent();
            return [false, unsupportedStartTransition];
          }
          function useId() {
            var task = currentlyRenderingTask;
            var treeId = getTreeId(task.treeContext);
            var responseState = currentResponseState;
            if (responseState === null) {
              throw new Error("Invalid hook call. Hooks can only be called inside of the body of a function component.");
            }
            var localId = localIdCounter++;
            return makeId(responseState, treeId, localId);
          }
          function noop2() {
          }
          var Dispatcher = {
            readContext: readContext$1,
            useContext,
            useMemo,
            useReducer,
            useRef: useRef2,
            useState: useState2,
            useInsertionEffect: noop2,
            useLayoutEffect,
            useCallback: useCallback2,
            // useImperativeHandle is not run in the server environment
            useImperativeHandle: noop2,
            // Effects are not run in the server environment.
            useEffect: noop2,
            // Debugging effect
            useDebugValue: noop2,
            useDeferredValue,
            useTransition,
            useId,
            // Subscriptions are not setup in a server environment.
            useMutableSource,
            useSyncExternalStore
          };
          var currentResponseState = null;
          function setCurrentResponseState(responseState) {
            currentResponseState = responseState;
          }
          function getStackByComponentStackNode(componentStack) {
            try {
              var info = "";
              var node = componentStack;
              do {
                switch (node.tag) {
                  case 0:
                    info += describeBuiltInComponentFrame(node.type, null, null);
                    break;
                  case 1:
                    info += describeFunctionComponentFrame(node.type, null, null);
                    break;
                  case 2:
                    info += describeClassComponentFrame(node.type, null, null);
                    break;
                }
                node = node.parent;
              } while (node);
              return info;
            } catch (x) {
              return "\nError generating stack: " + x.message + "\n" + x.stack;
            }
          }
          var ReactCurrentDispatcher$1 = ReactSharedInternals.ReactCurrentDispatcher;
          var ReactDebugCurrentFrame$1 = ReactSharedInternals.ReactDebugCurrentFrame;
          var PENDING = 0;
          var COMPLETED = 1;
          var FLUSHED = 2;
          var ABORTED = 3;
          var ERRORED = 4;
          var OPEN = 0;
          var CLOSING = 1;
          var CLOSED = 2;
          var DEFAULT_PROGRESSIVE_CHUNK_SIZE = 12800;
          function defaultErrorHandler(error2) {
            console["error"](error2);
            return null;
          }
          function noop$1() {
          }
          function createRequest(children, responseState, rootFormatContext, progressiveChunkSize, onError2, onAllReady, onShellReady, onShellError, onFatalError) {
            var pingedTasks = [];
            var abortSet = /* @__PURE__ */ new Set();
            var request = {
              destination: null,
              responseState,
              progressiveChunkSize: progressiveChunkSize === void 0 ? DEFAULT_PROGRESSIVE_CHUNK_SIZE : progressiveChunkSize,
              status: OPEN,
              fatalError: null,
              nextSegmentId: 0,
              allPendingTasks: 0,
              pendingRootTasks: 0,
              completedRootSegment: null,
              abortableTasks: abortSet,
              pingedTasks,
              clientRenderedBoundaries: [],
              completedBoundaries: [],
              partialBoundaries: [],
              onError: onError2 === void 0 ? defaultErrorHandler : onError2,
              onAllReady: onAllReady === void 0 ? noop$1 : onAllReady,
              onShellReady: onShellReady === void 0 ? noop$1 : onShellReady,
              onShellError: onShellError === void 0 ? noop$1 : onShellError,
              onFatalError: onFatalError === void 0 ? noop$1 : onFatalError
            };
            var rootSegment = createPendingSegment(
              request,
              0,
              null,
              rootFormatContext,
              // Root segments are never embedded in Text on either edge
              false,
              false
            );
            rootSegment.parentFlushed = true;
            var rootTask = createTask(request, children, null, rootSegment, abortSet, emptyContextObject, rootContextSnapshot, emptyTreeContext);
            pingedTasks.push(rootTask);
            return request;
          }
          function pingTask(request, task) {
            var pingedTasks = request.pingedTasks;
            pingedTasks.push(task);
            if (pingedTasks.length === 1) {
              scheduleWork(function() {
                return performWork(request);
              });
            }
          }
          function createSuspenseBoundary(request, fallbackAbortableTasks) {
            return {
              id: UNINITIALIZED_SUSPENSE_BOUNDARY_ID,
              rootSegmentID: -1,
              parentFlushed: false,
              pendingTasks: 0,
              forceClientRender: false,
              completedSegments: [],
              byteSize: 0,
              fallbackAbortableTasks,
              errorDigest: null
            };
          }
          function createTask(request, node, blockedBoundary, blockedSegment, abortSet, legacyContext, context, treeContext) {
            request.allPendingTasks++;
            if (blockedBoundary === null) {
              request.pendingRootTasks++;
            } else {
              blockedBoundary.pendingTasks++;
            }
            var task = {
              node,
              ping: function() {
                return pingTask(request, task);
              },
              blockedBoundary,
              blockedSegment,
              abortSet,
              legacyContext,
              context,
              treeContext
            };
            {
              task.componentStack = null;
            }
            abortSet.add(task);
            return task;
          }
          function createPendingSegment(request, index, boundary, formatContext, lastPushedText, textEmbedded) {
            return {
              status: PENDING,
              id: -1,
              // lazily assigned later
              index,
              parentFlushed: false,
              chunks: [],
              children: [],
              formatContext,
              boundary,
              lastPushedText,
              textEmbedded
            };
          }
          var currentTaskInDEV = null;
          function getCurrentStackInDEV() {
            {
              if (currentTaskInDEV === null || currentTaskInDEV.componentStack === null) {
                return "";
              }
              return getStackByComponentStackNode(currentTaskInDEV.componentStack);
            }
          }
          function pushBuiltInComponentStackInDEV(task, type) {
            {
              task.componentStack = {
                tag: 0,
                parent: task.componentStack,
                type
              };
            }
          }
          function pushFunctionComponentStackInDEV(task, type) {
            {
              task.componentStack = {
                tag: 1,
                parent: task.componentStack,
                type
              };
            }
          }
          function pushClassComponentStackInDEV(task, type) {
            {
              task.componentStack = {
                tag: 2,
                parent: task.componentStack,
                type
              };
            }
          }
          function popComponentStackInDEV(task) {
            {
              if (task.componentStack === null) {
                error("Unexpectedly popped too many stack frames. This is a bug in React.");
              } else {
                task.componentStack = task.componentStack.parent;
              }
            }
          }
          var lastBoundaryErrorComponentStackDev = null;
          function captureBoundaryErrorDetailsDev(boundary, error2) {
            {
              var errorMessage;
              if (typeof error2 === "string") {
                errorMessage = error2;
              } else if (error2 && typeof error2.message === "string") {
                errorMessage = error2.message;
              } else {
                errorMessage = String(error2);
              }
              var errorComponentStack = lastBoundaryErrorComponentStackDev || getCurrentStackInDEV();
              lastBoundaryErrorComponentStackDev = null;
              boundary.errorMessage = errorMessage;
              boundary.errorComponentStack = errorComponentStack;
            }
          }
          function logRecoverableError(request, error2) {
            var errorDigest = request.onError(error2);
            if (errorDigest != null && typeof errorDigest !== "string") {
              throw new Error('onError returned something with a type other than "string". onError should return a string and may return null or undefined but must not return anything else. It received something of type "' + typeof errorDigest + '" instead');
            }
            return errorDigest;
          }
          function fatalError(request, error2) {
            var onShellError = request.onShellError;
            onShellError(error2);
            var onFatalError = request.onFatalError;
            onFatalError(error2);
            if (request.destination !== null) {
              request.status = CLOSED;
              closeWithError(request.destination, error2);
            } else {
              request.status = CLOSING;
              request.fatalError = error2;
            }
          }
          function renderSuspenseBoundary(request, task, props) {
            pushBuiltInComponentStackInDEV(task, "Suspense");
            var parentBoundary = task.blockedBoundary;
            var parentSegment = task.blockedSegment;
            var fallback = props.fallback;
            var content = props.children;
            var fallbackAbortSet = /* @__PURE__ */ new Set();
            var newBoundary = createSuspenseBoundary(request, fallbackAbortSet);
            var insertionIndex = parentSegment.chunks.length;
            var boundarySegment = createPendingSegment(
              request,
              insertionIndex,
              newBoundary,
              parentSegment.formatContext,
              // boundaries never require text embedding at their edges because comment nodes bound them
              false,
              false
            );
            parentSegment.children.push(boundarySegment);
            parentSegment.lastPushedText = false;
            var contentRootSegment = createPendingSegment(
              request,
              0,
              null,
              parentSegment.formatContext,
              // boundaries never require text embedding at their edges because comment nodes bound them
              false,
              false
            );
            contentRootSegment.parentFlushed = true;
            task.blockedBoundary = newBoundary;
            task.blockedSegment = contentRootSegment;
            try {
              renderNode(request, task, content);
              pushSegmentFinale$1(contentRootSegment.chunks, request.responseState, contentRootSegment.lastPushedText, contentRootSegment.textEmbedded);
              contentRootSegment.status = COMPLETED;
              queueCompletedSegment(newBoundary, contentRootSegment);
              if (newBoundary.pendingTasks === 0) {
                popComponentStackInDEV(task);
                return;
              }
            } catch (error2) {
              contentRootSegment.status = ERRORED;
              newBoundary.forceClientRender = true;
              newBoundary.errorDigest = logRecoverableError(request, error2);
              {
                captureBoundaryErrorDetailsDev(newBoundary, error2);
              }
            } finally {
              task.blockedBoundary = parentBoundary;
              task.blockedSegment = parentSegment;
            }
            var suspendedFallbackTask = createTask(request, fallback, parentBoundary, boundarySegment, fallbackAbortSet, task.legacyContext, task.context, task.treeContext);
            {
              suspendedFallbackTask.componentStack = task.componentStack;
            }
            request.pingedTasks.push(suspendedFallbackTask);
            popComponentStackInDEV(task);
          }
          function renderHostElement(request, task, type, props) {
            pushBuiltInComponentStackInDEV(task, type);
            var segment = task.blockedSegment;
            var children = pushStartInstance(segment.chunks, type, props, request.responseState, segment.formatContext);
            segment.lastPushedText = false;
            var prevContext = segment.formatContext;
            segment.formatContext = getChildFormatContext(prevContext, type, props);
            renderNode(request, task, children);
            segment.formatContext = prevContext;
            pushEndInstance(segment.chunks, type);
            segment.lastPushedText = false;
            popComponentStackInDEV(task);
          }
          function shouldConstruct$1(Component) {
            return Component.prototype && Component.prototype.isReactComponent;
          }
          function renderWithHooks(request, task, Component, props, secondArg) {
            var componentIdentity = {};
            prepareToUseHooks(task, componentIdentity);
            var result = Component(props, secondArg);
            return finishHooks(Component, props, result, secondArg);
          }
          function finishClassComponent(request, task, instance2, Component, props) {
            var nextChildren = instance2.render();
            {
              if (instance2.props !== props) {
                if (!didWarnAboutReassigningProps) {
                  error("It looks like %s is reassigning its own `this.props` while rendering. This is not supported and can lead to confusing bugs.", getComponentNameFromType(Component) || "a component");
                }
                didWarnAboutReassigningProps = true;
              }
            }
            {
              var childContextTypes = Component.childContextTypes;
              if (childContextTypes !== null && childContextTypes !== void 0) {
                var previousContext = task.legacyContext;
                var mergedContext = processChildContext(instance2, Component, previousContext, childContextTypes);
                task.legacyContext = mergedContext;
                renderNodeDestructive(request, task, nextChildren);
                task.legacyContext = previousContext;
                return;
              }
            }
            renderNodeDestructive(request, task, nextChildren);
          }
          function renderClassComponent(request, task, Component, props) {
            pushClassComponentStackInDEV(task, Component);
            var maskedContext = getMaskedContext(Component, task.legacyContext);
            var instance2 = constructClassInstance(Component, props, maskedContext);
            mountClassInstance(instance2, Component, props, maskedContext);
            finishClassComponent(request, task, instance2, Component, props);
            popComponentStackInDEV(task);
          }
          var didWarnAboutBadClass = {};
          var didWarnAboutModulePatternComponent = {};
          var didWarnAboutContextTypeOnFunctionComponent = {};
          var didWarnAboutGetDerivedStateOnFunctionComponent = {};
          var didWarnAboutReassigningProps = false;
          var didWarnAboutDefaultPropsOnFunctionComponent = {};
          var didWarnAboutGenerators = false;
          var didWarnAboutMaps = false;
          var hasWarnedAboutUsingContextAsConsumer = false;
          function renderIndeterminateComponent(request, task, Component, props) {
            var legacyContext;
            {
              legacyContext = getMaskedContext(Component, task.legacyContext);
            }
            pushFunctionComponentStackInDEV(task, Component);
            {
              if (Component.prototype && typeof Component.prototype.render === "function") {
                var componentName = getComponentNameFromType(Component) || "Unknown";
                if (!didWarnAboutBadClass[componentName]) {
                  error("The <%s /> component appears to have a render method, but doesn't extend React.Component. This is likely to cause errors. Change %s to extend React.Component instead.", componentName, componentName);
                  didWarnAboutBadClass[componentName] = true;
                }
              }
            }
            var value = renderWithHooks(request, task, Component, props, legacyContext);
            var hasId = checkDidRenderIdHook();
            {
              if (typeof value === "object" && value !== null && typeof value.render === "function" && value.$$typeof === void 0) {
                var _componentName = getComponentNameFromType(Component) || "Unknown";
                if (!didWarnAboutModulePatternComponent[_componentName]) {
                  error("The <%s /> component appears to be a function component that returns a class instance. Change %s to a class that extends React.Component instead. If you can't use a class try assigning the prototype on the function as a workaround. `%s.prototype = React.Component.prototype`. Don't use an arrow function since it cannot be called with `new` by React.", _componentName, _componentName, _componentName);
                  didWarnAboutModulePatternComponent[_componentName] = true;
                }
              }
            }
            if (
              // Run these checks in production only if the flag is off.
              // Eventually we'll delete this branch altogether.
              typeof value === "object" && value !== null && typeof value.render === "function" && value.$$typeof === void 0
            ) {
              {
                var _componentName2 = getComponentNameFromType(Component) || "Unknown";
                if (!didWarnAboutModulePatternComponent[_componentName2]) {
                  error("The <%s /> component appears to be a function component that returns a class instance. Change %s to a class that extends React.Component instead. If you can't use a class try assigning the prototype on the function as a workaround. `%s.prototype = React.Component.prototype`. Don't use an arrow function since it cannot be called with `new` by React.", _componentName2, _componentName2, _componentName2);
                  didWarnAboutModulePatternComponent[_componentName2] = true;
                }
              }
              mountClassInstance(value, Component, props, legacyContext);
              finishClassComponent(request, task, value, Component, props);
            } else {
              {
                validateFunctionComponentInDev(Component);
              }
              if (hasId) {
                var prevTreeContext = task.treeContext;
                var totalChildren = 1;
                var index = 0;
                task.treeContext = pushTreeContext(prevTreeContext, totalChildren, index);
                try {
                  renderNodeDestructive(request, task, value);
                } finally {
                  task.treeContext = prevTreeContext;
                }
              } else {
                renderNodeDestructive(request, task, value);
              }
            }
            popComponentStackInDEV(task);
          }
          function validateFunctionComponentInDev(Component) {
            {
              if (Component) {
                if (Component.childContextTypes) {
                  error("%s(...): childContextTypes cannot be defined on a function component.", Component.displayName || Component.name || "Component");
                }
              }
              if (Component.defaultProps !== void 0) {
                var componentName = getComponentNameFromType(Component) || "Unknown";
                if (!didWarnAboutDefaultPropsOnFunctionComponent[componentName]) {
                  error("%s: Support for defaultProps will be removed from function components in a future major release. Use JavaScript default parameters instead.", componentName);
                  didWarnAboutDefaultPropsOnFunctionComponent[componentName] = true;
                }
              }
              if (typeof Component.getDerivedStateFromProps === "function") {
                var _componentName3 = getComponentNameFromType(Component) || "Unknown";
                if (!didWarnAboutGetDerivedStateOnFunctionComponent[_componentName3]) {
                  error("%s: Function components do not support getDerivedStateFromProps.", _componentName3);
                  didWarnAboutGetDerivedStateOnFunctionComponent[_componentName3] = true;
                }
              }
              if (typeof Component.contextType === "object" && Component.contextType !== null) {
                var _componentName4 = getComponentNameFromType(Component) || "Unknown";
                if (!didWarnAboutContextTypeOnFunctionComponent[_componentName4]) {
                  error("%s: Function components do not support contextType.", _componentName4);
                  didWarnAboutContextTypeOnFunctionComponent[_componentName4] = true;
                }
              }
            }
          }
          function resolveDefaultProps(Component, baseProps) {
            if (Component && Component.defaultProps) {
              var props = assign({}, baseProps);
              var defaultProps = Component.defaultProps;
              for (var propName in defaultProps) {
                if (props[propName] === void 0) {
                  props[propName] = defaultProps[propName];
                }
              }
              return props;
            }
            return baseProps;
          }
          function renderForwardRef(request, task, type, props, ref) {
            pushFunctionComponentStackInDEV(task, type.render);
            var children = renderWithHooks(request, task, type.render, props, ref);
            var hasId = checkDidRenderIdHook();
            if (hasId) {
              var prevTreeContext = task.treeContext;
              var totalChildren = 1;
              var index = 0;
              task.treeContext = pushTreeContext(prevTreeContext, totalChildren, index);
              try {
                renderNodeDestructive(request, task, children);
              } finally {
                task.treeContext = prevTreeContext;
              }
            } else {
              renderNodeDestructive(request, task, children);
            }
            popComponentStackInDEV(task);
          }
          function renderMemo(request, task, type, props, ref) {
            var innerType = type.type;
            var resolvedProps = resolveDefaultProps(innerType, props);
            renderElement(request, task, innerType, resolvedProps, ref);
          }
          function renderContextConsumer(request, task, context, props) {
            {
              if (context._context === void 0) {
                if (context !== context.Consumer) {
                  if (!hasWarnedAboutUsingContextAsConsumer) {
                    hasWarnedAboutUsingContextAsConsumer = true;
                    error("Rendering <Context> directly is not supported and will be removed in a future major release. Did you mean to render <Context.Consumer> instead?");
                  }
                }
              } else {
                context = context._context;
              }
            }
            var render = props.children;
            {
              if (typeof render !== "function") {
                error("A context consumer was rendered with multiple children, or a child that isn't a function. A context consumer expects a single child that is a function. If you did pass a function, make sure there is no trailing or leading whitespace around it.");
              }
            }
            var newValue = readContext(context);
            var newChildren = render(newValue);
            renderNodeDestructive(request, task, newChildren);
          }
          function renderContextProvider(request, task, type, props) {
            var context = type._context;
            var value = props.value;
            var children = props.children;
            var prevSnapshot;
            {
              prevSnapshot = task.context;
            }
            task.context = pushProvider(context, value);
            renderNodeDestructive(request, task, children);
            task.context = popProvider(context);
            {
              if (prevSnapshot !== task.context) {
                error("Popping the context provider did not return back to the original snapshot. This is a bug in React.");
              }
            }
          }
          function renderLazyComponent(request, task, lazyComponent, props, ref) {
            pushBuiltInComponentStackInDEV(task, "Lazy");
            var payload = lazyComponent._payload;
            var init = lazyComponent._init;
            var Component = init(payload);
            var resolvedProps = resolveDefaultProps(Component, props);
            renderElement(request, task, Component, resolvedProps, ref);
            popComponentStackInDEV(task);
          }
          function renderElement(request, task, type, props, ref) {
            if (typeof type === "function") {
              if (shouldConstruct$1(type)) {
                renderClassComponent(request, task, type, props);
                return;
              } else {
                renderIndeterminateComponent(request, task, type, props);
                return;
              }
            }
            if (typeof type === "string") {
              renderHostElement(request, task, type, props);
              return;
            }
            switch (type) {
              case REACT_LEGACY_HIDDEN_TYPE:
              case REACT_DEBUG_TRACING_MODE_TYPE:
              case REACT_STRICT_MODE_TYPE:
              case REACT_PROFILER_TYPE:
              case REACT_FRAGMENT_TYPE: {
                renderNodeDestructive(request, task, props.children);
                return;
              }
              case REACT_SUSPENSE_LIST_TYPE: {
                pushBuiltInComponentStackInDEV(task, "SuspenseList");
                renderNodeDestructive(request, task, props.children);
                popComponentStackInDEV(task);
                return;
              }
              case REACT_SCOPE_TYPE: {
                throw new Error("ReactDOMServer does not yet support scope components.");
              }
              case REACT_SUSPENSE_TYPE: {
                {
                  renderSuspenseBoundary(request, task, props);
                }
                return;
              }
            }
            if (typeof type === "object" && type !== null) {
              switch (type.$$typeof) {
                case REACT_FORWARD_REF_TYPE: {
                  renderForwardRef(request, task, type, props, ref);
                  return;
                }
                case REACT_MEMO_TYPE: {
                  renderMemo(request, task, type, props, ref);
                  return;
                }
                case REACT_PROVIDER_TYPE: {
                  renderContextProvider(request, task, type, props);
                  return;
                }
                case REACT_CONTEXT_TYPE: {
                  renderContextConsumer(request, task, type, props);
                  return;
                }
                case REACT_LAZY_TYPE: {
                  renderLazyComponent(request, task, type, props);
                  return;
                }
              }
            }
            var info = "";
            {
              if (type === void 0 || typeof type === "object" && type !== null && Object.keys(type).length === 0) {
                info += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.";
              }
            }
            throw new Error("Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) " + ("but got: " + (type == null ? type : typeof type) + "." + info));
          }
          function validateIterable(iterable, iteratorFn) {
            {
              if (typeof Symbol === "function" && // $FlowFixMe Flow doesn't know about toStringTag
              iterable[Symbol.toStringTag] === "Generator") {
                if (!didWarnAboutGenerators) {
                  error("Using Generators as children is unsupported and will likely yield unexpected results because enumerating a generator mutates it. You may convert it to an array with `Array.from()` or the `[...spread]` operator before rendering. Keep in mind you might need to polyfill these features for older browsers.");
                }
                didWarnAboutGenerators = true;
              }
              if (iterable.entries === iteratorFn) {
                if (!didWarnAboutMaps) {
                  error("Using Maps as children is not supported. Use an array of keyed ReactElements instead.");
                }
                didWarnAboutMaps = true;
              }
            }
          }
          function renderNodeDestructive(request, task, node) {
            {
              try {
                return renderNodeDestructiveImpl(request, task, node);
              } catch (x) {
                if (typeof x === "object" && x !== null && typeof x.then === "function")
                  ;
                else {
                  lastBoundaryErrorComponentStackDev = lastBoundaryErrorComponentStackDev !== null ? lastBoundaryErrorComponentStackDev : getCurrentStackInDEV();
                }
                throw x;
              }
            }
          }
          function renderNodeDestructiveImpl(request, task, node) {
            task.node = node;
            if (typeof node === "object" && node !== null) {
              switch (node.$$typeof) {
                case REACT_ELEMENT_TYPE: {
                  var element = node;
                  var type = element.type;
                  var props = element.props;
                  var ref = element.ref;
                  renderElement(request, task, type, props, ref);
                  return;
                }
                case REACT_PORTAL_TYPE:
                  throw new Error("Portals are not currently supported by the server renderer. Render them conditionally so that they only appear on the client render.");
                case REACT_LAZY_TYPE: {
                  var lazyNode = node;
                  var payload = lazyNode._payload;
                  var init = lazyNode._init;
                  var resolvedNode;
                  {
                    try {
                      resolvedNode = init(payload);
                    } catch (x) {
                      if (typeof x === "object" && x !== null && typeof x.then === "function") {
                        pushBuiltInComponentStackInDEV(task, "Lazy");
                      }
                      throw x;
                    }
                  }
                  renderNodeDestructive(request, task, resolvedNode);
                  return;
                }
              }
              if (isArray2(node)) {
                renderChildrenArray(request, task, node);
                return;
              }
              var iteratorFn = getIteratorFn(node);
              if (iteratorFn) {
                {
                  validateIterable(node, iteratorFn);
                }
                var iterator = iteratorFn.call(node);
                if (iterator) {
                  var step = iterator.next();
                  if (!step.done) {
                    var children = [];
                    do {
                      children.push(step.value);
                      step = iterator.next();
                    } while (!step.done);
                    renderChildrenArray(request, task, children);
                    return;
                  }
                  return;
                }
              }
              var childString = Object.prototype.toString.call(node);
              throw new Error("Objects are not valid as a React child (found: " + (childString === "[object Object]" ? "object with keys {" + Object.keys(node).join(", ") + "}" : childString) + "). If you meant to render a collection of children, use an array instead.");
            }
            if (typeof node === "string") {
              var segment = task.blockedSegment;
              segment.lastPushedText = pushTextInstance$1(task.blockedSegment.chunks, node, request.responseState, segment.lastPushedText);
              return;
            }
            if (typeof node === "number") {
              var _segment = task.blockedSegment;
              _segment.lastPushedText = pushTextInstance$1(task.blockedSegment.chunks, "" + node, request.responseState, _segment.lastPushedText);
              return;
            }
            {
              if (typeof node === "function") {
                error("Functions are not valid as a React child. This may happen if you return a Component instead of <Component /> from render. Or maybe you meant to call this function rather than return it.");
              }
            }
          }
          function renderChildrenArray(request, task, children) {
            var totalChildren = children.length;
            for (var i = 0; i < totalChildren; i++) {
              var prevTreeContext = task.treeContext;
              task.treeContext = pushTreeContext(prevTreeContext, totalChildren, i);
              try {
                renderNode(request, task, children[i]);
              } finally {
                task.treeContext = prevTreeContext;
              }
            }
          }
          function spawnNewSuspendedTask(request, task, x) {
            var segment = task.blockedSegment;
            var insertionIndex = segment.chunks.length;
            var newSegment = createPendingSegment(
              request,
              insertionIndex,
              null,
              segment.formatContext,
              // Adopt the parent segment's leading text embed
              segment.lastPushedText,
              // Assume we are text embedded at the trailing edge
              true
            );
            segment.children.push(newSegment);
            segment.lastPushedText = false;
            var newTask = createTask(request, task.node, task.blockedBoundary, newSegment, task.abortSet, task.legacyContext, task.context, task.treeContext);
            {
              if (task.componentStack !== null) {
                newTask.componentStack = task.componentStack.parent;
              }
            }
            var ping = newTask.ping;
            x.then(ping, ping);
          }
          function renderNode(request, task, node) {
            var previousFormatContext = task.blockedSegment.formatContext;
            var previousLegacyContext = task.legacyContext;
            var previousContext = task.context;
            var previousComponentStack = null;
            {
              previousComponentStack = task.componentStack;
            }
            try {
              return renderNodeDestructive(request, task, node);
            } catch (x) {
              resetHooksState();
              if (typeof x === "object" && x !== null && typeof x.then === "function") {
                spawnNewSuspendedTask(request, task, x);
                task.blockedSegment.formatContext = previousFormatContext;
                task.legacyContext = previousLegacyContext;
                task.context = previousContext;
                switchContext(previousContext);
                {
                  task.componentStack = previousComponentStack;
                }
                return;
              } else {
                task.blockedSegment.formatContext = previousFormatContext;
                task.legacyContext = previousLegacyContext;
                task.context = previousContext;
                switchContext(previousContext);
                {
                  task.componentStack = previousComponentStack;
                }
                throw x;
              }
            }
          }
          function erroredTask(request, boundary, segment, error2) {
            var errorDigest = logRecoverableError(request, error2);
            if (boundary === null) {
              fatalError(request, error2);
            } else {
              boundary.pendingTasks--;
              if (!boundary.forceClientRender) {
                boundary.forceClientRender = true;
                boundary.errorDigest = errorDigest;
                {
                  captureBoundaryErrorDetailsDev(boundary, error2);
                }
                if (boundary.parentFlushed) {
                  request.clientRenderedBoundaries.push(boundary);
                }
              }
            }
            request.allPendingTasks--;
            if (request.allPendingTasks === 0) {
              var onAllReady = request.onAllReady;
              onAllReady();
            }
          }
          function abortTaskSoft(task) {
            var request = this;
            var boundary = task.blockedBoundary;
            var segment = task.blockedSegment;
            segment.status = ABORTED;
            finishedTask(request, boundary, segment);
          }
          function abortTask(task, request, reason) {
            var boundary = task.blockedBoundary;
            var segment = task.blockedSegment;
            segment.status = ABORTED;
            if (boundary === null) {
              request.allPendingTasks--;
              if (request.status !== CLOSED) {
                request.status = CLOSED;
                if (request.destination !== null) {
                  close(request.destination);
                }
              }
            } else {
              boundary.pendingTasks--;
              if (!boundary.forceClientRender) {
                boundary.forceClientRender = true;
                var _error = reason === void 0 ? new Error("The render was aborted by the server without a reason.") : reason;
                boundary.errorDigest = request.onError(_error);
                {
                  var errorPrefix = "The server did not finish this Suspense boundary: ";
                  if (_error && typeof _error.message === "string") {
                    _error = errorPrefix + _error.message;
                  } else {
                    _error = errorPrefix + String(_error);
                  }
                  var previousTaskInDev = currentTaskInDEV;
                  currentTaskInDEV = task;
                  try {
                    captureBoundaryErrorDetailsDev(boundary, _error);
                  } finally {
                    currentTaskInDEV = previousTaskInDev;
                  }
                }
                if (boundary.parentFlushed) {
                  request.clientRenderedBoundaries.push(boundary);
                }
              }
              boundary.fallbackAbortableTasks.forEach(function(fallbackTask) {
                return abortTask(fallbackTask, request, reason);
              });
              boundary.fallbackAbortableTasks.clear();
              request.allPendingTasks--;
              if (request.allPendingTasks === 0) {
                var onAllReady = request.onAllReady;
                onAllReady();
              }
            }
          }
          function queueCompletedSegment(boundary, segment) {
            if (segment.chunks.length === 0 && segment.children.length === 1 && segment.children[0].boundary === null) {
              var childSegment = segment.children[0];
              childSegment.id = segment.id;
              childSegment.parentFlushed = true;
              if (childSegment.status === COMPLETED) {
                queueCompletedSegment(boundary, childSegment);
              }
            } else {
              var completedSegments = boundary.completedSegments;
              completedSegments.push(segment);
            }
          }
          function finishedTask(request, boundary, segment) {
            if (boundary === null) {
              if (segment.parentFlushed) {
                if (request.completedRootSegment !== null) {
                  throw new Error("There can only be one root segment. This is a bug in React.");
                }
                request.completedRootSegment = segment;
              }
              request.pendingRootTasks--;
              if (request.pendingRootTasks === 0) {
                request.onShellError = noop$1;
                var onShellReady = request.onShellReady;
                onShellReady();
              }
            } else {
              boundary.pendingTasks--;
              if (boundary.forceClientRender)
                ;
              else if (boundary.pendingTasks === 0) {
                if (segment.parentFlushed) {
                  if (segment.status === COMPLETED) {
                    queueCompletedSegment(boundary, segment);
                  }
                }
                if (boundary.parentFlushed) {
                  request.completedBoundaries.push(boundary);
                }
                boundary.fallbackAbortableTasks.forEach(abortTaskSoft, request);
                boundary.fallbackAbortableTasks.clear();
              } else {
                if (segment.parentFlushed) {
                  if (segment.status === COMPLETED) {
                    queueCompletedSegment(boundary, segment);
                    var completedSegments = boundary.completedSegments;
                    if (completedSegments.length === 1) {
                      if (boundary.parentFlushed) {
                        request.partialBoundaries.push(boundary);
                      }
                    }
                  }
                }
              }
            }
            request.allPendingTasks--;
            if (request.allPendingTasks === 0) {
              var onAllReady = request.onAllReady;
              onAllReady();
            }
          }
          function retryTask(request, task) {
            var segment = task.blockedSegment;
            if (segment.status !== PENDING) {
              return;
            }
            switchContext(task.context);
            var prevTaskInDEV = null;
            {
              prevTaskInDEV = currentTaskInDEV;
              currentTaskInDEV = task;
            }
            try {
              renderNodeDestructive(request, task, task.node);
              pushSegmentFinale$1(segment.chunks, request.responseState, segment.lastPushedText, segment.textEmbedded);
              task.abortSet.delete(task);
              segment.status = COMPLETED;
              finishedTask(request, task.blockedBoundary, segment);
            } catch (x) {
              resetHooksState();
              if (typeof x === "object" && x !== null && typeof x.then === "function") {
                var ping = task.ping;
                x.then(ping, ping);
              } else {
                task.abortSet.delete(task);
                segment.status = ERRORED;
                erroredTask(request, task.blockedBoundary, segment, x);
              }
            } finally {
              {
                currentTaskInDEV = prevTaskInDEV;
              }
            }
          }
          function performWork(request) {
            if (request.status === CLOSED) {
              return;
            }
            var prevContext = getActiveContext();
            var prevDispatcher = ReactCurrentDispatcher$1.current;
            ReactCurrentDispatcher$1.current = Dispatcher;
            var prevGetCurrentStackImpl;
            {
              prevGetCurrentStackImpl = ReactDebugCurrentFrame$1.getCurrentStack;
              ReactDebugCurrentFrame$1.getCurrentStack = getCurrentStackInDEV;
            }
            var prevResponseState = currentResponseState;
            setCurrentResponseState(request.responseState);
            try {
              var pingedTasks = request.pingedTasks;
              var i;
              for (i = 0; i < pingedTasks.length; i++) {
                var task = pingedTasks[i];
                retryTask(request, task);
              }
              pingedTasks.splice(0, i);
              if (request.destination !== null) {
                flushCompletedQueues(request, request.destination);
              }
            } catch (error2) {
              logRecoverableError(request, error2);
              fatalError(request, error2);
            } finally {
              setCurrentResponseState(prevResponseState);
              ReactCurrentDispatcher$1.current = prevDispatcher;
              {
                ReactDebugCurrentFrame$1.getCurrentStack = prevGetCurrentStackImpl;
              }
              if (prevDispatcher === Dispatcher) {
                switchContext(prevContext);
              }
            }
          }
          function flushSubtree(request, destination, segment) {
            segment.parentFlushed = true;
            switch (segment.status) {
              case PENDING: {
                var segmentID = segment.id = request.nextSegmentId++;
                segment.lastPushedText = false;
                segment.textEmbedded = false;
                return writePlaceholder(destination, request.responseState, segmentID);
              }
              case COMPLETED: {
                segment.status = FLUSHED;
                var r = true;
                var chunks = segment.chunks;
                var chunkIdx = 0;
                var children = segment.children;
                for (var childIdx = 0; childIdx < children.length; childIdx++) {
                  var nextChild = children[childIdx];
                  for (; chunkIdx < nextChild.index; chunkIdx++) {
                    writeChunk(destination, chunks[chunkIdx]);
                  }
                  r = flushSegment(request, destination, nextChild);
                }
                for (; chunkIdx < chunks.length - 1; chunkIdx++) {
                  writeChunk(destination, chunks[chunkIdx]);
                }
                if (chunkIdx < chunks.length) {
                  r = writeChunkAndReturn(destination, chunks[chunkIdx]);
                }
                return r;
              }
              default: {
                throw new Error("Aborted, errored or already flushed boundaries should not be flushed again. This is a bug in React.");
              }
            }
          }
          function flushSegment(request, destination, segment) {
            var boundary = segment.boundary;
            if (boundary === null) {
              return flushSubtree(request, destination, segment);
            }
            boundary.parentFlushed = true;
            if (boundary.forceClientRender) {
              writeStartClientRenderedSuspenseBoundary$1(destination, request.responseState, boundary.errorDigest, boundary.errorMessage, boundary.errorComponentStack);
              flushSubtree(request, destination, segment);
              return writeEndClientRenderedSuspenseBoundary$1(destination, request.responseState);
            } else if (boundary.pendingTasks > 0) {
              boundary.rootSegmentID = request.nextSegmentId++;
              if (boundary.completedSegments.length > 0) {
                request.partialBoundaries.push(boundary);
              }
              var id = boundary.id = assignSuspenseBoundaryID(request.responseState);
              writeStartPendingSuspenseBoundary(destination, request.responseState, id);
              flushSubtree(request, destination, segment);
              return writeEndPendingSuspenseBoundary(destination, request.responseState);
            } else if (boundary.byteSize > request.progressiveChunkSize) {
              boundary.rootSegmentID = request.nextSegmentId++;
              request.completedBoundaries.push(boundary);
              writeStartPendingSuspenseBoundary(destination, request.responseState, boundary.id);
              flushSubtree(request, destination, segment);
              return writeEndPendingSuspenseBoundary(destination, request.responseState);
            } else {
              writeStartCompletedSuspenseBoundary$1(destination, request.responseState);
              var completedSegments = boundary.completedSegments;
              if (completedSegments.length !== 1) {
                throw new Error("A previously unvisited boundary must have exactly one root segment. This is a bug in React.");
              }
              var contentSegment = completedSegments[0];
              flushSegment(request, destination, contentSegment);
              return writeEndCompletedSuspenseBoundary$1(destination, request.responseState);
            }
          }
          function flushClientRenderedBoundary(request, destination, boundary) {
            return writeClientRenderBoundaryInstruction(destination, request.responseState, boundary.id, boundary.errorDigest, boundary.errorMessage, boundary.errorComponentStack);
          }
          function flushSegmentContainer(request, destination, segment) {
            writeStartSegment(destination, request.responseState, segment.formatContext, segment.id);
            flushSegment(request, destination, segment);
            return writeEndSegment(destination, segment.formatContext);
          }
          function flushCompletedBoundary(request, destination, boundary) {
            var completedSegments = boundary.completedSegments;
            var i = 0;
            for (; i < completedSegments.length; i++) {
              var segment = completedSegments[i];
              flushPartiallyCompletedSegment(request, destination, boundary, segment);
            }
            completedSegments.length = 0;
            return writeCompletedBoundaryInstruction(destination, request.responseState, boundary.id, boundary.rootSegmentID);
          }
          function flushPartialBoundary(request, destination, boundary) {
            var completedSegments = boundary.completedSegments;
            var i = 0;
            for (; i < completedSegments.length; i++) {
              var segment = completedSegments[i];
              if (!flushPartiallyCompletedSegment(request, destination, boundary, segment)) {
                i++;
                completedSegments.splice(0, i);
                return false;
              }
            }
            completedSegments.splice(0, i);
            return true;
          }
          function flushPartiallyCompletedSegment(request, destination, boundary, segment) {
            if (segment.status === FLUSHED) {
              return true;
            }
            var segmentID = segment.id;
            if (segmentID === -1) {
              var rootSegmentID = segment.id = boundary.rootSegmentID;
              if (rootSegmentID === -1) {
                throw new Error("A root segment ID must have been assigned by now. This is a bug in React.");
              }
              return flushSegmentContainer(request, destination, segment);
            } else {
              flushSegmentContainer(request, destination, segment);
              return writeCompletedSegmentInstruction(destination, request.responseState, segmentID);
            }
          }
          function flushCompletedQueues(request, destination) {
            try {
              var completedRootSegment = request.completedRootSegment;
              if (completedRootSegment !== null && request.pendingRootTasks === 0) {
                flushSegment(request, destination, completedRootSegment);
                request.completedRootSegment = null;
                writeCompletedRoot(destination, request.responseState);
              }
              var clientRenderedBoundaries = request.clientRenderedBoundaries;
              var i;
              for (i = 0; i < clientRenderedBoundaries.length; i++) {
                var boundary = clientRenderedBoundaries[i];
                if (!flushClientRenderedBoundary(request, destination, boundary)) {
                  request.destination = null;
                  i++;
                  clientRenderedBoundaries.splice(0, i);
                  return;
                }
              }
              clientRenderedBoundaries.splice(0, i);
              var completedBoundaries = request.completedBoundaries;
              for (i = 0; i < completedBoundaries.length; i++) {
                var _boundary = completedBoundaries[i];
                if (!flushCompletedBoundary(request, destination, _boundary)) {
                  request.destination = null;
                  i++;
                  completedBoundaries.splice(0, i);
                  return;
                }
              }
              completedBoundaries.splice(0, i);
              completeWriting(destination);
              beginWriting(destination);
              var partialBoundaries = request.partialBoundaries;
              for (i = 0; i < partialBoundaries.length; i++) {
                var _boundary2 = partialBoundaries[i];
                if (!flushPartialBoundary(request, destination, _boundary2)) {
                  request.destination = null;
                  i++;
                  partialBoundaries.splice(0, i);
                  return;
                }
              }
              partialBoundaries.splice(0, i);
              var largeBoundaries = request.completedBoundaries;
              for (i = 0; i < largeBoundaries.length; i++) {
                var _boundary3 = largeBoundaries[i];
                if (!flushCompletedBoundary(request, destination, _boundary3)) {
                  request.destination = null;
                  i++;
                  largeBoundaries.splice(0, i);
                  return;
                }
              }
              largeBoundaries.splice(0, i);
            } finally {
              if (request.allPendingTasks === 0 && request.pingedTasks.length === 0 && request.clientRenderedBoundaries.length === 0 && request.completedBoundaries.length === 0) {
                {
                  if (request.abortableTasks.size !== 0) {
                    error("There was still abortable task at the root when we closed. This is a bug in React.");
                  }
                }
                close(destination);
              }
            }
          }
          function startWork(request) {
            scheduleWork(function() {
              return performWork(request);
            });
          }
          function startFlowing(request, destination) {
            if (request.status === CLOSING) {
              request.status = CLOSED;
              closeWithError(destination, request.fatalError);
              return;
            }
            if (request.status === CLOSED) {
              return;
            }
            if (request.destination !== null) {
              return;
            }
            request.destination = destination;
            try {
              flushCompletedQueues(request, destination);
            } catch (error2) {
              logRecoverableError(request, error2);
              fatalError(request, error2);
            }
          }
          function abort(request, reason) {
            try {
              var abortableTasks = request.abortableTasks;
              abortableTasks.forEach(function(task) {
                return abortTask(task, request, reason);
              });
              abortableTasks.clear();
              if (request.destination !== null) {
                flushCompletedQueues(request, request.destination);
              }
            } catch (error2) {
              logRecoverableError(request, error2);
              fatalError(request, error2);
            }
          }
          function onError() {
          }
          function renderToStringImpl(children, options, generateStaticMarkup, abortReason) {
            var didFatal = false;
            var fatalError2 = null;
            var result = "";
            var destination = {
              push: function(chunk) {
                if (chunk !== null) {
                  result += chunk;
                }
                return true;
              },
              destroy: function(error2) {
                didFatal = true;
                fatalError2 = error2;
              }
            };
            var readyToStream = false;
            function onShellReady() {
              readyToStream = true;
            }
            var request = createRequest(children, createResponseState$1(generateStaticMarkup, options ? options.identifierPrefix : void 0), createRootFormatContext(), Infinity, onError, void 0, onShellReady, void 0, void 0);
            startWork(request);
            abort(request, abortReason);
            startFlowing(request, destination);
            if (didFatal) {
              throw fatalError2;
            }
            if (!readyToStream) {
              throw new Error("A component suspended while responding to synchronous input. This will cause the UI to be replaced with a loading indicator. To fix, updates that suspend should be wrapped with startTransition.");
            }
            return result;
          }
          function renderToString(children, options) {
            return renderToStringImpl(children, options, false, 'The server used "renderToString" which does not support Suspense. If you intended for this Suspense boundary to render the fallback content on the server consider throwing an Error somewhere within the Suspense boundary. If you intended to have the server wait for the suspended component please switch to "renderToReadableStream" which supports Suspense on the server');
          }
          function renderToStaticMarkup(children, options) {
            return renderToStringImpl(children, options, true, 'The server used "renderToStaticMarkup" which does not support Suspense. If you intended to have the server wait for the suspended component please switch to "renderToReadableStream" which supports Suspense on the server');
          }
          function renderToNodeStream() {
            throw new Error("ReactDOMServer.renderToNodeStream(): The streaming API is not available in the browser. Use ReactDOMServer.renderToString() instead.");
          }
          function renderToStaticNodeStream() {
            throw new Error("ReactDOMServer.renderToStaticNodeStream(): The streaming API is not available in the browser. Use ReactDOMServer.renderToStaticMarkup() instead.");
          }
          exports.renderToNodeStream = renderToNodeStream;
          exports.renderToStaticMarkup = renderToStaticMarkup;
          exports.renderToStaticNodeStream = renderToStaticNodeStream;
          exports.renderToString = renderToString;
          exports.version = ReactVersion;
        })();
      }
    }
  });

  // node_modules/react-dom/cjs/react-dom-server.browser.development.js
  var require_react_dom_server_browser_development = __commonJS({
    "node_modules/react-dom/cjs/react-dom-server.browser.development.js"(exports) {
      "use strict";
      if (true) {
        (function() {
          "use strict";
          var React3 = require_react();
          var ReactVersion = "18.3.1";
          var ReactSharedInternals = React3.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
          function warn(format) {
            {
              {
                for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                  args[_key - 1] = arguments[_key];
                }
                printWarning("warn", format, args);
              }
            }
          }
          function error(format) {
            {
              {
                for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
                  args[_key2 - 1] = arguments[_key2];
                }
                printWarning("error", format, args);
              }
            }
          }
          function printWarning(level, format, args) {
            {
              var ReactDebugCurrentFrame2 = ReactSharedInternals.ReactDebugCurrentFrame;
              var stack = ReactDebugCurrentFrame2.getStackAddendum();
              if (stack !== "") {
                format += "%s";
                args = args.concat([stack]);
              }
              var argsWithFormat = args.map(function(item) {
                return String(item);
              });
              argsWithFormat.unshift("Warning: " + format);
              Function.prototype.apply.call(console[level], console, argsWithFormat);
            }
          }
          function scheduleWork(callback) {
            callback();
          }
          var VIEW_SIZE = 512;
          var currentView = null;
          var writtenBytes = 0;
          function beginWriting(destination) {
            currentView = new Uint8Array(VIEW_SIZE);
            writtenBytes = 0;
          }
          function writeChunk(destination, chunk) {
            if (chunk.length === 0) {
              return;
            }
            if (chunk.length > VIEW_SIZE) {
              if (writtenBytes > 0) {
                destination.enqueue(new Uint8Array(currentView.buffer, 0, writtenBytes));
                currentView = new Uint8Array(VIEW_SIZE);
                writtenBytes = 0;
              }
              destination.enqueue(chunk);
              return;
            }
            var bytesToWrite = chunk;
            var allowableBytes = currentView.length - writtenBytes;
            if (allowableBytes < bytesToWrite.length) {
              if (allowableBytes === 0) {
                destination.enqueue(currentView);
              } else {
                currentView.set(bytesToWrite.subarray(0, allowableBytes), writtenBytes);
                destination.enqueue(currentView);
                bytesToWrite = bytesToWrite.subarray(allowableBytes);
              }
              currentView = new Uint8Array(VIEW_SIZE);
              writtenBytes = 0;
            }
            currentView.set(bytesToWrite, writtenBytes);
            writtenBytes += bytesToWrite.length;
          }
          function writeChunkAndReturn(destination, chunk) {
            writeChunk(destination, chunk);
            return true;
          }
          function completeWriting(destination) {
            if (currentView && writtenBytes > 0) {
              destination.enqueue(new Uint8Array(currentView.buffer, 0, writtenBytes));
              currentView = null;
              writtenBytes = 0;
            }
          }
          function close(destination) {
            destination.close();
          }
          var textEncoder = new TextEncoder();
          function stringToChunk(content) {
            return textEncoder.encode(content);
          }
          function stringToPrecomputedChunk(content) {
            return textEncoder.encode(content);
          }
          function closeWithError(destination, error2) {
            if (typeof destination.error === "function") {
              destination.error(error2);
            } else {
              destination.close();
            }
          }
          function typeName(value) {
            {
              var hasToStringTag = typeof Symbol === "function" && Symbol.toStringTag;
              var type = hasToStringTag && value[Symbol.toStringTag] || value.constructor.name || "Object";
              return type;
            }
          }
          function willCoercionThrow(value) {
            {
              try {
                testStringCoercion(value);
                return false;
              } catch (e) {
                return true;
              }
            }
          }
          function testStringCoercion(value) {
            return "" + value;
          }
          function checkAttributeStringCoercion(value, attributeName) {
            {
              if (willCoercionThrow(value)) {
                error("The provided `%s` attribute is an unsupported type %s. This value must be coerced to a string before before using it here.", attributeName, typeName(value));
                return testStringCoercion(value);
              }
            }
          }
          function checkCSSPropertyStringCoercion(value, propName) {
            {
              if (willCoercionThrow(value)) {
                error("The provided `%s` CSS property is an unsupported type %s. This value must be coerced to a string before before using it here.", propName, typeName(value));
                return testStringCoercion(value);
              }
            }
          }
          function checkHtmlStringCoercion(value) {
            {
              if (willCoercionThrow(value)) {
                error("The provided HTML markup uses a value of unsupported type %s. This value must be coerced to a string before before using it here.", typeName(value));
                return testStringCoercion(value);
              }
            }
          }
          var hasOwnProperty2 = Object.prototype.hasOwnProperty;
          var RESERVED = 0;
          var STRING = 1;
          var BOOLEANISH_STRING = 2;
          var BOOLEAN = 3;
          var OVERLOADED_BOOLEAN = 4;
          var NUMERIC = 5;
          var POSITIVE_NUMERIC = 6;
          var ATTRIBUTE_NAME_START_CHAR = ":A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD";
          var ATTRIBUTE_NAME_CHAR = ATTRIBUTE_NAME_START_CHAR + "\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040";
          var VALID_ATTRIBUTE_NAME_REGEX = new RegExp("^[" + ATTRIBUTE_NAME_START_CHAR + "][" + ATTRIBUTE_NAME_CHAR + "]*$");
          var illegalAttributeNameCache = {};
          var validatedAttributeNameCache = {};
          function isAttributeNameSafe(attributeName) {
            if (hasOwnProperty2.call(validatedAttributeNameCache, attributeName)) {
              return true;
            }
            if (hasOwnProperty2.call(illegalAttributeNameCache, attributeName)) {
              return false;
            }
            if (VALID_ATTRIBUTE_NAME_REGEX.test(attributeName)) {
              validatedAttributeNameCache[attributeName] = true;
              return true;
            }
            illegalAttributeNameCache[attributeName] = true;
            {
              error("Invalid attribute name: `%s`", attributeName);
            }
            return false;
          }
          function shouldRemoveAttributeWithWarning(name, value, propertyInfo, isCustomComponentTag) {
            if (propertyInfo !== null && propertyInfo.type === RESERVED) {
              return false;
            }
            switch (typeof value) {
              case "function":
              case "symbol":
                return true;
              case "boolean": {
                if (isCustomComponentTag) {
                  return false;
                }
                if (propertyInfo !== null) {
                  return !propertyInfo.acceptsBooleans;
                } else {
                  var prefix2 = name.toLowerCase().slice(0, 5);
                  return prefix2 !== "data-" && prefix2 !== "aria-";
                }
              }
              default:
                return false;
            }
          }
          function getPropertyInfo(name) {
            return properties.hasOwnProperty(name) ? properties[name] : null;
          }
          function PropertyInfoRecord(name, type, mustUseProperty, attributeName, attributeNamespace, sanitizeURL2, removeEmptyString) {
            this.acceptsBooleans = type === BOOLEANISH_STRING || type === BOOLEAN || type === OVERLOADED_BOOLEAN;
            this.attributeName = attributeName;
            this.attributeNamespace = attributeNamespace;
            this.mustUseProperty = mustUseProperty;
            this.propertyName = name;
            this.type = type;
            this.sanitizeURL = sanitizeURL2;
            this.removeEmptyString = removeEmptyString;
          }
          var properties = {};
          var reservedProps = [
            "children",
            "dangerouslySetInnerHTML",
            // TODO: This prevents the assignment of defaultValue to regular
            // elements (not just inputs). Now that ReactDOMInput assigns to the
            // defaultValue property -- do we need this?
            "defaultValue",
            "defaultChecked",
            "innerHTML",
            "suppressContentEditableWarning",
            "suppressHydrationWarning",
            "style"
          ];
          reservedProps.forEach(function(name) {
            properties[name] = new PropertyInfoRecord(
              name,
              RESERVED,
              false,
              // mustUseProperty
              name,
              // attributeName
              null,
              // attributeNamespace
              false,
              // sanitizeURL
              false
            );
          });
          [["acceptCharset", "accept-charset"], ["className", "class"], ["htmlFor", "for"], ["httpEquiv", "http-equiv"]].forEach(function(_ref) {
            var name = _ref[0], attributeName = _ref[1];
            properties[name] = new PropertyInfoRecord(
              name,
              STRING,
              false,
              // mustUseProperty
              attributeName,
              // attributeName
              null,
              // attributeNamespace
              false,
              // sanitizeURL
              false
            );
          });
          ["contentEditable", "draggable", "spellCheck", "value"].forEach(function(name) {
            properties[name] = new PropertyInfoRecord(
              name,
              BOOLEANISH_STRING,
              false,
              // mustUseProperty
              name.toLowerCase(),
              // attributeName
              null,
              // attributeNamespace
              false,
              // sanitizeURL
              false
            );
          });
          ["autoReverse", "externalResourcesRequired", "focusable", "preserveAlpha"].forEach(function(name) {
            properties[name] = new PropertyInfoRecord(
              name,
              BOOLEANISH_STRING,
              false,
              // mustUseProperty
              name,
              // attributeName
              null,
              // attributeNamespace
              false,
              // sanitizeURL
              false
            );
          });
          [
            "allowFullScreen",
            "async",
            // Note: there is a special case that prevents it from being written to the DOM
            // on the client side because the browsers are inconsistent. Instead we call focus().
            "autoFocus",
            "autoPlay",
            "controls",
            "default",
            "defer",
            "disabled",
            "disablePictureInPicture",
            "disableRemotePlayback",
            "formNoValidate",
            "hidden",
            "loop",
            "noModule",
            "noValidate",
            "open",
            "playsInline",
            "readOnly",
            "required",
            "reversed",
            "scoped",
            "seamless",
            // Microdata
            "itemScope"
          ].forEach(function(name) {
            properties[name] = new PropertyInfoRecord(
              name,
              BOOLEAN,
              false,
              // mustUseProperty
              name.toLowerCase(),
              // attributeName
              null,
              // attributeNamespace
              false,
              // sanitizeURL
              false
            );
          });
          [
            "checked",
            // Note: `option.selected` is not updated if `select.multiple` is
            // disabled with `removeAttribute`. We have special logic for handling this.
            "multiple",
            "muted",
            "selected"
            // NOTE: if you add a camelCased prop to this list,
            // you'll need to set attributeName to name.toLowerCase()
            // instead in the assignment below.
          ].forEach(function(name) {
            properties[name] = new PropertyInfoRecord(
              name,
              BOOLEAN,
              true,
              // mustUseProperty
              name,
              // attributeName
              null,
              // attributeNamespace
              false,
              // sanitizeURL
              false
            );
          });
          [
            "capture",
            "download"
            // NOTE: if you add a camelCased prop to this list,
            // you'll need to set attributeName to name.toLowerCase()
            // instead in the assignment below.
          ].forEach(function(name) {
            properties[name] = new PropertyInfoRecord(
              name,
              OVERLOADED_BOOLEAN,
              false,
              // mustUseProperty
              name,
              // attributeName
              null,
              // attributeNamespace
              false,
              // sanitizeURL
              false
            );
          });
          [
            "cols",
            "rows",
            "size",
            "span"
            // NOTE: if you add a camelCased prop to this list,
            // you'll need to set attributeName to name.toLowerCase()
            // instead in the assignment below.
          ].forEach(function(name) {
            properties[name] = new PropertyInfoRecord(
              name,
              POSITIVE_NUMERIC,
              false,
              // mustUseProperty
              name,
              // attributeName
              null,
              // attributeNamespace
              false,
              // sanitizeURL
              false
            );
          });
          ["rowSpan", "start"].forEach(function(name) {
            properties[name] = new PropertyInfoRecord(
              name,
              NUMERIC,
              false,
              // mustUseProperty
              name.toLowerCase(),
              // attributeName
              null,
              // attributeNamespace
              false,
              // sanitizeURL
              false
            );
          });
          var CAMELIZE = /[\-\:]([a-z])/g;
          var capitalize = function(token) {
            return token[1].toUpperCase();
          };
          [
            "accent-height",
            "alignment-baseline",
            "arabic-form",
            "baseline-shift",
            "cap-height",
            "clip-path",
            "clip-rule",
            "color-interpolation",
            "color-interpolation-filters",
            "color-profile",
            "color-rendering",
            "dominant-baseline",
            "enable-background",
            "fill-opacity",
            "fill-rule",
            "flood-color",
            "flood-opacity",
            "font-family",
            "font-size",
            "font-size-adjust",
            "font-stretch",
            "font-style",
            "font-variant",
            "font-weight",
            "glyph-name",
            "glyph-orientation-horizontal",
            "glyph-orientation-vertical",
            "horiz-adv-x",
            "horiz-origin-x",
            "image-rendering",
            "letter-spacing",
            "lighting-color",
            "marker-end",
            "marker-mid",
            "marker-start",
            "overline-position",
            "overline-thickness",
            "paint-order",
            "panose-1",
            "pointer-events",
            "rendering-intent",
            "shape-rendering",
            "stop-color",
            "stop-opacity",
            "strikethrough-position",
            "strikethrough-thickness",
            "stroke-dasharray",
            "stroke-dashoffset",
            "stroke-linecap",
            "stroke-linejoin",
            "stroke-miterlimit",
            "stroke-opacity",
            "stroke-width",
            "text-anchor",
            "text-decoration",
            "text-rendering",
            "underline-position",
            "underline-thickness",
            "unicode-bidi",
            "unicode-range",
            "units-per-em",
            "v-alphabetic",
            "v-hanging",
            "v-ideographic",
            "v-mathematical",
            "vector-effect",
            "vert-adv-y",
            "vert-origin-x",
            "vert-origin-y",
            "word-spacing",
            "writing-mode",
            "xmlns:xlink",
            "x-height"
            // NOTE: if you add a camelCased prop to this list,
            // you'll need to set attributeName to name.toLowerCase()
            // instead in the assignment below.
          ].forEach(function(attributeName) {
            var name = attributeName.replace(CAMELIZE, capitalize);
            properties[name] = new PropertyInfoRecord(
              name,
              STRING,
              false,
              // mustUseProperty
              attributeName,
              null,
              // attributeNamespace
              false,
              // sanitizeURL
              false
            );
          });
          [
            "xlink:actuate",
            "xlink:arcrole",
            "xlink:role",
            "xlink:show",
            "xlink:title",
            "xlink:type"
            // NOTE: if you add a camelCased prop to this list,
            // you'll need to set attributeName to name.toLowerCase()
            // instead in the assignment below.
          ].forEach(function(attributeName) {
            var name = attributeName.replace(CAMELIZE, capitalize);
            properties[name] = new PropertyInfoRecord(
              name,
              STRING,
              false,
              // mustUseProperty
              attributeName,
              "http://www.w3.org/1999/xlink",
              false,
              // sanitizeURL
              false
            );
          });
          [
            "xml:base",
            "xml:lang",
            "xml:space"
            // NOTE: if you add a camelCased prop to this list,
            // you'll need to set attributeName to name.toLowerCase()
            // instead in the assignment below.
          ].forEach(function(attributeName) {
            var name = attributeName.replace(CAMELIZE, capitalize);
            properties[name] = new PropertyInfoRecord(
              name,
              STRING,
              false,
              // mustUseProperty
              attributeName,
              "http://www.w3.org/XML/1998/namespace",
              false,
              // sanitizeURL
              false
            );
          });
          ["tabIndex", "crossOrigin"].forEach(function(attributeName) {
            properties[attributeName] = new PropertyInfoRecord(
              attributeName,
              STRING,
              false,
              // mustUseProperty
              attributeName.toLowerCase(),
              // attributeName
              null,
              // attributeNamespace
              false,
              // sanitizeURL
              false
            );
          });
          var xlinkHref = "xlinkHref";
          properties[xlinkHref] = new PropertyInfoRecord(
            "xlinkHref",
            STRING,
            false,
            // mustUseProperty
            "xlink:href",
            "http://www.w3.org/1999/xlink",
            true,
            // sanitizeURL
            false
          );
          ["src", "href", "action", "formAction"].forEach(function(attributeName) {
            properties[attributeName] = new PropertyInfoRecord(
              attributeName,
              STRING,
              false,
              // mustUseProperty
              attributeName.toLowerCase(),
              // attributeName
              null,
              // attributeNamespace
              true,
              // sanitizeURL
              true
            );
          });
          var isUnitlessNumber = {
            animationIterationCount: true,
            aspectRatio: true,
            borderImageOutset: true,
            borderImageSlice: true,
            borderImageWidth: true,
            boxFlex: true,
            boxFlexGroup: true,
            boxOrdinalGroup: true,
            columnCount: true,
            columns: true,
            flex: true,
            flexGrow: true,
            flexPositive: true,
            flexShrink: true,
            flexNegative: true,
            flexOrder: true,
            gridArea: true,
            gridRow: true,
            gridRowEnd: true,
            gridRowSpan: true,
            gridRowStart: true,
            gridColumn: true,
            gridColumnEnd: true,
            gridColumnSpan: true,
            gridColumnStart: true,
            fontWeight: true,
            lineClamp: true,
            lineHeight: true,
            opacity: true,
            order: true,
            orphans: true,
            tabSize: true,
            widows: true,
            zIndex: true,
            zoom: true,
            // SVG-related properties
            fillOpacity: true,
            floodOpacity: true,
            stopOpacity: true,
            strokeDasharray: true,
            strokeDashoffset: true,
            strokeMiterlimit: true,
            strokeOpacity: true,
            strokeWidth: true
          };
          function prefixKey(prefix2, key) {
            return prefix2 + key.charAt(0).toUpperCase() + key.substring(1);
          }
          var prefixes = ["Webkit", "ms", "Moz", "O"];
          Object.keys(isUnitlessNumber).forEach(function(prop) {
            prefixes.forEach(function(prefix2) {
              isUnitlessNumber[prefixKey(prefix2, prop)] = isUnitlessNumber[prop];
            });
          });
          var hasReadOnlyValue = {
            button: true,
            checkbox: true,
            image: true,
            hidden: true,
            radio: true,
            reset: true,
            submit: true
          };
          function checkControlledValueProps(tagName, props) {
            {
              if (!(hasReadOnlyValue[props.type] || props.onChange || props.onInput || props.readOnly || props.disabled || props.value == null)) {
                error("You provided a `value` prop to a form field without an `onChange` handler. This will render a read-only field. If the field should be mutable use `defaultValue`. Otherwise, set either `onChange` or `readOnly`.");
              }
              if (!(props.onChange || props.readOnly || props.disabled || props.checked == null)) {
                error("You provided a `checked` prop to a form field without an `onChange` handler. This will render a read-only field. If the field should be mutable use `defaultChecked`. Otherwise, set either `onChange` or `readOnly`.");
              }
            }
          }
          function isCustomComponent(tagName, props) {
            if (tagName.indexOf("-") === -1) {
              return typeof props.is === "string";
            }
            switch (tagName) {
              case "annotation-xml":
              case "color-profile":
              case "font-face":
              case "font-face-src":
              case "font-face-uri":
              case "font-face-format":
              case "font-face-name":
              case "missing-glyph":
                return false;
              default:
                return true;
            }
          }
          var ariaProperties = {
            "aria-current": 0,
            // state
            "aria-description": 0,
            "aria-details": 0,
            "aria-disabled": 0,
            // state
            "aria-hidden": 0,
            // state
            "aria-invalid": 0,
            // state
            "aria-keyshortcuts": 0,
            "aria-label": 0,
            "aria-roledescription": 0,
            // Widget Attributes
            "aria-autocomplete": 0,
            "aria-checked": 0,
            "aria-expanded": 0,
            "aria-haspopup": 0,
            "aria-level": 0,
            "aria-modal": 0,
            "aria-multiline": 0,
            "aria-multiselectable": 0,
            "aria-orientation": 0,
            "aria-placeholder": 0,
            "aria-pressed": 0,
            "aria-readonly": 0,
            "aria-required": 0,
            "aria-selected": 0,
            "aria-sort": 0,
            "aria-valuemax": 0,
            "aria-valuemin": 0,
            "aria-valuenow": 0,
            "aria-valuetext": 0,
            // Live Region Attributes
            "aria-atomic": 0,
            "aria-busy": 0,
            "aria-live": 0,
            "aria-relevant": 0,
            // Drag-and-Drop Attributes
            "aria-dropeffect": 0,
            "aria-grabbed": 0,
            // Relationship Attributes
            "aria-activedescendant": 0,
            "aria-colcount": 0,
            "aria-colindex": 0,
            "aria-colspan": 0,
            "aria-controls": 0,
            "aria-describedby": 0,
            "aria-errormessage": 0,
            "aria-flowto": 0,
            "aria-labelledby": 0,
            "aria-owns": 0,
            "aria-posinset": 0,
            "aria-rowcount": 0,
            "aria-rowindex": 0,
            "aria-rowspan": 0,
            "aria-setsize": 0
          };
          var warnedProperties = {};
          var rARIA = new RegExp("^(aria)-[" + ATTRIBUTE_NAME_CHAR + "]*$");
          var rARIACamel = new RegExp("^(aria)[A-Z][" + ATTRIBUTE_NAME_CHAR + "]*$");
          function validateProperty(tagName, name) {
            {
              if (hasOwnProperty2.call(warnedProperties, name) && warnedProperties[name]) {
                return true;
              }
              if (rARIACamel.test(name)) {
                var ariaName = "aria-" + name.slice(4).toLowerCase();
                var correctName = ariaProperties.hasOwnProperty(ariaName) ? ariaName : null;
                if (correctName == null) {
                  error("Invalid ARIA attribute `%s`. ARIA attributes follow the pattern aria-* and must be lowercase.", name);
                  warnedProperties[name] = true;
                  return true;
                }
                if (name !== correctName) {
                  error("Invalid ARIA attribute `%s`. Did you mean `%s`?", name, correctName);
                  warnedProperties[name] = true;
                  return true;
                }
              }
              if (rARIA.test(name)) {
                var lowerCasedName = name.toLowerCase();
                var standardName = ariaProperties.hasOwnProperty(lowerCasedName) ? lowerCasedName : null;
                if (standardName == null) {
                  warnedProperties[name] = true;
                  return false;
                }
                if (name !== standardName) {
                  error("Unknown ARIA attribute `%s`. Did you mean `%s`?", name, standardName);
                  warnedProperties[name] = true;
                  return true;
                }
              }
            }
            return true;
          }
          function warnInvalidARIAProps(type, props) {
            {
              var invalidProps = [];
              for (var key in props) {
                var isValid = validateProperty(type, key);
                if (!isValid) {
                  invalidProps.push(key);
                }
              }
              var unknownPropString = invalidProps.map(function(prop) {
                return "`" + prop + "`";
              }).join(", ");
              if (invalidProps.length === 1) {
                error("Invalid aria prop %s on <%s> tag. For details, see https://reactjs.org/link/invalid-aria-props", unknownPropString, type);
              } else if (invalidProps.length > 1) {
                error("Invalid aria props %s on <%s> tag. For details, see https://reactjs.org/link/invalid-aria-props", unknownPropString, type);
              }
            }
          }
          function validateProperties(type, props) {
            if (isCustomComponent(type, props)) {
              return;
            }
            warnInvalidARIAProps(type, props);
          }
          var didWarnValueNull = false;
          function validateProperties$1(type, props) {
            {
              if (type !== "input" && type !== "textarea" && type !== "select") {
                return;
              }
              if (props != null && props.value === null && !didWarnValueNull) {
                didWarnValueNull = true;
                if (type === "select" && props.multiple) {
                  error("`value` prop on `%s` should not be null. Consider using an empty array when `multiple` is set to `true` to clear the component or `undefined` for uncontrolled components.", type);
                } else {
                  error("`value` prop on `%s` should not be null. Consider using an empty string to clear the component or `undefined` for uncontrolled components.", type);
                }
              }
            }
          }
          var possibleStandardNames = {
            // HTML
            accept: "accept",
            acceptcharset: "acceptCharset",
            "accept-charset": "acceptCharset",
            accesskey: "accessKey",
            action: "action",
            allowfullscreen: "allowFullScreen",
            alt: "alt",
            as: "as",
            async: "async",
            autocapitalize: "autoCapitalize",
            autocomplete: "autoComplete",
            autocorrect: "autoCorrect",
            autofocus: "autoFocus",
            autoplay: "autoPlay",
            autosave: "autoSave",
            capture: "capture",
            cellpadding: "cellPadding",
            cellspacing: "cellSpacing",
            challenge: "challenge",
            charset: "charSet",
            checked: "checked",
            children: "children",
            cite: "cite",
            class: "className",
            classid: "classID",
            classname: "className",
            cols: "cols",
            colspan: "colSpan",
            content: "content",
            contenteditable: "contentEditable",
            contextmenu: "contextMenu",
            controls: "controls",
            controlslist: "controlsList",
            coords: "coords",
            crossorigin: "crossOrigin",
            dangerouslysetinnerhtml: "dangerouslySetInnerHTML",
            data: "data",
            datetime: "dateTime",
            default: "default",
            defaultchecked: "defaultChecked",
            defaultvalue: "defaultValue",
            defer: "defer",
            dir: "dir",
            disabled: "disabled",
            disablepictureinpicture: "disablePictureInPicture",
            disableremoteplayback: "disableRemotePlayback",
            download: "download",
            draggable: "draggable",
            enctype: "encType",
            enterkeyhint: "enterKeyHint",
            for: "htmlFor",
            form: "form",
            formmethod: "formMethod",
            formaction: "formAction",
            formenctype: "formEncType",
            formnovalidate: "formNoValidate",
            formtarget: "formTarget",
            frameborder: "frameBorder",
            headers: "headers",
            height: "height",
            hidden: "hidden",
            high: "high",
            href: "href",
            hreflang: "hrefLang",
            htmlfor: "htmlFor",
            httpequiv: "httpEquiv",
            "http-equiv": "httpEquiv",
            icon: "icon",
            id: "id",
            imagesizes: "imageSizes",
            imagesrcset: "imageSrcSet",
            innerhtml: "innerHTML",
            inputmode: "inputMode",
            integrity: "integrity",
            is: "is",
            itemid: "itemID",
            itemprop: "itemProp",
            itemref: "itemRef",
            itemscope: "itemScope",
            itemtype: "itemType",
            keyparams: "keyParams",
            keytype: "keyType",
            kind: "kind",
            label: "label",
            lang: "lang",
            list: "list",
            loop: "loop",
            low: "low",
            manifest: "manifest",
            marginwidth: "marginWidth",
            marginheight: "marginHeight",
            max: "max",
            maxlength: "maxLength",
            media: "media",
            mediagroup: "mediaGroup",
            method: "method",
            min: "min",
            minlength: "minLength",
            multiple: "multiple",
            muted: "muted",
            name: "name",
            nomodule: "noModule",
            nonce: "nonce",
            novalidate: "noValidate",
            open: "open",
            optimum: "optimum",
            pattern: "pattern",
            placeholder: "placeholder",
            playsinline: "playsInline",
            poster: "poster",
            preload: "preload",
            profile: "profile",
            radiogroup: "radioGroup",
            readonly: "readOnly",
            referrerpolicy: "referrerPolicy",
            rel: "rel",
            required: "required",
            reversed: "reversed",
            role: "role",
            rows: "rows",
            rowspan: "rowSpan",
            sandbox: "sandbox",
            scope: "scope",
            scoped: "scoped",
            scrolling: "scrolling",
            seamless: "seamless",
            selected: "selected",
            shape: "shape",
            size: "size",
            sizes: "sizes",
            span: "span",
            spellcheck: "spellCheck",
            src: "src",
            srcdoc: "srcDoc",
            srclang: "srcLang",
            srcset: "srcSet",
            start: "start",
            step: "step",
            style: "style",
            summary: "summary",
            tabindex: "tabIndex",
            target: "target",
            title: "title",
            type: "type",
            usemap: "useMap",
            value: "value",
            width: "width",
            wmode: "wmode",
            wrap: "wrap",
            // SVG
            about: "about",
            accentheight: "accentHeight",
            "accent-height": "accentHeight",
            accumulate: "accumulate",
            additive: "additive",
            alignmentbaseline: "alignmentBaseline",
            "alignment-baseline": "alignmentBaseline",
            allowreorder: "allowReorder",
            alphabetic: "alphabetic",
            amplitude: "amplitude",
            arabicform: "arabicForm",
            "arabic-form": "arabicForm",
            ascent: "ascent",
            attributename: "attributeName",
            attributetype: "attributeType",
            autoreverse: "autoReverse",
            azimuth: "azimuth",
            basefrequency: "baseFrequency",
            baselineshift: "baselineShift",
            "baseline-shift": "baselineShift",
            baseprofile: "baseProfile",
            bbox: "bbox",
            begin: "begin",
            bias: "bias",
            by: "by",
            calcmode: "calcMode",
            capheight: "capHeight",
            "cap-height": "capHeight",
            clip: "clip",
            clippath: "clipPath",
            "clip-path": "clipPath",
            clippathunits: "clipPathUnits",
            cliprule: "clipRule",
            "clip-rule": "clipRule",
            color: "color",
            colorinterpolation: "colorInterpolation",
            "color-interpolation": "colorInterpolation",
            colorinterpolationfilters: "colorInterpolationFilters",
            "color-interpolation-filters": "colorInterpolationFilters",
            colorprofile: "colorProfile",
            "color-profile": "colorProfile",
            colorrendering: "colorRendering",
            "color-rendering": "colorRendering",
            contentscripttype: "contentScriptType",
            contentstyletype: "contentStyleType",
            cursor: "cursor",
            cx: "cx",
            cy: "cy",
            d: "d",
            datatype: "datatype",
            decelerate: "decelerate",
            descent: "descent",
            diffuseconstant: "diffuseConstant",
            direction: "direction",
            display: "display",
            divisor: "divisor",
            dominantbaseline: "dominantBaseline",
            "dominant-baseline": "dominantBaseline",
            dur: "dur",
            dx: "dx",
            dy: "dy",
            edgemode: "edgeMode",
            elevation: "elevation",
            enablebackground: "enableBackground",
            "enable-background": "enableBackground",
            end: "end",
            exponent: "exponent",
            externalresourcesrequired: "externalResourcesRequired",
            fill: "fill",
            fillopacity: "fillOpacity",
            "fill-opacity": "fillOpacity",
            fillrule: "fillRule",
            "fill-rule": "fillRule",
            filter: "filter",
            filterres: "filterRes",
            filterunits: "filterUnits",
            floodopacity: "floodOpacity",
            "flood-opacity": "floodOpacity",
            floodcolor: "floodColor",
            "flood-color": "floodColor",
            focusable: "focusable",
            fontfamily: "fontFamily",
            "font-family": "fontFamily",
            fontsize: "fontSize",
            "font-size": "fontSize",
            fontsizeadjust: "fontSizeAdjust",
            "font-size-adjust": "fontSizeAdjust",
            fontstretch: "fontStretch",
            "font-stretch": "fontStretch",
            fontstyle: "fontStyle",
            "font-style": "fontStyle",
            fontvariant: "fontVariant",
            "font-variant": "fontVariant",
            fontweight: "fontWeight",
            "font-weight": "fontWeight",
            format: "format",
            from: "from",
            fx: "fx",
            fy: "fy",
            g1: "g1",
            g2: "g2",
            glyphname: "glyphName",
            "glyph-name": "glyphName",
            glyphorientationhorizontal: "glyphOrientationHorizontal",
            "glyph-orientation-horizontal": "glyphOrientationHorizontal",
            glyphorientationvertical: "glyphOrientationVertical",
            "glyph-orientation-vertical": "glyphOrientationVertical",
            glyphref: "glyphRef",
            gradienttransform: "gradientTransform",
            gradientunits: "gradientUnits",
            hanging: "hanging",
            horizadvx: "horizAdvX",
            "horiz-adv-x": "horizAdvX",
            horizoriginx: "horizOriginX",
            "horiz-origin-x": "horizOriginX",
            ideographic: "ideographic",
            imagerendering: "imageRendering",
            "image-rendering": "imageRendering",
            in2: "in2",
            in: "in",
            inlist: "inlist",
            intercept: "intercept",
            k1: "k1",
            k2: "k2",
            k3: "k3",
            k4: "k4",
            k: "k",
            kernelmatrix: "kernelMatrix",
            kernelunitlength: "kernelUnitLength",
            kerning: "kerning",
            keypoints: "keyPoints",
            keysplines: "keySplines",
            keytimes: "keyTimes",
            lengthadjust: "lengthAdjust",
            letterspacing: "letterSpacing",
            "letter-spacing": "letterSpacing",
            lightingcolor: "lightingColor",
            "lighting-color": "lightingColor",
            limitingconeangle: "limitingConeAngle",
            local: "local",
            markerend: "markerEnd",
            "marker-end": "markerEnd",
            markerheight: "markerHeight",
            markermid: "markerMid",
            "marker-mid": "markerMid",
            markerstart: "markerStart",
            "marker-start": "markerStart",
            markerunits: "markerUnits",
            markerwidth: "markerWidth",
            mask: "mask",
            maskcontentunits: "maskContentUnits",
            maskunits: "maskUnits",
            mathematical: "mathematical",
            mode: "mode",
            numoctaves: "numOctaves",
            offset: "offset",
            opacity: "opacity",
            operator: "operator",
            order: "order",
            orient: "orient",
            orientation: "orientation",
            origin: "origin",
            overflow: "overflow",
            overlineposition: "overlinePosition",
            "overline-position": "overlinePosition",
            overlinethickness: "overlineThickness",
            "overline-thickness": "overlineThickness",
            paintorder: "paintOrder",
            "paint-order": "paintOrder",
            panose1: "panose1",
            "panose-1": "panose1",
            pathlength: "pathLength",
            patterncontentunits: "patternContentUnits",
            patterntransform: "patternTransform",
            patternunits: "patternUnits",
            pointerevents: "pointerEvents",
            "pointer-events": "pointerEvents",
            points: "points",
            pointsatx: "pointsAtX",
            pointsaty: "pointsAtY",
            pointsatz: "pointsAtZ",
            prefix: "prefix",
            preservealpha: "preserveAlpha",
            preserveaspectratio: "preserveAspectRatio",
            primitiveunits: "primitiveUnits",
            property: "property",
            r: "r",
            radius: "radius",
            refx: "refX",
            refy: "refY",
            renderingintent: "renderingIntent",
            "rendering-intent": "renderingIntent",
            repeatcount: "repeatCount",
            repeatdur: "repeatDur",
            requiredextensions: "requiredExtensions",
            requiredfeatures: "requiredFeatures",
            resource: "resource",
            restart: "restart",
            result: "result",
            results: "results",
            rotate: "rotate",
            rx: "rx",
            ry: "ry",
            scale: "scale",
            security: "security",
            seed: "seed",
            shaperendering: "shapeRendering",
            "shape-rendering": "shapeRendering",
            slope: "slope",
            spacing: "spacing",
            specularconstant: "specularConstant",
            specularexponent: "specularExponent",
            speed: "speed",
            spreadmethod: "spreadMethod",
            startoffset: "startOffset",
            stddeviation: "stdDeviation",
            stemh: "stemh",
            stemv: "stemv",
            stitchtiles: "stitchTiles",
            stopcolor: "stopColor",
            "stop-color": "stopColor",
            stopopacity: "stopOpacity",
            "stop-opacity": "stopOpacity",
            strikethroughposition: "strikethroughPosition",
            "strikethrough-position": "strikethroughPosition",
            strikethroughthickness: "strikethroughThickness",
            "strikethrough-thickness": "strikethroughThickness",
            string: "string",
            stroke: "stroke",
            strokedasharray: "strokeDasharray",
            "stroke-dasharray": "strokeDasharray",
            strokedashoffset: "strokeDashoffset",
            "stroke-dashoffset": "strokeDashoffset",
            strokelinecap: "strokeLinecap",
            "stroke-linecap": "strokeLinecap",
            strokelinejoin: "strokeLinejoin",
            "stroke-linejoin": "strokeLinejoin",
            strokemiterlimit: "strokeMiterlimit",
            "stroke-miterlimit": "strokeMiterlimit",
            strokewidth: "strokeWidth",
            "stroke-width": "strokeWidth",
            strokeopacity: "strokeOpacity",
            "stroke-opacity": "strokeOpacity",
            suppresscontenteditablewarning: "suppressContentEditableWarning",
            suppresshydrationwarning: "suppressHydrationWarning",
            surfacescale: "surfaceScale",
            systemlanguage: "systemLanguage",
            tablevalues: "tableValues",
            targetx: "targetX",
            targety: "targetY",
            textanchor: "textAnchor",
            "text-anchor": "textAnchor",
            textdecoration: "textDecoration",
            "text-decoration": "textDecoration",
            textlength: "textLength",
            textrendering: "textRendering",
            "text-rendering": "textRendering",
            to: "to",
            transform: "transform",
            typeof: "typeof",
            u1: "u1",
            u2: "u2",
            underlineposition: "underlinePosition",
            "underline-position": "underlinePosition",
            underlinethickness: "underlineThickness",
            "underline-thickness": "underlineThickness",
            unicode: "unicode",
            unicodebidi: "unicodeBidi",
            "unicode-bidi": "unicodeBidi",
            unicoderange: "unicodeRange",
            "unicode-range": "unicodeRange",
            unitsperem: "unitsPerEm",
            "units-per-em": "unitsPerEm",
            unselectable: "unselectable",
            valphabetic: "vAlphabetic",
            "v-alphabetic": "vAlphabetic",
            values: "values",
            vectoreffect: "vectorEffect",
            "vector-effect": "vectorEffect",
            version: "version",
            vertadvy: "vertAdvY",
            "vert-adv-y": "vertAdvY",
            vertoriginx: "vertOriginX",
            "vert-origin-x": "vertOriginX",
            vertoriginy: "vertOriginY",
            "vert-origin-y": "vertOriginY",
            vhanging: "vHanging",
            "v-hanging": "vHanging",
            videographic: "vIdeographic",
            "v-ideographic": "vIdeographic",
            viewbox: "viewBox",
            viewtarget: "viewTarget",
            visibility: "visibility",
            vmathematical: "vMathematical",
            "v-mathematical": "vMathematical",
            vocab: "vocab",
            widths: "widths",
            wordspacing: "wordSpacing",
            "word-spacing": "wordSpacing",
            writingmode: "writingMode",
            "writing-mode": "writingMode",
            x1: "x1",
            x2: "x2",
            x: "x",
            xchannelselector: "xChannelSelector",
            xheight: "xHeight",
            "x-height": "xHeight",
            xlinkactuate: "xlinkActuate",
            "xlink:actuate": "xlinkActuate",
            xlinkarcrole: "xlinkArcrole",
            "xlink:arcrole": "xlinkArcrole",
            xlinkhref: "xlinkHref",
            "xlink:href": "xlinkHref",
            xlinkrole: "xlinkRole",
            "xlink:role": "xlinkRole",
            xlinkshow: "xlinkShow",
            "xlink:show": "xlinkShow",
            xlinktitle: "xlinkTitle",
            "xlink:title": "xlinkTitle",
            xlinktype: "xlinkType",
            "xlink:type": "xlinkType",
            xmlbase: "xmlBase",
            "xml:base": "xmlBase",
            xmllang: "xmlLang",
            "xml:lang": "xmlLang",
            xmlns: "xmlns",
            "xml:space": "xmlSpace",
            xmlnsxlink: "xmlnsXlink",
            "xmlns:xlink": "xmlnsXlink",
            xmlspace: "xmlSpace",
            y1: "y1",
            y2: "y2",
            y: "y",
            ychannelselector: "yChannelSelector",
            z: "z",
            zoomandpan: "zoomAndPan"
          };
          var validateProperty$1 = function() {
          };
          {
            var warnedProperties$1 = {};
            var EVENT_NAME_REGEX = /^on./;
            var INVALID_EVENT_NAME_REGEX = /^on[^A-Z]/;
            var rARIA$1 = new RegExp("^(aria)-[" + ATTRIBUTE_NAME_CHAR + "]*$");
            var rARIACamel$1 = new RegExp("^(aria)[A-Z][" + ATTRIBUTE_NAME_CHAR + "]*$");
            validateProperty$1 = function(tagName, name, value, eventRegistry) {
              if (hasOwnProperty2.call(warnedProperties$1, name) && warnedProperties$1[name]) {
                return true;
              }
              var lowerCasedName = name.toLowerCase();
              if (lowerCasedName === "onfocusin" || lowerCasedName === "onfocusout") {
                error("React uses onFocus and onBlur instead of onFocusIn and onFocusOut. All React events are normalized to bubble, so onFocusIn and onFocusOut are not needed/supported by React.");
                warnedProperties$1[name] = true;
                return true;
              }
              if (eventRegistry != null) {
                var registrationNameDependencies = eventRegistry.registrationNameDependencies, possibleRegistrationNames = eventRegistry.possibleRegistrationNames;
                if (registrationNameDependencies.hasOwnProperty(name)) {
                  return true;
                }
                var registrationName = possibleRegistrationNames.hasOwnProperty(lowerCasedName) ? possibleRegistrationNames[lowerCasedName] : null;
                if (registrationName != null) {
                  error("Invalid event handler property `%s`. Did you mean `%s`?", name, registrationName);
                  warnedProperties$1[name] = true;
                  return true;
                }
                if (EVENT_NAME_REGEX.test(name)) {
                  error("Unknown event handler property `%s`. It will be ignored.", name);
                  warnedProperties$1[name] = true;
                  return true;
                }
              } else if (EVENT_NAME_REGEX.test(name)) {
                if (INVALID_EVENT_NAME_REGEX.test(name)) {
                  error("Invalid event handler property `%s`. React events use the camelCase naming convention, for example `onClick`.", name);
                }
                warnedProperties$1[name] = true;
                return true;
              }
              if (rARIA$1.test(name) || rARIACamel$1.test(name)) {
                return true;
              }
              if (lowerCasedName === "innerhtml") {
                error("Directly setting property `innerHTML` is not permitted. For more information, lookup documentation on `dangerouslySetInnerHTML`.");
                warnedProperties$1[name] = true;
                return true;
              }
              if (lowerCasedName === "aria") {
                error("The `aria` attribute is reserved for future use in React. Pass individual `aria-` attributes instead.");
                warnedProperties$1[name] = true;
                return true;
              }
              if (lowerCasedName === "is" && value !== null && value !== void 0 && typeof value !== "string") {
                error("Received a `%s` for a string attribute `is`. If this is expected, cast the value to a string.", typeof value);
                warnedProperties$1[name] = true;
                return true;
              }
              if (typeof value === "number" && isNaN(value)) {
                error("Received NaN for the `%s` attribute. If this is expected, cast the value to a string.", name);
                warnedProperties$1[name] = true;
                return true;
              }
              var propertyInfo = getPropertyInfo(name);
              var isReserved = propertyInfo !== null && propertyInfo.type === RESERVED;
              if (possibleStandardNames.hasOwnProperty(lowerCasedName)) {
                var standardName = possibleStandardNames[lowerCasedName];
                if (standardName !== name) {
                  error("Invalid DOM property `%s`. Did you mean `%s`?", name, standardName);
                  warnedProperties$1[name] = true;
                  return true;
                }
              } else if (!isReserved && name !== lowerCasedName) {
                error("React does not recognize the `%s` prop on a DOM element. If you intentionally want it to appear in the DOM as a custom attribute, spell it as lowercase `%s` instead. If you accidentally passed it from a parent component, remove it from the DOM element.", name, lowerCasedName);
                warnedProperties$1[name] = true;
                return true;
              }
              if (typeof value === "boolean" && shouldRemoveAttributeWithWarning(name, value, propertyInfo, false)) {
                if (value) {
                  error('Received `%s` for a non-boolean attribute `%s`.\n\nIf you want to write it to the DOM, pass a string instead: %s="%s" or %s={value.toString()}.', value, name, name, value, name);
                } else {
                  error('Received `%s` for a non-boolean attribute `%s`.\n\nIf you want to write it to the DOM, pass a string instead: %s="%s" or %s={value.toString()}.\n\nIf you used to conditionally omit it with %s={condition && value}, pass %s={condition ? value : undefined} instead.', value, name, name, value, name, name, name);
                }
                warnedProperties$1[name] = true;
                return true;
              }
              if (isReserved) {
                return true;
              }
              if (shouldRemoveAttributeWithWarning(name, value, propertyInfo, false)) {
                warnedProperties$1[name] = true;
                return false;
              }
              if ((value === "false" || value === "true") && propertyInfo !== null && propertyInfo.type === BOOLEAN) {
                error("Received the string `%s` for the boolean attribute `%s`. %s Did you mean %s={%s}?", value, name, value === "false" ? "The browser will interpret it as a truthy value." : 'Although this works, it will not work as expected if you pass the string "false".', name, value);
                warnedProperties$1[name] = true;
                return true;
              }
              return true;
            };
          }
          var warnUnknownProperties = function(type, props, eventRegistry) {
            {
              var unknownProps = [];
              for (var key in props) {
                var isValid = validateProperty$1(type, key, props[key], eventRegistry);
                if (!isValid) {
                  unknownProps.push(key);
                }
              }
              var unknownPropString = unknownProps.map(function(prop) {
                return "`" + prop + "`";
              }).join(", ");
              if (unknownProps.length === 1) {
                error("Invalid value for prop %s on <%s> tag. Either remove it from the element, or pass a string or number value to keep it in the DOM. For details, see https://reactjs.org/link/attribute-behavior ", unknownPropString, type);
              } else if (unknownProps.length > 1) {
                error("Invalid values for props %s on <%s> tag. Either remove them from the element, or pass a string or number value to keep them in the DOM. For details, see https://reactjs.org/link/attribute-behavior ", unknownPropString, type);
              }
            }
          };
          function validateProperties$2(type, props, eventRegistry) {
            if (isCustomComponent(type, props)) {
              return;
            }
            warnUnknownProperties(type, props, eventRegistry);
          }
          var warnValidStyle = function() {
          };
          {
            var badVendoredStyleNamePattern = /^(?:webkit|moz|o)[A-Z]/;
            var msPattern = /^-ms-/;
            var hyphenPattern = /-(.)/g;
            var badStyleValueWithSemicolonPattern = /;\s*$/;
            var warnedStyleNames = {};
            var warnedStyleValues = {};
            var warnedForNaNValue = false;
            var warnedForInfinityValue = false;
            var camelize = function(string) {
              return string.replace(hyphenPattern, function(_, character) {
                return character.toUpperCase();
              });
            };
            var warnHyphenatedStyleName = function(name) {
              if (warnedStyleNames.hasOwnProperty(name) && warnedStyleNames[name]) {
                return;
              }
              warnedStyleNames[name] = true;
              error(
                "Unsupported style property %s. Did you mean %s?",
                name,
                // As Andi Smith suggests
                // (http://www.andismith.com/blog/2012/02/modernizr-prefixed/), an `-ms` prefix
                // is converted to lowercase `ms`.
                camelize(name.replace(msPattern, "ms-"))
              );
            };
            var warnBadVendoredStyleName = function(name) {
              if (warnedStyleNames.hasOwnProperty(name) && warnedStyleNames[name]) {
                return;
              }
              warnedStyleNames[name] = true;
              error("Unsupported vendor-prefixed style property %s. Did you mean %s?", name, name.charAt(0).toUpperCase() + name.slice(1));
            };
            var warnStyleValueWithSemicolon = function(name, value) {
              if (warnedStyleValues.hasOwnProperty(value) && warnedStyleValues[value]) {
                return;
              }
              warnedStyleValues[value] = true;
              error(`Style property values shouldn't contain a semicolon. Try "%s: %s" instead.`, name, value.replace(badStyleValueWithSemicolonPattern, ""));
            };
            var warnStyleValueIsNaN = function(name, value) {
              if (warnedForNaNValue) {
                return;
              }
              warnedForNaNValue = true;
              error("`NaN` is an invalid value for the `%s` css style property.", name);
            };
            var warnStyleValueIsInfinity = function(name, value) {
              if (warnedForInfinityValue) {
                return;
              }
              warnedForInfinityValue = true;
              error("`Infinity` is an invalid value for the `%s` css style property.", name);
            };
            warnValidStyle = function(name, value) {
              if (name.indexOf("-") > -1) {
                warnHyphenatedStyleName(name);
              } else if (badVendoredStyleNamePattern.test(name)) {
                warnBadVendoredStyleName(name);
              } else if (badStyleValueWithSemicolonPattern.test(value)) {
                warnStyleValueWithSemicolon(name, value);
              }
              if (typeof value === "number") {
                if (isNaN(value)) {
                  warnStyleValueIsNaN(name, value);
                } else if (!isFinite(value)) {
                  warnStyleValueIsInfinity(name, value);
                }
              }
            };
          }
          var warnValidStyle$1 = warnValidStyle;
          var matchHtmlRegExp = /["'&<>]/;
          function escapeHtml(string) {
            {
              checkHtmlStringCoercion(string);
            }
            var str = "" + string;
            var match = matchHtmlRegExp.exec(str);
            if (!match) {
              return str;
            }
            var escape;
            var html = "";
            var index;
            var lastIndex = 0;
            for (index = match.index; index < str.length; index++) {
              switch (str.charCodeAt(index)) {
                case 34:
                  escape = "&quot;";
                  break;
                case 38:
                  escape = "&amp;";
                  break;
                case 39:
                  escape = "&#x27;";
                  break;
                case 60:
                  escape = "&lt;";
                  break;
                case 62:
                  escape = "&gt;";
                  break;
                default:
                  continue;
              }
              if (lastIndex !== index) {
                html += str.substring(lastIndex, index);
              }
              lastIndex = index + 1;
              html += escape;
            }
            return lastIndex !== index ? html + str.substring(lastIndex, index) : html;
          }
          function escapeTextForBrowser(text) {
            if (typeof text === "boolean" || typeof text === "number") {
              return "" + text;
            }
            return escapeHtml(text);
          }
          var uppercasePattern = /([A-Z])/g;
          var msPattern$1 = /^ms-/;
          function hyphenateStyleName(name) {
            return name.replace(uppercasePattern, "-$1").toLowerCase().replace(msPattern$1, "-ms-");
          }
          var isJavaScriptProtocol = /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*\:/i;
          var didWarn = false;
          function sanitizeURL(url) {
            {
              if (!didWarn && isJavaScriptProtocol.test(url)) {
                didWarn = true;
                error("A future version of React will block javascript: URLs as a security precaution. Use event handlers instead if you can. If you need to generate unsafe HTML try using dangerouslySetInnerHTML instead. React was passed %s.", JSON.stringify(url));
              }
            }
          }
          var isArrayImpl = Array.isArray;
          function isArray2(a) {
            return isArrayImpl(a);
          }
          var startInlineScript = stringToPrecomputedChunk("<script>");
          var endInlineScript = stringToPrecomputedChunk("<\/script>");
          var startScriptSrc = stringToPrecomputedChunk('<script src="');
          var startModuleSrc = stringToPrecomputedChunk('<script type="module" src="');
          var endAsyncScript = stringToPrecomputedChunk('" async=""><\/script>');
          function escapeBootstrapScriptContent(scriptText) {
            {
              checkHtmlStringCoercion(scriptText);
            }
            return ("" + scriptText).replace(scriptRegex, scriptReplacer);
          }
          var scriptRegex = /(<\/|<)(s)(cript)/gi;
          var scriptReplacer = function(match, prefix2, s, suffix) {
            return "" + prefix2 + (s === "s" ? "\\u0073" : "\\u0053") + suffix;
          };
          function createResponseState(identifierPrefix, nonce, bootstrapScriptContent, bootstrapScripts, bootstrapModules) {
            var idPrefix = identifierPrefix === void 0 ? "" : identifierPrefix;
            var inlineScriptWithNonce = nonce === void 0 ? startInlineScript : stringToPrecomputedChunk('<script nonce="' + escapeTextForBrowser(nonce) + '">');
            var bootstrapChunks = [];
            if (bootstrapScriptContent !== void 0) {
              bootstrapChunks.push(inlineScriptWithNonce, stringToChunk(escapeBootstrapScriptContent(bootstrapScriptContent)), endInlineScript);
            }
            if (bootstrapScripts !== void 0) {
              for (var i = 0; i < bootstrapScripts.length; i++) {
                bootstrapChunks.push(startScriptSrc, stringToChunk(escapeTextForBrowser(bootstrapScripts[i])), endAsyncScript);
              }
            }
            if (bootstrapModules !== void 0) {
              for (var _i = 0; _i < bootstrapModules.length; _i++) {
                bootstrapChunks.push(startModuleSrc, stringToChunk(escapeTextForBrowser(bootstrapModules[_i])), endAsyncScript);
              }
            }
            return {
              bootstrapChunks,
              startInlineScript: inlineScriptWithNonce,
              placeholderPrefix: stringToPrecomputedChunk(idPrefix + "P:"),
              segmentPrefix: stringToPrecomputedChunk(idPrefix + "S:"),
              boundaryPrefix: idPrefix + "B:",
              idPrefix,
              nextSuspenseID: 0,
              sentCompleteSegmentFunction: false,
              sentCompleteBoundaryFunction: false,
              sentClientRenderFunction: false
            };
          }
          var ROOT_HTML_MODE = 0;
          var HTML_MODE = 1;
          var SVG_MODE = 2;
          var MATHML_MODE = 3;
          var HTML_TABLE_MODE = 4;
          var HTML_TABLE_BODY_MODE = 5;
          var HTML_TABLE_ROW_MODE = 6;
          var HTML_COLGROUP_MODE = 7;
          function createFormatContext(insertionMode, selectedValue) {
            return {
              insertionMode,
              selectedValue
            };
          }
          function createRootFormatContext(namespaceURI) {
            var insertionMode = namespaceURI === "http://www.w3.org/2000/svg" ? SVG_MODE : namespaceURI === "http://www.w3.org/1998/Math/MathML" ? MATHML_MODE : ROOT_HTML_MODE;
            return createFormatContext(insertionMode, null);
          }
          function getChildFormatContext(parentContext, type, props) {
            switch (type) {
              case "select":
                return createFormatContext(HTML_MODE, props.value != null ? props.value : props.defaultValue);
              case "svg":
                return createFormatContext(SVG_MODE, null);
              case "math":
                return createFormatContext(MATHML_MODE, null);
              case "foreignObject":
                return createFormatContext(HTML_MODE, null);
              case "table":
                return createFormatContext(HTML_TABLE_MODE, null);
              case "thead":
              case "tbody":
              case "tfoot":
                return createFormatContext(HTML_TABLE_BODY_MODE, null);
              case "colgroup":
                return createFormatContext(HTML_COLGROUP_MODE, null);
              case "tr":
                return createFormatContext(HTML_TABLE_ROW_MODE, null);
            }
            if (parentContext.insertionMode >= HTML_TABLE_MODE) {
              return createFormatContext(HTML_MODE, null);
            }
            if (parentContext.insertionMode === ROOT_HTML_MODE) {
              return createFormatContext(HTML_MODE, null);
            }
            return parentContext;
          }
          var UNINITIALIZED_SUSPENSE_BOUNDARY_ID = null;
          function assignSuspenseBoundaryID(responseState) {
            var generatedID = responseState.nextSuspenseID++;
            return stringToPrecomputedChunk(responseState.boundaryPrefix + generatedID.toString(16));
          }
          function makeId(responseState, treeId, localId) {
            var idPrefix = responseState.idPrefix;
            var id = ":" + idPrefix + "R" + treeId;
            if (localId > 0) {
              id += "H" + localId.toString(32);
            }
            return id + ":";
          }
          function encodeHTMLTextNode(text) {
            return escapeTextForBrowser(text);
          }
          var textSeparator = stringToPrecomputedChunk("<!-- -->");
          function pushTextInstance(target, text, responseState, textEmbedded) {
            if (text === "") {
              return textEmbedded;
            }
            if (textEmbedded) {
              target.push(textSeparator);
            }
            target.push(stringToChunk(encodeHTMLTextNode(text)));
            return true;
          }
          function pushSegmentFinale(target, responseState, lastPushedText, textEmbedded) {
            if (lastPushedText && textEmbedded) {
              target.push(textSeparator);
            }
          }
          var styleNameCache = /* @__PURE__ */ new Map();
          function processStyleName(styleName) {
            var chunk = styleNameCache.get(styleName);
            if (chunk !== void 0) {
              return chunk;
            }
            var result = stringToPrecomputedChunk(escapeTextForBrowser(hyphenateStyleName(styleName)));
            styleNameCache.set(styleName, result);
            return result;
          }
          var styleAttributeStart = stringToPrecomputedChunk(' style="');
          var styleAssign = stringToPrecomputedChunk(":");
          var styleSeparator = stringToPrecomputedChunk(";");
          function pushStyle(target, responseState, style) {
            if (typeof style !== "object") {
              throw new Error("The `style` prop expects a mapping from style properties to values, not a string. For example, style={{marginRight: spacing + 'em'}} when using JSX.");
            }
            var isFirst = true;
            for (var styleName in style) {
              if (!hasOwnProperty2.call(style, styleName)) {
                continue;
              }
              var styleValue = style[styleName];
              if (styleValue == null || typeof styleValue === "boolean" || styleValue === "") {
                continue;
              }
              var nameChunk = void 0;
              var valueChunk = void 0;
              var isCustomProperty = styleName.indexOf("--") === 0;
              if (isCustomProperty) {
                nameChunk = stringToChunk(escapeTextForBrowser(styleName));
                {
                  checkCSSPropertyStringCoercion(styleValue, styleName);
                }
                valueChunk = stringToChunk(escapeTextForBrowser(("" + styleValue).trim()));
              } else {
                {
                  warnValidStyle$1(styleName, styleValue);
                }
                nameChunk = processStyleName(styleName);
                if (typeof styleValue === "number") {
                  if (styleValue !== 0 && !hasOwnProperty2.call(isUnitlessNumber, styleName)) {
                    valueChunk = stringToChunk(styleValue + "px");
                  } else {
                    valueChunk = stringToChunk("" + styleValue);
                  }
                } else {
                  {
                    checkCSSPropertyStringCoercion(styleValue, styleName);
                  }
                  valueChunk = stringToChunk(escapeTextForBrowser(("" + styleValue).trim()));
                }
              }
              if (isFirst) {
                isFirst = false;
                target.push(styleAttributeStart, nameChunk, styleAssign, valueChunk);
              } else {
                target.push(styleSeparator, nameChunk, styleAssign, valueChunk);
              }
            }
            if (!isFirst) {
              target.push(attributeEnd);
            }
          }
          var attributeSeparator = stringToPrecomputedChunk(" ");
          var attributeAssign = stringToPrecomputedChunk('="');
          var attributeEnd = stringToPrecomputedChunk('"');
          var attributeEmptyString = stringToPrecomputedChunk('=""');
          function pushAttribute(target, responseState, name, value) {
            switch (name) {
              case "style": {
                pushStyle(target, responseState, value);
                return;
              }
              case "defaultValue":
              case "defaultChecked":
              case "innerHTML":
              case "suppressContentEditableWarning":
              case "suppressHydrationWarning":
                return;
            }
            if (
              // shouldIgnoreAttribute
              // We have already filtered out null/undefined and reserved words.
              name.length > 2 && (name[0] === "o" || name[0] === "O") && (name[1] === "n" || name[1] === "N")
            ) {
              return;
            }
            var propertyInfo = getPropertyInfo(name);
            if (propertyInfo !== null) {
              switch (typeof value) {
                case "function":
                case "symbol":
                  return;
                case "boolean": {
                  if (!propertyInfo.acceptsBooleans) {
                    return;
                  }
                }
              }
              var attributeName = propertyInfo.attributeName;
              var attributeNameChunk = stringToChunk(attributeName);
              switch (propertyInfo.type) {
                case BOOLEAN:
                  if (value) {
                    target.push(attributeSeparator, attributeNameChunk, attributeEmptyString);
                  }
                  return;
                case OVERLOADED_BOOLEAN:
                  if (value === true) {
                    target.push(attributeSeparator, attributeNameChunk, attributeEmptyString);
                  } else if (value === false)
                    ;
                  else {
                    target.push(attributeSeparator, attributeNameChunk, attributeAssign, stringToChunk(escapeTextForBrowser(value)), attributeEnd);
                  }
                  return;
                case NUMERIC:
                  if (!isNaN(value)) {
                    target.push(attributeSeparator, attributeNameChunk, attributeAssign, stringToChunk(escapeTextForBrowser(value)), attributeEnd);
                  }
                  break;
                case POSITIVE_NUMERIC:
                  if (!isNaN(value) && value >= 1) {
                    target.push(attributeSeparator, attributeNameChunk, attributeAssign, stringToChunk(escapeTextForBrowser(value)), attributeEnd);
                  }
                  break;
                default:
                  if (propertyInfo.sanitizeURL) {
                    {
                      checkAttributeStringCoercion(value, attributeName);
                    }
                    value = "" + value;
                    sanitizeURL(value);
                  }
                  target.push(attributeSeparator, attributeNameChunk, attributeAssign, stringToChunk(escapeTextForBrowser(value)), attributeEnd);
              }
            } else if (isAttributeNameSafe(name)) {
              switch (typeof value) {
                case "function":
                case "symbol":
                  return;
                case "boolean": {
                  var prefix2 = name.toLowerCase().slice(0, 5);
                  if (prefix2 !== "data-" && prefix2 !== "aria-") {
                    return;
                  }
                }
              }
              target.push(attributeSeparator, stringToChunk(name), attributeAssign, stringToChunk(escapeTextForBrowser(value)), attributeEnd);
            }
          }
          var endOfStartTag = stringToPrecomputedChunk(">");
          var endOfStartTagSelfClosing = stringToPrecomputedChunk("/>");
          function pushInnerHTML(target, innerHTML, children) {
            if (innerHTML != null) {
              if (children != null) {
                throw new Error("Can only set one of `children` or `props.dangerouslySetInnerHTML`.");
              }
              if (typeof innerHTML !== "object" || !("__html" in innerHTML)) {
                throw new Error("`props.dangerouslySetInnerHTML` must be in the form `{__html: ...}`. Please visit https://reactjs.org/link/dangerously-set-inner-html for more information.");
              }
              var html = innerHTML.__html;
              if (html !== null && html !== void 0) {
                {
                  checkHtmlStringCoercion(html);
                }
                target.push(stringToChunk("" + html));
              }
            }
          }
          var didWarnDefaultInputValue = false;
          var didWarnDefaultChecked = false;
          var didWarnDefaultSelectValue = false;
          var didWarnDefaultTextareaValue = false;
          var didWarnInvalidOptionChildren = false;
          var didWarnInvalidOptionInnerHTML = false;
          var didWarnSelectedSetOnOption = false;
          function checkSelectProp(props, propName) {
            {
              var value = props[propName];
              if (value != null) {
                var array = isArray2(value);
                if (props.multiple && !array) {
                  error("The `%s` prop supplied to <select> must be an array if `multiple` is true.", propName);
                } else if (!props.multiple && array) {
                  error("The `%s` prop supplied to <select> must be a scalar value if `multiple` is false.", propName);
                }
              }
            }
          }
          function pushStartSelect(target, props, responseState) {
            {
              checkControlledValueProps("select", props);
              checkSelectProp(props, "value");
              checkSelectProp(props, "defaultValue");
              if (props.value !== void 0 && props.defaultValue !== void 0 && !didWarnDefaultSelectValue) {
                error("Select elements must be either controlled or uncontrolled (specify either the value prop, or the defaultValue prop, but not both). Decide between using a controlled or uncontrolled select element and remove one of these props. More info: https://reactjs.org/link/controlled-components");
                didWarnDefaultSelectValue = true;
              }
            }
            target.push(startChunkForTag("select"));
            var children = null;
            var innerHTML = null;
            for (var propKey in props) {
              if (hasOwnProperty2.call(props, propKey)) {
                var propValue = props[propKey];
                if (propValue == null) {
                  continue;
                }
                switch (propKey) {
                  case "children":
                    children = propValue;
                    break;
                  case "dangerouslySetInnerHTML":
                    innerHTML = propValue;
                    break;
                  case "defaultValue":
                  case "value":
                    break;
                  default:
                    pushAttribute(target, responseState, propKey, propValue);
                    break;
                }
              }
            }
            target.push(endOfStartTag);
            pushInnerHTML(target, innerHTML, children);
            return children;
          }
          function flattenOptionChildren(children) {
            var content = "";
            React3.Children.forEach(children, function(child) {
              if (child == null) {
                return;
              }
              content += child;
              {
                if (!didWarnInvalidOptionChildren && typeof child !== "string" && typeof child !== "number") {
                  didWarnInvalidOptionChildren = true;
                  error("Cannot infer the option value of complex children. Pass a `value` prop or use a plain string as children to <option>.");
                }
              }
            });
            return content;
          }
          var selectedMarkerAttribute = stringToPrecomputedChunk(' selected=""');
          function pushStartOption(target, props, responseState, formatContext) {
            var selectedValue = formatContext.selectedValue;
            target.push(startChunkForTag("option"));
            var children = null;
            var value = null;
            var selected = null;
            var innerHTML = null;
            for (var propKey in props) {
              if (hasOwnProperty2.call(props, propKey)) {
                var propValue = props[propKey];
                if (propValue == null) {
                  continue;
                }
                switch (propKey) {
                  case "children":
                    children = propValue;
                    break;
                  case "selected":
                    selected = propValue;
                    {
                      if (!didWarnSelectedSetOnOption) {
                        error("Use the `defaultValue` or `value` props on <select> instead of setting `selected` on <option>.");
                        didWarnSelectedSetOnOption = true;
                      }
                    }
                    break;
                  case "dangerouslySetInnerHTML":
                    innerHTML = propValue;
                    break;
                  case "value":
                    value = propValue;
                  default:
                    pushAttribute(target, responseState, propKey, propValue);
                    break;
                }
              }
            }
            if (selectedValue != null) {
              var stringValue;
              if (value !== null) {
                {
                  checkAttributeStringCoercion(value, "value");
                }
                stringValue = "" + value;
              } else {
                {
                  if (innerHTML !== null) {
                    if (!didWarnInvalidOptionInnerHTML) {
                      didWarnInvalidOptionInnerHTML = true;
                      error("Pass a `value` prop if you set dangerouslyInnerHTML so React knows which value should be selected.");
                    }
                  }
                }
                stringValue = flattenOptionChildren(children);
              }
              if (isArray2(selectedValue)) {
                for (var i = 0; i < selectedValue.length; i++) {
                  {
                    checkAttributeStringCoercion(selectedValue[i], "value");
                  }
                  var v = "" + selectedValue[i];
                  if (v === stringValue) {
                    target.push(selectedMarkerAttribute);
                    break;
                  }
                }
              } else {
                {
                  checkAttributeStringCoercion(selectedValue, "select.value");
                }
                if ("" + selectedValue === stringValue) {
                  target.push(selectedMarkerAttribute);
                }
              }
            } else if (selected) {
              target.push(selectedMarkerAttribute);
            }
            target.push(endOfStartTag);
            pushInnerHTML(target, innerHTML, children);
            return children;
          }
          function pushInput(target, props, responseState) {
            {
              checkControlledValueProps("input", props);
              if (props.checked !== void 0 && props.defaultChecked !== void 0 && !didWarnDefaultChecked) {
                error("%s contains an input of type %s with both checked and defaultChecked props. Input elements must be either controlled or uncontrolled (specify either the checked prop, or the defaultChecked prop, but not both). Decide between using a controlled or uncontrolled input element and remove one of these props. More info: https://reactjs.org/link/controlled-components", "A component", props.type);
                didWarnDefaultChecked = true;
              }
              if (props.value !== void 0 && props.defaultValue !== void 0 && !didWarnDefaultInputValue) {
                error("%s contains an input of type %s with both value and defaultValue props. Input elements must be either controlled or uncontrolled (specify either the value prop, or the defaultValue prop, but not both). Decide between using a controlled or uncontrolled input element and remove one of these props. More info: https://reactjs.org/link/controlled-components", "A component", props.type);
                didWarnDefaultInputValue = true;
              }
            }
            target.push(startChunkForTag("input"));
            var value = null;
            var defaultValue = null;
            var checked = null;
            var defaultChecked = null;
            for (var propKey in props) {
              if (hasOwnProperty2.call(props, propKey)) {
                var propValue = props[propKey];
                if (propValue == null) {
                  continue;
                }
                switch (propKey) {
                  case "children":
                  case "dangerouslySetInnerHTML":
                    throw new Error("input is a self-closing tag and must neither have `children` nor use `dangerouslySetInnerHTML`.");
                  case "defaultChecked":
                    defaultChecked = propValue;
                    break;
                  case "defaultValue":
                    defaultValue = propValue;
                    break;
                  case "checked":
                    checked = propValue;
                    break;
                  case "value":
                    value = propValue;
                    break;
                  default:
                    pushAttribute(target, responseState, propKey, propValue);
                    break;
                }
              }
            }
            if (checked !== null) {
              pushAttribute(target, responseState, "checked", checked);
            } else if (defaultChecked !== null) {
              pushAttribute(target, responseState, "checked", defaultChecked);
            }
            if (value !== null) {
              pushAttribute(target, responseState, "value", value);
            } else if (defaultValue !== null) {
              pushAttribute(target, responseState, "value", defaultValue);
            }
            target.push(endOfStartTagSelfClosing);
            return null;
          }
          function pushStartTextArea(target, props, responseState) {
            {
              checkControlledValueProps("textarea", props);
              if (props.value !== void 0 && props.defaultValue !== void 0 && !didWarnDefaultTextareaValue) {
                error("Textarea elements must be either controlled or uncontrolled (specify either the value prop, or the defaultValue prop, but not both). Decide between using a controlled or uncontrolled textarea and remove one of these props. More info: https://reactjs.org/link/controlled-components");
                didWarnDefaultTextareaValue = true;
              }
            }
            target.push(startChunkForTag("textarea"));
            var value = null;
            var defaultValue = null;
            var children = null;
            for (var propKey in props) {
              if (hasOwnProperty2.call(props, propKey)) {
                var propValue = props[propKey];
                if (propValue == null) {
                  continue;
                }
                switch (propKey) {
                  case "children":
                    children = propValue;
                    break;
                  case "value":
                    value = propValue;
                    break;
                  case "defaultValue":
                    defaultValue = propValue;
                    break;
                  case "dangerouslySetInnerHTML":
                    throw new Error("`dangerouslySetInnerHTML` does not make sense on <textarea>.");
                  default:
                    pushAttribute(target, responseState, propKey, propValue);
                    break;
                }
              }
            }
            if (value === null && defaultValue !== null) {
              value = defaultValue;
            }
            target.push(endOfStartTag);
            if (children != null) {
              {
                error("Use the `defaultValue` or `value` props instead of setting children on <textarea>.");
              }
              if (value != null) {
                throw new Error("If you supply `defaultValue` on a <textarea>, do not pass children.");
              }
              if (isArray2(children)) {
                if (children.length > 1) {
                  throw new Error("<textarea> can only have at most one child.");
                }
                {
                  checkHtmlStringCoercion(children[0]);
                }
                value = "" + children[0];
              }
              {
                checkHtmlStringCoercion(children);
              }
              value = "" + children;
            }
            if (typeof value === "string" && value[0] === "\n") {
              target.push(leadingNewline);
            }
            if (value !== null) {
              {
                checkAttributeStringCoercion(value, "value");
              }
              target.push(stringToChunk(encodeHTMLTextNode("" + value)));
            }
            return null;
          }
          function pushSelfClosing(target, props, tag, responseState) {
            target.push(startChunkForTag(tag));
            for (var propKey in props) {
              if (hasOwnProperty2.call(props, propKey)) {
                var propValue = props[propKey];
                if (propValue == null) {
                  continue;
                }
                switch (propKey) {
                  case "children":
                  case "dangerouslySetInnerHTML":
                    throw new Error(tag + " is a self-closing tag and must neither have `children` nor use `dangerouslySetInnerHTML`.");
                  default:
                    pushAttribute(target, responseState, propKey, propValue);
                    break;
                }
              }
            }
            target.push(endOfStartTagSelfClosing);
            return null;
          }
          function pushStartMenuItem(target, props, responseState) {
            target.push(startChunkForTag("menuitem"));
            for (var propKey in props) {
              if (hasOwnProperty2.call(props, propKey)) {
                var propValue = props[propKey];
                if (propValue == null) {
                  continue;
                }
                switch (propKey) {
                  case "children":
                  case "dangerouslySetInnerHTML":
                    throw new Error("menuitems cannot have `children` nor `dangerouslySetInnerHTML`.");
                  default:
                    pushAttribute(target, responseState, propKey, propValue);
                    break;
                }
              }
            }
            target.push(endOfStartTag);
            return null;
          }
          function pushStartTitle(target, props, responseState) {
            target.push(startChunkForTag("title"));
            var children = null;
            for (var propKey in props) {
              if (hasOwnProperty2.call(props, propKey)) {
                var propValue = props[propKey];
                if (propValue == null) {
                  continue;
                }
                switch (propKey) {
                  case "children":
                    children = propValue;
                    break;
                  case "dangerouslySetInnerHTML":
                    throw new Error("`dangerouslySetInnerHTML` does not make sense on <title>.");
                  default:
                    pushAttribute(target, responseState, propKey, propValue);
                    break;
                }
              }
            }
            target.push(endOfStartTag);
            {
              var child = Array.isArray(children) && children.length < 2 ? children[0] || null : children;
              if (Array.isArray(children) && children.length > 1) {
                error("A title element received an array with more than 1 element as children. In browsers title Elements can only have Text Nodes as children. If the children being rendered output more than a single text node in aggregate the browser will display markup and comments as text in the title and hydration will likely fail and fall back to client rendering");
              } else if (child != null && child.$$typeof != null) {
                error("A title element received a React element for children. In the browser title Elements can only have Text Nodes as children. If the children being rendered output more than a single text node in aggregate the browser will display markup and comments as text in the title and hydration will likely fail and fall back to client rendering");
              } else if (child != null && typeof child !== "string" && typeof child !== "number") {
                error("A title element received a value that was not a string or number for children. In the browser title Elements can only have Text Nodes as children. If the children being rendered output more than a single text node in aggregate the browser will display markup and comments as text in the title and hydration will likely fail and fall back to client rendering");
              }
            }
            return children;
          }
          function pushStartGenericElement(target, props, tag, responseState) {
            target.push(startChunkForTag(tag));
            var children = null;
            var innerHTML = null;
            for (var propKey in props) {
              if (hasOwnProperty2.call(props, propKey)) {
                var propValue = props[propKey];
                if (propValue == null) {
                  continue;
                }
                switch (propKey) {
                  case "children":
                    children = propValue;
                    break;
                  case "dangerouslySetInnerHTML":
                    innerHTML = propValue;
                    break;
                  default:
                    pushAttribute(target, responseState, propKey, propValue);
                    break;
                }
              }
            }
            target.push(endOfStartTag);
            pushInnerHTML(target, innerHTML, children);
            if (typeof children === "string") {
              target.push(stringToChunk(encodeHTMLTextNode(children)));
              return null;
            }
            return children;
          }
          function pushStartCustomElement(target, props, tag, responseState) {
            target.push(startChunkForTag(tag));
            var children = null;
            var innerHTML = null;
            for (var propKey in props) {
              if (hasOwnProperty2.call(props, propKey)) {
                var propValue = props[propKey];
                if (propValue == null) {
                  continue;
                }
                switch (propKey) {
                  case "children":
                    children = propValue;
                    break;
                  case "dangerouslySetInnerHTML":
                    innerHTML = propValue;
                    break;
                  case "style":
                    pushStyle(target, responseState, propValue);
                    break;
                  case "suppressContentEditableWarning":
                  case "suppressHydrationWarning":
                    break;
                  default:
                    if (isAttributeNameSafe(propKey) && typeof propValue !== "function" && typeof propValue !== "symbol") {
                      target.push(attributeSeparator, stringToChunk(propKey), attributeAssign, stringToChunk(escapeTextForBrowser(propValue)), attributeEnd);
                    }
                    break;
                }
              }
            }
            target.push(endOfStartTag);
            pushInnerHTML(target, innerHTML, children);
            return children;
          }
          var leadingNewline = stringToPrecomputedChunk("\n");
          function pushStartPreformattedElement(target, props, tag, responseState) {
            target.push(startChunkForTag(tag));
            var children = null;
            var innerHTML = null;
            for (var propKey in props) {
              if (hasOwnProperty2.call(props, propKey)) {
                var propValue = props[propKey];
                if (propValue == null) {
                  continue;
                }
                switch (propKey) {
                  case "children":
                    children = propValue;
                    break;
                  case "dangerouslySetInnerHTML":
                    innerHTML = propValue;
                    break;
                  default:
                    pushAttribute(target, responseState, propKey, propValue);
                    break;
                }
              }
            }
            target.push(endOfStartTag);
            if (innerHTML != null) {
              if (children != null) {
                throw new Error("Can only set one of `children` or `props.dangerouslySetInnerHTML`.");
              }
              if (typeof innerHTML !== "object" || !("__html" in innerHTML)) {
                throw new Error("`props.dangerouslySetInnerHTML` must be in the form `{__html: ...}`. Please visit https://reactjs.org/link/dangerously-set-inner-html for more information.");
              }
              var html = innerHTML.__html;
              if (html !== null && html !== void 0) {
                if (typeof html === "string" && html.length > 0 && html[0] === "\n") {
                  target.push(leadingNewline, stringToChunk(html));
                } else {
                  {
                    checkHtmlStringCoercion(html);
                  }
                  target.push(stringToChunk("" + html));
                }
              }
            }
            if (typeof children === "string" && children[0] === "\n") {
              target.push(leadingNewline);
            }
            return children;
          }
          var VALID_TAG_REGEX = /^[a-zA-Z][a-zA-Z:_\.\-\d]*$/;
          var validatedTagCache = /* @__PURE__ */ new Map();
          function startChunkForTag(tag) {
            var tagStartChunk = validatedTagCache.get(tag);
            if (tagStartChunk === void 0) {
              if (!VALID_TAG_REGEX.test(tag)) {
                throw new Error("Invalid tag: " + tag);
              }
              tagStartChunk = stringToPrecomputedChunk("<" + tag);
              validatedTagCache.set(tag, tagStartChunk);
            }
            return tagStartChunk;
          }
          var DOCTYPE = stringToPrecomputedChunk("<!DOCTYPE html>");
          function pushStartInstance(target, type, props, responseState, formatContext) {
            {
              validateProperties(type, props);
              validateProperties$1(type, props);
              validateProperties$2(type, props, null);
              if (!props.suppressContentEditableWarning && props.contentEditable && props.children != null) {
                error("A component is `contentEditable` and contains `children` managed by React. It is now your responsibility to guarantee that none of those nodes are unexpectedly modified or duplicated. This is probably not intentional.");
              }
              if (formatContext.insertionMode !== SVG_MODE && formatContext.insertionMode !== MATHML_MODE) {
                if (type.indexOf("-") === -1 && typeof props.is !== "string" && type.toLowerCase() !== type) {
                  error("<%s /> is using incorrect casing. Use PascalCase for React components, or lowercase for HTML elements.", type);
                }
              }
            }
            switch (type) {
              case "select":
                return pushStartSelect(target, props, responseState);
              case "option":
                return pushStartOption(target, props, responseState, formatContext);
              case "textarea":
                return pushStartTextArea(target, props, responseState);
              case "input":
                return pushInput(target, props, responseState);
              case "menuitem":
                return pushStartMenuItem(target, props, responseState);
              case "title":
                return pushStartTitle(target, props, responseState);
              case "listing":
              case "pre": {
                return pushStartPreformattedElement(target, props, type, responseState);
              }
              case "area":
              case "base":
              case "br":
              case "col":
              case "embed":
              case "hr":
              case "img":
              case "keygen":
              case "link":
              case "meta":
              case "param":
              case "source":
              case "track":
              case "wbr": {
                return pushSelfClosing(target, props, type, responseState);
              }
              case "annotation-xml":
              case "color-profile":
              case "font-face":
              case "font-face-src":
              case "font-face-uri":
              case "font-face-format":
              case "font-face-name":
              case "missing-glyph": {
                return pushStartGenericElement(target, props, type, responseState);
              }
              case "html": {
                if (formatContext.insertionMode === ROOT_HTML_MODE) {
                  target.push(DOCTYPE);
                }
                return pushStartGenericElement(target, props, type, responseState);
              }
              default: {
                if (type.indexOf("-") === -1 && typeof props.is !== "string") {
                  return pushStartGenericElement(target, props, type, responseState);
                } else {
                  return pushStartCustomElement(target, props, type, responseState);
                }
              }
            }
          }
          var endTag1 = stringToPrecomputedChunk("</");
          var endTag2 = stringToPrecomputedChunk(">");
          function pushEndInstance(target, type, props) {
            switch (type) {
              case "area":
              case "base":
              case "br":
              case "col":
              case "embed":
              case "hr":
              case "img":
              case "input":
              case "keygen":
              case "link":
              case "meta":
              case "param":
              case "source":
              case "track":
              case "wbr": {
                break;
              }
              default: {
                target.push(endTag1, stringToChunk(type), endTag2);
              }
            }
          }
          function writeCompletedRoot(destination, responseState) {
            var bootstrapChunks = responseState.bootstrapChunks;
            var i = 0;
            for (; i < bootstrapChunks.length - 1; i++) {
              writeChunk(destination, bootstrapChunks[i]);
            }
            if (i < bootstrapChunks.length) {
              return writeChunkAndReturn(destination, bootstrapChunks[i]);
            }
            return true;
          }
          var placeholder1 = stringToPrecomputedChunk('<template id="');
          var placeholder2 = stringToPrecomputedChunk('"></template>');
          function writePlaceholder(destination, responseState, id) {
            writeChunk(destination, placeholder1);
            writeChunk(destination, responseState.placeholderPrefix);
            var formattedID = stringToChunk(id.toString(16));
            writeChunk(destination, formattedID);
            return writeChunkAndReturn(destination, placeholder2);
          }
          var startCompletedSuspenseBoundary = stringToPrecomputedChunk("<!--$-->");
          var startPendingSuspenseBoundary1 = stringToPrecomputedChunk('<!--$?--><template id="');
          var startPendingSuspenseBoundary2 = stringToPrecomputedChunk('"></template>');
          var startClientRenderedSuspenseBoundary = stringToPrecomputedChunk("<!--$!-->");
          var endSuspenseBoundary = stringToPrecomputedChunk("<!--/$-->");
          var clientRenderedSuspenseBoundaryError1 = stringToPrecomputedChunk("<template");
          var clientRenderedSuspenseBoundaryErrorAttrInterstitial = stringToPrecomputedChunk('"');
          var clientRenderedSuspenseBoundaryError1A = stringToPrecomputedChunk(' data-dgst="');
          var clientRenderedSuspenseBoundaryError1B = stringToPrecomputedChunk(' data-msg="');
          var clientRenderedSuspenseBoundaryError1C = stringToPrecomputedChunk(' data-stck="');
          var clientRenderedSuspenseBoundaryError2 = stringToPrecomputedChunk("></template>");
          function writeStartCompletedSuspenseBoundary(destination, responseState) {
            return writeChunkAndReturn(destination, startCompletedSuspenseBoundary);
          }
          function writeStartPendingSuspenseBoundary(destination, responseState, id) {
            writeChunk(destination, startPendingSuspenseBoundary1);
            if (id === null) {
              throw new Error("An ID must have been assigned before we can complete the boundary.");
            }
            writeChunk(destination, id);
            return writeChunkAndReturn(destination, startPendingSuspenseBoundary2);
          }
          function writeStartClientRenderedSuspenseBoundary(destination, responseState, errorDigest, errorMesssage, errorComponentStack) {
            var result;
            result = writeChunkAndReturn(destination, startClientRenderedSuspenseBoundary);
            writeChunk(destination, clientRenderedSuspenseBoundaryError1);
            if (errorDigest) {
              writeChunk(destination, clientRenderedSuspenseBoundaryError1A);
              writeChunk(destination, stringToChunk(escapeTextForBrowser(errorDigest)));
              writeChunk(destination, clientRenderedSuspenseBoundaryErrorAttrInterstitial);
            }
            {
              if (errorMesssage) {
                writeChunk(destination, clientRenderedSuspenseBoundaryError1B);
                writeChunk(destination, stringToChunk(escapeTextForBrowser(errorMesssage)));
                writeChunk(destination, clientRenderedSuspenseBoundaryErrorAttrInterstitial);
              }
              if (errorComponentStack) {
                writeChunk(destination, clientRenderedSuspenseBoundaryError1C);
                writeChunk(destination, stringToChunk(escapeTextForBrowser(errorComponentStack)));
                writeChunk(destination, clientRenderedSuspenseBoundaryErrorAttrInterstitial);
              }
            }
            result = writeChunkAndReturn(destination, clientRenderedSuspenseBoundaryError2);
            return result;
          }
          function writeEndCompletedSuspenseBoundary(destination, responseState) {
            return writeChunkAndReturn(destination, endSuspenseBoundary);
          }
          function writeEndPendingSuspenseBoundary(destination, responseState) {
            return writeChunkAndReturn(destination, endSuspenseBoundary);
          }
          function writeEndClientRenderedSuspenseBoundary(destination, responseState) {
            return writeChunkAndReturn(destination, endSuspenseBoundary);
          }
          var startSegmentHTML = stringToPrecomputedChunk('<div hidden id="');
          var startSegmentHTML2 = stringToPrecomputedChunk('">');
          var endSegmentHTML = stringToPrecomputedChunk("</div>");
          var startSegmentSVG = stringToPrecomputedChunk('<svg aria-hidden="true" style="display:none" id="');
          var startSegmentSVG2 = stringToPrecomputedChunk('">');
          var endSegmentSVG = stringToPrecomputedChunk("</svg>");
          var startSegmentMathML = stringToPrecomputedChunk('<math aria-hidden="true" style="display:none" id="');
          var startSegmentMathML2 = stringToPrecomputedChunk('">');
          var endSegmentMathML = stringToPrecomputedChunk("</math>");
          var startSegmentTable = stringToPrecomputedChunk('<table hidden id="');
          var startSegmentTable2 = stringToPrecomputedChunk('">');
          var endSegmentTable = stringToPrecomputedChunk("</table>");
          var startSegmentTableBody = stringToPrecomputedChunk('<table hidden><tbody id="');
          var startSegmentTableBody2 = stringToPrecomputedChunk('">');
          var endSegmentTableBody = stringToPrecomputedChunk("</tbody></table>");
          var startSegmentTableRow = stringToPrecomputedChunk('<table hidden><tr id="');
          var startSegmentTableRow2 = stringToPrecomputedChunk('">');
          var endSegmentTableRow = stringToPrecomputedChunk("</tr></table>");
          var startSegmentColGroup = stringToPrecomputedChunk('<table hidden><colgroup id="');
          var startSegmentColGroup2 = stringToPrecomputedChunk('">');
          var endSegmentColGroup = stringToPrecomputedChunk("</colgroup></table>");
          function writeStartSegment(destination, responseState, formatContext, id) {
            switch (formatContext.insertionMode) {
              case ROOT_HTML_MODE:
              case HTML_MODE: {
                writeChunk(destination, startSegmentHTML);
                writeChunk(destination, responseState.segmentPrefix);
                writeChunk(destination, stringToChunk(id.toString(16)));
                return writeChunkAndReturn(destination, startSegmentHTML2);
              }
              case SVG_MODE: {
                writeChunk(destination, startSegmentSVG);
                writeChunk(destination, responseState.segmentPrefix);
                writeChunk(destination, stringToChunk(id.toString(16)));
                return writeChunkAndReturn(destination, startSegmentSVG2);
              }
              case MATHML_MODE: {
                writeChunk(destination, startSegmentMathML);
                writeChunk(destination, responseState.segmentPrefix);
                writeChunk(destination, stringToChunk(id.toString(16)));
                return writeChunkAndReturn(destination, startSegmentMathML2);
              }
              case HTML_TABLE_MODE: {
                writeChunk(destination, startSegmentTable);
                writeChunk(destination, responseState.segmentPrefix);
                writeChunk(destination, stringToChunk(id.toString(16)));
                return writeChunkAndReturn(destination, startSegmentTable2);
              }
              case HTML_TABLE_BODY_MODE: {
                writeChunk(destination, startSegmentTableBody);
                writeChunk(destination, responseState.segmentPrefix);
                writeChunk(destination, stringToChunk(id.toString(16)));
                return writeChunkAndReturn(destination, startSegmentTableBody2);
              }
              case HTML_TABLE_ROW_MODE: {
                writeChunk(destination, startSegmentTableRow);
                writeChunk(destination, responseState.segmentPrefix);
                writeChunk(destination, stringToChunk(id.toString(16)));
                return writeChunkAndReturn(destination, startSegmentTableRow2);
              }
              case HTML_COLGROUP_MODE: {
                writeChunk(destination, startSegmentColGroup);
                writeChunk(destination, responseState.segmentPrefix);
                writeChunk(destination, stringToChunk(id.toString(16)));
                return writeChunkAndReturn(destination, startSegmentColGroup2);
              }
              default: {
                throw new Error("Unknown insertion mode. This is a bug in React.");
              }
            }
          }
          function writeEndSegment(destination, formatContext) {
            switch (formatContext.insertionMode) {
              case ROOT_HTML_MODE:
              case HTML_MODE: {
                return writeChunkAndReturn(destination, endSegmentHTML);
              }
              case SVG_MODE: {
                return writeChunkAndReturn(destination, endSegmentSVG);
              }
              case MATHML_MODE: {
                return writeChunkAndReturn(destination, endSegmentMathML);
              }
              case HTML_TABLE_MODE: {
                return writeChunkAndReturn(destination, endSegmentTable);
              }
              case HTML_TABLE_BODY_MODE: {
                return writeChunkAndReturn(destination, endSegmentTableBody);
              }
              case HTML_TABLE_ROW_MODE: {
                return writeChunkAndReturn(destination, endSegmentTableRow);
              }
              case HTML_COLGROUP_MODE: {
                return writeChunkAndReturn(destination, endSegmentColGroup);
              }
              default: {
                throw new Error("Unknown insertion mode. This is a bug in React.");
              }
            }
          }
          var completeSegmentFunction = "function $RS(a,b){a=document.getElementById(a);b=document.getElementById(b);for(a.parentNode.removeChild(a);a.firstChild;)b.parentNode.insertBefore(a.firstChild,b);b.parentNode.removeChild(b)}";
          var completeBoundaryFunction = 'function $RC(a,b){a=document.getElementById(a);b=document.getElementById(b);b.parentNode.removeChild(b);if(a){a=a.previousSibling;var f=a.parentNode,c=a.nextSibling,e=0;do{if(c&&8===c.nodeType){var d=c.data;if("/$"===d)if(0===e)break;else e--;else"$"!==d&&"$?"!==d&&"$!"!==d||e++}d=c.nextSibling;f.removeChild(c);c=d}while(c);for(;b.firstChild;)f.insertBefore(b.firstChild,c);a.data="$";a._reactRetry&&a._reactRetry()}}';
          var clientRenderFunction = 'function $RX(b,c,d,e){var a=document.getElementById(b);a&&(b=a.previousSibling,b.data="$!",a=a.dataset,c&&(a.dgst=c),d&&(a.msg=d),e&&(a.stck=e),b._reactRetry&&b._reactRetry())}';
          var completeSegmentScript1Full = stringToPrecomputedChunk(completeSegmentFunction + ';$RS("');
          var completeSegmentScript1Partial = stringToPrecomputedChunk('$RS("');
          var completeSegmentScript2 = stringToPrecomputedChunk('","');
          var completeSegmentScript3 = stringToPrecomputedChunk('")<\/script>');
          function writeCompletedSegmentInstruction(destination, responseState, contentSegmentID) {
            writeChunk(destination, responseState.startInlineScript);
            if (!responseState.sentCompleteSegmentFunction) {
              responseState.sentCompleteSegmentFunction = true;
              writeChunk(destination, completeSegmentScript1Full);
            } else {
              writeChunk(destination, completeSegmentScript1Partial);
            }
            writeChunk(destination, responseState.segmentPrefix);
            var formattedID = stringToChunk(contentSegmentID.toString(16));
            writeChunk(destination, formattedID);
            writeChunk(destination, completeSegmentScript2);
            writeChunk(destination, responseState.placeholderPrefix);
            writeChunk(destination, formattedID);
            return writeChunkAndReturn(destination, completeSegmentScript3);
          }
          var completeBoundaryScript1Full = stringToPrecomputedChunk(completeBoundaryFunction + ';$RC("');
          var completeBoundaryScript1Partial = stringToPrecomputedChunk('$RC("');
          var completeBoundaryScript2 = stringToPrecomputedChunk('","');
          var completeBoundaryScript3 = stringToPrecomputedChunk('")<\/script>');
          function writeCompletedBoundaryInstruction(destination, responseState, boundaryID, contentSegmentID) {
            writeChunk(destination, responseState.startInlineScript);
            if (!responseState.sentCompleteBoundaryFunction) {
              responseState.sentCompleteBoundaryFunction = true;
              writeChunk(destination, completeBoundaryScript1Full);
            } else {
              writeChunk(destination, completeBoundaryScript1Partial);
            }
            if (boundaryID === null) {
              throw new Error("An ID must have been assigned before we can complete the boundary.");
            }
            var formattedContentID = stringToChunk(contentSegmentID.toString(16));
            writeChunk(destination, boundaryID);
            writeChunk(destination, completeBoundaryScript2);
            writeChunk(destination, responseState.segmentPrefix);
            writeChunk(destination, formattedContentID);
            return writeChunkAndReturn(destination, completeBoundaryScript3);
          }
          var clientRenderScript1Full = stringToPrecomputedChunk(clientRenderFunction + ';$RX("');
          var clientRenderScript1Partial = stringToPrecomputedChunk('$RX("');
          var clientRenderScript1A = stringToPrecomputedChunk('"');
          var clientRenderScript2 = stringToPrecomputedChunk(")<\/script>");
          var clientRenderErrorScriptArgInterstitial = stringToPrecomputedChunk(",");
          function writeClientRenderBoundaryInstruction(destination, responseState, boundaryID, errorDigest, errorMessage, errorComponentStack) {
            writeChunk(destination, responseState.startInlineScript);
            if (!responseState.sentClientRenderFunction) {
              responseState.sentClientRenderFunction = true;
              writeChunk(destination, clientRenderScript1Full);
            } else {
              writeChunk(destination, clientRenderScript1Partial);
            }
            if (boundaryID === null) {
              throw new Error("An ID must have been assigned before we can complete the boundary.");
            }
            writeChunk(destination, boundaryID);
            writeChunk(destination, clientRenderScript1A);
            if (errorDigest || errorMessage || errorComponentStack) {
              writeChunk(destination, clientRenderErrorScriptArgInterstitial);
              writeChunk(destination, stringToChunk(escapeJSStringsForInstructionScripts(errorDigest || "")));
            }
            if (errorMessage || errorComponentStack) {
              writeChunk(destination, clientRenderErrorScriptArgInterstitial);
              writeChunk(destination, stringToChunk(escapeJSStringsForInstructionScripts(errorMessage || "")));
            }
            if (errorComponentStack) {
              writeChunk(destination, clientRenderErrorScriptArgInterstitial);
              writeChunk(destination, stringToChunk(escapeJSStringsForInstructionScripts(errorComponentStack)));
            }
            return writeChunkAndReturn(destination, clientRenderScript2);
          }
          var regexForJSStringsInScripts = /[<\u2028\u2029]/g;
          function escapeJSStringsForInstructionScripts(input) {
            var escaped = JSON.stringify(input);
            return escaped.replace(regexForJSStringsInScripts, function(match) {
              switch (match) {
                case "<":
                  return "\\u003c";
                case "\u2028":
                  return "\\u2028";
                case "\u2029":
                  return "\\u2029";
                default: {
                  throw new Error("escapeJSStringsForInstructionScripts encountered a match it does not know how to replace. this means the match regex and the replacement characters are no longer in sync. This is a bug in React");
                }
              }
            });
          }
          var assign = Object.assign;
          var REACT_ELEMENT_TYPE = Symbol.for("react.element");
          var REACT_PORTAL_TYPE = Symbol.for("react.portal");
          var REACT_FRAGMENT_TYPE = Symbol.for("react.fragment");
          var REACT_STRICT_MODE_TYPE = Symbol.for("react.strict_mode");
          var REACT_PROFILER_TYPE = Symbol.for("react.profiler");
          var REACT_PROVIDER_TYPE = Symbol.for("react.provider");
          var REACT_CONTEXT_TYPE = Symbol.for("react.context");
          var REACT_FORWARD_REF_TYPE = Symbol.for("react.forward_ref");
          var REACT_SUSPENSE_TYPE = Symbol.for("react.suspense");
          var REACT_SUSPENSE_LIST_TYPE = Symbol.for("react.suspense_list");
          var REACT_MEMO_TYPE = Symbol.for("react.memo");
          var REACT_LAZY_TYPE = Symbol.for("react.lazy");
          var REACT_SCOPE_TYPE = Symbol.for("react.scope");
          var REACT_DEBUG_TRACING_MODE_TYPE = Symbol.for("react.debug_trace_mode");
          var REACT_LEGACY_HIDDEN_TYPE = Symbol.for("react.legacy_hidden");
          var REACT_SERVER_CONTEXT_DEFAULT_VALUE_NOT_LOADED = Symbol.for("react.default_value");
          var MAYBE_ITERATOR_SYMBOL = Symbol.iterator;
          var FAUX_ITERATOR_SYMBOL = "@@iterator";
          function getIteratorFn(maybeIterable) {
            if (maybeIterable === null || typeof maybeIterable !== "object") {
              return null;
            }
            var maybeIterator = MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL];
            if (typeof maybeIterator === "function") {
              return maybeIterator;
            }
            return null;
          }
          function getWrappedName(outerType, innerType, wrapperName) {
            var displayName = outerType.displayName;
            if (displayName) {
              return displayName;
            }
            var functionName = innerType.displayName || innerType.name || "";
            return functionName !== "" ? wrapperName + "(" + functionName + ")" : wrapperName;
          }
          function getContextName(type) {
            return type.displayName || "Context";
          }
          function getComponentNameFromType(type) {
            if (type == null) {
              return null;
            }
            {
              if (typeof type.tag === "number") {
                error("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue.");
              }
            }
            if (typeof type === "function") {
              return type.displayName || type.name || null;
            }
            if (typeof type === "string") {
              return type;
            }
            switch (type) {
              case REACT_FRAGMENT_TYPE:
                return "Fragment";
              case REACT_PORTAL_TYPE:
                return "Portal";
              case REACT_PROFILER_TYPE:
                return "Profiler";
              case REACT_STRICT_MODE_TYPE:
                return "StrictMode";
              case REACT_SUSPENSE_TYPE:
                return "Suspense";
              case REACT_SUSPENSE_LIST_TYPE:
                return "SuspenseList";
            }
            if (typeof type === "object") {
              switch (type.$$typeof) {
                case REACT_CONTEXT_TYPE:
                  var context = type;
                  return getContextName(context) + ".Consumer";
                case REACT_PROVIDER_TYPE:
                  var provider = type;
                  return getContextName(provider._context) + ".Provider";
                case REACT_FORWARD_REF_TYPE:
                  return getWrappedName(type, type.render, "ForwardRef");
                case REACT_MEMO_TYPE:
                  var outerName = type.displayName || null;
                  if (outerName !== null) {
                    return outerName;
                  }
                  return getComponentNameFromType(type.type) || "Memo";
                case REACT_LAZY_TYPE: {
                  var lazyComponent = type;
                  var payload = lazyComponent._payload;
                  var init = lazyComponent._init;
                  try {
                    return getComponentNameFromType(init(payload));
                  } catch (x) {
                    return null;
                  }
                }
              }
            }
            return null;
          }
          var disabledDepth = 0;
          var prevLog;
          var prevInfo;
          var prevWarn;
          var prevError;
          var prevGroup;
          var prevGroupCollapsed;
          var prevGroupEnd;
          function disabledLog() {
          }
          disabledLog.__reactDisabledLog = true;
          function disableLogs() {
            {
              if (disabledDepth === 0) {
                prevLog = console.log;
                prevInfo = console.info;
                prevWarn = console.warn;
                prevError = console.error;
                prevGroup = console.group;
                prevGroupCollapsed = console.groupCollapsed;
                prevGroupEnd = console.groupEnd;
                var props = {
                  configurable: true,
                  enumerable: true,
                  value: disabledLog,
                  writable: true
                };
                Object.defineProperties(console, {
                  info: props,
                  log: props,
                  warn: props,
                  error: props,
                  group: props,
                  groupCollapsed: props,
                  groupEnd: props
                });
              }
              disabledDepth++;
            }
          }
          function reenableLogs() {
            {
              disabledDepth--;
              if (disabledDepth === 0) {
                var props = {
                  configurable: true,
                  enumerable: true,
                  writable: true
                };
                Object.defineProperties(console, {
                  log: assign({}, props, {
                    value: prevLog
                  }),
                  info: assign({}, props, {
                    value: prevInfo
                  }),
                  warn: assign({}, props, {
                    value: prevWarn
                  }),
                  error: assign({}, props, {
                    value: prevError
                  }),
                  group: assign({}, props, {
                    value: prevGroup
                  }),
                  groupCollapsed: assign({}, props, {
                    value: prevGroupCollapsed
                  }),
                  groupEnd: assign({}, props, {
                    value: prevGroupEnd
                  })
                });
              }
              if (disabledDepth < 0) {
                error("disabledDepth fell below zero. This is a bug in React. Please file an issue.");
              }
            }
          }
          var ReactCurrentDispatcher = ReactSharedInternals.ReactCurrentDispatcher;
          var prefix;
          function describeBuiltInComponentFrame(name, source, ownerFn) {
            {
              if (prefix === void 0) {
                try {
                  throw Error();
                } catch (x) {
                  var match = x.stack.trim().match(/\n( *(at )?)/);
                  prefix = match && match[1] || "";
                }
              }
              return "\n" + prefix + name;
            }
          }
          var reentry = false;
          var componentFrameCache;
          {
            var PossiblyWeakMap = typeof WeakMap === "function" ? WeakMap : Map;
            componentFrameCache = new PossiblyWeakMap();
          }
          function describeNativeComponentFrame(fn, construct) {
            if (!fn || reentry) {
              return "";
            }
            {
              var frame = componentFrameCache.get(fn);
              if (frame !== void 0) {
                return frame;
              }
            }
            var control;
            reentry = true;
            var previousPrepareStackTrace = Error.prepareStackTrace;
            Error.prepareStackTrace = void 0;
            var previousDispatcher;
            {
              previousDispatcher = ReactCurrentDispatcher.current;
              ReactCurrentDispatcher.current = null;
              disableLogs();
            }
            try {
              if (construct) {
                var Fake = function() {
                  throw Error();
                };
                Object.defineProperty(Fake.prototype, "props", {
                  set: function() {
                    throw Error();
                  }
                });
                if (typeof Reflect === "object" && Reflect.construct) {
                  try {
                    Reflect.construct(Fake, []);
                  } catch (x) {
                    control = x;
                  }
                  Reflect.construct(fn, [], Fake);
                } else {
                  try {
                    Fake.call();
                  } catch (x) {
                    control = x;
                  }
                  fn.call(Fake.prototype);
                }
              } else {
                try {
                  throw Error();
                } catch (x) {
                  control = x;
                }
                fn();
              }
            } catch (sample) {
              if (sample && control && typeof sample.stack === "string") {
                var sampleLines = sample.stack.split("\n");
                var controlLines = control.stack.split("\n");
                var s = sampleLines.length - 1;
                var c = controlLines.length - 1;
                while (s >= 1 && c >= 0 && sampleLines[s] !== controlLines[c]) {
                  c--;
                }
                for (; s >= 1 && c >= 0; s--, c--) {
                  if (sampleLines[s] !== controlLines[c]) {
                    if (s !== 1 || c !== 1) {
                      do {
                        s--;
                        c--;
                        if (c < 0 || sampleLines[s] !== controlLines[c]) {
                          var _frame = "\n" + sampleLines[s].replace(" at new ", " at ");
                          if (fn.displayName && _frame.includes("<anonymous>")) {
                            _frame = _frame.replace("<anonymous>", fn.displayName);
                          }
                          {
                            if (typeof fn === "function") {
                              componentFrameCache.set(fn, _frame);
                            }
                          }
                          return _frame;
                        }
                      } while (s >= 1 && c >= 0);
                    }
                    break;
                  }
                }
              }
            } finally {
              reentry = false;
              {
                ReactCurrentDispatcher.current = previousDispatcher;
                reenableLogs();
              }
              Error.prepareStackTrace = previousPrepareStackTrace;
            }
            var name = fn ? fn.displayName || fn.name : "";
            var syntheticFrame = name ? describeBuiltInComponentFrame(name) : "";
            {
              if (typeof fn === "function") {
                componentFrameCache.set(fn, syntheticFrame);
              }
            }
            return syntheticFrame;
          }
          function describeClassComponentFrame(ctor, source, ownerFn) {
            {
              return describeNativeComponentFrame(ctor, true);
            }
          }
          function describeFunctionComponentFrame(fn, source, ownerFn) {
            {
              return describeNativeComponentFrame(fn, false);
            }
          }
          function shouldConstruct(Component) {
            var prototype3 = Component.prototype;
            return !!(prototype3 && prototype3.isReactComponent);
          }
          function describeUnknownElementTypeFrameInDEV(type, source, ownerFn) {
            if (type == null) {
              return "";
            }
            if (typeof type === "function") {
              {
                return describeNativeComponentFrame(type, shouldConstruct(type));
              }
            }
            if (typeof type === "string") {
              return describeBuiltInComponentFrame(type);
            }
            switch (type) {
              case REACT_SUSPENSE_TYPE:
                return describeBuiltInComponentFrame("Suspense");
              case REACT_SUSPENSE_LIST_TYPE:
                return describeBuiltInComponentFrame("SuspenseList");
            }
            if (typeof type === "object") {
              switch (type.$$typeof) {
                case REACT_FORWARD_REF_TYPE:
                  return describeFunctionComponentFrame(type.render);
                case REACT_MEMO_TYPE:
                  return describeUnknownElementTypeFrameInDEV(type.type, source, ownerFn);
                case REACT_LAZY_TYPE: {
                  var lazyComponent = type;
                  var payload = lazyComponent._payload;
                  var init = lazyComponent._init;
                  try {
                    return describeUnknownElementTypeFrameInDEV(init(payload), source, ownerFn);
                  } catch (x) {
                  }
                }
              }
            }
            return "";
          }
          var loggedTypeFailures = {};
          var ReactDebugCurrentFrame = ReactSharedInternals.ReactDebugCurrentFrame;
          function setCurrentlyValidatingElement(element) {
            {
              if (element) {
                var owner = element._owner;
                var stack = describeUnknownElementTypeFrameInDEV(element.type, element._source, owner ? owner.type : null);
                ReactDebugCurrentFrame.setExtraStackFrame(stack);
              } else {
                ReactDebugCurrentFrame.setExtraStackFrame(null);
              }
            }
          }
          function checkPropTypes(typeSpecs, values, location, componentName, element) {
            {
              var has = Function.call.bind(hasOwnProperty2);
              for (var typeSpecName in typeSpecs) {
                if (has(typeSpecs, typeSpecName)) {
                  var error$1 = void 0;
                  try {
                    if (typeof typeSpecs[typeSpecName] !== "function") {
                      var err = Error((componentName || "React class") + ": " + location + " type `" + typeSpecName + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + typeof typeSpecs[typeSpecName] + "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.");
                      err.name = "Invariant Violation";
                      throw err;
                    }
                    error$1 = typeSpecs[typeSpecName](values, typeSpecName, componentName, location, null, "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED");
                  } catch (ex) {
                    error$1 = ex;
                  }
                  if (error$1 && !(error$1 instanceof Error)) {
                    setCurrentlyValidatingElement(element);
                    error("%s: type specification of %s `%s` is invalid; the type checker function must return `null` or an `Error` but returned a %s. You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).", componentName || "React class", location, typeSpecName, typeof error$1);
                    setCurrentlyValidatingElement(null);
                  }
                  if (error$1 instanceof Error && !(error$1.message in loggedTypeFailures)) {
                    loggedTypeFailures[error$1.message] = true;
                    setCurrentlyValidatingElement(element);
                    error("Failed %s type: %s", location, error$1.message);
                    setCurrentlyValidatingElement(null);
                  }
                }
              }
            }
          }
          var warnedAboutMissingGetChildContext;
          {
            warnedAboutMissingGetChildContext = {};
          }
          var emptyContextObject = {};
          {
            Object.freeze(emptyContextObject);
          }
          function getMaskedContext(type, unmaskedContext) {
            {
              var contextTypes = type.contextTypes;
              if (!contextTypes) {
                return emptyContextObject;
              }
              var context = {};
              for (var key in contextTypes) {
                context[key] = unmaskedContext[key];
              }
              {
                var name = getComponentNameFromType(type) || "Unknown";
                checkPropTypes(contextTypes, context, "context", name);
              }
              return context;
            }
          }
          function processChildContext(instance2, type, parentContext, childContextTypes) {
            {
              if (typeof instance2.getChildContext !== "function") {
                {
                  var componentName = getComponentNameFromType(type) || "Unknown";
                  if (!warnedAboutMissingGetChildContext[componentName]) {
                    warnedAboutMissingGetChildContext[componentName] = true;
                    error("%s.childContextTypes is specified but there is no getChildContext() method on the instance. You can either define getChildContext() on %s or remove childContextTypes from it.", componentName, componentName);
                  }
                }
                return parentContext;
              }
              var childContext = instance2.getChildContext();
              for (var contextKey in childContext) {
                if (!(contextKey in childContextTypes)) {
                  throw new Error((getComponentNameFromType(type) || "Unknown") + '.getChildContext(): key "' + contextKey + '" is not defined in childContextTypes.');
                }
              }
              {
                var name = getComponentNameFromType(type) || "Unknown";
                checkPropTypes(childContextTypes, childContext, "child context", name);
              }
              return assign({}, parentContext, childContext);
            }
          }
          var rendererSigil;
          {
            rendererSigil = {};
          }
          var rootContextSnapshot = null;
          var currentActiveSnapshot = null;
          function popNode(prev) {
            {
              prev.context._currentValue = prev.parentValue;
            }
          }
          function pushNode(next) {
            {
              next.context._currentValue = next.value;
            }
          }
          function popToNearestCommonAncestor(prev, next) {
            if (prev === next)
              ;
            else {
              popNode(prev);
              var parentPrev = prev.parent;
              var parentNext = next.parent;
              if (parentPrev === null) {
                if (parentNext !== null) {
                  throw new Error("The stacks must reach the root at the same time. This is a bug in React.");
                }
              } else {
                if (parentNext === null) {
                  throw new Error("The stacks must reach the root at the same time. This is a bug in React.");
                }
                popToNearestCommonAncestor(parentPrev, parentNext);
              }
              pushNode(next);
            }
          }
          function popAllPrevious(prev) {
            popNode(prev);
            var parentPrev = prev.parent;
            if (parentPrev !== null) {
              popAllPrevious(parentPrev);
            }
          }
          function pushAllNext(next) {
            var parentNext = next.parent;
            if (parentNext !== null) {
              pushAllNext(parentNext);
            }
            pushNode(next);
          }
          function popPreviousToCommonLevel(prev, next) {
            popNode(prev);
            var parentPrev = prev.parent;
            if (parentPrev === null) {
              throw new Error("The depth must equal at least at zero before reaching the root. This is a bug in React.");
            }
            if (parentPrev.depth === next.depth) {
              popToNearestCommonAncestor(parentPrev, next);
            } else {
              popPreviousToCommonLevel(parentPrev, next);
            }
          }
          function popNextToCommonLevel(prev, next) {
            var parentNext = next.parent;
            if (parentNext === null) {
              throw new Error("The depth must equal at least at zero before reaching the root. This is a bug in React.");
            }
            if (prev.depth === parentNext.depth) {
              popToNearestCommonAncestor(prev, parentNext);
            } else {
              popNextToCommonLevel(prev, parentNext);
            }
            pushNode(next);
          }
          function switchContext(newSnapshot) {
            var prev = currentActiveSnapshot;
            var next = newSnapshot;
            if (prev !== next) {
              if (prev === null) {
                pushAllNext(next);
              } else if (next === null) {
                popAllPrevious(prev);
              } else if (prev.depth === next.depth) {
                popToNearestCommonAncestor(prev, next);
              } else if (prev.depth > next.depth) {
                popPreviousToCommonLevel(prev, next);
              } else {
                popNextToCommonLevel(prev, next);
              }
              currentActiveSnapshot = next;
            }
          }
          function pushProvider(context, nextValue) {
            var prevValue;
            {
              prevValue = context._currentValue;
              context._currentValue = nextValue;
              {
                if (context._currentRenderer !== void 0 && context._currentRenderer !== null && context._currentRenderer !== rendererSigil) {
                  error("Detected multiple renderers concurrently rendering the same context provider. This is currently unsupported.");
                }
                context._currentRenderer = rendererSigil;
              }
            }
            var prevNode = currentActiveSnapshot;
            var newNode = {
              parent: prevNode,
              depth: prevNode === null ? 0 : prevNode.depth + 1,
              context,
              parentValue: prevValue,
              value: nextValue
            };
            currentActiveSnapshot = newNode;
            return newNode;
          }
          function popProvider(context) {
            var prevSnapshot = currentActiveSnapshot;
            if (prevSnapshot === null) {
              throw new Error("Tried to pop a Context at the root of the app. This is a bug in React.");
            }
            {
              if (prevSnapshot.context !== context) {
                error("The parent context is not the expected context. This is probably a bug in React.");
              }
            }
            {
              var value = prevSnapshot.parentValue;
              if (value === REACT_SERVER_CONTEXT_DEFAULT_VALUE_NOT_LOADED) {
                prevSnapshot.context._currentValue = prevSnapshot.context._defaultValue;
              } else {
                prevSnapshot.context._currentValue = value;
              }
              {
                if (context._currentRenderer !== void 0 && context._currentRenderer !== null && context._currentRenderer !== rendererSigil) {
                  error("Detected multiple renderers concurrently rendering the same context provider. This is currently unsupported.");
                }
                context._currentRenderer = rendererSigil;
              }
            }
            return currentActiveSnapshot = prevSnapshot.parent;
          }
          function getActiveContext() {
            return currentActiveSnapshot;
          }
          function readContext(context) {
            var value = context._currentValue;
            return value;
          }
          function get(key) {
            return key._reactInternals;
          }
          function set(key, value) {
            key._reactInternals = value;
          }
          var didWarnAboutNoopUpdateForComponent = {};
          var didWarnAboutDeprecatedWillMount = {};
          var didWarnAboutUninitializedState;
          var didWarnAboutGetSnapshotBeforeUpdateWithoutDidUpdate;
          var didWarnAboutLegacyLifecyclesAndDerivedState;
          var didWarnAboutUndefinedDerivedState;
          var warnOnUndefinedDerivedState;
          var warnOnInvalidCallback;
          var didWarnAboutDirectlyAssigningPropsToState;
          var didWarnAboutContextTypeAndContextTypes;
          var didWarnAboutInvalidateContextType;
          {
            didWarnAboutUninitializedState = /* @__PURE__ */ new Set();
            didWarnAboutGetSnapshotBeforeUpdateWithoutDidUpdate = /* @__PURE__ */ new Set();
            didWarnAboutLegacyLifecyclesAndDerivedState = /* @__PURE__ */ new Set();
            didWarnAboutDirectlyAssigningPropsToState = /* @__PURE__ */ new Set();
            didWarnAboutUndefinedDerivedState = /* @__PURE__ */ new Set();
            didWarnAboutContextTypeAndContextTypes = /* @__PURE__ */ new Set();
            didWarnAboutInvalidateContextType = /* @__PURE__ */ new Set();
            var didWarnOnInvalidCallback = /* @__PURE__ */ new Set();
            warnOnInvalidCallback = function(callback, callerName) {
              if (callback === null || typeof callback === "function") {
                return;
              }
              var key = callerName + "_" + callback;
              if (!didWarnOnInvalidCallback.has(key)) {
                didWarnOnInvalidCallback.add(key);
                error("%s(...): Expected the last optional `callback` argument to be a function. Instead received: %s.", callerName, callback);
              }
            };
            warnOnUndefinedDerivedState = function(type, partialState) {
              if (partialState === void 0) {
                var componentName = getComponentNameFromType(type) || "Component";
                if (!didWarnAboutUndefinedDerivedState.has(componentName)) {
                  didWarnAboutUndefinedDerivedState.add(componentName);
                  error("%s.getDerivedStateFromProps(): A valid state object (or null) must be returned. You have returned undefined.", componentName);
                }
              }
            };
          }
          function warnNoop(publicInstance, callerName) {
            {
              var _constructor = publicInstance.constructor;
              var componentName = _constructor && getComponentNameFromType(_constructor) || "ReactClass";
              var warningKey = componentName + "." + callerName;
              if (didWarnAboutNoopUpdateForComponent[warningKey]) {
                return;
              }
              error("%s(...): Can only update a mounting component. This usually means you called %s() outside componentWillMount() on the server. This is a no-op.\n\nPlease check the code for the %s component.", callerName, callerName, componentName);
              didWarnAboutNoopUpdateForComponent[warningKey] = true;
            }
          }
          var classComponentUpdater = {
            isMounted: function(inst) {
              return false;
            },
            enqueueSetState: function(inst, payload, callback) {
              var internals = get(inst);
              if (internals.queue === null) {
                warnNoop(inst, "setState");
              } else {
                internals.queue.push(payload);
                {
                  if (callback !== void 0 && callback !== null) {
                    warnOnInvalidCallback(callback, "setState");
                  }
                }
              }
            },
            enqueueReplaceState: function(inst, payload, callback) {
              var internals = get(inst);
              internals.replace = true;
              internals.queue = [payload];
              {
                if (callback !== void 0 && callback !== null) {
                  warnOnInvalidCallback(callback, "setState");
                }
              }
            },
            enqueueForceUpdate: function(inst, callback) {
              var internals = get(inst);
              if (internals.queue === null) {
                warnNoop(inst, "forceUpdate");
              } else {
                {
                  if (callback !== void 0 && callback !== null) {
                    warnOnInvalidCallback(callback, "setState");
                  }
                }
              }
            }
          };
          function applyDerivedStateFromProps(instance2, ctor, getDerivedStateFromProps, prevState, nextProps) {
            var partialState = getDerivedStateFromProps(nextProps, prevState);
            {
              warnOnUndefinedDerivedState(ctor, partialState);
            }
            var newState = partialState === null || partialState === void 0 ? prevState : assign({}, prevState, partialState);
            return newState;
          }
          function constructClassInstance(ctor, props, maskedLegacyContext) {
            var context = emptyContextObject;
            var contextType = ctor.contextType;
            {
              if ("contextType" in ctor) {
                var isValid = (
                  // Allow null for conditional declaration
                  contextType === null || contextType !== void 0 && contextType.$$typeof === REACT_CONTEXT_TYPE && contextType._context === void 0
                );
                if (!isValid && !didWarnAboutInvalidateContextType.has(ctor)) {
                  didWarnAboutInvalidateContextType.add(ctor);
                  var addendum = "";
                  if (contextType === void 0) {
                    addendum = " However, it is set to undefined. This can be caused by a typo or by mixing up named and default imports. This can also happen due to a circular dependency, so try moving the createContext() call to a separate file.";
                  } else if (typeof contextType !== "object") {
                    addendum = " However, it is set to a " + typeof contextType + ".";
                  } else if (contextType.$$typeof === REACT_PROVIDER_TYPE) {
                    addendum = " Did you accidentally pass the Context.Provider instead?";
                  } else if (contextType._context !== void 0) {
                    addendum = " Did you accidentally pass the Context.Consumer instead?";
                  } else {
                    addendum = " However, it is set to an object with keys {" + Object.keys(contextType).join(", ") + "}.";
                  }
                  error("%s defines an invalid contextType. contextType should point to the Context object returned by React.createContext().%s", getComponentNameFromType(ctor) || "Component", addendum);
                }
              }
            }
            if (typeof contextType === "object" && contextType !== null) {
              context = readContext(contextType);
            } else {
              context = maskedLegacyContext;
            }
            var instance2 = new ctor(props, context);
            {
              if (typeof ctor.getDerivedStateFromProps === "function" && (instance2.state === null || instance2.state === void 0)) {
                var componentName = getComponentNameFromType(ctor) || "Component";
                if (!didWarnAboutUninitializedState.has(componentName)) {
                  didWarnAboutUninitializedState.add(componentName);
                  error("`%s` uses `getDerivedStateFromProps` but its initial state is %s. This is not recommended. Instead, define the initial state by assigning an object to `this.state` in the constructor of `%s`. This ensures that `getDerivedStateFromProps` arguments have a consistent shape.", componentName, instance2.state === null ? "null" : "undefined", componentName);
                }
              }
              if (typeof ctor.getDerivedStateFromProps === "function" || typeof instance2.getSnapshotBeforeUpdate === "function") {
                var foundWillMountName = null;
                var foundWillReceivePropsName = null;
                var foundWillUpdateName = null;
                if (typeof instance2.componentWillMount === "function" && instance2.componentWillMount.__suppressDeprecationWarning !== true) {
                  foundWillMountName = "componentWillMount";
                } else if (typeof instance2.UNSAFE_componentWillMount === "function") {
                  foundWillMountName = "UNSAFE_componentWillMount";
                }
                if (typeof instance2.componentWillReceiveProps === "function" && instance2.componentWillReceiveProps.__suppressDeprecationWarning !== true) {
                  foundWillReceivePropsName = "componentWillReceiveProps";
                } else if (typeof instance2.UNSAFE_componentWillReceiveProps === "function") {
                  foundWillReceivePropsName = "UNSAFE_componentWillReceiveProps";
                }
                if (typeof instance2.componentWillUpdate === "function" && instance2.componentWillUpdate.__suppressDeprecationWarning !== true) {
                  foundWillUpdateName = "componentWillUpdate";
                } else if (typeof instance2.UNSAFE_componentWillUpdate === "function") {
                  foundWillUpdateName = "UNSAFE_componentWillUpdate";
                }
                if (foundWillMountName !== null || foundWillReceivePropsName !== null || foundWillUpdateName !== null) {
                  var _componentName = getComponentNameFromType(ctor) || "Component";
                  var newApiName = typeof ctor.getDerivedStateFromProps === "function" ? "getDerivedStateFromProps()" : "getSnapshotBeforeUpdate()";
                  if (!didWarnAboutLegacyLifecyclesAndDerivedState.has(_componentName)) {
                    didWarnAboutLegacyLifecyclesAndDerivedState.add(_componentName);
                    error("Unsafe legacy lifecycles will not be called for components using new component APIs.\n\n%s uses %s but also contains the following legacy lifecycles:%s%s%s\n\nThe above lifecycles should be removed. Learn more about this warning here:\nhttps://reactjs.org/link/unsafe-component-lifecycles", _componentName, newApiName, foundWillMountName !== null ? "\n  " + foundWillMountName : "", foundWillReceivePropsName !== null ? "\n  " + foundWillReceivePropsName : "", foundWillUpdateName !== null ? "\n  " + foundWillUpdateName : "");
                  }
                }
              }
            }
            return instance2;
          }
          function checkClassInstance(instance2, ctor, newProps) {
            {
              var name = getComponentNameFromType(ctor) || "Component";
              var renderPresent = instance2.render;
              if (!renderPresent) {
                if (ctor.prototype && typeof ctor.prototype.render === "function") {
                  error("%s(...): No `render` method found on the returned component instance: did you accidentally return an object from the constructor?", name);
                } else {
                  error("%s(...): No `render` method found on the returned component instance: you may have forgotten to define `render`.", name);
                }
              }
              if (instance2.getInitialState && !instance2.getInitialState.isReactClassApproved && !instance2.state) {
                error("getInitialState was defined on %s, a plain JavaScript class. This is only supported for classes created using React.createClass. Did you mean to define a state property instead?", name);
              }
              if (instance2.getDefaultProps && !instance2.getDefaultProps.isReactClassApproved) {
                error("getDefaultProps was defined on %s, a plain JavaScript class. This is only supported for classes created using React.createClass. Use a static property to define defaultProps instead.", name);
              }
              if (instance2.propTypes) {
                error("propTypes was defined as an instance property on %s. Use a static property to define propTypes instead.", name);
              }
              if (instance2.contextType) {
                error("contextType was defined as an instance property on %s. Use a static property to define contextType instead.", name);
              }
              {
                if (instance2.contextTypes) {
                  error("contextTypes was defined as an instance property on %s. Use a static property to define contextTypes instead.", name);
                }
                if (ctor.contextType && ctor.contextTypes && !didWarnAboutContextTypeAndContextTypes.has(ctor)) {
                  didWarnAboutContextTypeAndContextTypes.add(ctor);
                  error("%s declares both contextTypes and contextType static properties. The legacy contextTypes property will be ignored.", name);
                }
              }
              if (typeof instance2.componentShouldUpdate === "function") {
                error("%s has a method called componentShouldUpdate(). Did you mean shouldComponentUpdate()? The name is phrased as a question because the function is expected to return a value.", name);
              }
              if (ctor.prototype && ctor.prototype.isPureReactComponent && typeof instance2.shouldComponentUpdate !== "undefined") {
                error("%s has a method called shouldComponentUpdate(). shouldComponentUpdate should not be used when extending React.PureComponent. Please extend React.Component if shouldComponentUpdate is used.", getComponentNameFromType(ctor) || "A pure component");
              }
              if (typeof instance2.componentDidUnmount === "function") {
                error("%s has a method called componentDidUnmount(). But there is no such lifecycle method. Did you mean componentWillUnmount()?", name);
              }
              if (typeof instance2.componentDidReceiveProps === "function") {
                error("%s has a method called componentDidReceiveProps(). But there is no such lifecycle method. If you meant to update the state in response to changing props, use componentWillReceiveProps(). If you meant to fetch data or run side-effects or mutations after React has updated the UI, use componentDidUpdate().", name);
              }
              if (typeof instance2.componentWillRecieveProps === "function") {
                error("%s has a method called componentWillRecieveProps(). Did you mean componentWillReceiveProps()?", name);
              }
              if (typeof instance2.UNSAFE_componentWillRecieveProps === "function") {
                error("%s has a method called UNSAFE_componentWillRecieveProps(). Did you mean UNSAFE_componentWillReceiveProps()?", name);
              }
              var hasMutatedProps = instance2.props !== newProps;
              if (instance2.props !== void 0 && hasMutatedProps) {
                error("%s(...): When calling super() in `%s`, make sure to pass up the same props that your component's constructor was passed.", name, name);
              }
              if (instance2.defaultProps) {
                error("Setting defaultProps as an instance property on %s is not supported and will be ignored. Instead, define defaultProps as a static property on %s.", name, name);
              }
              if (typeof instance2.getSnapshotBeforeUpdate === "function" && typeof instance2.componentDidUpdate !== "function" && !didWarnAboutGetSnapshotBeforeUpdateWithoutDidUpdate.has(ctor)) {
                didWarnAboutGetSnapshotBeforeUpdateWithoutDidUpdate.add(ctor);
                error("%s: getSnapshotBeforeUpdate() should be used with componentDidUpdate(). This component defines getSnapshotBeforeUpdate() only.", getComponentNameFromType(ctor));
              }
              if (typeof instance2.getDerivedStateFromProps === "function") {
                error("%s: getDerivedStateFromProps() is defined as an instance method and will be ignored. Instead, declare it as a static method.", name);
              }
              if (typeof instance2.getDerivedStateFromError === "function") {
                error("%s: getDerivedStateFromError() is defined as an instance method and will be ignored. Instead, declare it as a static method.", name);
              }
              if (typeof ctor.getSnapshotBeforeUpdate === "function") {
                error("%s: getSnapshotBeforeUpdate() is defined as a static method and will be ignored. Instead, declare it as an instance method.", name);
              }
              var _state = instance2.state;
              if (_state && (typeof _state !== "object" || isArray2(_state))) {
                error("%s.state: must be set to an object or null", name);
              }
              if (typeof instance2.getChildContext === "function" && typeof ctor.childContextTypes !== "object") {
                error("%s.getChildContext(): childContextTypes must be defined in order to use getChildContext().", name);
              }
            }
          }
          function callComponentWillMount(type, instance2) {
            var oldState = instance2.state;
            if (typeof instance2.componentWillMount === "function") {
              {
                if (instance2.componentWillMount.__suppressDeprecationWarning !== true) {
                  var componentName = getComponentNameFromType(type) || "Unknown";
                  if (!didWarnAboutDeprecatedWillMount[componentName]) {
                    warn(
                      // keep this warning in sync with ReactStrictModeWarning.js
                      "componentWillMount has been renamed, and is not recommended for use. See https://reactjs.org/link/unsafe-component-lifecycles for details.\n\n* Move code from componentWillMount to componentDidMount (preferred in most cases) or the constructor.\n\nPlease update the following components: %s",
                      componentName
                    );
                    didWarnAboutDeprecatedWillMount[componentName] = true;
                  }
                }
              }
              instance2.componentWillMount();
            }
            if (typeof instance2.UNSAFE_componentWillMount === "function") {
              instance2.UNSAFE_componentWillMount();
            }
            if (oldState !== instance2.state) {
              {
                error("%s.componentWillMount(): Assigning directly to this.state is deprecated (except inside a component's constructor). Use setState instead.", getComponentNameFromType(type) || "Component");
              }
              classComponentUpdater.enqueueReplaceState(instance2, instance2.state, null);
            }
          }
          function processUpdateQueue(internalInstance, inst, props, maskedLegacyContext) {
            if (internalInstance.queue !== null && internalInstance.queue.length > 0) {
              var oldQueue = internalInstance.queue;
              var oldReplace = internalInstance.replace;
              internalInstance.queue = null;
              internalInstance.replace = false;
              if (oldReplace && oldQueue.length === 1) {
                inst.state = oldQueue[0];
              } else {
                var nextState = oldReplace ? oldQueue[0] : inst.state;
                var dontMutate = true;
                for (var i = oldReplace ? 1 : 0; i < oldQueue.length; i++) {
                  var partial = oldQueue[i];
                  var partialState = typeof partial === "function" ? partial.call(inst, nextState, props, maskedLegacyContext) : partial;
                  if (partialState != null) {
                    if (dontMutate) {
                      dontMutate = false;
                      nextState = assign({}, nextState, partialState);
                    } else {
                      assign(nextState, partialState);
                    }
                  }
                }
                inst.state = nextState;
              }
            } else {
              internalInstance.queue = null;
            }
          }
          function mountClassInstance(instance2, ctor, newProps, maskedLegacyContext) {
            {
              checkClassInstance(instance2, ctor, newProps);
            }
            var initialState = instance2.state !== void 0 ? instance2.state : null;
            instance2.updater = classComponentUpdater;
            instance2.props = newProps;
            instance2.state = initialState;
            var internalInstance = {
              queue: [],
              replace: false
            };
            set(instance2, internalInstance);
            var contextType = ctor.contextType;
            if (typeof contextType === "object" && contextType !== null) {
              instance2.context = readContext(contextType);
            } else {
              instance2.context = maskedLegacyContext;
            }
            {
              if (instance2.state === newProps) {
                var componentName = getComponentNameFromType(ctor) || "Component";
                if (!didWarnAboutDirectlyAssigningPropsToState.has(componentName)) {
                  didWarnAboutDirectlyAssigningPropsToState.add(componentName);
                  error("%s: It is not recommended to assign props directly to state because updates to props won't be reflected in state. In most cases, it is better to use props directly.", componentName);
                }
              }
            }
            var getDerivedStateFromProps = ctor.getDerivedStateFromProps;
            if (typeof getDerivedStateFromProps === "function") {
              instance2.state = applyDerivedStateFromProps(instance2, ctor, getDerivedStateFromProps, initialState, newProps);
            }
            if (typeof ctor.getDerivedStateFromProps !== "function" && typeof instance2.getSnapshotBeforeUpdate !== "function" && (typeof instance2.UNSAFE_componentWillMount === "function" || typeof instance2.componentWillMount === "function")) {
              callComponentWillMount(ctor, instance2);
              processUpdateQueue(internalInstance, instance2, newProps, maskedLegacyContext);
            }
          }
          var emptyTreeContext = {
            id: 1,
            overflow: ""
          };
          function getTreeId(context) {
            var overflow = context.overflow;
            var idWithLeadingBit = context.id;
            var id = idWithLeadingBit & ~getLeadingBit(idWithLeadingBit);
            return id.toString(32) + overflow;
          }
          function pushTreeContext(baseContext, totalChildren, index) {
            var baseIdWithLeadingBit = baseContext.id;
            var baseOverflow = baseContext.overflow;
            var baseLength = getBitLength(baseIdWithLeadingBit) - 1;
            var baseId = baseIdWithLeadingBit & ~(1 << baseLength);
            var slot = index + 1;
            var length = getBitLength(totalChildren) + baseLength;
            if (length > 30) {
              var numberOfOverflowBits = baseLength - baseLength % 5;
              var newOverflowBits = (1 << numberOfOverflowBits) - 1;
              var newOverflow = (baseId & newOverflowBits).toString(32);
              var restOfBaseId = baseId >> numberOfOverflowBits;
              var restOfBaseLength = baseLength - numberOfOverflowBits;
              var restOfLength = getBitLength(totalChildren) + restOfBaseLength;
              var restOfNewBits = slot << restOfBaseLength;
              var id = restOfNewBits | restOfBaseId;
              var overflow = newOverflow + baseOverflow;
              return {
                id: 1 << restOfLength | id,
                overflow
              };
            } else {
              var newBits = slot << baseLength;
              var _id = newBits | baseId;
              var _overflow = baseOverflow;
              return {
                id: 1 << length | _id,
                overflow: _overflow
              };
            }
          }
          function getBitLength(number) {
            return 32 - clz32(number);
          }
          function getLeadingBit(id) {
            return 1 << getBitLength(id) - 1;
          }
          var clz32 = Math.clz32 ? Math.clz32 : clz32Fallback;
          var log = Math.log;
          var LN2 = Math.LN2;
          function clz32Fallback(x) {
            var asUint = x >>> 0;
            if (asUint === 0) {
              return 32;
            }
            return 31 - (log(asUint) / LN2 | 0) | 0;
          }
          function is(x, y) {
            return x === y && (x !== 0 || 1 / x === 1 / y) || x !== x && y !== y;
          }
          var objectIs = typeof Object.is === "function" ? Object.is : is;
          var currentlyRenderingComponent = null;
          var currentlyRenderingTask = null;
          var firstWorkInProgressHook = null;
          var workInProgressHook = null;
          var isReRender = false;
          var didScheduleRenderPhaseUpdate = false;
          var localIdCounter = 0;
          var renderPhaseUpdates = null;
          var numberOfReRenders = 0;
          var RE_RENDER_LIMIT = 25;
          var isInHookUserCodeInDev = false;
          var currentHookNameInDev;
          function resolveCurrentlyRenderingComponent() {
            if (currentlyRenderingComponent === null) {
              throw new Error("Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:\n1. You might have mismatching versions of React and the renderer (such as React DOM)\n2. You might be breaking the Rules of Hooks\n3. You might have more than one copy of React in the same app\nSee https://reactjs.org/link/invalid-hook-call for tips about how to debug and fix this problem.");
            }
            {
              if (isInHookUserCodeInDev) {
                error("Do not call Hooks inside useEffect(...), useMemo(...), or other built-in Hooks. You can only call Hooks at the top level of your React function. For more information, see https://reactjs.org/link/rules-of-hooks");
              }
            }
            return currentlyRenderingComponent;
          }
          function areHookInputsEqual(nextDeps, prevDeps) {
            if (prevDeps === null) {
              {
                error("%s received a final argument during this render, but not during the previous render. Even though the final argument is optional, its type cannot change between renders.", currentHookNameInDev);
              }
              return false;
            }
            {
              if (nextDeps.length !== prevDeps.length) {
                error("The final argument passed to %s changed size between renders. The order and size of this array must remain constant.\n\nPrevious: %s\nIncoming: %s", currentHookNameInDev, "[" + nextDeps.join(", ") + "]", "[" + prevDeps.join(", ") + "]");
              }
            }
            for (var i = 0; i < prevDeps.length && i < nextDeps.length; i++) {
              if (objectIs(nextDeps[i], prevDeps[i])) {
                continue;
              }
              return false;
            }
            return true;
          }
          function createHook() {
            if (numberOfReRenders > 0) {
              throw new Error("Rendered more hooks than during the previous render");
            }
            return {
              memoizedState: null,
              queue: null,
              next: null
            };
          }
          function createWorkInProgressHook() {
            if (workInProgressHook === null) {
              if (firstWorkInProgressHook === null) {
                isReRender = false;
                firstWorkInProgressHook = workInProgressHook = createHook();
              } else {
                isReRender = true;
                workInProgressHook = firstWorkInProgressHook;
              }
            } else {
              if (workInProgressHook.next === null) {
                isReRender = false;
                workInProgressHook = workInProgressHook.next = createHook();
              } else {
                isReRender = true;
                workInProgressHook = workInProgressHook.next;
              }
            }
            return workInProgressHook;
          }
          function prepareToUseHooks(task, componentIdentity) {
            currentlyRenderingComponent = componentIdentity;
            currentlyRenderingTask = task;
            {
              isInHookUserCodeInDev = false;
            }
            localIdCounter = 0;
          }
          function finishHooks(Component, props, children, refOrContext) {
            while (didScheduleRenderPhaseUpdate) {
              didScheduleRenderPhaseUpdate = false;
              localIdCounter = 0;
              numberOfReRenders += 1;
              workInProgressHook = null;
              children = Component(props, refOrContext);
            }
            resetHooksState();
            return children;
          }
          function checkDidRenderIdHook() {
            var didRenderIdHook = localIdCounter !== 0;
            return didRenderIdHook;
          }
          function resetHooksState() {
            {
              isInHookUserCodeInDev = false;
            }
            currentlyRenderingComponent = null;
            currentlyRenderingTask = null;
            didScheduleRenderPhaseUpdate = false;
            firstWorkInProgressHook = null;
            numberOfReRenders = 0;
            renderPhaseUpdates = null;
            workInProgressHook = null;
          }
          function readContext$1(context) {
            {
              if (isInHookUserCodeInDev) {
                error("Context can only be read while React is rendering. In classes, you can read it in the render method or getDerivedStateFromProps. In function components, you can read it directly in the function body, but not inside Hooks like useReducer() or useMemo().");
              }
            }
            return readContext(context);
          }
          function useContext(context) {
            {
              currentHookNameInDev = "useContext";
            }
            resolveCurrentlyRenderingComponent();
            return readContext(context);
          }
          function basicStateReducer(state, action) {
            return typeof action === "function" ? action(state) : action;
          }
          function useState2(initialState) {
            {
              currentHookNameInDev = "useState";
            }
            return useReducer(
              basicStateReducer,
              // useReducer has a special case to support lazy useState initializers
              initialState
            );
          }
          function useReducer(reducer, initialArg, init) {
            {
              if (reducer !== basicStateReducer) {
                currentHookNameInDev = "useReducer";
              }
            }
            currentlyRenderingComponent = resolveCurrentlyRenderingComponent();
            workInProgressHook = createWorkInProgressHook();
            if (isReRender) {
              var queue = workInProgressHook.queue;
              var dispatch = queue.dispatch;
              if (renderPhaseUpdates !== null) {
                var firstRenderPhaseUpdate = renderPhaseUpdates.get(queue);
                if (firstRenderPhaseUpdate !== void 0) {
                  renderPhaseUpdates.delete(queue);
                  var newState = workInProgressHook.memoizedState;
                  var update = firstRenderPhaseUpdate;
                  do {
                    var action = update.action;
                    {
                      isInHookUserCodeInDev = true;
                    }
                    newState = reducer(newState, action);
                    {
                      isInHookUserCodeInDev = false;
                    }
                    update = update.next;
                  } while (update !== null);
                  workInProgressHook.memoizedState = newState;
                  return [newState, dispatch];
                }
              }
              return [workInProgressHook.memoizedState, dispatch];
            } else {
              {
                isInHookUserCodeInDev = true;
              }
              var initialState;
              if (reducer === basicStateReducer) {
                initialState = typeof initialArg === "function" ? initialArg() : initialArg;
              } else {
                initialState = init !== void 0 ? init(initialArg) : initialArg;
              }
              {
                isInHookUserCodeInDev = false;
              }
              workInProgressHook.memoizedState = initialState;
              var _queue = workInProgressHook.queue = {
                last: null,
                dispatch: null
              };
              var _dispatch = _queue.dispatch = dispatchAction.bind(null, currentlyRenderingComponent, _queue);
              return [workInProgressHook.memoizedState, _dispatch];
            }
          }
          function useMemo(nextCreate, deps) {
            currentlyRenderingComponent = resolveCurrentlyRenderingComponent();
            workInProgressHook = createWorkInProgressHook();
            var nextDeps = deps === void 0 ? null : deps;
            if (workInProgressHook !== null) {
              var prevState = workInProgressHook.memoizedState;
              if (prevState !== null) {
                if (nextDeps !== null) {
                  var prevDeps = prevState[1];
                  if (areHookInputsEqual(nextDeps, prevDeps)) {
                    return prevState[0];
                  }
                }
              }
            }
            {
              isInHookUserCodeInDev = true;
            }
            var nextValue = nextCreate();
            {
              isInHookUserCodeInDev = false;
            }
            workInProgressHook.memoizedState = [nextValue, nextDeps];
            return nextValue;
          }
          function useRef2(initialValue) {
            currentlyRenderingComponent = resolveCurrentlyRenderingComponent();
            workInProgressHook = createWorkInProgressHook();
            var previousRef = workInProgressHook.memoizedState;
            if (previousRef === null) {
              var ref = {
                current: initialValue
              };
              {
                Object.seal(ref);
              }
              workInProgressHook.memoizedState = ref;
              return ref;
            } else {
              return previousRef;
            }
          }
          function useLayoutEffect(create, inputs) {
            {
              currentHookNameInDev = "useLayoutEffect";
              error("useLayoutEffect does nothing on the server, because its effect cannot be encoded into the server renderer's output format. This will lead to a mismatch between the initial, non-hydrated UI and the intended UI. To avoid this, useLayoutEffect should only be used in components that render exclusively on the client. See https://reactjs.org/link/uselayouteffect-ssr for common fixes.");
            }
          }
          function dispatchAction(componentIdentity, queue, action) {
            if (numberOfReRenders >= RE_RENDER_LIMIT) {
              throw new Error("Too many re-renders. React limits the number of renders to prevent an infinite loop.");
            }
            if (componentIdentity === currentlyRenderingComponent) {
              didScheduleRenderPhaseUpdate = true;
              var update = {
                action,
                next: null
              };
              if (renderPhaseUpdates === null) {
                renderPhaseUpdates = /* @__PURE__ */ new Map();
              }
              var firstRenderPhaseUpdate = renderPhaseUpdates.get(queue);
              if (firstRenderPhaseUpdate === void 0) {
                renderPhaseUpdates.set(queue, update);
              } else {
                var lastRenderPhaseUpdate = firstRenderPhaseUpdate;
                while (lastRenderPhaseUpdate.next !== null) {
                  lastRenderPhaseUpdate = lastRenderPhaseUpdate.next;
                }
                lastRenderPhaseUpdate.next = update;
              }
            }
          }
          function useCallback2(callback, deps) {
            return useMemo(function() {
              return callback;
            }, deps);
          }
          function useMutableSource(source, getSnapshot, subscribe) {
            resolveCurrentlyRenderingComponent();
            return getSnapshot(source._source);
          }
          function useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot) {
            if (getServerSnapshot === void 0) {
              throw new Error("Missing getServerSnapshot, which is required for server-rendered content. Will revert to client rendering.");
            }
            return getServerSnapshot();
          }
          function useDeferredValue(value) {
            resolveCurrentlyRenderingComponent();
            return value;
          }
          function unsupportedStartTransition() {
            throw new Error("startTransition cannot be called during server rendering.");
          }
          function useTransition() {
            resolveCurrentlyRenderingComponent();
            return [false, unsupportedStartTransition];
          }
          function useId() {
            var task = currentlyRenderingTask;
            var treeId = getTreeId(task.treeContext);
            var responseState = currentResponseState;
            if (responseState === null) {
              throw new Error("Invalid hook call. Hooks can only be called inside of the body of a function component.");
            }
            var localId = localIdCounter++;
            return makeId(responseState, treeId, localId);
          }
          function noop2() {
          }
          var Dispatcher = {
            readContext: readContext$1,
            useContext,
            useMemo,
            useReducer,
            useRef: useRef2,
            useState: useState2,
            useInsertionEffect: noop2,
            useLayoutEffect,
            useCallback: useCallback2,
            // useImperativeHandle is not run in the server environment
            useImperativeHandle: noop2,
            // Effects are not run in the server environment.
            useEffect: noop2,
            // Debugging effect
            useDebugValue: noop2,
            useDeferredValue,
            useTransition,
            useId,
            // Subscriptions are not setup in a server environment.
            useMutableSource,
            useSyncExternalStore
          };
          var currentResponseState = null;
          function setCurrentResponseState(responseState) {
            currentResponseState = responseState;
          }
          function getStackByComponentStackNode(componentStack) {
            try {
              var info = "";
              var node = componentStack;
              do {
                switch (node.tag) {
                  case 0:
                    info += describeBuiltInComponentFrame(node.type, null, null);
                    break;
                  case 1:
                    info += describeFunctionComponentFrame(node.type, null, null);
                    break;
                  case 2:
                    info += describeClassComponentFrame(node.type, null, null);
                    break;
                }
                node = node.parent;
              } while (node);
              return info;
            } catch (x) {
              return "\nError generating stack: " + x.message + "\n" + x.stack;
            }
          }
          var ReactCurrentDispatcher$1 = ReactSharedInternals.ReactCurrentDispatcher;
          var ReactDebugCurrentFrame$1 = ReactSharedInternals.ReactDebugCurrentFrame;
          var PENDING = 0;
          var COMPLETED = 1;
          var FLUSHED = 2;
          var ABORTED = 3;
          var ERRORED = 4;
          var OPEN = 0;
          var CLOSING = 1;
          var CLOSED = 2;
          var DEFAULT_PROGRESSIVE_CHUNK_SIZE = 12800;
          function defaultErrorHandler(error2) {
            console["error"](error2);
            return null;
          }
          function noop$1() {
          }
          function createRequest(children, responseState, rootFormatContext, progressiveChunkSize, onError, onAllReady, onShellReady, onShellError, onFatalError) {
            var pingedTasks = [];
            var abortSet = /* @__PURE__ */ new Set();
            var request = {
              destination: null,
              responseState,
              progressiveChunkSize: progressiveChunkSize === void 0 ? DEFAULT_PROGRESSIVE_CHUNK_SIZE : progressiveChunkSize,
              status: OPEN,
              fatalError: null,
              nextSegmentId: 0,
              allPendingTasks: 0,
              pendingRootTasks: 0,
              completedRootSegment: null,
              abortableTasks: abortSet,
              pingedTasks,
              clientRenderedBoundaries: [],
              completedBoundaries: [],
              partialBoundaries: [],
              onError: onError === void 0 ? defaultErrorHandler : onError,
              onAllReady: onAllReady === void 0 ? noop$1 : onAllReady,
              onShellReady: onShellReady === void 0 ? noop$1 : onShellReady,
              onShellError: onShellError === void 0 ? noop$1 : onShellError,
              onFatalError: onFatalError === void 0 ? noop$1 : onFatalError
            };
            var rootSegment = createPendingSegment(
              request,
              0,
              null,
              rootFormatContext,
              // Root segments are never embedded in Text on either edge
              false,
              false
            );
            rootSegment.parentFlushed = true;
            var rootTask = createTask(request, children, null, rootSegment, abortSet, emptyContextObject, rootContextSnapshot, emptyTreeContext);
            pingedTasks.push(rootTask);
            return request;
          }
          function pingTask(request, task) {
            var pingedTasks = request.pingedTasks;
            pingedTasks.push(task);
            if (pingedTasks.length === 1) {
              scheduleWork(function() {
                return performWork(request);
              });
            }
          }
          function createSuspenseBoundary(request, fallbackAbortableTasks) {
            return {
              id: UNINITIALIZED_SUSPENSE_BOUNDARY_ID,
              rootSegmentID: -1,
              parentFlushed: false,
              pendingTasks: 0,
              forceClientRender: false,
              completedSegments: [],
              byteSize: 0,
              fallbackAbortableTasks,
              errorDigest: null
            };
          }
          function createTask(request, node, blockedBoundary, blockedSegment, abortSet, legacyContext, context, treeContext) {
            request.allPendingTasks++;
            if (blockedBoundary === null) {
              request.pendingRootTasks++;
            } else {
              blockedBoundary.pendingTasks++;
            }
            var task = {
              node,
              ping: function() {
                return pingTask(request, task);
              },
              blockedBoundary,
              blockedSegment,
              abortSet,
              legacyContext,
              context,
              treeContext
            };
            {
              task.componentStack = null;
            }
            abortSet.add(task);
            return task;
          }
          function createPendingSegment(request, index, boundary, formatContext, lastPushedText, textEmbedded) {
            return {
              status: PENDING,
              id: -1,
              // lazily assigned later
              index,
              parentFlushed: false,
              chunks: [],
              children: [],
              formatContext,
              boundary,
              lastPushedText,
              textEmbedded
            };
          }
          var currentTaskInDEV = null;
          function getCurrentStackInDEV() {
            {
              if (currentTaskInDEV === null || currentTaskInDEV.componentStack === null) {
                return "";
              }
              return getStackByComponentStackNode(currentTaskInDEV.componentStack);
            }
          }
          function pushBuiltInComponentStackInDEV(task, type) {
            {
              task.componentStack = {
                tag: 0,
                parent: task.componentStack,
                type
              };
            }
          }
          function pushFunctionComponentStackInDEV(task, type) {
            {
              task.componentStack = {
                tag: 1,
                parent: task.componentStack,
                type
              };
            }
          }
          function pushClassComponentStackInDEV(task, type) {
            {
              task.componentStack = {
                tag: 2,
                parent: task.componentStack,
                type
              };
            }
          }
          function popComponentStackInDEV(task) {
            {
              if (task.componentStack === null) {
                error("Unexpectedly popped too many stack frames. This is a bug in React.");
              } else {
                task.componentStack = task.componentStack.parent;
              }
            }
          }
          var lastBoundaryErrorComponentStackDev = null;
          function captureBoundaryErrorDetailsDev(boundary, error2) {
            {
              var errorMessage;
              if (typeof error2 === "string") {
                errorMessage = error2;
              } else if (error2 && typeof error2.message === "string") {
                errorMessage = error2.message;
              } else {
                errorMessage = String(error2);
              }
              var errorComponentStack = lastBoundaryErrorComponentStackDev || getCurrentStackInDEV();
              lastBoundaryErrorComponentStackDev = null;
              boundary.errorMessage = errorMessage;
              boundary.errorComponentStack = errorComponentStack;
            }
          }
          function logRecoverableError(request, error2) {
            var errorDigest = request.onError(error2);
            if (errorDigest != null && typeof errorDigest !== "string") {
              throw new Error('onError returned something with a type other than "string". onError should return a string and may return null or undefined but must not return anything else. It received something of type "' + typeof errorDigest + '" instead');
            }
            return errorDigest;
          }
          function fatalError(request, error2) {
            var onShellError = request.onShellError;
            onShellError(error2);
            var onFatalError = request.onFatalError;
            onFatalError(error2);
            if (request.destination !== null) {
              request.status = CLOSED;
              closeWithError(request.destination, error2);
            } else {
              request.status = CLOSING;
              request.fatalError = error2;
            }
          }
          function renderSuspenseBoundary(request, task, props) {
            pushBuiltInComponentStackInDEV(task, "Suspense");
            var parentBoundary = task.blockedBoundary;
            var parentSegment = task.blockedSegment;
            var fallback = props.fallback;
            var content = props.children;
            var fallbackAbortSet = /* @__PURE__ */ new Set();
            var newBoundary = createSuspenseBoundary(request, fallbackAbortSet);
            var insertionIndex = parentSegment.chunks.length;
            var boundarySegment = createPendingSegment(
              request,
              insertionIndex,
              newBoundary,
              parentSegment.formatContext,
              // boundaries never require text embedding at their edges because comment nodes bound them
              false,
              false
            );
            parentSegment.children.push(boundarySegment);
            parentSegment.lastPushedText = false;
            var contentRootSegment = createPendingSegment(
              request,
              0,
              null,
              parentSegment.formatContext,
              // boundaries never require text embedding at their edges because comment nodes bound them
              false,
              false
            );
            contentRootSegment.parentFlushed = true;
            task.blockedBoundary = newBoundary;
            task.blockedSegment = contentRootSegment;
            try {
              renderNode(request, task, content);
              pushSegmentFinale(contentRootSegment.chunks, request.responseState, contentRootSegment.lastPushedText, contentRootSegment.textEmbedded);
              contentRootSegment.status = COMPLETED;
              queueCompletedSegment(newBoundary, contentRootSegment);
              if (newBoundary.pendingTasks === 0) {
                popComponentStackInDEV(task);
                return;
              }
            } catch (error2) {
              contentRootSegment.status = ERRORED;
              newBoundary.forceClientRender = true;
              newBoundary.errorDigest = logRecoverableError(request, error2);
              {
                captureBoundaryErrorDetailsDev(newBoundary, error2);
              }
            } finally {
              task.blockedBoundary = parentBoundary;
              task.blockedSegment = parentSegment;
            }
            var suspendedFallbackTask = createTask(request, fallback, parentBoundary, boundarySegment, fallbackAbortSet, task.legacyContext, task.context, task.treeContext);
            {
              suspendedFallbackTask.componentStack = task.componentStack;
            }
            request.pingedTasks.push(suspendedFallbackTask);
            popComponentStackInDEV(task);
          }
          function renderHostElement(request, task, type, props) {
            pushBuiltInComponentStackInDEV(task, type);
            var segment = task.blockedSegment;
            var children = pushStartInstance(segment.chunks, type, props, request.responseState, segment.formatContext);
            segment.lastPushedText = false;
            var prevContext = segment.formatContext;
            segment.formatContext = getChildFormatContext(prevContext, type, props);
            renderNode(request, task, children);
            segment.formatContext = prevContext;
            pushEndInstance(segment.chunks, type);
            segment.lastPushedText = false;
            popComponentStackInDEV(task);
          }
          function shouldConstruct$1(Component) {
            return Component.prototype && Component.prototype.isReactComponent;
          }
          function renderWithHooks(request, task, Component, props, secondArg) {
            var componentIdentity = {};
            prepareToUseHooks(task, componentIdentity);
            var result = Component(props, secondArg);
            return finishHooks(Component, props, result, secondArg);
          }
          function finishClassComponent(request, task, instance2, Component, props) {
            var nextChildren = instance2.render();
            {
              if (instance2.props !== props) {
                if (!didWarnAboutReassigningProps) {
                  error("It looks like %s is reassigning its own `this.props` while rendering. This is not supported and can lead to confusing bugs.", getComponentNameFromType(Component) || "a component");
                }
                didWarnAboutReassigningProps = true;
              }
            }
            {
              var childContextTypes = Component.childContextTypes;
              if (childContextTypes !== null && childContextTypes !== void 0) {
                var previousContext = task.legacyContext;
                var mergedContext = processChildContext(instance2, Component, previousContext, childContextTypes);
                task.legacyContext = mergedContext;
                renderNodeDestructive(request, task, nextChildren);
                task.legacyContext = previousContext;
                return;
              }
            }
            renderNodeDestructive(request, task, nextChildren);
          }
          function renderClassComponent(request, task, Component, props) {
            pushClassComponentStackInDEV(task, Component);
            var maskedContext = getMaskedContext(Component, task.legacyContext);
            var instance2 = constructClassInstance(Component, props, maskedContext);
            mountClassInstance(instance2, Component, props, maskedContext);
            finishClassComponent(request, task, instance2, Component, props);
            popComponentStackInDEV(task);
          }
          var didWarnAboutBadClass = {};
          var didWarnAboutModulePatternComponent = {};
          var didWarnAboutContextTypeOnFunctionComponent = {};
          var didWarnAboutGetDerivedStateOnFunctionComponent = {};
          var didWarnAboutReassigningProps = false;
          var didWarnAboutDefaultPropsOnFunctionComponent = {};
          var didWarnAboutGenerators = false;
          var didWarnAboutMaps = false;
          var hasWarnedAboutUsingContextAsConsumer = false;
          function renderIndeterminateComponent(request, task, Component, props) {
            var legacyContext;
            {
              legacyContext = getMaskedContext(Component, task.legacyContext);
            }
            pushFunctionComponentStackInDEV(task, Component);
            {
              if (Component.prototype && typeof Component.prototype.render === "function") {
                var componentName = getComponentNameFromType(Component) || "Unknown";
                if (!didWarnAboutBadClass[componentName]) {
                  error("The <%s /> component appears to have a render method, but doesn't extend React.Component. This is likely to cause errors. Change %s to extend React.Component instead.", componentName, componentName);
                  didWarnAboutBadClass[componentName] = true;
                }
              }
            }
            var value = renderWithHooks(request, task, Component, props, legacyContext);
            var hasId = checkDidRenderIdHook();
            {
              if (typeof value === "object" && value !== null && typeof value.render === "function" && value.$$typeof === void 0) {
                var _componentName = getComponentNameFromType(Component) || "Unknown";
                if (!didWarnAboutModulePatternComponent[_componentName]) {
                  error("The <%s /> component appears to be a function component that returns a class instance. Change %s to a class that extends React.Component instead. If you can't use a class try assigning the prototype on the function as a workaround. `%s.prototype = React.Component.prototype`. Don't use an arrow function since it cannot be called with `new` by React.", _componentName, _componentName, _componentName);
                  didWarnAboutModulePatternComponent[_componentName] = true;
                }
              }
            }
            if (
              // Run these checks in production only if the flag is off.
              // Eventually we'll delete this branch altogether.
              typeof value === "object" && value !== null && typeof value.render === "function" && value.$$typeof === void 0
            ) {
              {
                var _componentName2 = getComponentNameFromType(Component) || "Unknown";
                if (!didWarnAboutModulePatternComponent[_componentName2]) {
                  error("The <%s /> component appears to be a function component that returns a class instance. Change %s to a class that extends React.Component instead. If you can't use a class try assigning the prototype on the function as a workaround. `%s.prototype = React.Component.prototype`. Don't use an arrow function since it cannot be called with `new` by React.", _componentName2, _componentName2, _componentName2);
                  didWarnAboutModulePatternComponent[_componentName2] = true;
                }
              }
              mountClassInstance(value, Component, props, legacyContext);
              finishClassComponent(request, task, value, Component, props);
            } else {
              {
                validateFunctionComponentInDev(Component);
              }
              if (hasId) {
                var prevTreeContext = task.treeContext;
                var totalChildren = 1;
                var index = 0;
                task.treeContext = pushTreeContext(prevTreeContext, totalChildren, index);
                try {
                  renderNodeDestructive(request, task, value);
                } finally {
                  task.treeContext = prevTreeContext;
                }
              } else {
                renderNodeDestructive(request, task, value);
              }
            }
            popComponentStackInDEV(task);
          }
          function validateFunctionComponentInDev(Component) {
            {
              if (Component) {
                if (Component.childContextTypes) {
                  error("%s(...): childContextTypes cannot be defined on a function component.", Component.displayName || Component.name || "Component");
                }
              }
              if (Component.defaultProps !== void 0) {
                var componentName = getComponentNameFromType(Component) || "Unknown";
                if (!didWarnAboutDefaultPropsOnFunctionComponent[componentName]) {
                  error("%s: Support for defaultProps will be removed from function components in a future major release. Use JavaScript default parameters instead.", componentName);
                  didWarnAboutDefaultPropsOnFunctionComponent[componentName] = true;
                }
              }
              if (typeof Component.getDerivedStateFromProps === "function") {
                var _componentName3 = getComponentNameFromType(Component) || "Unknown";
                if (!didWarnAboutGetDerivedStateOnFunctionComponent[_componentName3]) {
                  error("%s: Function components do not support getDerivedStateFromProps.", _componentName3);
                  didWarnAboutGetDerivedStateOnFunctionComponent[_componentName3] = true;
                }
              }
              if (typeof Component.contextType === "object" && Component.contextType !== null) {
                var _componentName4 = getComponentNameFromType(Component) || "Unknown";
                if (!didWarnAboutContextTypeOnFunctionComponent[_componentName4]) {
                  error("%s: Function components do not support contextType.", _componentName4);
                  didWarnAboutContextTypeOnFunctionComponent[_componentName4] = true;
                }
              }
            }
          }
          function resolveDefaultProps(Component, baseProps) {
            if (Component && Component.defaultProps) {
              var props = assign({}, baseProps);
              var defaultProps = Component.defaultProps;
              for (var propName in defaultProps) {
                if (props[propName] === void 0) {
                  props[propName] = defaultProps[propName];
                }
              }
              return props;
            }
            return baseProps;
          }
          function renderForwardRef(request, task, type, props, ref) {
            pushFunctionComponentStackInDEV(task, type.render);
            var children = renderWithHooks(request, task, type.render, props, ref);
            var hasId = checkDidRenderIdHook();
            if (hasId) {
              var prevTreeContext = task.treeContext;
              var totalChildren = 1;
              var index = 0;
              task.treeContext = pushTreeContext(prevTreeContext, totalChildren, index);
              try {
                renderNodeDestructive(request, task, children);
              } finally {
                task.treeContext = prevTreeContext;
              }
            } else {
              renderNodeDestructive(request, task, children);
            }
            popComponentStackInDEV(task);
          }
          function renderMemo(request, task, type, props, ref) {
            var innerType = type.type;
            var resolvedProps = resolveDefaultProps(innerType, props);
            renderElement(request, task, innerType, resolvedProps, ref);
          }
          function renderContextConsumer(request, task, context, props) {
            {
              if (context._context === void 0) {
                if (context !== context.Consumer) {
                  if (!hasWarnedAboutUsingContextAsConsumer) {
                    hasWarnedAboutUsingContextAsConsumer = true;
                    error("Rendering <Context> directly is not supported and will be removed in a future major release. Did you mean to render <Context.Consumer> instead?");
                  }
                }
              } else {
                context = context._context;
              }
            }
            var render = props.children;
            {
              if (typeof render !== "function") {
                error("A context consumer was rendered with multiple children, or a child that isn't a function. A context consumer expects a single child that is a function. If you did pass a function, make sure there is no trailing or leading whitespace around it.");
              }
            }
            var newValue = readContext(context);
            var newChildren = render(newValue);
            renderNodeDestructive(request, task, newChildren);
          }
          function renderContextProvider(request, task, type, props) {
            var context = type._context;
            var value = props.value;
            var children = props.children;
            var prevSnapshot;
            {
              prevSnapshot = task.context;
            }
            task.context = pushProvider(context, value);
            renderNodeDestructive(request, task, children);
            task.context = popProvider(context);
            {
              if (prevSnapshot !== task.context) {
                error("Popping the context provider did not return back to the original snapshot. This is a bug in React.");
              }
            }
          }
          function renderLazyComponent(request, task, lazyComponent, props, ref) {
            pushBuiltInComponentStackInDEV(task, "Lazy");
            var payload = lazyComponent._payload;
            var init = lazyComponent._init;
            var Component = init(payload);
            var resolvedProps = resolveDefaultProps(Component, props);
            renderElement(request, task, Component, resolvedProps, ref);
            popComponentStackInDEV(task);
          }
          function renderElement(request, task, type, props, ref) {
            if (typeof type === "function") {
              if (shouldConstruct$1(type)) {
                renderClassComponent(request, task, type, props);
                return;
              } else {
                renderIndeterminateComponent(request, task, type, props);
                return;
              }
            }
            if (typeof type === "string") {
              renderHostElement(request, task, type, props);
              return;
            }
            switch (type) {
              case REACT_LEGACY_HIDDEN_TYPE:
              case REACT_DEBUG_TRACING_MODE_TYPE:
              case REACT_STRICT_MODE_TYPE:
              case REACT_PROFILER_TYPE:
              case REACT_FRAGMENT_TYPE: {
                renderNodeDestructive(request, task, props.children);
                return;
              }
              case REACT_SUSPENSE_LIST_TYPE: {
                pushBuiltInComponentStackInDEV(task, "SuspenseList");
                renderNodeDestructive(request, task, props.children);
                popComponentStackInDEV(task);
                return;
              }
              case REACT_SCOPE_TYPE: {
                throw new Error("ReactDOMServer does not yet support scope components.");
              }
              case REACT_SUSPENSE_TYPE: {
                {
                  renderSuspenseBoundary(request, task, props);
                }
                return;
              }
            }
            if (typeof type === "object" && type !== null) {
              switch (type.$$typeof) {
                case REACT_FORWARD_REF_TYPE: {
                  renderForwardRef(request, task, type, props, ref);
                  return;
                }
                case REACT_MEMO_TYPE: {
                  renderMemo(request, task, type, props, ref);
                  return;
                }
                case REACT_PROVIDER_TYPE: {
                  renderContextProvider(request, task, type, props);
                  return;
                }
                case REACT_CONTEXT_TYPE: {
                  renderContextConsumer(request, task, type, props);
                  return;
                }
                case REACT_LAZY_TYPE: {
                  renderLazyComponent(request, task, type, props);
                  return;
                }
              }
            }
            var info = "";
            {
              if (type === void 0 || typeof type === "object" && type !== null && Object.keys(type).length === 0) {
                info += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.";
              }
            }
            throw new Error("Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) " + ("but got: " + (type == null ? type : typeof type) + "." + info));
          }
          function validateIterable(iterable, iteratorFn) {
            {
              if (typeof Symbol === "function" && // $FlowFixMe Flow doesn't know about toStringTag
              iterable[Symbol.toStringTag] === "Generator") {
                if (!didWarnAboutGenerators) {
                  error("Using Generators as children is unsupported and will likely yield unexpected results because enumerating a generator mutates it. You may convert it to an array with `Array.from()` or the `[...spread]` operator before rendering. Keep in mind you might need to polyfill these features for older browsers.");
                }
                didWarnAboutGenerators = true;
              }
              if (iterable.entries === iteratorFn) {
                if (!didWarnAboutMaps) {
                  error("Using Maps as children is not supported. Use an array of keyed ReactElements instead.");
                }
                didWarnAboutMaps = true;
              }
            }
          }
          function renderNodeDestructive(request, task, node) {
            {
              try {
                return renderNodeDestructiveImpl(request, task, node);
              } catch (x) {
                if (typeof x === "object" && x !== null && typeof x.then === "function")
                  ;
                else {
                  lastBoundaryErrorComponentStackDev = lastBoundaryErrorComponentStackDev !== null ? lastBoundaryErrorComponentStackDev : getCurrentStackInDEV();
                }
                throw x;
              }
            }
          }
          function renderNodeDestructiveImpl(request, task, node) {
            task.node = node;
            if (typeof node === "object" && node !== null) {
              switch (node.$$typeof) {
                case REACT_ELEMENT_TYPE: {
                  var element = node;
                  var type = element.type;
                  var props = element.props;
                  var ref = element.ref;
                  renderElement(request, task, type, props, ref);
                  return;
                }
                case REACT_PORTAL_TYPE:
                  throw new Error("Portals are not currently supported by the server renderer. Render them conditionally so that they only appear on the client render.");
                case REACT_LAZY_TYPE: {
                  var lazyNode = node;
                  var payload = lazyNode._payload;
                  var init = lazyNode._init;
                  var resolvedNode;
                  {
                    try {
                      resolvedNode = init(payload);
                    } catch (x) {
                      if (typeof x === "object" && x !== null && typeof x.then === "function") {
                        pushBuiltInComponentStackInDEV(task, "Lazy");
                      }
                      throw x;
                    }
                  }
                  renderNodeDestructive(request, task, resolvedNode);
                  return;
                }
              }
              if (isArray2(node)) {
                renderChildrenArray(request, task, node);
                return;
              }
              var iteratorFn = getIteratorFn(node);
              if (iteratorFn) {
                {
                  validateIterable(node, iteratorFn);
                }
                var iterator = iteratorFn.call(node);
                if (iterator) {
                  var step = iterator.next();
                  if (!step.done) {
                    var children = [];
                    do {
                      children.push(step.value);
                      step = iterator.next();
                    } while (!step.done);
                    renderChildrenArray(request, task, children);
                    return;
                  }
                  return;
                }
              }
              var childString = Object.prototype.toString.call(node);
              throw new Error("Objects are not valid as a React child (found: " + (childString === "[object Object]" ? "object with keys {" + Object.keys(node).join(", ") + "}" : childString) + "). If you meant to render a collection of children, use an array instead.");
            }
            if (typeof node === "string") {
              var segment = task.blockedSegment;
              segment.lastPushedText = pushTextInstance(task.blockedSegment.chunks, node, request.responseState, segment.lastPushedText);
              return;
            }
            if (typeof node === "number") {
              var _segment = task.blockedSegment;
              _segment.lastPushedText = pushTextInstance(task.blockedSegment.chunks, "" + node, request.responseState, _segment.lastPushedText);
              return;
            }
            {
              if (typeof node === "function") {
                error("Functions are not valid as a React child. This may happen if you return a Component instead of <Component /> from render. Or maybe you meant to call this function rather than return it.");
              }
            }
          }
          function renderChildrenArray(request, task, children) {
            var totalChildren = children.length;
            for (var i = 0; i < totalChildren; i++) {
              var prevTreeContext = task.treeContext;
              task.treeContext = pushTreeContext(prevTreeContext, totalChildren, i);
              try {
                renderNode(request, task, children[i]);
              } finally {
                task.treeContext = prevTreeContext;
              }
            }
          }
          function spawnNewSuspendedTask(request, task, x) {
            var segment = task.blockedSegment;
            var insertionIndex = segment.chunks.length;
            var newSegment = createPendingSegment(
              request,
              insertionIndex,
              null,
              segment.formatContext,
              // Adopt the parent segment's leading text embed
              segment.lastPushedText,
              // Assume we are text embedded at the trailing edge
              true
            );
            segment.children.push(newSegment);
            segment.lastPushedText = false;
            var newTask = createTask(request, task.node, task.blockedBoundary, newSegment, task.abortSet, task.legacyContext, task.context, task.treeContext);
            {
              if (task.componentStack !== null) {
                newTask.componentStack = task.componentStack.parent;
              }
            }
            var ping = newTask.ping;
            x.then(ping, ping);
          }
          function renderNode(request, task, node) {
            var previousFormatContext = task.blockedSegment.formatContext;
            var previousLegacyContext = task.legacyContext;
            var previousContext = task.context;
            var previousComponentStack = null;
            {
              previousComponentStack = task.componentStack;
            }
            try {
              return renderNodeDestructive(request, task, node);
            } catch (x) {
              resetHooksState();
              if (typeof x === "object" && x !== null && typeof x.then === "function") {
                spawnNewSuspendedTask(request, task, x);
                task.blockedSegment.formatContext = previousFormatContext;
                task.legacyContext = previousLegacyContext;
                task.context = previousContext;
                switchContext(previousContext);
                {
                  task.componentStack = previousComponentStack;
                }
                return;
              } else {
                task.blockedSegment.formatContext = previousFormatContext;
                task.legacyContext = previousLegacyContext;
                task.context = previousContext;
                switchContext(previousContext);
                {
                  task.componentStack = previousComponentStack;
                }
                throw x;
              }
            }
          }
          function erroredTask(request, boundary, segment, error2) {
            var errorDigest = logRecoverableError(request, error2);
            if (boundary === null) {
              fatalError(request, error2);
            } else {
              boundary.pendingTasks--;
              if (!boundary.forceClientRender) {
                boundary.forceClientRender = true;
                boundary.errorDigest = errorDigest;
                {
                  captureBoundaryErrorDetailsDev(boundary, error2);
                }
                if (boundary.parentFlushed) {
                  request.clientRenderedBoundaries.push(boundary);
                }
              }
            }
            request.allPendingTasks--;
            if (request.allPendingTasks === 0) {
              var onAllReady = request.onAllReady;
              onAllReady();
            }
          }
          function abortTaskSoft(task) {
            var request = this;
            var boundary = task.blockedBoundary;
            var segment = task.blockedSegment;
            segment.status = ABORTED;
            finishedTask(request, boundary, segment);
          }
          function abortTask(task, request, reason) {
            var boundary = task.blockedBoundary;
            var segment = task.blockedSegment;
            segment.status = ABORTED;
            if (boundary === null) {
              request.allPendingTasks--;
              if (request.status !== CLOSED) {
                request.status = CLOSED;
                if (request.destination !== null) {
                  close(request.destination);
                }
              }
            } else {
              boundary.pendingTasks--;
              if (!boundary.forceClientRender) {
                boundary.forceClientRender = true;
                var _error = reason === void 0 ? new Error("The render was aborted by the server without a reason.") : reason;
                boundary.errorDigest = request.onError(_error);
                {
                  var errorPrefix = "The server did not finish this Suspense boundary: ";
                  if (_error && typeof _error.message === "string") {
                    _error = errorPrefix + _error.message;
                  } else {
                    _error = errorPrefix + String(_error);
                  }
                  var previousTaskInDev = currentTaskInDEV;
                  currentTaskInDEV = task;
                  try {
                    captureBoundaryErrorDetailsDev(boundary, _error);
                  } finally {
                    currentTaskInDEV = previousTaskInDev;
                  }
                }
                if (boundary.parentFlushed) {
                  request.clientRenderedBoundaries.push(boundary);
                }
              }
              boundary.fallbackAbortableTasks.forEach(function(fallbackTask) {
                return abortTask(fallbackTask, request, reason);
              });
              boundary.fallbackAbortableTasks.clear();
              request.allPendingTasks--;
              if (request.allPendingTasks === 0) {
                var onAllReady = request.onAllReady;
                onAllReady();
              }
            }
          }
          function queueCompletedSegment(boundary, segment) {
            if (segment.chunks.length === 0 && segment.children.length === 1 && segment.children[0].boundary === null) {
              var childSegment = segment.children[0];
              childSegment.id = segment.id;
              childSegment.parentFlushed = true;
              if (childSegment.status === COMPLETED) {
                queueCompletedSegment(boundary, childSegment);
              }
            } else {
              var completedSegments = boundary.completedSegments;
              completedSegments.push(segment);
            }
          }
          function finishedTask(request, boundary, segment) {
            if (boundary === null) {
              if (segment.parentFlushed) {
                if (request.completedRootSegment !== null) {
                  throw new Error("There can only be one root segment. This is a bug in React.");
                }
                request.completedRootSegment = segment;
              }
              request.pendingRootTasks--;
              if (request.pendingRootTasks === 0) {
                request.onShellError = noop$1;
                var onShellReady = request.onShellReady;
                onShellReady();
              }
            } else {
              boundary.pendingTasks--;
              if (boundary.forceClientRender)
                ;
              else if (boundary.pendingTasks === 0) {
                if (segment.parentFlushed) {
                  if (segment.status === COMPLETED) {
                    queueCompletedSegment(boundary, segment);
                  }
                }
                if (boundary.parentFlushed) {
                  request.completedBoundaries.push(boundary);
                }
                boundary.fallbackAbortableTasks.forEach(abortTaskSoft, request);
                boundary.fallbackAbortableTasks.clear();
              } else {
                if (segment.parentFlushed) {
                  if (segment.status === COMPLETED) {
                    queueCompletedSegment(boundary, segment);
                    var completedSegments = boundary.completedSegments;
                    if (completedSegments.length === 1) {
                      if (boundary.parentFlushed) {
                        request.partialBoundaries.push(boundary);
                      }
                    }
                  }
                }
              }
            }
            request.allPendingTasks--;
            if (request.allPendingTasks === 0) {
              var onAllReady = request.onAllReady;
              onAllReady();
            }
          }
          function retryTask(request, task) {
            var segment = task.blockedSegment;
            if (segment.status !== PENDING) {
              return;
            }
            switchContext(task.context);
            var prevTaskInDEV = null;
            {
              prevTaskInDEV = currentTaskInDEV;
              currentTaskInDEV = task;
            }
            try {
              renderNodeDestructive(request, task, task.node);
              pushSegmentFinale(segment.chunks, request.responseState, segment.lastPushedText, segment.textEmbedded);
              task.abortSet.delete(task);
              segment.status = COMPLETED;
              finishedTask(request, task.blockedBoundary, segment);
            } catch (x) {
              resetHooksState();
              if (typeof x === "object" && x !== null && typeof x.then === "function") {
                var ping = task.ping;
                x.then(ping, ping);
              } else {
                task.abortSet.delete(task);
                segment.status = ERRORED;
                erroredTask(request, task.blockedBoundary, segment, x);
              }
            } finally {
              {
                currentTaskInDEV = prevTaskInDEV;
              }
            }
          }
          function performWork(request) {
            if (request.status === CLOSED) {
              return;
            }
            var prevContext = getActiveContext();
            var prevDispatcher = ReactCurrentDispatcher$1.current;
            ReactCurrentDispatcher$1.current = Dispatcher;
            var prevGetCurrentStackImpl;
            {
              prevGetCurrentStackImpl = ReactDebugCurrentFrame$1.getCurrentStack;
              ReactDebugCurrentFrame$1.getCurrentStack = getCurrentStackInDEV;
            }
            var prevResponseState = currentResponseState;
            setCurrentResponseState(request.responseState);
            try {
              var pingedTasks = request.pingedTasks;
              var i;
              for (i = 0; i < pingedTasks.length; i++) {
                var task = pingedTasks[i];
                retryTask(request, task);
              }
              pingedTasks.splice(0, i);
              if (request.destination !== null) {
                flushCompletedQueues(request, request.destination);
              }
            } catch (error2) {
              logRecoverableError(request, error2);
              fatalError(request, error2);
            } finally {
              setCurrentResponseState(prevResponseState);
              ReactCurrentDispatcher$1.current = prevDispatcher;
              {
                ReactDebugCurrentFrame$1.getCurrentStack = prevGetCurrentStackImpl;
              }
              if (prevDispatcher === Dispatcher) {
                switchContext(prevContext);
              }
            }
          }
          function flushSubtree(request, destination, segment) {
            segment.parentFlushed = true;
            switch (segment.status) {
              case PENDING: {
                var segmentID = segment.id = request.nextSegmentId++;
                segment.lastPushedText = false;
                segment.textEmbedded = false;
                return writePlaceholder(destination, request.responseState, segmentID);
              }
              case COMPLETED: {
                segment.status = FLUSHED;
                var r = true;
                var chunks = segment.chunks;
                var chunkIdx = 0;
                var children = segment.children;
                for (var childIdx = 0; childIdx < children.length; childIdx++) {
                  var nextChild = children[childIdx];
                  for (; chunkIdx < nextChild.index; chunkIdx++) {
                    writeChunk(destination, chunks[chunkIdx]);
                  }
                  r = flushSegment(request, destination, nextChild);
                }
                for (; chunkIdx < chunks.length - 1; chunkIdx++) {
                  writeChunk(destination, chunks[chunkIdx]);
                }
                if (chunkIdx < chunks.length) {
                  r = writeChunkAndReturn(destination, chunks[chunkIdx]);
                }
                return r;
              }
              default: {
                throw new Error("Aborted, errored or already flushed boundaries should not be flushed again. This is a bug in React.");
              }
            }
          }
          function flushSegment(request, destination, segment) {
            var boundary = segment.boundary;
            if (boundary === null) {
              return flushSubtree(request, destination, segment);
            }
            boundary.parentFlushed = true;
            if (boundary.forceClientRender) {
              writeStartClientRenderedSuspenseBoundary(destination, request.responseState, boundary.errorDigest, boundary.errorMessage, boundary.errorComponentStack);
              flushSubtree(request, destination, segment);
              return writeEndClientRenderedSuspenseBoundary(destination, request.responseState);
            } else if (boundary.pendingTasks > 0) {
              boundary.rootSegmentID = request.nextSegmentId++;
              if (boundary.completedSegments.length > 0) {
                request.partialBoundaries.push(boundary);
              }
              var id = boundary.id = assignSuspenseBoundaryID(request.responseState);
              writeStartPendingSuspenseBoundary(destination, request.responseState, id);
              flushSubtree(request, destination, segment);
              return writeEndPendingSuspenseBoundary(destination, request.responseState);
            } else if (boundary.byteSize > request.progressiveChunkSize) {
              boundary.rootSegmentID = request.nextSegmentId++;
              request.completedBoundaries.push(boundary);
              writeStartPendingSuspenseBoundary(destination, request.responseState, boundary.id);
              flushSubtree(request, destination, segment);
              return writeEndPendingSuspenseBoundary(destination, request.responseState);
            } else {
              writeStartCompletedSuspenseBoundary(destination, request.responseState);
              var completedSegments = boundary.completedSegments;
              if (completedSegments.length !== 1) {
                throw new Error("A previously unvisited boundary must have exactly one root segment. This is a bug in React.");
              }
              var contentSegment = completedSegments[0];
              flushSegment(request, destination, contentSegment);
              return writeEndCompletedSuspenseBoundary(destination, request.responseState);
            }
          }
          function flushClientRenderedBoundary(request, destination, boundary) {
            return writeClientRenderBoundaryInstruction(destination, request.responseState, boundary.id, boundary.errorDigest, boundary.errorMessage, boundary.errorComponentStack);
          }
          function flushSegmentContainer(request, destination, segment) {
            writeStartSegment(destination, request.responseState, segment.formatContext, segment.id);
            flushSegment(request, destination, segment);
            return writeEndSegment(destination, segment.formatContext);
          }
          function flushCompletedBoundary(request, destination, boundary) {
            var completedSegments = boundary.completedSegments;
            var i = 0;
            for (; i < completedSegments.length; i++) {
              var segment = completedSegments[i];
              flushPartiallyCompletedSegment(request, destination, boundary, segment);
            }
            completedSegments.length = 0;
            return writeCompletedBoundaryInstruction(destination, request.responseState, boundary.id, boundary.rootSegmentID);
          }
          function flushPartialBoundary(request, destination, boundary) {
            var completedSegments = boundary.completedSegments;
            var i = 0;
            for (; i < completedSegments.length; i++) {
              var segment = completedSegments[i];
              if (!flushPartiallyCompletedSegment(request, destination, boundary, segment)) {
                i++;
                completedSegments.splice(0, i);
                return false;
              }
            }
            completedSegments.splice(0, i);
            return true;
          }
          function flushPartiallyCompletedSegment(request, destination, boundary, segment) {
            if (segment.status === FLUSHED) {
              return true;
            }
            var segmentID = segment.id;
            if (segmentID === -1) {
              var rootSegmentID = segment.id = boundary.rootSegmentID;
              if (rootSegmentID === -1) {
                throw new Error("A root segment ID must have been assigned by now. This is a bug in React.");
              }
              return flushSegmentContainer(request, destination, segment);
            } else {
              flushSegmentContainer(request, destination, segment);
              return writeCompletedSegmentInstruction(destination, request.responseState, segmentID);
            }
          }
          function flushCompletedQueues(request, destination) {
            beginWriting();
            try {
              var completedRootSegment = request.completedRootSegment;
              if (completedRootSegment !== null && request.pendingRootTasks === 0) {
                flushSegment(request, destination, completedRootSegment);
                request.completedRootSegment = null;
                writeCompletedRoot(destination, request.responseState);
              }
              var clientRenderedBoundaries = request.clientRenderedBoundaries;
              var i;
              for (i = 0; i < clientRenderedBoundaries.length; i++) {
                var boundary = clientRenderedBoundaries[i];
                if (!flushClientRenderedBoundary(request, destination, boundary)) {
                  request.destination = null;
                  i++;
                  clientRenderedBoundaries.splice(0, i);
                  return;
                }
              }
              clientRenderedBoundaries.splice(0, i);
              var completedBoundaries = request.completedBoundaries;
              for (i = 0; i < completedBoundaries.length; i++) {
                var _boundary = completedBoundaries[i];
                if (!flushCompletedBoundary(request, destination, _boundary)) {
                  request.destination = null;
                  i++;
                  completedBoundaries.splice(0, i);
                  return;
                }
              }
              completedBoundaries.splice(0, i);
              completeWriting(destination);
              beginWriting(destination);
              var partialBoundaries = request.partialBoundaries;
              for (i = 0; i < partialBoundaries.length; i++) {
                var _boundary2 = partialBoundaries[i];
                if (!flushPartialBoundary(request, destination, _boundary2)) {
                  request.destination = null;
                  i++;
                  partialBoundaries.splice(0, i);
                  return;
                }
              }
              partialBoundaries.splice(0, i);
              var largeBoundaries = request.completedBoundaries;
              for (i = 0; i < largeBoundaries.length; i++) {
                var _boundary3 = largeBoundaries[i];
                if (!flushCompletedBoundary(request, destination, _boundary3)) {
                  request.destination = null;
                  i++;
                  largeBoundaries.splice(0, i);
                  return;
                }
              }
              largeBoundaries.splice(0, i);
            } finally {
              completeWriting(destination);
              if (request.allPendingTasks === 0 && request.pingedTasks.length === 0 && request.clientRenderedBoundaries.length === 0 && request.completedBoundaries.length === 0) {
                {
                  if (request.abortableTasks.size !== 0) {
                    error("There was still abortable task at the root when we closed. This is a bug in React.");
                  }
                }
                close(destination);
              }
            }
          }
          function startWork(request) {
            scheduleWork(function() {
              return performWork(request);
            });
          }
          function startFlowing(request, destination) {
            if (request.status === CLOSING) {
              request.status = CLOSED;
              closeWithError(destination, request.fatalError);
              return;
            }
            if (request.status === CLOSED) {
              return;
            }
            if (request.destination !== null) {
              return;
            }
            request.destination = destination;
            try {
              flushCompletedQueues(request, destination);
            } catch (error2) {
              logRecoverableError(request, error2);
              fatalError(request, error2);
            }
          }
          function abort(request, reason) {
            try {
              var abortableTasks = request.abortableTasks;
              abortableTasks.forEach(function(task) {
                return abortTask(task, request, reason);
              });
              abortableTasks.clear();
              if (request.destination !== null) {
                flushCompletedQueues(request, request.destination);
              }
            } catch (error2) {
              logRecoverableError(request, error2);
              fatalError(request, error2);
            }
          }
          function renderToReadableStream(children, options) {
            return new Promise(function(resolve, reject) {
              var onFatalError;
              var onAllReady;
              var allReady = new Promise(function(res, rej) {
                onAllReady = res;
                onFatalError = rej;
              });
              function onShellReady() {
                var stream = new ReadableStream(
                  {
                    type: "bytes",
                    pull: function(controller) {
                      startFlowing(request, controller);
                    },
                    cancel: function(reason) {
                      abort(request);
                    }
                  },
                  // $FlowFixMe size() methods are not allowed on byte streams.
                  {
                    highWaterMark: 0
                  }
                );
                stream.allReady = allReady;
                resolve(stream);
              }
              function onShellError(error2) {
                allReady.catch(function() {
                });
                reject(error2);
              }
              var request = createRequest(children, createResponseState(options ? options.identifierPrefix : void 0, options ? options.nonce : void 0, options ? options.bootstrapScriptContent : void 0, options ? options.bootstrapScripts : void 0, options ? options.bootstrapModules : void 0), createRootFormatContext(options ? options.namespaceURI : void 0), options ? options.progressiveChunkSize : void 0, options ? options.onError : void 0, onAllReady, onShellReady, onShellError, onFatalError);
              if (options && options.signal) {
                var signal = options.signal;
                var listener = function() {
                  abort(request, signal.reason);
                  signal.removeEventListener("abort", listener);
                };
                signal.addEventListener("abort", listener);
              }
              startWork(request);
            });
          }
          exports.renderToReadableStream = renderToReadableStream;
          exports.version = ReactVersion;
        })();
      }
    }
  });

  // node_modules/react-dom/server.browser.js
  var require_server_browser = __commonJS({
    "node_modules/react-dom/server.browser.js"(exports) {
      "use strict";
      var l;
      var s;
      if (false) {
        l = null;
        s = null;
      } else {
        l = require_react_dom_server_legacy_browser_development();
        s = require_react_dom_server_browser_development();
      }
      exports.version = l.version;
      exports.renderToString = l.renderToString;
      exports.renderToStaticMarkup = l.renderToStaticMarkup;
      exports.renderToNodeStream = l.renderToNodeStream;
      exports.renderToStaticNodeStream = l.renderToStaticNodeStream;
      exports.renderToReadableStream = s.renderToReadableStream;
    }
  });

  // app/javascript/utils/deviceKey.js
  var require_deviceKey = __commonJS({
    "app/javascript/utils/deviceKey.js"(exports, module) {
      var generateDeviceKey2 = async () => {
        try {
          const array = new Uint8Array(32);
          crypto.getRandomValues(array);
          const key = Array.from(array).map((b) => b.toString(16).padStart(2, "0")).join("");
          console.log("Generated new device key:", key.substring(0, 10) + "...");
          return key;
        } catch (err) {
          console.error("Failed to generate device key:", err);
          return null;
        }
      };
      var getCompleteDeviceHeaderFromStorage3 = () => {
        try {
          const headerString = localStorage.getItem("superapp_device_header");
          if (!headerString) {
            console.log("No device header found in localStorage");
            return null;
          }
          const parsedHeader = JSON.parse(headerString);
          if (parsedHeader.deviceId && parsedHeader.userGuid && parsedHeader.userHandle) {
            console.log("Found complete device header in localStorage with all required fields:", {
              deviceId: parsedHeader.deviceId.substring(0, 10) + "...",
              userGuid: parsedHeader.userGuid,
              userHandle: parsedHeader.userHandle
            });
            return parsedHeader;
          } else {
            console.warn("Found incomplete device header in localStorage (missing required fields):", {
              hasDeviceId: !!parsedHeader.deviceId,
              hasUserGuid: !!parsedHeader.userGuid,
              hasUserHandle: !!parsedHeader.userHandle
            });
            if (!parsedHeader.deviceId || !parsedHeader.userGuid || !parsedHeader.userHandle) {
              console.warn("Removing incomplete device header from localStorage");
              localStorage.removeItem("superapp_device_header");
            }
            return null;
          }
        } catch (e) {
          console.error("Error parsing device header from localStorage:", e);
          localStorage.removeItem("superapp_device_header");
          return null;
        }
      };
      var getStoredDeviceKey3 = async () => {
        try {
          console.log("Checking for existing device key");
          const completeHeader = getCompleteDeviceHeaderFromStorage3();
          if (completeHeader && completeHeader.deviceId) {
            console.log("Using deviceId from complete device header:", completeHeader.deviceId.substring(0, 10) + "...");
            sessionStorage.setItem("device_key", completeHeader.deviceId);
            return completeHeader.deviceId;
          }
          const sessionKey = sessionStorage.getItem("device_key");
          if (sessionKey) {
            console.log("Found existing device key in session storage:", sessionKey.substring(0, 10) + "...");
            return sessionKey;
          }
          console.log("No device key found, generating new one");
          const newKey = await generateDeviceKey2();
          if (newKey) {
            sessionStorage.setItem("device_key", newKey);
            console.log("Stored new device key in session storage");
          }
          return newKey;
        } catch (err) {
          console.error("Error in getStoredDeviceKey:", err);
          const existingKey = sessionStorage.getItem("device_key");
          if (existingKey) {
            return existingKey;
          }
          return generateDeviceKey2();
        }
      };
      var getDeviceFingerprint2 = async () => {
        try {
          let deviceType = "Desktop";
          let deviceModel = "";
          const userAgent = navigator.userAgent.toLowerCase();
          if (/iphone|ipad|ipod/.test(userAgent)) {
            if (/ipad/.test(userAgent)) {
              deviceType = "iPad";
            } else if (/ipod/.test(userAgent)) {
              deviceType = "iPod";
            } else {
              deviceType = "iPhone";
            }
            const iosMatch = userAgent.match(/os (\d+)_(\d+)/);
            if (iosMatch) {
              deviceModel = `iOS ${iosMatch[1]}.${iosMatch[2]}`;
            }
          } else if (/android/.test(userAgent)) {
            deviceType = /mobile/.test(userAgent) ? "Android Phone" : "Android Tablet";
          } else if (/macintosh|mac os x/.test(userAgent)) {
            deviceType = "MacBook";
            if (window.screen.width > 1800 && window.screen.height > 1e3) {
              deviceType = "iMac/Mac Pro";
            }
          } else if (/windows/.test(userAgent)) {
            deviceType = "Windows PC";
          } else if (/linux/.test(userAgent)) {
            deviceType = "Linux PC";
          }
          const characteristics = {
            platform: navigator.platform || "unknown",
            screenWidth: window.screen.width,
            screenHeight: window.screen.height,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            language: navigator.language || "unknown",
            devicePixelRatio: window.devicePixelRatio || 1,
            browserFamily: detectBrowserFamily2(navigator.userAgent),
            colorDepth: window.screen.colorDepth,
            // Additional characteristics you already have
            cpuCores: navigator.hardwareConcurrency || 0,
            touchSupport: "ontouchstart" in window || navigator.maxTouchPoints > 0,
            cookiesEnabled: navigator.cookieEnabled,
            // Add new device type info
            deviceType,
            deviceModel
          };
          console.log(
            "Generated device fingerprint with characteristics:",
            JSON.stringify(characteristics).substring(0, 100) + "..."
          );
          return characteristics;
        } catch (err) {
          console.error("Error generating device fingerprint:", err);
          return null;
        }
      };
      var detectBrowserFamily2 = (userAgent) => {
        if (/Chrome/i.test(userAgent))
          return "Chrome";
        if (/Firefox/i.test(userAgent))
          return "Firefox";
        if (/Safari/i.test(userAgent))
          return "Safari";
        if (/Edge|Edg/i.test(userAgent))
          return "Edge";
        if (/MSIE|Trident/i.test(userAgent))
          return "Internet Explorer";
        if (/Opera|OPR/i.test(userAgent))
          return "Opera";
        return "Unknown";
      };
      var generateDeviceHeader3 = (deviceId, userGuid, userHandle) => {
        if (!deviceId) {
          console.warn("Missing deviceId for device header generation");
          return null;
        }
        if (!userGuid) {
          console.warn("Missing userGuid for device header generation");
          return null;
        }
        if (!userHandle) {
          console.warn("Missing userHandle for device header generation");
          return null;
        }
        console.log("Generating device header with all required fields:", {
          deviceId: deviceId.substring(0, 10) + "...",
          userGuid,
          userHandle
        });
        try {
          const deviceCharacteristics = {
            platform: navigator.platform || "unknown",
            screenWidth: window.screen.width,
            screenHeight: window.screen.height,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            language: navigator.language || "unknown",
            devicePixelRatio: window.devicePixelRatio || 1,
            browserFamily: detectBrowserFamily2(navigator.userAgent),
            colorDepth: window.screen.colorDepth
          };
          try {
            const testKey = "superapp_local_storage_test";
            localStorage.setItem(testKey, "test");
            localStorage.removeItem(testKey);
          } catch (storageError) {
            console.error("LocalStorage not accessible:", storageError);
            return null;
          }
          const headerData = {
            deviceId,
            userGuid,
            userHandle,
            timestamp: Date.now(),
            deviceCharacteristics
          };
          headerData.signature = generateSimpleSignature(headerData);
          const headerString = JSON.stringify(headerData);
          localStorage.setItem("superapp_device_header", headerString);
          const storedValue = localStorage.getItem("superapp_device_header");
          const success = !!storedValue;
          if (success) {
            console.log("Device header successfully stored in localStorage with all required fields");
            try {
              const parsedHeader = JSON.parse(storedValue);
              console.log("Verified header can be parsed back with fields:", {
                hasDeviceId: !!parsedHeader.deviceId,
                hasUserGuid: !!parsedHeader.userGuid,
                hasUserHandle: !!parsedHeader.userHandle
              });
            } catch (e) {
              console.error("Error parsing stored header during verification:", e);
            }
          } else {
            console.error("Failed to store device header in localStorage");
          }
          return success ? headerString : null;
        } catch (err) {
          console.error("Error generating device header:", err);
          return null;
        }
      };
      var generateSimpleSignature = (data) => {
        try {
          const deviceId = data.deviceId || "";
          const userGuid = data.userGuid || "";
          const timestamp = data.timestamp || Date.now();
          let signatureBase = `${deviceId}|${userGuid}|${timestamp}`;
          let hash = 0;
          for (let i = 0; i < signatureBase.length; i++) {
            hash = (hash << 5) - hash + signatureBase.charCodeAt(i);
            hash |= 0;
          }
          return hash.toString(16);
        } catch (err) {
          console.error("Error generating signature:", err);
          return "invalid";
        }
      };
      var getDeviceHeader3 = () => {
        try {
          const headerString = localStorage.getItem("superapp_device_header");
          if (!headerString) {
            console.log("No device header found in localStorage");
            return null;
          }
          const parsed = JSON.parse(headerString);
          if (!parsed.deviceId || !parsed.userGuid || !parsed.userHandle) {
            console.warn("Invalid device header data in localStorage, removing it:", {
              hasDeviceId: !!parsed.deviceId,
              hasUserGuid: !!parsed.userGuid,
              hasUserHandle: !!parsed.userHandle
            });
            localStorage.removeItem("superapp_device_header");
            return null;
          }
          const expectedSignature = generateSimpleSignature(parsed);
          if (parsed.signature !== expectedSignature) {
            console.warn("Device header signature mismatch, possible tampering");
            localStorage.removeItem("superapp_device_header");
            return null;
          }
          if (parsed.timestamp && Date.now() - parsed.timestamp > 30 * 24 * 60 * 60 * 1e3) {
            console.log("Device header expired (older than 30 days), removing");
            localStorage.removeItem("superapp_device_header");
            return null;
          }
          console.log("Found valid device header in localStorage for cross-browser recognition");
          return headerString;
        } catch (err) {
          console.error("Error retrieving device header:", err);
          localStorage.removeItem("superapp_device_header");
          return null;
        }
      };
      var storeDeviceSessionData2 = (data) => {
        if (!data)
          return;
        console.log("Storing device session data:", JSON.stringify(data).substring(0, 100) + "...");
        if (data.device_key) {
          storeDeviceKey2(data.device_key);
        }
        if (data.status === "authenticated") {
          sessionStorage.setItem("device_session", "authenticated");
          localStorage.setItem("authenticated_user", "true");
        }
        if (data.handle) {
          sessionStorage.setItem("current_handle", data.handle);
        }
        if (data.phone) {
          sessionStorage.setItem("current_phone", data.phone);
        }
        if (data.guid) {
          sessionStorage.setItem("current_guid", data.guid);
        }
        if (data.masked_phone) {
          sessionStorage.setItem("masked_phone", data.masked_phone);
        }
        sessionStorage.setItem("last_device_check", Date.now().toString());
        if (data.device_header_data) {
          console.log("Processing device_header_data from authentication response");
          if (data.device_header_data.deviceId && data.device_header_data.userGuid && data.device_header_data.userHandle) {
            const headerStored = generateDeviceHeader3(
              data.device_header_data.deviceId,
              data.device_header_data.userGuid,
              data.device_header_data.userHandle
            );
            console.log("Device header storage result:", headerStored ? "SUCCESS" : "FAILED");
            console.log("STORED DEVICE HEADER CONTENT:", localStorage.getItem("superapp_device_header"));
          } else {
            console.warn("Incomplete device_header_data - missing required fields:", {
              hasDeviceId: !!data.device_header_data.deviceId,
              hasUserGuid: !!data.device_header_data.userGuid,
              hasUserHandle: !!data.device_header_data.userHandle
            });
          }
        } else if (data.device_key && data.guid && data.handle) {
          console.log("Creating device header from individual fields");
          const headerStored = generateDeviceHeader3(data.device_key, data.guid, data.handle);
          console.log("Device header storage result:", headerStored ? "SUCCESS" : "FAILED");
          if (!headerStored && data.device_key && data.guid && data.handle) {
            const headerData = {
              deviceId: data.device_key,
              userGuid: data.guid,
              userHandle: data.handle,
              timestamp: Date.now()
            };
            try {
              console.log("Forcing storage of complete device header with all required fields");
              localStorage.setItem("superapp_device_header", JSON.stringify(headerData));
              console.log(
                "Forced device header creation successful:",
                !!localStorage.getItem("superapp_device_header")
              );
            } catch (e) {
              console.error("Error forcing storage of device header:", e);
            }
          }
          console.log(
            "AFTER STORAGE - DEVICE HEADER CONTENT:",
            localStorage.getItem("superapp_device_header")
          );
        } else {
          console.warn(
            "Insufficient data to generate device header -",
            "device_key:",
            !!data.device_key,
            "guid:",
            !!data.guid,
            "handle:",
            !!data.handle
          );
        }
      };
      var storeDeviceKey2 = (key) => {
        if (key) {
          sessionStorage.setItem("device_key", key);
          console.log("Stored device key:", key.substring(0, 10) + "...");
        } else {
          console.warn("Attempted to store null or undefined device key");
        }
      };
      var clearDeviceSession2 = () => {
        const deviceKey = sessionStorage.getItem("device_key");
        const currentHandle = sessionStorage.getItem("current_handle");
        if (currentHandle) {
          localStorage.setItem("previous_handle", currentHandle);
        }
        localStorage.setItem("logout_state", "true");
        sessionStorage.clear();
        localStorage.removeItem("superapp_device_header");
        if (deviceKey) {
          sessionStorage.setItem("device_key", deviceKey);
        }
        sessionStorage.setItem("logging_out", "true");
        console.log("Cleared device session data, preserved device key for recognition");
      };
      var base64urlToArrayBuffer = (base64url) => {
        const base64 = base64url.replace(/-/g, "+").replace(/_/g, "/");
        const padding = "=".repeat((4 - base64.length % 4) % 4);
        const base64Padded = base64 + padding;
        const binary = window.atob(base64Padded);
        const buffer = new ArrayBuffer(binary.length);
        const bytes = new Uint8Array(buffer);
        for (let i = 0; i < binary.length; i++) {
          bytes[i] = binary.charCodeAt(i);
        }
        return buffer;
      };
      var arrayBufferToBase64url = (buffer) => {
        const bytes = new Uint8Array(buffer);
        let binary = "";
        for (let i = 0; i < bytes.byteLength; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        const base64 = window.btoa(binary);
        return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
      };
      var formatCredentialForServer = (credential) => {
        return {
          id: credential.id,
          type: credential.type,
          rawId: arrayBufferToBase64url(credential.rawId),
          response: {
            clientDataJSON: arrayBufferToBase64url(credential.response.clientDataJSON),
            attestationObject: credential.response.attestationObject ? arrayBufferToBase64url(credential.response.attestationObject) : void 0,
            authenticatorData: credential.response.authenticatorData ? arrayBufferToBase64url(credential.response.authenticatorData) : void 0,
            signature: credential.response.signature ? arrayBufferToBase64url(credential.response.signature) : void 0,
            userHandle: credential.response.userHandle ? arrayBufferToBase64url(credential.response.userHandle) : void 0
          }
        };
      };
      var registerWebAuthnCredential2 = async () => {
        try {
          console.log("Starting WebAuthn registration process");
          if (typeof showOverlay === "function") {
            showOverlay("Securing your device for faster login in the future...");
          }
          const optionsResponse = await fetch("/api/v1/auth/webauthn_registration_options", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-CSRF-Token": getCsrfToken()
            }
          });
          if (!optionsResponse.ok) {
            const error = await optionsResponse.json();
            console.error("Error getting WebAuthn registration options:", error);
            return false;
          }
          const options = await optionsResponse.json();
          console.log("Got WebAuthn registration options from server");
          options.publicKey.challenge = base64urlToArrayBuffer(options.publicKey.challenge);
          options.publicKey.user.id = base64urlToArrayBuffer(options.publicKey.user.id);
          if (options.publicKey.excludeCredentials) {
            options.publicKey.excludeCredentials = options.publicKey.excludeCredentials.map((credential2) => {
              return {
                ...credential2,
                id: base64urlToArrayBuffer(credential2.id)
              };
            });
          }
          console.log("Creating WebAuthn credential");
          const credential = await navigator.credentials.create({
            publicKey: options.publicKey
          });
          const credentialData = formatCredentialForServer(credential);
          console.log("Sending WebAuthn credential to server");
          const registerResponse = await fetch("/api/v1/auth/register_webauthn_credential", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-CSRF-Token": getCsrfToken()
            },
            body: JSON.stringify({ credential: credentialData })
          });
          if (typeof hideOverlay === "function") {
            hideOverlay();
          }
          if (!registerResponse.ok) {
            const error = await registerResponse.json();
            console.error("Error registering WebAuthn credential:", error);
            return false;
          }
          console.log("WebAuthn credential registered successfully");
          return true;
        } catch (error) {
          console.error("WebAuthn registration failed:", error);
          if (typeof hideOverlay === "function") {
            hideOverlay();
          }
          return false;
        }
      };
      var verifyWebAuthnCredential2 = async (handle) => {
        try {
          console.log("Starting WebAuthn verification for handle:", handle);
          if (typeof showOverlay === "function") {
            showOverlay("Preparing secure login...");
          }
          const optionsResponse = await fetch(`/api/v1/auth/webauthn_login_options?handle=${encodeURIComponent(handle)}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-CSRF-Token": getCsrfToken()
            }
          });
          if (!optionsResponse.ok) {
            const error = await optionsResponse.json();
            console.error("Error getting WebAuthn login options:", error);
            return { success: false };
          }
          const options = await optionsResponse.json();
          console.log("Got WebAuthn login options from server");
          options.publicKey.challenge = base64urlToArrayBuffer(options.publicKey.challenge);
          if (options.publicKey.allowCredentials) {
            options.publicKey.allowCredentials = options.publicKey.allowCredentials.map((credential2) => {
              return {
                ...credential2,
                id: base64urlToArrayBuffer(credential2.id)
              };
            });
          }
          console.log("Attempting WebAuthn authentication");
          const credential = await navigator.credentials.get({
            publicKey: options.publicKey
          });
          const credentialData = formatCredentialForServer(credential);
          if (typeof showOverlay === "function") {
            showOverlay("Verification successful! Preparing your dashboard...");
          }
          console.log("Sending WebAuthn verification to server");
          const verifyResponse = await fetch("/api/v1/auth/verify_webauthn_login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-CSRF-Token": getCsrfToken()
            },
            body: JSON.stringify({
              credential: credentialData,
              handle
            })
          });
          if (!verifyResponse.ok) {
            const error = await verifyResponse.json();
            console.error("WebAuthn verification failed:", error);
            if (typeof hideOverlay === "function") {
              hideOverlay();
            }
            return { success: false };
          }
          const response = await verifyResponse.json();
          console.log("WebAuthn verification successful:", response);
          return {
            success: true,
            data: response
          };
        } catch (error) {
          console.error("WebAuthn verification error:", error);
          if (typeof hideOverlay === "function") {
            hideOverlay();
          }
          return { success: false };
        }
      };
      var isWebAuthnSupported2 = () => {
        return window.PublicKeyCredential !== void 0;
      };
      var getCsrfToken = () => {
        return document.querySelector('meta[name="csrf-token"]')?.getAttribute("content");
      };
      module.exports = {
        generateDeviceKey: generateDeviceKey2,
        getStoredDeviceKey: getStoredDeviceKey3,
        storeDeviceKey: storeDeviceKey2,
        storeDeviceSessionData: storeDeviceSessionData2,
        clearDeviceSession: clearDeviceSession2,
        generateDeviceHeader: generateDeviceHeader3,
        getDeviceHeader: getDeviceHeader3,
        getDeviceFingerprint: getDeviceFingerprint2,
        getCompleteDeviceHeaderFromStorage: getCompleteDeviceHeaderFromStorage3,
        // WebAuthn functions
        registerWebAuthnCredential: registerWebAuthnCredential2,
        verifyWebAuthnCredential: verifyWebAuthnCredential2,
        isWebAuthnSupported: isWebAuthnSupported2,
        base64urlToArrayBuffer,
        arrayBufferToBase64url,
        formatCredentialForServer
      };
    }
  });

  // app/javascript/entrypoints/server_rendering.js
  var import_react3 = __toESM(require_react());
  var import_server = __toESM(require_server_browser());

  // app/javascript/components/auth/UnifiedLogin.jsx
  var import_react2 = __toESM(require_react());

  // node_modules/lucide-react/dist/esm/createLucideIcon.js
  var import_react = __toESM(require_react());

  // node_modules/lucide-react/dist/esm/defaultAttributes.js
  var defaultAttributes = {
    xmlns: "http://www.w3.org/2000/svg",
    width: 24,
    height: 24,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeLinejoin: "round"
  };

  // node_modules/lucide-react/dist/esm/createLucideIcon.js
  var toKebabCase = (string) => string.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase().trim();
  var createLucideIcon = (iconName, iconNode) => {
    const Component = (0, import_react.forwardRef)(
      ({ color = "currentColor", size = 24, strokeWidth = 2, absoluteStrokeWidth, className = "", children, ...rest }, ref) => {
        return (0, import_react.createElement)(
          "svg",
          {
            ref,
            ...defaultAttributes,
            width: size,
            height: size,
            stroke: color,
            strokeWidth: absoluteStrokeWidth ? Number(strokeWidth) * 24 / Number(size) : strokeWidth,
            className: ["lucide", `lucide-${toKebabCase(iconName)}`, className].join(" "),
            ...rest
          },
          [
            ...iconNode.map(([tag, attrs]) => (0, import_react.createElement)(tag, attrs)),
            ...Array.isArray(children) ? children : [children]
          ]
        );
      }
    );
    Component.displayName = `${iconName}`;
    return Component;
  };

  // node_modules/lucide-react/dist/esm/icons/arrow-left.js
  var ArrowLeft = createLucideIcon("ArrowLeft", [
    ["path", { d: "m12 19-7-7 7-7", key: "1l729n" }],
    ["path", { d: "M19 12H5", key: "x3x0zl" }]
  ]);

  // node_modules/lucide-react/dist/esm/icons/arrow-right.js
  var ArrowRight = createLucideIcon("ArrowRight", [
    ["path", { d: "M5 12h14", key: "1ays0h" }],
    ["path", { d: "m12 5 7 7-7 7", key: "xquz4c" }]
  ]);

  // node_modules/lucide-react/dist/esm/icons/check.js
  var Check = createLucideIcon("Check", [["path", { d: "M20 6 9 17l-5-5", key: "1gmf2c" }]]);

  // node_modules/lucide-react/dist/esm/icons/chevron-down.js
  var ChevronDown = createLucideIcon("ChevronDown", [
    ["path", { d: "m6 9 6 6 6-6", key: "qrunsl" }]
  ]);

  // node_modules/lucide-react/dist/esm/icons/lock.js
  var Lock = createLucideIcon("Lock", [
    ["rect", { width: "18", height: "11", x: "3", y: "11", rx: "2", ry: "2", key: "1w4ew1" }],
    ["path", { d: "M7 11V7a5 5 0 0 1 10 0v4", key: "fwvmzm" }]
  ]);

  // node_modules/lucide-react/dist/esm/icons/phone.js
  var Phone = createLucideIcon("Phone", [
    [
      "path",
      {
        d: "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z",
        key: "foiqr5"
      }
    ]
  ]);

  // node_modules/lucide-react/dist/esm/icons/user.js
  var User = createLucideIcon("User", [
    ["path", { d: "M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2", key: "975kel" }],
    ["circle", { cx: "12", cy: "7", r: "4", key: "17ys0d" }]
  ]);

  // node_modules/lucide-react/dist/esm/icons/x.js
  var X = createLucideIcon("X", [
    ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
    ["path", { d: "m6 6 12 12", key: "d8bk6v" }]
  ]);

  // node_modules/axios/lib/helpers/bind.js
  function bind(fn, thisArg) {
    return function wrap() {
      return fn.apply(thisArg, arguments);
    };
  }

  // node_modules/axios/lib/utils.js
  var { toString } = Object.prototype;
  var { getPrototypeOf } = Object;
  var kindOf = /* @__PURE__ */ ((cache) => (thing) => {
    const str = toString.call(thing);
    return cache[str] || (cache[str] = str.slice(8, -1).toLowerCase());
  })(/* @__PURE__ */ Object.create(null));
  var kindOfTest = (type) => {
    type = type.toLowerCase();
    return (thing) => kindOf(thing) === type;
  };
  var typeOfTest = (type) => (thing) => typeof thing === type;
  var { isArray } = Array;
  var isUndefined = typeOfTest("undefined");
  function isBuffer(val) {
    return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor) && isFunction(val.constructor.isBuffer) && val.constructor.isBuffer(val);
  }
  var isArrayBuffer = kindOfTest("ArrayBuffer");
  function isArrayBufferView(val) {
    let result;
    if (typeof ArrayBuffer !== "undefined" && ArrayBuffer.isView) {
      result = ArrayBuffer.isView(val);
    } else {
      result = val && val.buffer && isArrayBuffer(val.buffer);
    }
    return result;
  }
  var isString = typeOfTest("string");
  var isFunction = typeOfTest("function");
  var isNumber = typeOfTest("number");
  var isObject = (thing) => thing !== null && typeof thing === "object";
  var isBoolean = (thing) => thing === true || thing === false;
  var isPlainObject = (val) => {
    if (kindOf(val) !== "object") {
      return false;
    }
    const prototype3 = getPrototypeOf(val);
    return (prototype3 === null || prototype3 === Object.prototype || Object.getPrototypeOf(prototype3) === null) && !(Symbol.toStringTag in val) && !(Symbol.iterator in val);
  };
  var isDate = kindOfTest("Date");
  var isFile = kindOfTest("File");
  var isBlob = kindOfTest("Blob");
  var isFileList = kindOfTest("FileList");
  var isStream = (val) => isObject(val) && isFunction(val.pipe);
  var isFormData = (thing) => {
    let kind;
    return thing && (typeof FormData === "function" && thing instanceof FormData || isFunction(thing.append) && ((kind = kindOf(thing)) === "formdata" || // detect form-data instance
    kind === "object" && isFunction(thing.toString) && thing.toString() === "[object FormData]"));
  };
  var isURLSearchParams = kindOfTest("URLSearchParams");
  var [isReadableStream, isRequest, isResponse, isHeaders] = ["ReadableStream", "Request", "Response", "Headers"].map(kindOfTest);
  var trim = (str) => str.trim ? str.trim() : str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
  function forEach(obj, fn, { allOwnKeys = false } = {}) {
    if (obj === null || typeof obj === "undefined") {
      return;
    }
    let i;
    let l;
    if (typeof obj !== "object") {
      obj = [obj];
    }
    if (isArray(obj)) {
      for (i = 0, l = obj.length; i < l; i++) {
        fn.call(null, obj[i], i, obj);
      }
    } else {
      const keys = allOwnKeys ? Object.getOwnPropertyNames(obj) : Object.keys(obj);
      const len = keys.length;
      let key;
      for (i = 0; i < len; i++) {
        key = keys[i];
        fn.call(null, obj[key], key, obj);
      }
    }
  }
  function findKey(obj, key) {
    key = key.toLowerCase();
    const keys = Object.keys(obj);
    let i = keys.length;
    let _key;
    while (i-- > 0) {
      _key = keys[i];
      if (key === _key.toLowerCase()) {
        return _key;
      }
    }
    return null;
  }
  var _global = (() => {
    if (typeof globalThis !== "undefined")
      return globalThis;
    return typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : global;
  })();
  var isContextDefined = (context) => !isUndefined(context) && context !== _global;
  function merge() {
    const { caseless } = isContextDefined(this) && this || {};
    const result = {};
    const assignValue = (val, key) => {
      const targetKey = caseless && findKey(result, key) || key;
      if (isPlainObject(result[targetKey]) && isPlainObject(val)) {
        result[targetKey] = merge(result[targetKey], val);
      } else if (isPlainObject(val)) {
        result[targetKey] = merge({}, val);
      } else if (isArray(val)) {
        result[targetKey] = val.slice();
      } else {
        result[targetKey] = val;
      }
    };
    for (let i = 0, l = arguments.length; i < l; i++) {
      arguments[i] && forEach(arguments[i], assignValue);
    }
    return result;
  }
  var extend = (a, b, thisArg, { allOwnKeys } = {}) => {
    forEach(b, (val, key) => {
      if (thisArg && isFunction(val)) {
        a[key] = bind(val, thisArg);
      } else {
        a[key] = val;
      }
    }, { allOwnKeys });
    return a;
  };
  var stripBOM = (content) => {
    if (content.charCodeAt(0) === 65279) {
      content = content.slice(1);
    }
    return content;
  };
  var inherits = (constructor, superConstructor, props, descriptors2) => {
    constructor.prototype = Object.create(superConstructor.prototype, descriptors2);
    constructor.prototype.constructor = constructor;
    Object.defineProperty(constructor, "super", {
      value: superConstructor.prototype
    });
    props && Object.assign(constructor.prototype, props);
  };
  var toFlatObject = (sourceObj, destObj, filter2, propFilter) => {
    let props;
    let i;
    let prop;
    const merged = {};
    destObj = destObj || {};
    if (sourceObj == null)
      return destObj;
    do {
      props = Object.getOwnPropertyNames(sourceObj);
      i = props.length;
      while (i-- > 0) {
        prop = props[i];
        if ((!propFilter || propFilter(prop, sourceObj, destObj)) && !merged[prop]) {
          destObj[prop] = sourceObj[prop];
          merged[prop] = true;
        }
      }
      sourceObj = filter2 !== false && getPrototypeOf(sourceObj);
    } while (sourceObj && (!filter2 || filter2(sourceObj, destObj)) && sourceObj !== Object.prototype);
    return destObj;
  };
  var endsWith = (str, searchString, position) => {
    str = String(str);
    if (position === void 0 || position > str.length) {
      position = str.length;
    }
    position -= searchString.length;
    const lastIndex = str.indexOf(searchString, position);
    return lastIndex !== -1 && lastIndex === position;
  };
  var toArray = (thing) => {
    if (!thing)
      return null;
    if (isArray(thing))
      return thing;
    let i = thing.length;
    if (!isNumber(i))
      return null;
    const arr = new Array(i);
    while (i-- > 0) {
      arr[i] = thing[i];
    }
    return arr;
  };
  var isTypedArray = /* @__PURE__ */ ((TypedArray) => {
    return (thing) => {
      return TypedArray && thing instanceof TypedArray;
    };
  })(typeof Uint8Array !== "undefined" && getPrototypeOf(Uint8Array));
  var forEachEntry = (obj, fn) => {
    const generator = obj && obj[Symbol.iterator];
    const iterator = generator.call(obj);
    let result;
    while ((result = iterator.next()) && !result.done) {
      const pair = result.value;
      fn.call(obj, pair[0], pair[1]);
    }
  };
  var matchAll = (regExp, str) => {
    let matches;
    const arr = [];
    while ((matches = regExp.exec(str)) !== null) {
      arr.push(matches);
    }
    return arr;
  };
  var isHTMLForm = kindOfTest("HTMLFormElement");
  var toCamelCase = (str) => {
    return str.toLowerCase().replace(
      /[-_\s]([a-z\d])(\w*)/g,
      function replacer(m, p1, p2) {
        return p1.toUpperCase() + p2;
      }
    );
  };
  var hasOwnProperty = (({ hasOwnProperty: hasOwnProperty2 }) => (obj, prop) => hasOwnProperty2.call(obj, prop))(Object.prototype);
  var isRegExp = kindOfTest("RegExp");
  var reduceDescriptors = (obj, reducer) => {
    const descriptors2 = Object.getOwnPropertyDescriptors(obj);
    const reducedDescriptors = {};
    forEach(descriptors2, (descriptor, name) => {
      let ret;
      if ((ret = reducer(descriptor, name, obj)) !== false) {
        reducedDescriptors[name] = ret || descriptor;
      }
    });
    Object.defineProperties(obj, reducedDescriptors);
  };
  var freezeMethods = (obj) => {
    reduceDescriptors(obj, (descriptor, name) => {
      if (isFunction(obj) && ["arguments", "caller", "callee"].indexOf(name) !== -1) {
        return false;
      }
      const value = obj[name];
      if (!isFunction(value))
        return;
      descriptor.enumerable = false;
      if ("writable" in descriptor) {
        descriptor.writable = false;
        return;
      }
      if (!descriptor.set) {
        descriptor.set = () => {
          throw Error("Can not rewrite read-only method '" + name + "'");
        };
      }
    });
  };
  var toObjectSet = (arrayOrString, delimiter) => {
    const obj = {};
    const define = (arr) => {
      arr.forEach((value) => {
        obj[value] = true;
      });
    };
    isArray(arrayOrString) ? define(arrayOrString) : define(String(arrayOrString).split(delimiter));
    return obj;
  };
  var noop = () => {
  };
  var toFiniteNumber = (value, defaultValue) => {
    return value != null && Number.isFinite(value = +value) ? value : defaultValue;
  };
  var ALPHA = "abcdefghijklmnopqrstuvwxyz";
  var DIGIT = "0123456789";
  var ALPHABET = {
    DIGIT,
    ALPHA,
    ALPHA_DIGIT: ALPHA + ALPHA.toUpperCase() + DIGIT
  };
  var generateString = (size = 16, alphabet = ALPHABET.ALPHA_DIGIT) => {
    let str = "";
    const { length } = alphabet;
    while (size--) {
      str += alphabet[Math.random() * length | 0];
    }
    return str;
  };
  function isSpecCompliantForm(thing) {
    return !!(thing && isFunction(thing.append) && thing[Symbol.toStringTag] === "FormData" && thing[Symbol.iterator]);
  }
  var toJSONObject = (obj) => {
    const stack = new Array(10);
    const visit = (source, i) => {
      if (isObject(source)) {
        if (stack.indexOf(source) >= 0) {
          return;
        }
        if (!("toJSON" in source)) {
          stack[i] = source;
          const target = isArray(source) ? [] : {};
          forEach(source, (value, key) => {
            const reducedValue = visit(value, i + 1);
            !isUndefined(reducedValue) && (target[key] = reducedValue);
          });
          stack[i] = void 0;
          return target;
        }
      }
      return source;
    };
    return visit(obj, 0);
  };
  var isAsyncFn = kindOfTest("AsyncFunction");
  var isThenable = (thing) => thing && (isObject(thing) || isFunction(thing)) && isFunction(thing.then) && isFunction(thing.catch);
  var _setImmediate = ((setImmediateSupported, postMessageSupported) => {
    if (setImmediateSupported) {
      return setImmediate;
    }
    return postMessageSupported ? ((token, callbacks) => {
      _global.addEventListener("message", ({ source, data }) => {
        if (source === _global && data === token) {
          callbacks.length && callbacks.shift()();
        }
      }, false);
      return (cb) => {
        callbacks.push(cb);
        _global.postMessage(token, "*");
      };
    })(`axios@${Math.random()}`, []) : (cb) => setTimeout(cb);
  })(
    typeof setImmediate === "function",
    isFunction(_global.postMessage)
  );
  var asap = typeof queueMicrotask !== "undefined" ? queueMicrotask.bind(_global) : typeof process !== "undefined" && process.nextTick || _setImmediate;
  var utils_default = {
    isArray,
    isArrayBuffer,
    isBuffer,
    isFormData,
    isArrayBufferView,
    isString,
    isNumber,
    isBoolean,
    isObject,
    isPlainObject,
    isReadableStream,
    isRequest,
    isResponse,
    isHeaders,
    isUndefined,
    isDate,
    isFile,
    isBlob,
    isRegExp,
    isFunction,
    isStream,
    isURLSearchParams,
    isTypedArray,
    isFileList,
    forEach,
    merge,
    extend,
    trim,
    stripBOM,
    inherits,
    toFlatObject,
    kindOf,
    kindOfTest,
    endsWith,
    toArray,
    forEachEntry,
    matchAll,
    isHTMLForm,
    hasOwnProperty,
    hasOwnProp: hasOwnProperty,
    // an alias to avoid ESLint no-prototype-builtins detection
    reduceDescriptors,
    freezeMethods,
    toObjectSet,
    toCamelCase,
    noop,
    toFiniteNumber,
    findKey,
    global: _global,
    isContextDefined,
    ALPHABET,
    generateString,
    isSpecCompliantForm,
    toJSONObject,
    isAsyncFn,
    isThenable,
    setImmediate: _setImmediate,
    asap
  };

  // node_modules/axios/lib/core/AxiosError.js
  function AxiosError(message, code, config, request, response) {
    Error.call(this);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    } else {
      this.stack = new Error().stack;
    }
    this.message = message;
    this.name = "AxiosError";
    code && (this.code = code);
    config && (this.config = config);
    request && (this.request = request);
    if (response) {
      this.response = response;
      this.status = response.status ? response.status : null;
    }
  }
  utils_default.inherits(AxiosError, Error, {
    toJSON: function toJSON() {
      return {
        // Standard
        message: this.message,
        name: this.name,
        // Microsoft
        description: this.description,
        number: this.number,
        // Mozilla
        fileName: this.fileName,
        lineNumber: this.lineNumber,
        columnNumber: this.columnNumber,
        stack: this.stack,
        // Axios
        config: utils_default.toJSONObject(this.config),
        code: this.code,
        status: this.status
      };
    }
  });
  var prototype = AxiosError.prototype;
  var descriptors = {};
  [
    "ERR_BAD_OPTION_VALUE",
    "ERR_BAD_OPTION",
    "ECONNABORTED",
    "ETIMEDOUT",
    "ERR_NETWORK",
    "ERR_FR_TOO_MANY_REDIRECTS",
    "ERR_DEPRECATED",
    "ERR_BAD_RESPONSE",
    "ERR_BAD_REQUEST",
    "ERR_CANCELED",
    "ERR_NOT_SUPPORT",
    "ERR_INVALID_URL"
    // eslint-disable-next-line func-names
  ].forEach((code) => {
    descriptors[code] = { value: code };
  });
  Object.defineProperties(AxiosError, descriptors);
  Object.defineProperty(prototype, "isAxiosError", { value: true });
  AxiosError.from = (error, code, config, request, response, customProps) => {
    const axiosError = Object.create(prototype);
    utils_default.toFlatObject(error, axiosError, function filter2(obj) {
      return obj !== Error.prototype;
    }, (prop) => {
      return prop !== "isAxiosError";
    });
    AxiosError.call(axiosError, error.message, code, config, request, response);
    axiosError.cause = error;
    axiosError.name = error.name;
    customProps && Object.assign(axiosError, customProps);
    return axiosError;
  };
  var AxiosError_default = AxiosError;

  // node_modules/axios/lib/helpers/null.js
  var null_default = null;

  // node_modules/axios/lib/helpers/toFormData.js
  function isVisitable(thing) {
    return utils_default.isPlainObject(thing) || utils_default.isArray(thing);
  }
  function removeBrackets(key) {
    return utils_default.endsWith(key, "[]") ? key.slice(0, -2) : key;
  }
  function renderKey(path, key, dots) {
    if (!path)
      return key;
    return path.concat(key).map(function each(token, i) {
      token = removeBrackets(token);
      return !dots && i ? "[" + token + "]" : token;
    }).join(dots ? "." : "");
  }
  function isFlatArray(arr) {
    return utils_default.isArray(arr) && !arr.some(isVisitable);
  }
  var predicates = utils_default.toFlatObject(utils_default, {}, null, function filter(prop) {
    return /^is[A-Z]/.test(prop);
  });
  function toFormData(obj, formData, options) {
    if (!utils_default.isObject(obj)) {
      throw new TypeError("target must be an object");
    }
    formData = formData || new (null_default || FormData)();
    options = utils_default.toFlatObject(options, {
      metaTokens: true,
      dots: false,
      indexes: false
    }, false, function defined(option, source) {
      return !utils_default.isUndefined(source[option]);
    });
    const metaTokens = options.metaTokens;
    const visitor = options.visitor || defaultVisitor;
    const dots = options.dots;
    const indexes = options.indexes;
    const _Blob = options.Blob || typeof Blob !== "undefined" && Blob;
    const useBlob = _Blob && utils_default.isSpecCompliantForm(formData);
    if (!utils_default.isFunction(visitor)) {
      throw new TypeError("visitor must be a function");
    }
    function convertValue(value) {
      if (value === null)
        return "";
      if (utils_default.isDate(value)) {
        return value.toISOString();
      }
      if (!useBlob && utils_default.isBlob(value)) {
        throw new AxiosError_default("Blob is not supported. Use a Buffer instead.");
      }
      if (utils_default.isArrayBuffer(value) || utils_default.isTypedArray(value)) {
        return useBlob && typeof Blob === "function" ? new Blob([value]) : Buffer.from(value);
      }
      return value;
    }
    function defaultVisitor(value, key, path) {
      let arr = value;
      if (value && !path && typeof value === "object") {
        if (utils_default.endsWith(key, "{}")) {
          key = metaTokens ? key : key.slice(0, -2);
          value = JSON.stringify(value);
        } else if (utils_default.isArray(value) && isFlatArray(value) || (utils_default.isFileList(value) || utils_default.endsWith(key, "[]")) && (arr = utils_default.toArray(value))) {
          key = removeBrackets(key);
          arr.forEach(function each(el, index) {
            !(utils_default.isUndefined(el) || el === null) && formData.append(
              // eslint-disable-next-line no-nested-ternary
              indexes === true ? renderKey([key], index, dots) : indexes === null ? key : key + "[]",
              convertValue(el)
            );
          });
          return false;
        }
      }
      if (isVisitable(value)) {
        return true;
      }
      formData.append(renderKey(path, key, dots), convertValue(value));
      return false;
    }
    const stack = [];
    const exposedHelpers = Object.assign(predicates, {
      defaultVisitor,
      convertValue,
      isVisitable
    });
    function build(value, path) {
      if (utils_default.isUndefined(value))
        return;
      if (stack.indexOf(value) !== -1) {
        throw Error("Circular reference detected in " + path.join("."));
      }
      stack.push(value);
      utils_default.forEach(value, function each(el, key) {
        const result = !(utils_default.isUndefined(el) || el === null) && visitor.call(
          formData,
          el,
          utils_default.isString(key) ? key.trim() : key,
          path,
          exposedHelpers
        );
        if (result === true) {
          build(el, path ? path.concat(key) : [key]);
        }
      });
      stack.pop();
    }
    if (!utils_default.isObject(obj)) {
      throw new TypeError("data must be an object");
    }
    build(obj);
    return formData;
  }
  var toFormData_default = toFormData;

  // node_modules/axios/lib/helpers/AxiosURLSearchParams.js
  function encode(str) {
    const charMap = {
      "!": "%21",
      "'": "%27",
      "(": "%28",
      ")": "%29",
      "~": "%7E",
      "%20": "+",
      "%00": "\0"
    };
    return encodeURIComponent(str).replace(/[!'()~]|%20|%00/g, function replacer(match) {
      return charMap[match];
    });
  }
  function AxiosURLSearchParams(params, options) {
    this._pairs = [];
    params && toFormData_default(params, this, options);
  }
  var prototype2 = AxiosURLSearchParams.prototype;
  prototype2.append = function append(name, value) {
    this._pairs.push([name, value]);
  };
  prototype2.toString = function toString2(encoder) {
    const _encode = encoder ? function(value) {
      return encoder.call(this, value, encode);
    } : encode;
    return this._pairs.map(function each(pair) {
      return _encode(pair[0]) + "=" + _encode(pair[1]);
    }, "").join("&");
  };
  var AxiosURLSearchParams_default = AxiosURLSearchParams;

  // node_modules/axios/lib/helpers/buildURL.js
  function encode2(val) {
    return encodeURIComponent(val).replace(/%3A/gi, ":").replace(/%24/g, "$").replace(/%2C/gi, ",").replace(/%20/g, "+").replace(/%5B/gi, "[").replace(/%5D/gi, "]");
  }
  function buildURL(url, params, options) {
    if (!params) {
      return url;
    }
    const _encode = options && options.encode || encode2;
    if (utils_default.isFunction(options)) {
      options = {
        serialize: options
      };
    }
    const serializeFn = options && options.serialize;
    let serializedParams;
    if (serializeFn) {
      serializedParams = serializeFn(params, options);
    } else {
      serializedParams = utils_default.isURLSearchParams(params) ? params.toString() : new AxiosURLSearchParams_default(params, options).toString(_encode);
    }
    if (serializedParams) {
      const hashmarkIndex = url.indexOf("#");
      if (hashmarkIndex !== -1) {
        url = url.slice(0, hashmarkIndex);
      }
      url += (url.indexOf("?") === -1 ? "?" : "&") + serializedParams;
    }
    return url;
  }

  // node_modules/axios/lib/core/InterceptorManager.js
  var InterceptorManager = class {
    constructor() {
      this.handlers = [];
    }
    /**
     * Add a new interceptor to the stack
     *
     * @param {Function} fulfilled The function to handle `then` for a `Promise`
     * @param {Function} rejected The function to handle `reject` for a `Promise`
     *
     * @return {Number} An ID used to remove interceptor later
     */
    use(fulfilled, rejected, options) {
      this.handlers.push({
        fulfilled,
        rejected,
        synchronous: options ? options.synchronous : false,
        runWhen: options ? options.runWhen : null
      });
      return this.handlers.length - 1;
    }
    /**
     * Remove an interceptor from the stack
     *
     * @param {Number} id The ID that was returned by `use`
     *
     * @returns {Boolean} `true` if the interceptor was removed, `false` otherwise
     */
    eject(id) {
      if (this.handlers[id]) {
        this.handlers[id] = null;
      }
    }
    /**
     * Clear all interceptors from the stack
     *
     * @returns {void}
     */
    clear() {
      if (this.handlers) {
        this.handlers = [];
      }
    }
    /**
     * Iterate over all the registered interceptors
     *
     * This method is particularly useful for skipping over any
     * interceptors that may have become `null` calling `eject`.
     *
     * @param {Function} fn The function to call for each interceptor
     *
     * @returns {void}
     */
    forEach(fn) {
      utils_default.forEach(this.handlers, function forEachHandler(h) {
        if (h !== null) {
          fn(h);
        }
      });
    }
  };
  var InterceptorManager_default = InterceptorManager;

  // node_modules/axios/lib/defaults/transitional.js
  var transitional_default = {
    silentJSONParsing: true,
    forcedJSONParsing: true,
    clarifyTimeoutError: false
  };

  // node_modules/axios/lib/platform/browser/classes/URLSearchParams.js
  var URLSearchParams_default = typeof URLSearchParams !== "undefined" ? URLSearchParams : AxiosURLSearchParams_default;

  // node_modules/axios/lib/platform/browser/classes/FormData.js
  var FormData_default = typeof FormData !== "undefined" ? FormData : null;

  // node_modules/axios/lib/platform/browser/classes/Blob.js
  var Blob_default = typeof Blob !== "undefined" ? Blob : null;

  // node_modules/axios/lib/platform/browser/index.js
  var browser_default = {
    isBrowser: true,
    classes: {
      URLSearchParams: URLSearchParams_default,
      FormData: FormData_default,
      Blob: Blob_default
    },
    protocols: ["http", "https", "file", "blob", "url", "data"]
  };

  // node_modules/axios/lib/platform/common/utils.js
  var utils_exports = {};
  __export(utils_exports, {
    hasBrowserEnv: () => hasBrowserEnv,
    hasStandardBrowserEnv: () => hasStandardBrowserEnv,
    hasStandardBrowserWebWorkerEnv: () => hasStandardBrowserWebWorkerEnv,
    navigator: () => _navigator,
    origin: () => origin
  });
  var hasBrowserEnv = typeof window !== "undefined" && typeof document !== "undefined";
  var _navigator = typeof navigator === "object" && navigator || void 0;
  var hasStandardBrowserEnv = hasBrowserEnv && (!_navigator || ["ReactNative", "NativeScript", "NS"].indexOf(_navigator.product) < 0);
  var hasStandardBrowserWebWorkerEnv = (() => {
    return typeof WorkerGlobalScope !== "undefined" && // eslint-disable-next-line no-undef
    self instanceof WorkerGlobalScope && typeof self.importScripts === "function";
  })();
  var origin = hasBrowserEnv && window.location.href || "http://localhost";

  // node_modules/axios/lib/platform/index.js
  var platform_default = {
    ...utils_exports,
    ...browser_default
  };

  // node_modules/axios/lib/helpers/toURLEncodedForm.js
  function toURLEncodedForm(data, options) {
    return toFormData_default(data, new platform_default.classes.URLSearchParams(), Object.assign({
      visitor: function(value, key, path, helpers) {
        if (platform_default.isNode && utils_default.isBuffer(value)) {
          this.append(key, value.toString("base64"));
          return false;
        }
        return helpers.defaultVisitor.apply(this, arguments);
      }
    }, options));
  }

  // node_modules/axios/lib/helpers/formDataToJSON.js
  function parsePropPath(name) {
    return utils_default.matchAll(/\w+|\[(\w*)]/g, name).map((match) => {
      return match[0] === "[]" ? "" : match[1] || match[0];
    });
  }
  function arrayToObject(arr) {
    const obj = {};
    const keys = Object.keys(arr);
    let i;
    const len = keys.length;
    let key;
    for (i = 0; i < len; i++) {
      key = keys[i];
      obj[key] = arr[key];
    }
    return obj;
  }
  function formDataToJSON(formData) {
    function buildPath(path, value, target, index) {
      let name = path[index++];
      if (name === "__proto__")
        return true;
      const isNumericKey = Number.isFinite(+name);
      const isLast = index >= path.length;
      name = !name && utils_default.isArray(target) ? target.length : name;
      if (isLast) {
        if (utils_default.hasOwnProp(target, name)) {
          target[name] = [target[name], value];
        } else {
          target[name] = value;
        }
        return !isNumericKey;
      }
      if (!target[name] || !utils_default.isObject(target[name])) {
        target[name] = [];
      }
      const result = buildPath(path, value, target[name], index);
      if (result && utils_default.isArray(target[name])) {
        target[name] = arrayToObject(target[name]);
      }
      return !isNumericKey;
    }
    if (utils_default.isFormData(formData) && utils_default.isFunction(formData.entries)) {
      const obj = {};
      utils_default.forEachEntry(formData, (name, value) => {
        buildPath(parsePropPath(name), value, obj, 0);
      });
      return obj;
    }
    return null;
  }
  var formDataToJSON_default = formDataToJSON;

  // node_modules/axios/lib/defaults/index.js
  function stringifySafely(rawValue, parser, encoder) {
    if (utils_default.isString(rawValue)) {
      try {
        (parser || JSON.parse)(rawValue);
        return utils_default.trim(rawValue);
      } catch (e) {
        if (e.name !== "SyntaxError") {
          throw e;
        }
      }
    }
    return (encoder || JSON.stringify)(rawValue);
  }
  var defaults = {
    transitional: transitional_default,
    adapter: ["xhr", "http", "fetch"],
    transformRequest: [function transformRequest(data, headers) {
      const contentType = headers.getContentType() || "";
      const hasJSONContentType = contentType.indexOf("application/json") > -1;
      const isObjectPayload = utils_default.isObject(data);
      if (isObjectPayload && utils_default.isHTMLForm(data)) {
        data = new FormData(data);
      }
      const isFormData2 = utils_default.isFormData(data);
      if (isFormData2) {
        return hasJSONContentType ? JSON.stringify(formDataToJSON_default(data)) : data;
      }
      if (utils_default.isArrayBuffer(data) || utils_default.isBuffer(data) || utils_default.isStream(data) || utils_default.isFile(data) || utils_default.isBlob(data) || utils_default.isReadableStream(data)) {
        return data;
      }
      if (utils_default.isArrayBufferView(data)) {
        return data.buffer;
      }
      if (utils_default.isURLSearchParams(data)) {
        headers.setContentType("application/x-www-form-urlencoded;charset=utf-8", false);
        return data.toString();
      }
      let isFileList2;
      if (isObjectPayload) {
        if (contentType.indexOf("application/x-www-form-urlencoded") > -1) {
          return toURLEncodedForm(data, this.formSerializer).toString();
        }
        if ((isFileList2 = utils_default.isFileList(data)) || contentType.indexOf("multipart/form-data") > -1) {
          const _FormData = this.env && this.env.FormData;
          return toFormData_default(
            isFileList2 ? { "files[]": data } : data,
            _FormData && new _FormData(),
            this.formSerializer
          );
        }
      }
      if (isObjectPayload || hasJSONContentType) {
        headers.setContentType("application/json", false);
        return stringifySafely(data);
      }
      return data;
    }],
    transformResponse: [function transformResponse(data) {
      const transitional2 = this.transitional || defaults.transitional;
      const forcedJSONParsing = transitional2 && transitional2.forcedJSONParsing;
      const JSONRequested = this.responseType === "json";
      if (utils_default.isResponse(data) || utils_default.isReadableStream(data)) {
        return data;
      }
      if (data && utils_default.isString(data) && (forcedJSONParsing && !this.responseType || JSONRequested)) {
        const silentJSONParsing = transitional2 && transitional2.silentJSONParsing;
        const strictJSONParsing = !silentJSONParsing && JSONRequested;
        try {
          return JSON.parse(data);
        } catch (e) {
          if (strictJSONParsing) {
            if (e.name === "SyntaxError") {
              throw AxiosError_default.from(e, AxiosError_default.ERR_BAD_RESPONSE, this, null, this.response);
            }
            throw e;
          }
        }
      }
      return data;
    }],
    /**
     * A timeout in milliseconds to abort a request. If set to 0 (default) a
     * timeout is not created.
     */
    timeout: 0,
    xsrfCookieName: "XSRF-TOKEN",
    xsrfHeaderName: "X-XSRF-TOKEN",
    maxContentLength: -1,
    maxBodyLength: -1,
    env: {
      FormData: platform_default.classes.FormData,
      Blob: platform_default.classes.Blob
    },
    validateStatus: function validateStatus(status) {
      return status >= 200 && status < 300;
    },
    headers: {
      common: {
        "Accept": "application/json, text/plain, */*",
        "Content-Type": void 0
      }
    }
  };
  utils_default.forEach(["delete", "get", "head", "post", "put", "patch"], (method) => {
    defaults.headers[method] = {};
  });
  var defaults_default = defaults;

  // node_modules/axios/lib/helpers/parseHeaders.js
  var ignoreDuplicateOf = utils_default.toObjectSet([
    "age",
    "authorization",
    "content-length",
    "content-type",
    "etag",
    "expires",
    "from",
    "host",
    "if-modified-since",
    "if-unmodified-since",
    "last-modified",
    "location",
    "max-forwards",
    "proxy-authorization",
    "referer",
    "retry-after",
    "user-agent"
  ]);
  var parseHeaders_default = (rawHeaders) => {
    const parsed = {};
    let key;
    let val;
    let i;
    rawHeaders && rawHeaders.split("\n").forEach(function parser(line) {
      i = line.indexOf(":");
      key = line.substring(0, i).trim().toLowerCase();
      val = line.substring(i + 1).trim();
      if (!key || parsed[key] && ignoreDuplicateOf[key]) {
        return;
      }
      if (key === "set-cookie") {
        if (parsed[key]) {
          parsed[key].push(val);
        } else {
          parsed[key] = [val];
        }
      } else {
        parsed[key] = parsed[key] ? parsed[key] + ", " + val : val;
      }
    });
    return parsed;
  };

  // node_modules/axios/lib/core/AxiosHeaders.js
  var $internals = Symbol("internals");
  function normalizeHeader(header) {
    return header && String(header).trim().toLowerCase();
  }
  function normalizeValue(value) {
    if (value === false || value == null) {
      return value;
    }
    return utils_default.isArray(value) ? value.map(normalizeValue) : String(value);
  }
  function parseTokens(str) {
    const tokens = /* @__PURE__ */ Object.create(null);
    const tokensRE = /([^\s,;=]+)\s*(?:=\s*([^,;]+))?/g;
    let match;
    while (match = tokensRE.exec(str)) {
      tokens[match[1]] = match[2];
    }
    return tokens;
  }
  var isValidHeaderName = (str) => /^[-_a-zA-Z0-9^`|~,!#$%&'*+.]+$/.test(str.trim());
  function matchHeaderValue(context, value, header, filter2, isHeaderNameFilter) {
    if (utils_default.isFunction(filter2)) {
      return filter2.call(this, value, header);
    }
    if (isHeaderNameFilter) {
      value = header;
    }
    if (!utils_default.isString(value))
      return;
    if (utils_default.isString(filter2)) {
      return value.indexOf(filter2) !== -1;
    }
    if (utils_default.isRegExp(filter2)) {
      return filter2.test(value);
    }
  }
  function formatHeader(header) {
    return header.trim().toLowerCase().replace(/([a-z\d])(\w*)/g, (w, char, str) => {
      return char.toUpperCase() + str;
    });
  }
  function buildAccessors(obj, header) {
    const accessorName = utils_default.toCamelCase(" " + header);
    ["get", "set", "has"].forEach((methodName) => {
      Object.defineProperty(obj, methodName + accessorName, {
        value: function(arg1, arg2, arg3) {
          return this[methodName].call(this, header, arg1, arg2, arg3);
        },
        configurable: true
      });
    });
  }
  var AxiosHeaders = class {
    constructor(headers) {
      headers && this.set(headers);
    }
    set(header, valueOrRewrite, rewrite) {
      const self2 = this;
      function setHeader(_value, _header, _rewrite) {
        const lHeader = normalizeHeader(_header);
        if (!lHeader) {
          throw new Error("header name must be a non-empty string");
        }
        const key = utils_default.findKey(self2, lHeader);
        if (!key || self2[key] === void 0 || _rewrite === true || _rewrite === void 0 && self2[key] !== false) {
          self2[key || _header] = normalizeValue(_value);
        }
      }
      const setHeaders = (headers, _rewrite) => utils_default.forEach(headers, (_value, _header) => setHeader(_value, _header, _rewrite));
      if (utils_default.isPlainObject(header) || header instanceof this.constructor) {
        setHeaders(header, valueOrRewrite);
      } else if (utils_default.isString(header) && (header = header.trim()) && !isValidHeaderName(header)) {
        setHeaders(parseHeaders_default(header), valueOrRewrite);
      } else if (utils_default.isHeaders(header)) {
        for (const [key, value] of header.entries()) {
          setHeader(value, key, rewrite);
        }
      } else {
        header != null && setHeader(valueOrRewrite, header, rewrite);
      }
      return this;
    }
    get(header, parser) {
      header = normalizeHeader(header);
      if (header) {
        const key = utils_default.findKey(this, header);
        if (key) {
          const value = this[key];
          if (!parser) {
            return value;
          }
          if (parser === true) {
            return parseTokens(value);
          }
          if (utils_default.isFunction(parser)) {
            return parser.call(this, value, key);
          }
          if (utils_default.isRegExp(parser)) {
            return parser.exec(value);
          }
          throw new TypeError("parser must be boolean|regexp|function");
        }
      }
    }
    has(header, matcher) {
      header = normalizeHeader(header);
      if (header) {
        const key = utils_default.findKey(this, header);
        return !!(key && this[key] !== void 0 && (!matcher || matchHeaderValue(this, this[key], key, matcher)));
      }
      return false;
    }
    delete(header, matcher) {
      const self2 = this;
      let deleted = false;
      function deleteHeader(_header) {
        _header = normalizeHeader(_header);
        if (_header) {
          const key = utils_default.findKey(self2, _header);
          if (key && (!matcher || matchHeaderValue(self2, self2[key], key, matcher))) {
            delete self2[key];
            deleted = true;
          }
        }
      }
      if (utils_default.isArray(header)) {
        header.forEach(deleteHeader);
      } else {
        deleteHeader(header);
      }
      return deleted;
    }
    clear(matcher) {
      const keys = Object.keys(this);
      let i = keys.length;
      let deleted = false;
      while (i--) {
        const key = keys[i];
        if (!matcher || matchHeaderValue(this, this[key], key, matcher, true)) {
          delete this[key];
          deleted = true;
        }
      }
      return deleted;
    }
    normalize(format) {
      const self2 = this;
      const headers = {};
      utils_default.forEach(this, (value, header) => {
        const key = utils_default.findKey(headers, header);
        if (key) {
          self2[key] = normalizeValue(value);
          delete self2[header];
          return;
        }
        const normalized = format ? formatHeader(header) : String(header).trim();
        if (normalized !== header) {
          delete self2[header];
        }
        self2[normalized] = normalizeValue(value);
        headers[normalized] = true;
      });
      return this;
    }
    concat(...targets) {
      return this.constructor.concat(this, ...targets);
    }
    toJSON(asStrings) {
      const obj = /* @__PURE__ */ Object.create(null);
      utils_default.forEach(this, (value, header) => {
        value != null && value !== false && (obj[header] = asStrings && utils_default.isArray(value) ? value.join(", ") : value);
      });
      return obj;
    }
    [Symbol.iterator]() {
      return Object.entries(this.toJSON())[Symbol.iterator]();
    }
    toString() {
      return Object.entries(this.toJSON()).map(([header, value]) => header + ": " + value).join("\n");
    }
    get [Symbol.toStringTag]() {
      return "AxiosHeaders";
    }
    static from(thing) {
      return thing instanceof this ? thing : new this(thing);
    }
    static concat(first, ...targets) {
      const computed = new this(first);
      targets.forEach((target) => computed.set(target));
      return computed;
    }
    static accessor(header) {
      const internals = this[$internals] = this[$internals] = {
        accessors: {}
      };
      const accessors = internals.accessors;
      const prototype3 = this.prototype;
      function defineAccessor(_header) {
        const lHeader = normalizeHeader(_header);
        if (!accessors[lHeader]) {
          buildAccessors(prototype3, _header);
          accessors[lHeader] = true;
        }
      }
      utils_default.isArray(header) ? header.forEach(defineAccessor) : defineAccessor(header);
      return this;
    }
  };
  AxiosHeaders.accessor(["Content-Type", "Content-Length", "Accept", "Accept-Encoding", "User-Agent", "Authorization"]);
  utils_default.reduceDescriptors(AxiosHeaders.prototype, ({ value }, key) => {
    let mapped = key[0].toUpperCase() + key.slice(1);
    return {
      get: () => value,
      set(headerValue) {
        this[mapped] = headerValue;
      }
    };
  });
  utils_default.freezeMethods(AxiosHeaders);
  var AxiosHeaders_default = AxiosHeaders;

  // node_modules/axios/lib/core/transformData.js
  function transformData(fns, response) {
    const config = this || defaults_default;
    const context = response || config;
    const headers = AxiosHeaders_default.from(context.headers);
    let data = context.data;
    utils_default.forEach(fns, function transform(fn) {
      data = fn.call(config, data, headers.normalize(), response ? response.status : void 0);
    });
    headers.normalize();
    return data;
  }

  // node_modules/axios/lib/cancel/isCancel.js
  function isCancel(value) {
    return !!(value && value.__CANCEL__);
  }

  // node_modules/axios/lib/cancel/CanceledError.js
  function CanceledError(message, config, request) {
    AxiosError_default.call(this, message == null ? "canceled" : message, AxiosError_default.ERR_CANCELED, config, request);
    this.name = "CanceledError";
  }
  utils_default.inherits(CanceledError, AxiosError_default, {
    __CANCEL__: true
  });
  var CanceledError_default = CanceledError;

  // node_modules/axios/lib/core/settle.js
  function settle(resolve, reject, response) {
    const validateStatus2 = response.config.validateStatus;
    if (!response.status || !validateStatus2 || validateStatus2(response.status)) {
      resolve(response);
    } else {
      reject(new AxiosError_default(
        "Request failed with status code " + response.status,
        [AxiosError_default.ERR_BAD_REQUEST, AxiosError_default.ERR_BAD_RESPONSE][Math.floor(response.status / 100) - 4],
        response.config,
        response.request,
        response
      ));
    }
  }

  // node_modules/axios/lib/helpers/parseProtocol.js
  function parseProtocol(url) {
    const match = /^([-+\w]{1,25})(:?\/\/|:)/.exec(url);
    return match && match[1] || "";
  }

  // node_modules/axios/lib/helpers/speedometer.js
  function speedometer(samplesCount, min) {
    samplesCount = samplesCount || 10;
    const bytes = new Array(samplesCount);
    const timestamps = new Array(samplesCount);
    let head = 0;
    let tail = 0;
    let firstSampleTS;
    min = min !== void 0 ? min : 1e3;
    return function push(chunkLength) {
      const now = Date.now();
      const startedAt = timestamps[tail];
      if (!firstSampleTS) {
        firstSampleTS = now;
      }
      bytes[head] = chunkLength;
      timestamps[head] = now;
      let i = tail;
      let bytesCount = 0;
      while (i !== head) {
        bytesCount += bytes[i++];
        i = i % samplesCount;
      }
      head = (head + 1) % samplesCount;
      if (head === tail) {
        tail = (tail + 1) % samplesCount;
      }
      if (now - firstSampleTS < min) {
        return;
      }
      const passed = startedAt && now - startedAt;
      return passed ? Math.round(bytesCount * 1e3 / passed) : void 0;
    };
  }
  var speedometer_default = speedometer;

  // node_modules/axios/lib/helpers/throttle.js
  function throttle(fn, freq) {
    let timestamp = 0;
    let threshold = 1e3 / freq;
    let lastArgs;
    let timer;
    const invoke = (args, now = Date.now()) => {
      timestamp = now;
      lastArgs = null;
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      fn.apply(null, args);
    };
    const throttled = (...args) => {
      const now = Date.now();
      const passed = now - timestamp;
      if (passed >= threshold) {
        invoke(args, now);
      } else {
        lastArgs = args;
        if (!timer) {
          timer = setTimeout(() => {
            timer = null;
            invoke(lastArgs);
          }, threshold - passed);
        }
      }
    };
    const flush = () => lastArgs && invoke(lastArgs);
    return [throttled, flush];
  }
  var throttle_default = throttle;

  // node_modules/axios/lib/helpers/progressEventReducer.js
  var progressEventReducer = (listener, isDownloadStream, freq = 3) => {
    let bytesNotified = 0;
    const _speedometer = speedometer_default(50, 250);
    return throttle_default((e) => {
      const loaded = e.loaded;
      const total = e.lengthComputable ? e.total : void 0;
      const progressBytes = loaded - bytesNotified;
      const rate = _speedometer(progressBytes);
      const inRange = loaded <= total;
      bytesNotified = loaded;
      const data = {
        loaded,
        total,
        progress: total ? loaded / total : void 0,
        bytes: progressBytes,
        rate: rate ? rate : void 0,
        estimated: rate && total && inRange ? (total - loaded) / rate : void 0,
        event: e,
        lengthComputable: total != null,
        [isDownloadStream ? "download" : "upload"]: true
      };
      listener(data);
    }, freq);
  };
  var progressEventDecorator = (total, throttled) => {
    const lengthComputable = total != null;
    return [(loaded) => throttled[0]({
      lengthComputable,
      total,
      loaded
    }), throttled[1]];
  };
  var asyncDecorator = (fn) => (...args) => utils_default.asap(() => fn(...args));

  // node_modules/axios/lib/helpers/isURLSameOrigin.js
  var isURLSameOrigin_default = platform_default.hasStandardBrowserEnv ? /* @__PURE__ */ ((origin2, isMSIE) => (url) => {
    url = new URL(url, platform_default.origin);
    return origin2.protocol === url.protocol && origin2.host === url.host && (isMSIE || origin2.port === url.port);
  })(
    new URL(platform_default.origin),
    platform_default.navigator && /(msie|trident)/i.test(platform_default.navigator.userAgent)
  ) : () => true;

  // node_modules/axios/lib/helpers/cookies.js
  var cookies_default = platform_default.hasStandardBrowserEnv ? (
    // Standard browser envs support document.cookie
    {
      write(name, value, expires, path, domain, secure) {
        const cookie = [name + "=" + encodeURIComponent(value)];
        utils_default.isNumber(expires) && cookie.push("expires=" + new Date(expires).toGMTString());
        utils_default.isString(path) && cookie.push("path=" + path);
        utils_default.isString(domain) && cookie.push("domain=" + domain);
        secure === true && cookie.push("secure");
        document.cookie = cookie.join("; ");
      },
      read(name) {
        const match = document.cookie.match(new RegExp("(^|;\\s*)(" + name + ")=([^;]*)"));
        return match ? decodeURIComponent(match[3]) : null;
      },
      remove(name) {
        this.write(name, "", Date.now() - 864e5);
      }
    }
  ) : (
    // Non-standard browser env (web workers, react-native) lack needed support.
    {
      write() {
      },
      read() {
        return null;
      },
      remove() {
      }
    }
  );

  // node_modules/axios/lib/helpers/isAbsoluteURL.js
  function isAbsoluteURL(url) {
    return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url);
  }

  // node_modules/axios/lib/helpers/combineURLs.js
  function combineURLs(baseURL, relativeURL) {
    return relativeURL ? baseURL.replace(/\/?\/$/, "") + "/" + relativeURL.replace(/^\/+/, "") : baseURL;
  }

  // node_modules/axios/lib/core/buildFullPath.js
  function buildFullPath(baseURL, requestedURL) {
    if (baseURL && !isAbsoluteURL(requestedURL)) {
      return combineURLs(baseURL, requestedURL);
    }
    return requestedURL;
  }

  // node_modules/axios/lib/core/mergeConfig.js
  var headersToObject = (thing) => thing instanceof AxiosHeaders_default ? { ...thing } : thing;
  function mergeConfig(config1, config2) {
    config2 = config2 || {};
    const config = {};
    function getMergedValue(target, source, prop, caseless) {
      if (utils_default.isPlainObject(target) && utils_default.isPlainObject(source)) {
        return utils_default.merge.call({ caseless }, target, source);
      } else if (utils_default.isPlainObject(source)) {
        return utils_default.merge({}, source);
      } else if (utils_default.isArray(source)) {
        return source.slice();
      }
      return source;
    }
    function mergeDeepProperties(a, b, prop, caseless) {
      if (!utils_default.isUndefined(b)) {
        return getMergedValue(a, b, prop, caseless);
      } else if (!utils_default.isUndefined(a)) {
        return getMergedValue(void 0, a, prop, caseless);
      }
    }
    function valueFromConfig2(a, b) {
      if (!utils_default.isUndefined(b)) {
        return getMergedValue(void 0, b);
      }
    }
    function defaultToConfig2(a, b) {
      if (!utils_default.isUndefined(b)) {
        return getMergedValue(void 0, b);
      } else if (!utils_default.isUndefined(a)) {
        return getMergedValue(void 0, a);
      }
    }
    function mergeDirectKeys(a, b, prop) {
      if (prop in config2) {
        return getMergedValue(a, b);
      } else if (prop in config1) {
        return getMergedValue(void 0, a);
      }
    }
    const mergeMap = {
      url: valueFromConfig2,
      method: valueFromConfig2,
      data: valueFromConfig2,
      baseURL: defaultToConfig2,
      transformRequest: defaultToConfig2,
      transformResponse: defaultToConfig2,
      paramsSerializer: defaultToConfig2,
      timeout: defaultToConfig2,
      timeoutMessage: defaultToConfig2,
      withCredentials: defaultToConfig2,
      withXSRFToken: defaultToConfig2,
      adapter: defaultToConfig2,
      responseType: defaultToConfig2,
      xsrfCookieName: defaultToConfig2,
      xsrfHeaderName: defaultToConfig2,
      onUploadProgress: defaultToConfig2,
      onDownloadProgress: defaultToConfig2,
      decompress: defaultToConfig2,
      maxContentLength: defaultToConfig2,
      maxBodyLength: defaultToConfig2,
      beforeRedirect: defaultToConfig2,
      transport: defaultToConfig2,
      httpAgent: defaultToConfig2,
      httpsAgent: defaultToConfig2,
      cancelToken: defaultToConfig2,
      socketPath: defaultToConfig2,
      responseEncoding: defaultToConfig2,
      validateStatus: mergeDirectKeys,
      headers: (a, b, prop) => mergeDeepProperties(headersToObject(a), headersToObject(b), prop, true)
    };
    utils_default.forEach(Object.keys(Object.assign({}, config1, config2)), function computeConfigValue(prop) {
      const merge2 = mergeMap[prop] || mergeDeepProperties;
      const configValue = merge2(config1[prop], config2[prop], prop);
      utils_default.isUndefined(configValue) && merge2 !== mergeDirectKeys || (config[prop] = configValue);
    });
    return config;
  }

  // node_modules/axios/lib/helpers/resolveConfig.js
  var resolveConfig_default = (config) => {
    const newConfig = mergeConfig({}, config);
    let { data, withXSRFToken, xsrfHeaderName, xsrfCookieName, headers, auth } = newConfig;
    newConfig.headers = headers = AxiosHeaders_default.from(headers);
    newConfig.url = buildURL(buildFullPath(newConfig.baseURL, newConfig.url), config.params, config.paramsSerializer);
    if (auth) {
      headers.set(
        "Authorization",
        "Basic " + btoa((auth.username || "") + ":" + (auth.password ? unescape(encodeURIComponent(auth.password)) : ""))
      );
    }
    let contentType;
    if (utils_default.isFormData(data)) {
      if (platform_default.hasStandardBrowserEnv || platform_default.hasStandardBrowserWebWorkerEnv) {
        headers.setContentType(void 0);
      } else if ((contentType = headers.getContentType()) !== false) {
        const [type, ...tokens] = contentType ? contentType.split(";").map((token) => token.trim()).filter(Boolean) : [];
        headers.setContentType([type || "multipart/form-data", ...tokens].join("; "));
      }
    }
    if (platform_default.hasStandardBrowserEnv) {
      withXSRFToken && utils_default.isFunction(withXSRFToken) && (withXSRFToken = withXSRFToken(newConfig));
      if (withXSRFToken || withXSRFToken !== false && isURLSameOrigin_default(newConfig.url)) {
        const xsrfValue = xsrfHeaderName && xsrfCookieName && cookies_default.read(xsrfCookieName);
        if (xsrfValue) {
          headers.set(xsrfHeaderName, xsrfValue);
        }
      }
    }
    return newConfig;
  };

  // node_modules/axios/lib/adapters/xhr.js
  var isXHRAdapterSupported = typeof XMLHttpRequest !== "undefined";
  var xhr_default = isXHRAdapterSupported && function(config) {
    return new Promise(function dispatchXhrRequest(resolve, reject) {
      const _config = resolveConfig_default(config);
      let requestData = _config.data;
      const requestHeaders = AxiosHeaders_default.from(_config.headers).normalize();
      let { responseType, onUploadProgress, onDownloadProgress } = _config;
      let onCanceled;
      let uploadThrottled, downloadThrottled;
      let flushUpload, flushDownload;
      function done() {
        flushUpload && flushUpload();
        flushDownload && flushDownload();
        _config.cancelToken && _config.cancelToken.unsubscribe(onCanceled);
        _config.signal && _config.signal.removeEventListener("abort", onCanceled);
      }
      let request = new XMLHttpRequest();
      request.open(_config.method.toUpperCase(), _config.url, true);
      request.timeout = _config.timeout;
      function onloadend() {
        if (!request) {
          return;
        }
        const responseHeaders = AxiosHeaders_default.from(
          "getAllResponseHeaders" in request && request.getAllResponseHeaders()
        );
        const responseData = !responseType || responseType === "text" || responseType === "json" ? request.responseText : request.response;
        const response = {
          data: responseData,
          status: request.status,
          statusText: request.statusText,
          headers: responseHeaders,
          config,
          request
        };
        settle(function _resolve(value) {
          resolve(value);
          done();
        }, function _reject(err) {
          reject(err);
          done();
        }, response);
        request = null;
      }
      if ("onloadend" in request) {
        request.onloadend = onloadend;
      } else {
        request.onreadystatechange = function handleLoad() {
          if (!request || request.readyState !== 4) {
            return;
          }
          if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf("file:") === 0)) {
            return;
          }
          setTimeout(onloadend);
        };
      }
      request.onabort = function handleAbort() {
        if (!request) {
          return;
        }
        reject(new AxiosError_default("Request aborted", AxiosError_default.ECONNABORTED, config, request));
        request = null;
      };
      request.onerror = function handleError() {
        reject(new AxiosError_default("Network Error", AxiosError_default.ERR_NETWORK, config, request));
        request = null;
      };
      request.ontimeout = function handleTimeout() {
        let timeoutErrorMessage = _config.timeout ? "timeout of " + _config.timeout + "ms exceeded" : "timeout exceeded";
        const transitional2 = _config.transitional || transitional_default;
        if (_config.timeoutErrorMessage) {
          timeoutErrorMessage = _config.timeoutErrorMessage;
        }
        reject(new AxiosError_default(
          timeoutErrorMessage,
          transitional2.clarifyTimeoutError ? AxiosError_default.ETIMEDOUT : AxiosError_default.ECONNABORTED,
          config,
          request
        ));
        request = null;
      };
      requestData === void 0 && requestHeaders.setContentType(null);
      if ("setRequestHeader" in request) {
        utils_default.forEach(requestHeaders.toJSON(), function setRequestHeader(val, key) {
          request.setRequestHeader(key, val);
        });
      }
      if (!utils_default.isUndefined(_config.withCredentials)) {
        request.withCredentials = !!_config.withCredentials;
      }
      if (responseType && responseType !== "json") {
        request.responseType = _config.responseType;
      }
      if (onDownloadProgress) {
        [downloadThrottled, flushDownload] = progressEventReducer(onDownloadProgress, true);
        request.addEventListener("progress", downloadThrottled);
      }
      if (onUploadProgress && request.upload) {
        [uploadThrottled, flushUpload] = progressEventReducer(onUploadProgress);
        request.upload.addEventListener("progress", uploadThrottled);
        request.upload.addEventListener("loadend", flushUpload);
      }
      if (_config.cancelToken || _config.signal) {
        onCanceled = (cancel) => {
          if (!request) {
            return;
          }
          reject(!cancel || cancel.type ? new CanceledError_default(null, config, request) : cancel);
          request.abort();
          request = null;
        };
        _config.cancelToken && _config.cancelToken.subscribe(onCanceled);
        if (_config.signal) {
          _config.signal.aborted ? onCanceled() : _config.signal.addEventListener("abort", onCanceled);
        }
      }
      const protocol = parseProtocol(_config.url);
      if (protocol && platform_default.protocols.indexOf(protocol) === -1) {
        reject(new AxiosError_default("Unsupported protocol " + protocol + ":", AxiosError_default.ERR_BAD_REQUEST, config));
        return;
      }
      request.send(requestData || null);
    });
  };

  // node_modules/axios/lib/helpers/composeSignals.js
  var composeSignals = (signals, timeout) => {
    const { length } = signals = signals ? signals.filter(Boolean) : [];
    if (timeout || length) {
      let controller = new AbortController();
      let aborted;
      const onabort = function(reason) {
        if (!aborted) {
          aborted = true;
          unsubscribe();
          const err = reason instanceof Error ? reason : this.reason;
          controller.abort(err instanceof AxiosError_default ? err : new CanceledError_default(err instanceof Error ? err.message : err));
        }
      };
      let timer = timeout && setTimeout(() => {
        timer = null;
        onabort(new AxiosError_default(`timeout ${timeout} of ms exceeded`, AxiosError_default.ETIMEDOUT));
      }, timeout);
      const unsubscribe = () => {
        if (signals) {
          timer && clearTimeout(timer);
          timer = null;
          signals.forEach((signal2) => {
            signal2.unsubscribe ? signal2.unsubscribe(onabort) : signal2.removeEventListener("abort", onabort);
          });
          signals = null;
        }
      };
      signals.forEach((signal2) => signal2.addEventListener("abort", onabort));
      const { signal } = controller;
      signal.unsubscribe = () => utils_default.asap(unsubscribe);
      return signal;
    }
  };
  var composeSignals_default = composeSignals;

  // node_modules/axios/lib/helpers/trackStream.js
  var streamChunk = function* (chunk, chunkSize) {
    let len = chunk.byteLength;
    if (!chunkSize || len < chunkSize) {
      yield chunk;
      return;
    }
    let pos = 0;
    let end;
    while (pos < len) {
      end = pos + chunkSize;
      yield chunk.slice(pos, end);
      pos = end;
    }
  };
  var readBytes = async function* (iterable, chunkSize) {
    for await (const chunk of readStream(iterable)) {
      yield* streamChunk(chunk, chunkSize);
    }
  };
  var readStream = async function* (stream) {
    if (stream[Symbol.asyncIterator]) {
      yield* stream;
      return;
    }
    const reader = stream.getReader();
    try {
      for (; ; ) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }
        yield value;
      }
    } finally {
      await reader.cancel();
    }
  };
  var trackStream = (stream, chunkSize, onProgress, onFinish) => {
    const iterator = readBytes(stream, chunkSize);
    let bytes = 0;
    let done;
    let _onFinish = (e) => {
      if (!done) {
        done = true;
        onFinish && onFinish(e);
      }
    };
    return new ReadableStream({
      async pull(controller) {
        try {
          const { done: done2, value } = await iterator.next();
          if (done2) {
            _onFinish();
            controller.close();
            return;
          }
          let len = value.byteLength;
          if (onProgress) {
            let loadedBytes = bytes += len;
            onProgress(loadedBytes);
          }
          controller.enqueue(new Uint8Array(value));
        } catch (err) {
          _onFinish(err);
          throw err;
        }
      },
      cancel(reason) {
        _onFinish(reason);
        return iterator.return();
      }
    }, {
      highWaterMark: 2
    });
  };

  // node_modules/axios/lib/adapters/fetch.js
  var isFetchSupported = typeof fetch === "function" && typeof Request === "function" && typeof Response === "function";
  var isReadableStreamSupported = isFetchSupported && typeof ReadableStream === "function";
  var encodeText = isFetchSupported && (typeof TextEncoder === "function" ? /* @__PURE__ */ ((encoder) => (str) => encoder.encode(str))(new TextEncoder()) : async (str) => new Uint8Array(await new Response(str).arrayBuffer()));
  var test = (fn, ...args) => {
    try {
      return !!fn(...args);
    } catch (e) {
      return false;
    }
  };
  var supportsRequestStream = isReadableStreamSupported && test(() => {
    let duplexAccessed = false;
    const hasContentType = new Request(platform_default.origin, {
      body: new ReadableStream(),
      method: "POST",
      get duplex() {
        duplexAccessed = true;
        return "half";
      }
    }).headers.has("Content-Type");
    return duplexAccessed && !hasContentType;
  });
  var DEFAULT_CHUNK_SIZE = 64 * 1024;
  var supportsResponseStream = isReadableStreamSupported && test(() => utils_default.isReadableStream(new Response("").body));
  var resolvers = {
    stream: supportsResponseStream && ((res) => res.body)
  };
  isFetchSupported && ((res) => {
    ["text", "arrayBuffer", "blob", "formData", "stream"].forEach((type) => {
      !resolvers[type] && (resolvers[type] = utils_default.isFunction(res[type]) ? (res2) => res2[type]() : (_, config) => {
        throw new AxiosError_default(`Response type '${type}' is not supported`, AxiosError_default.ERR_NOT_SUPPORT, config);
      });
    });
  })(new Response());
  var getBodyLength = async (body) => {
    if (body == null) {
      return 0;
    }
    if (utils_default.isBlob(body)) {
      return body.size;
    }
    if (utils_default.isSpecCompliantForm(body)) {
      const _request = new Request(platform_default.origin, {
        method: "POST",
        body
      });
      return (await _request.arrayBuffer()).byteLength;
    }
    if (utils_default.isArrayBufferView(body) || utils_default.isArrayBuffer(body)) {
      return body.byteLength;
    }
    if (utils_default.isURLSearchParams(body)) {
      body = body + "";
    }
    if (utils_default.isString(body)) {
      return (await encodeText(body)).byteLength;
    }
  };
  var resolveBodyLength = async (headers, body) => {
    const length = utils_default.toFiniteNumber(headers.getContentLength());
    return length == null ? getBodyLength(body) : length;
  };
  var fetch_default = isFetchSupported && (async (config) => {
    let {
      url,
      method,
      data,
      signal,
      cancelToken,
      timeout,
      onDownloadProgress,
      onUploadProgress,
      responseType,
      headers,
      withCredentials = "same-origin",
      fetchOptions
    } = resolveConfig_default(config);
    responseType = responseType ? (responseType + "").toLowerCase() : "text";
    let composedSignal = composeSignals_default([signal, cancelToken && cancelToken.toAbortSignal()], timeout);
    let request;
    const unsubscribe = composedSignal && composedSignal.unsubscribe && (() => {
      composedSignal.unsubscribe();
    });
    let requestContentLength;
    try {
      if (onUploadProgress && supportsRequestStream && method !== "get" && method !== "head" && (requestContentLength = await resolveBodyLength(headers, data)) !== 0) {
        let _request = new Request(url, {
          method: "POST",
          body: data,
          duplex: "half"
        });
        let contentTypeHeader;
        if (utils_default.isFormData(data) && (contentTypeHeader = _request.headers.get("content-type"))) {
          headers.setContentType(contentTypeHeader);
        }
        if (_request.body) {
          const [onProgress, flush] = progressEventDecorator(
            requestContentLength,
            progressEventReducer(asyncDecorator(onUploadProgress))
          );
          data = trackStream(_request.body, DEFAULT_CHUNK_SIZE, onProgress, flush);
        }
      }
      if (!utils_default.isString(withCredentials)) {
        withCredentials = withCredentials ? "include" : "omit";
      }
      const isCredentialsSupported = "credentials" in Request.prototype;
      request = new Request(url, {
        ...fetchOptions,
        signal: composedSignal,
        method: method.toUpperCase(),
        headers: headers.normalize().toJSON(),
        body: data,
        duplex: "half",
        credentials: isCredentialsSupported ? withCredentials : void 0
      });
      let response = await fetch(request);
      const isStreamResponse = supportsResponseStream && (responseType === "stream" || responseType === "response");
      if (supportsResponseStream && (onDownloadProgress || isStreamResponse && unsubscribe)) {
        const options = {};
        ["status", "statusText", "headers"].forEach((prop) => {
          options[prop] = response[prop];
        });
        const responseContentLength = utils_default.toFiniteNumber(response.headers.get("content-length"));
        const [onProgress, flush] = onDownloadProgress && progressEventDecorator(
          responseContentLength,
          progressEventReducer(asyncDecorator(onDownloadProgress), true)
        ) || [];
        response = new Response(
          trackStream(response.body, DEFAULT_CHUNK_SIZE, onProgress, () => {
            flush && flush();
            unsubscribe && unsubscribe();
          }),
          options
        );
      }
      responseType = responseType || "text";
      let responseData = await resolvers[utils_default.findKey(resolvers, responseType) || "text"](response, config);
      !isStreamResponse && unsubscribe && unsubscribe();
      return await new Promise((resolve, reject) => {
        settle(resolve, reject, {
          data: responseData,
          headers: AxiosHeaders_default.from(response.headers),
          status: response.status,
          statusText: response.statusText,
          config,
          request
        });
      });
    } catch (err) {
      unsubscribe && unsubscribe();
      if (err && err.name === "TypeError" && /fetch/i.test(err.message)) {
        throw Object.assign(
          new AxiosError_default("Network Error", AxiosError_default.ERR_NETWORK, config, request),
          {
            cause: err.cause || err
          }
        );
      }
      throw AxiosError_default.from(err, err && err.code, config, request);
    }
  });

  // node_modules/axios/lib/adapters/adapters.js
  var knownAdapters = {
    http: null_default,
    xhr: xhr_default,
    fetch: fetch_default
  };
  utils_default.forEach(knownAdapters, (fn, value) => {
    if (fn) {
      try {
        Object.defineProperty(fn, "name", { value });
      } catch (e) {
      }
      Object.defineProperty(fn, "adapterName", { value });
    }
  });
  var renderReason = (reason) => `- ${reason}`;
  var isResolvedHandle = (adapter) => utils_default.isFunction(adapter) || adapter === null || adapter === false;
  var adapters_default = {
    getAdapter: (adapters) => {
      adapters = utils_default.isArray(adapters) ? adapters : [adapters];
      const { length } = adapters;
      let nameOrAdapter;
      let adapter;
      const rejectedReasons = {};
      for (let i = 0; i < length; i++) {
        nameOrAdapter = adapters[i];
        let id;
        adapter = nameOrAdapter;
        if (!isResolvedHandle(nameOrAdapter)) {
          adapter = knownAdapters[(id = String(nameOrAdapter)).toLowerCase()];
          if (adapter === void 0) {
            throw new AxiosError_default(`Unknown adapter '${id}'`);
          }
        }
        if (adapter) {
          break;
        }
        rejectedReasons[id || "#" + i] = adapter;
      }
      if (!adapter) {
        const reasons = Object.entries(rejectedReasons).map(
          ([id, state]) => `adapter ${id} ` + (state === false ? "is not supported by the environment" : "is not available in the build")
        );
        let s = length ? reasons.length > 1 ? "since :\n" + reasons.map(renderReason).join("\n") : " " + renderReason(reasons[0]) : "as no adapter specified";
        throw new AxiosError_default(
          `There is no suitable adapter to dispatch the request ` + s,
          "ERR_NOT_SUPPORT"
        );
      }
      return adapter;
    },
    adapters: knownAdapters
  };

  // node_modules/axios/lib/core/dispatchRequest.js
  function throwIfCancellationRequested(config) {
    if (config.cancelToken) {
      config.cancelToken.throwIfRequested();
    }
    if (config.signal && config.signal.aborted) {
      throw new CanceledError_default(null, config);
    }
  }
  function dispatchRequest(config) {
    throwIfCancellationRequested(config);
    config.headers = AxiosHeaders_default.from(config.headers);
    config.data = transformData.call(
      config,
      config.transformRequest
    );
    if (["post", "put", "patch"].indexOf(config.method) !== -1) {
      config.headers.setContentType("application/x-www-form-urlencoded", false);
    }
    const adapter = adapters_default.getAdapter(config.adapter || defaults_default.adapter);
    return adapter(config).then(function onAdapterResolution(response) {
      throwIfCancellationRequested(config);
      response.data = transformData.call(
        config,
        config.transformResponse,
        response
      );
      response.headers = AxiosHeaders_default.from(response.headers);
      return response;
    }, function onAdapterRejection(reason) {
      if (!isCancel(reason)) {
        throwIfCancellationRequested(config);
        if (reason && reason.response) {
          reason.response.data = transformData.call(
            config,
            config.transformResponse,
            reason.response
          );
          reason.response.headers = AxiosHeaders_default.from(reason.response.headers);
        }
      }
      return Promise.reject(reason);
    });
  }

  // node_modules/axios/lib/env/data.js
  var VERSION = "1.7.9";

  // node_modules/axios/lib/helpers/validator.js
  var validators = {};
  ["object", "boolean", "number", "function", "string", "symbol"].forEach((type, i) => {
    validators[type] = function validator(thing) {
      return typeof thing === type || "a" + (i < 1 ? "n " : " ") + type;
    };
  });
  var deprecatedWarnings = {};
  validators.transitional = function transitional(validator, version, message) {
    function formatMessage(opt, desc) {
      return "[Axios v" + VERSION + "] Transitional option '" + opt + "'" + desc + (message ? ". " + message : "");
    }
    return (value, opt, opts) => {
      if (validator === false) {
        throw new AxiosError_default(
          formatMessage(opt, " has been removed" + (version ? " in " + version : "")),
          AxiosError_default.ERR_DEPRECATED
        );
      }
      if (version && !deprecatedWarnings[opt]) {
        deprecatedWarnings[opt] = true;
        console.warn(
          formatMessage(
            opt,
            " has been deprecated since v" + version + " and will be removed in the near future"
          )
        );
      }
      return validator ? validator(value, opt, opts) : true;
    };
  };
  validators.spelling = function spelling(correctSpelling) {
    return (value, opt) => {
      console.warn(`${opt} is likely a misspelling of ${correctSpelling}`);
      return true;
    };
  };
  function assertOptions(options, schema, allowUnknown) {
    if (typeof options !== "object") {
      throw new AxiosError_default("options must be an object", AxiosError_default.ERR_BAD_OPTION_VALUE);
    }
    const keys = Object.keys(options);
    let i = keys.length;
    while (i-- > 0) {
      const opt = keys[i];
      const validator = schema[opt];
      if (validator) {
        const value = options[opt];
        const result = value === void 0 || validator(value, opt, options);
        if (result !== true) {
          throw new AxiosError_default("option " + opt + " must be " + result, AxiosError_default.ERR_BAD_OPTION_VALUE);
        }
        continue;
      }
      if (allowUnknown !== true) {
        throw new AxiosError_default("Unknown option " + opt, AxiosError_default.ERR_BAD_OPTION);
      }
    }
  }
  var validator_default = {
    assertOptions,
    validators
  };

  // node_modules/axios/lib/core/Axios.js
  var validators2 = validator_default.validators;
  var Axios = class {
    constructor(instanceConfig) {
      this.defaults = instanceConfig;
      this.interceptors = {
        request: new InterceptorManager_default(),
        response: new InterceptorManager_default()
      };
    }
    /**
     * Dispatch a request
     *
     * @param {String|Object} configOrUrl The config specific for this request (merged with this.defaults)
     * @param {?Object} config
     *
     * @returns {Promise} The Promise to be fulfilled
     */
    async request(configOrUrl, config) {
      try {
        return await this._request(configOrUrl, config);
      } catch (err) {
        if (err instanceof Error) {
          let dummy = {};
          Error.captureStackTrace ? Error.captureStackTrace(dummy) : dummy = new Error();
          const stack = dummy.stack ? dummy.stack.replace(/^.+\n/, "") : "";
          try {
            if (!err.stack) {
              err.stack = stack;
            } else if (stack && !String(err.stack).endsWith(stack.replace(/^.+\n.+\n/, ""))) {
              err.stack += "\n" + stack;
            }
          } catch (e) {
          }
        }
        throw err;
      }
    }
    _request(configOrUrl, config) {
      if (typeof configOrUrl === "string") {
        config = config || {};
        config.url = configOrUrl;
      } else {
        config = configOrUrl || {};
      }
      config = mergeConfig(this.defaults, config);
      const { transitional: transitional2, paramsSerializer, headers } = config;
      if (transitional2 !== void 0) {
        validator_default.assertOptions(transitional2, {
          silentJSONParsing: validators2.transitional(validators2.boolean),
          forcedJSONParsing: validators2.transitional(validators2.boolean),
          clarifyTimeoutError: validators2.transitional(validators2.boolean)
        }, false);
      }
      if (paramsSerializer != null) {
        if (utils_default.isFunction(paramsSerializer)) {
          config.paramsSerializer = {
            serialize: paramsSerializer
          };
        } else {
          validator_default.assertOptions(paramsSerializer, {
            encode: validators2.function,
            serialize: validators2.function
          }, true);
        }
      }
      validator_default.assertOptions(config, {
        baseUrl: validators2.spelling("baseURL"),
        withXsrfToken: validators2.spelling("withXSRFToken")
      }, true);
      config.method = (config.method || this.defaults.method || "get").toLowerCase();
      let contextHeaders = headers && utils_default.merge(
        headers.common,
        headers[config.method]
      );
      headers && utils_default.forEach(
        ["delete", "get", "head", "post", "put", "patch", "common"],
        (method) => {
          delete headers[method];
        }
      );
      config.headers = AxiosHeaders_default.concat(contextHeaders, headers);
      const requestInterceptorChain = [];
      let synchronousRequestInterceptors = true;
      this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
        if (typeof interceptor.runWhen === "function" && interceptor.runWhen(config) === false) {
          return;
        }
        synchronousRequestInterceptors = synchronousRequestInterceptors && interceptor.synchronous;
        requestInterceptorChain.unshift(interceptor.fulfilled, interceptor.rejected);
      });
      const responseInterceptorChain = [];
      this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
        responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
      });
      let promise;
      let i = 0;
      let len;
      if (!synchronousRequestInterceptors) {
        const chain = [dispatchRequest.bind(this), void 0];
        chain.unshift.apply(chain, requestInterceptorChain);
        chain.push.apply(chain, responseInterceptorChain);
        len = chain.length;
        promise = Promise.resolve(config);
        while (i < len) {
          promise = promise.then(chain[i++], chain[i++]);
        }
        return promise;
      }
      len = requestInterceptorChain.length;
      let newConfig = config;
      i = 0;
      while (i < len) {
        const onFulfilled = requestInterceptorChain[i++];
        const onRejected = requestInterceptorChain[i++];
        try {
          newConfig = onFulfilled(newConfig);
        } catch (error) {
          onRejected.call(this, error);
          break;
        }
      }
      try {
        promise = dispatchRequest.call(this, newConfig);
      } catch (error) {
        return Promise.reject(error);
      }
      i = 0;
      len = responseInterceptorChain.length;
      while (i < len) {
        promise = promise.then(responseInterceptorChain[i++], responseInterceptorChain[i++]);
      }
      return promise;
    }
    getUri(config) {
      config = mergeConfig(this.defaults, config);
      const fullPath = buildFullPath(config.baseURL, config.url);
      return buildURL(fullPath, config.params, config.paramsSerializer);
    }
  };
  utils_default.forEach(["delete", "get", "head", "options"], function forEachMethodNoData(method) {
    Axios.prototype[method] = function(url, config) {
      return this.request(mergeConfig(config || {}, {
        method,
        url,
        data: (config || {}).data
      }));
    };
  });
  utils_default.forEach(["post", "put", "patch"], function forEachMethodWithData(method) {
    function generateHTTPMethod(isForm) {
      return function httpMethod(url, data, config) {
        return this.request(mergeConfig(config || {}, {
          method,
          headers: isForm ? {
            "Content-Type": "multipart/form-data"
          } : {},
          url,
          data
        }));
      };
    }
    Axios.prototype[method] = generateHTTPMethod();
    Axios.prototype[method + "Form"] = generateHTTPMethod(true);
  });
  var Axios_default = Axios;

  // node_modules/axios/lib/cancel/CancelToken.js
  var CancelToken = class _CancelToken {
    constructor(executor) {
      if (typeof executor !== "function") {
        throw new TypeError("executor must be a function.");
      }
      let resolvePromise;
      this.promise = new Promise(function promiseExecutor(resolve) {
        resolvePromise = resolve;
      });
      const token = this;
      this.promise.then((cancel) => {
        if (!token._listeners)
          return;
        let i = token._listeners.length;
        while (i-- > 0) {
          token._listeners[i](cancel);
        }
        token._listeners = null;
      });
      this.promise.then = (onfulfilled) => {
        let _resolve;
        const promise = new Promise((resolve) => {
          token.subscribe(resolve);
          _resolve = resolve;
        }).then(onfulfilled);
        promise.cancel = function reject() {
          token.unsubscribe(_resolve);
        };
        return promise;
      };
      executor(function cancel(message, config, request) {
        if (token.reason) {
          return;
        }
        token.reason = new CanceledError_default(message, config, request);
        resolvePromise(token.reason);
      });
    }
    /**
     * Throws a `CanceledError` if cancellation has been requested.
     */
    throwIfRequested() {
      if (this.reason) {
        throw this.reason;
      }
    }
    /**
     * Subscribe to the cancel signal
     */
    subscribe(listener) {
      if (this.reason) {
        listener(this.reason);
        return;
      }
      if (this._listeners) {
        this._listeners.push(listener);
      } else {
        this._listeners = [listener];
      }
    }
    /**
     * Unsubscribe from the cancel signal
     */
    unsubscribe(listener) {
      if (!this._listeners) {
        return;
      }
      const index = this._listeners.indexOf(listener);
      if (index !== -1) {
        this._listeners.splice(index, 1);
      }
    }
    toAbortSignal() {
      const controller = new AbortController();
      const abort = (err) => {
        controller.abort(err);
      };
      this.subscribe(abort);
      controller.signal.unsubscribe = () => this.unsubscribe(abort);
      return controller.signal;
    }
    /**
     * Returns an object that contains a new `CancelToken` and a function that, when called,
     * cancels the `CancelToken`.
     */
    static source() {
      let cancel;
      const token = new _CancelToken(function executor(c) {
        cancel = c;
      });
      return {
        token,
        cancel
      };
    }
  };
  var CancelToken_default = CancelToken;

  // node_modules/axios/lib/helpers/spread.js
  function spread(callback) {
    return function wrap(arr) {
      return callback.apply(null, arr);
    };
  }

  // node_modules/axios/lib/helpers/isAxiosError.js
  function isAxiosError(payload) {
    return utils_default.isObject(payload) && payload.isAxiosError === true;
  }

  // node_modules/axios/lib/helpers/HttpStatusCode.js
  var HttpStatusCode = {
    Continue: 100,
    SwitchingProtocols: 101,
    Processing: 102,
    EarlyHints: 103,
    Ok: 200,
    Created: 201,
    Accepted: 202,
    NonAuthoritativeInformation: 203,
    NoContent: 204,
    ResetContent: 205,
    PartialContent: 206,
    MultiStatus: 207,
    AlreadyReported: 208,
    ImUsed: 226,
    MultipleChoices: 300,
    MovedPermanently: 301,
    Found: 302,
    SeeOther: 303,
    NotModified: 304,
    UseProxy: 305,
    Unused: 306,
    TemporaryRedirect: 307,
    PermanentRedirect: 308,
    BadRequest: 400,
    Unauthorized: 401,
    PaymentRequired: 402,
    Forbidden: 403,
    NotFound: 404,
    MethodNotAllowed: 405,
    NotAcceptable: 406,
    ProxyAuthenticationRequired: 407,
    RequestTimeout: 408,
    Conflict: 409,
    Gone: 410,
    LengthRequired: 411,
    PreconditionFailed: 412,
    PayloadTooLarge: 413,
    UriTooLong: 414,
    UnsupportedMediaType: 415,
    RangeNotSatisfiable: 416,
    ExpectationFailed: 417,
    ImATeapot: 418,
    MisdirectedRequest: 421,
    UnprocessableEntity: 422,
    Locked: 423,
    FailedDependency: 424,
    TooEarly: 425,
    UpgradeRequired: 426,
    PreconditionRequired: 428,
    TooManyRequests: 429,
    RequestHeaderFieldsTooLarge: 431,
    UnavailableForLegalReasons: 451,
    InternalServerError: 500,
    NotImplemented: 501,
    BadGateway: 502,
    ServiceUnavailable: 503,
    GatewayTimeout: 504,
    HttpVersionNotSupported: 505,
    VariantAlsoNegotiates: 506,
    InsufficientStorage: 507,
    LoopDetected: 508,
    NotExtended: 510,
    NetworkAuthenticationRequired: 511
  };
  Object.entries(HttpStatusCode).forEach(([key, value]) => {
    HttpStatusCode[value] = key;
  });
  var HttpStatusCode_default = HttpStatusCode;

  // node_modules/axios/lib/axios.js
  function createInstance(defaultConfig) {
    const context = new Axios_default(defaultConfig);
    const instance2 = bind(Axios_default.prototype.request, context);
    utils_default.extend(instance2, Axios_default.prototype, context, { allOwnKeys: true });
    utils_default.extend(instance2, context, null, { allOwnKeys: true });
    instance2.create = function create(instanceConfig) {
      return createInstance(mergeConfig(defaultConfig, instanceConfig));
    };
    return instance2;
  }
  var axios = createInstance(defaults_default);
  axios.Axios = Axios_default;
  axios.CanceledError = CanceledError_default;
  axios.CancelToken = CancelToken_default;
  axios.isCancel = isCancel;
  axios.VERSION = VERSION;
  axios.toFormData = toFormData_default;
  axios.AxiosError = AxiosError_default;
  axios.Cancel = axios.CanceledError;
  axios.all = function all(promises) {
    return Promise.all(promises);
  };
  axios.spread = spread;
  axios.isAxiosError = isAxiosError;
  axios.mergeConfig = mergeConfig;
  axios.AxiosHeaders = AxiosHeaders_default;
  axios.formToJSON = (thing) => formDataToJSON_default(utils_default.isHTMLForm(thing) ? new FormData(thing) : thing);
  axios.getAdapter = adapters_default.getAdapter;
  axios.HttpStatusCode = HttpStatusCode_default;
  axios.default = axios;
  var axios_default = axios;

  // node_modules/axios/index.js
  var {
    Axios: Axios2,
    AxiosError: AxiosError2,
    CanceledError: CanceledError2,
    isCancel: isCancel2,
    CancelToken: CancelToken2,
    VERSION: VERSION2,
    all: all2,
    Cancel,
    isAxiosError: isAxiosError2,
    spread: spread2,
    toFormData: toFormData2,
    AxiosHeaders: AxiosHeaders2,
    HttpStatusCode: HttpStatusCode2,
    formToJSON,
    getAdapter,
    mergeConfig: mergeConfig2
  } = axios_default;

  // app/javascript/config/axios.js
  var import_deviceKey = __toESM(require_deviceKey());
  var instance = axios_default.create({
    baseURL: `${window.location.protocol}//${window.location.host}/api/v1`,
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    }
  });
  instance.interceptors.request.use(async (config) => {
    try {
      let url = config.url || "";
      console.log("Original URL before normalization:", url);
      url = url.replace(/^api\/v1\/auth\/api\/v1\//, "");
      url = url.replace(/^api\/v1\/auth\//, "");
      url = url.replace(/^api\/v1\//, "");
      url = url.replace(/^auth\//, "");
      config.url = `auth/${url}`;
      console.log("Normalized URL after processing:", config.url);
      const completeHeader = (0, import_deviceKey.getCompleteDeviceHeaderFromStorage)();
      if (completeHeader) {
        console.log("Using complete device header with all required fields for request:", {
          deviceId: completeHeader.deviceId.substring(0, 10) + "...",
          userGuid: completeHeader.userGuid,
          userHandle: completeHeader.userHandle
        });
        config.headers["X-Device-Header"] = JSON.stringify(completeHeader);
      } else {
        console.log("No complete device header available - sending simplified header for fingerprinting only");
        const browserKey2 = await (0, import_deviceKey.getStoredDeviceKey)();
        if (browserKey2) {
          const deviceCharacteristics = {
            platform: navigator.platform || "unknown",
            screenWidth: window.screen.width,
            screenHeight: window.screen.height,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            language: navigator.language || "unknown",
            devicePixelRatio: window.devicePixelRatio || 1,
            browserFamily: detectBrowserFamily(navigator.userAgent),
            colorDepth: window.screen.colorDepth
          };
          const simplifiedHeader = {
            deviceId: browserKey2,
            deviceCharacteristics,
            timestamp: Date.now()
          };
          config.headers["X-Device-Header"] = JSON.stringify(simplifiedHeader);
        }
      }
      const browserKey = await (0, import_deviceKey.getStoredDeviceKey)();
      if (browserKey) {
        console.log("Setting request header X-Device-Key:", browserKey.substring(0, 10) + "...");
        config.headers["X-Device-Key"] = browserKey;
      }
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content;
      if (csrfToken) {
        config.headers["X-CSRF-Token"] = csrfToken;
      }
      return config;
    } catch (error) {
      console.error("Request interceptor error:", error);
      return config;
    }
  });
  function detectBrowserFamily(userAgent) {
    if (/Chrome/i.test(userAgent))
      return "Chrome";
    if (/Firefox/i.test(userAgent))
      return "Firefox";
    if (/Safari/i.test(userAgent))
      return "Safari";
    if (/Edge|Edg/i.test(userAgent))
      return "Edge";
    if (/MSIE|Trident/i.test(userAgent))
      return "Internet Explorer";
    if (/Opera|OPR/i.test(userAgent))
      return "Opera";
    return "Unknown";
  }
  instance.interceptors.response.use((response) => {
    try {
      if (response.data) {
        if (response.data.device_key) {
          sessionStorage.setItem("device_key", response.data.device_key);
        }
        if (response.data.status === "authenticated") {
          sessionStorage.setItem("device_session", "authenticated");
          if (response.data.handle) {
            sessionStorage.setItem("current_handle", response.data.handle);
          }
          if (response.data.device_header_data) {
            console.log("Received device_header_data in response:", response.data.device_header_data);
            if (response.data.device_header_data.deviceId && response.data.device_header_data.userGuid && response.data.device_header_data.userHandle) {
              const headerStored = (0, import_deviceKey.generateDeviceHeader)(
                response.data.device_header_data.deviceId,
                response.data.device_header_data.userGuid,
                response.data.device_header_data.userHandle
              );
              if (headerStored) {
                console.log("Successfully stored complete device header in localStorage for cross-browser auth");
                const storedHeader = localStorage.getItem("superapp_device_header");
                if (storedHeader) {
                  try {
                    const parsedHeader = JSON.parse(storedHeader);
                    console.log("Verified stored header has required fields:", {
                      hasDeviceId: !!parsedHeader.deviceId,
                      hasUserGuid: !!parsedHeader.userGuid,
                      hasUserHandle: !!parsedHeader.userHandle
                    });
                  } catch (e) {
                    console.error("Error validating stored header:", e);
                  }
                }
              } else {
                console.warn("Failed to store device header data - cross-browser auth may not work");
              }
            } else {
              console.warn("Incomplete device_header_data received, missing required fields:", {
                hasDeviceId: !!response.data.device_header_data.deviceId,
                hasUserGuid: !!response.data.device_header_data.userGuid,
                hasUserHandle: !!response.data.device_header_data.userHandle
              });
            }
          } else if (response.data.device_key && response.data.guid && response.data.handle) {
            console.log("Creating device header from individual response fields");
            const headerStored = (0, import_deviceKey.generateDeviceHeader)(
              response.data.device_key,
              response.data.guid,
              response.data.handle
            );
            if (headerStored) {
              console.log("Successfully stored device header from individual fields");
            } else {
              console.warn("Failed to store device header from individual fields");
              try {
                const headerData = {
                  deviceId: response.data.device_key,
                  userGuid: response.data.guid,
                  userHandle: response.data.handle,
                  timestamp: Date.now()
                };
                localStorage.setItem("superapp_device_header", JSON.stringify(headerData));
                console.log("Directly stored device header as last resort");
              } catch (e) {
                console.error("Failed even with direct localStorage storage:", e);
              }
            }
          } else {
            console.log("No device_header_data or complete field set in authenticated response");
          }
        }
      }
    } catch (error) {
      console.error("Response interceptor error:", error);
    }
    return response;
  });
  var axios_default2 = instance;

  // app/javascript/components/auth/UnifiedLogin.jsx
  var import_deviceKey2 = __toESM(require_deviceKey());
  var UnifiedLogin = () => {
    const [flowState, setFlowState] = (0, import_react2.useState)("checking");
    const [identifier, setIdentifier] = (0, import_react2.useState)("");
    const [verificationCode, setVerificationCode] = (0, import_react2.useState)("");
    const [handle, setHandle] = (0, import_react2.useState)("");
    const [error, setError] = (0, import_react2.useState)("");
    const [phone, setPhone] = (0, import_react2.useState)("");
    const [isQuickVerification, setIsQuickVerification] = (0, import_react2.useState)(false);
    const [countryCode, setCountryCode] = (0, import_react2.useState)("+44");
    const [phoneNumber, setPhoneNumber] = (0, import_react2.useState)("");
    const [showCountrySelect, setShowCountrySelect] = (0, import_react2.useState)(false);
    const [isLoading, setIsLoading] = (0, import_react2.useState)(false);
    const [redirectAttempts, setRedirectAttempts] = (0, import_react2.useState)(0);
    const [welcomeMessage, setWelcomeMessage] = (0, import_react2.useState)("");
    const [loginMethod, setLoginMethod] = (0, import_react2.useState)("handle");
    const [existingUserData, setExistingUserData] = (0, import_react2.useState)(null);
    const [autoSubmit, setAutoSubmit] = (0, import_react2.useState)(true);
    const [deviceNotRegistered, setDeviceNotRegistered] = (0, import_react2.useState)(false);
    const [suggestedHandles, setSuggestedHandles] = (0, import_react2.useState)([]);
    const [showExistingAccountAlert, setShowExistingAccountAlert] = (0, import_react2.useState)(false);
    const [accountType, setAccountType] = (0, import_react2.useState)(null);
    const [existingHandle, setExistingHandle] = (0, import_react2.useState)("");
    const [isHandleFirst, setIsHandleFirst] = (0, import_react2.useState)(false);
    const [customHandle, setCustomHandle] = (0, import_react2.useState)("");
    const [showPinEntry, setShowPinEntry] = (0, import_react2.useState)(false);
    const [pinAvailable, setPinAvailable] = (0, import_react2.useState)(false);
    const [pin, setPin] = (0, import_react2.useState)("");
    const [pinAttempts, setPinAttempts] = (0, import_react2.useState)(0);
    const [isRegistrationFlow, setIsRegistrationFlow] = (0, import_react2.useState)(false);
    const [isVerificationSuccess, setIsVerificationSuccess] = (0, import_react2.useState)(false);
    const [webAuthnEnabled, setWebAuthnEnabled] = (0, import_react2.useState)(false);
    const loadingTimeoutRef = (0, import_react2.useRef)(null);
    const verificationInputRef = (0, import_react2.useRef)(null);
    const yesButtonRef = (0, import_react2.useRef)(null);
    const noButtonRef = (0, import_react2.useRef)(null);
    const MAX_REDIRECT_ATTEMPTS = 3;
    const getExistingCompleteHeader = () => {
      try {
        const headerString = localStorage.getItem("superapp_device_header");
        if (!headerString) {
          console.log("No device header found in localStorage");
          return null;
        }
        const parsedHeader = JSON.parse(headerString);
        if (parsedHeader.deviceId && parsedHeader.userGuid && parsedHeader.userHandle) {
          console.log("Found complete device header for cross-browser auth:", {
            deviceId: parsedHeader.deviceId.substring(0, 10) + "...",
            userGuid: parsedHeader.userGuid,
            userHandle: parsedHeader.userHandle
          });
          return parsedHeader;
        } else {
          console.warn("Found incomplete device header (missing required fields):", {
            hasDeviceId: !!parsedHeader.deviceId,
            hasUserGuid: !!parsedHeader.userGuid,
            hasUserHandle: !!parsedHeader.userHandle
          });
          console.warn("Cannot use incomplete header for cross-browser authentication");
          return null;
        }
      } catch (e) {
        console.error("Error parsing stored device header:", e);
        return null;
      }
    };
    const getExistingDeviceHeader = () => {
      try {
        const headerString = localStorage.getItem("superapp_device_header");
        if (!headerString) {
          console.log("No existing device header found in localStorage");
          return null;
        }
        const parsedHeader = JSON.parse(headerString);
        if (parsedHeader.deviceId && parsedHeader.userGuid && parsedHeader.userHandle) {
          console.log("Found complete device header from previous browser session:", {
            deviceId: parsedHeader.deviceId.substring(0, 10) + "...",
            userGuid: parsedHeader.userGuid,
            userHandle: parsedHeader.userHandle
          });
          return parsedHeader;
        } else {
          console.warn("Found incomplete device header, ignoring it:", {
            hasDeviceId: !!parsedHeader.deviceId,
            hasUserGuid: !!parsedHeader.userGuid,
            hasUserHandle: !!parsedHeader.userHandle
          });
          return null;
        }
      } catch (e) {
        console.error("Error parsing stored device header:", e);
        return null;
      }
    };
    const ensureDeviceHeaderCreated = (authData) => {
      console.log("Ensuring device header is properly created with all fields");
      if (!authData || !authData.device_key || !authData.guid || !authData.handle) {
        console.warn(
          "Missing required auth data fields for device header:",
          {
            hasDeviceKey: !!authData?.device_key,
            hasGuid: !!authData?.guid,
            hasHandle: !!authData?.handle
          }
        );
        return false;
      }
      console.log("Current localStorage header:", localStorage.getItem("superapp_device_header"));
      console.log("Creating explicit device header with data:", {
        deviceId: authData.device_key.substring(0, 10) + "...",
        userGuid: authData.guid,
        userHandle: authData.handle
      });
      const headerStored = (0, import_deviceKey2.generateDeviceHeader)(
        authData.device_key,
        authData.guid,
        authData.handle
      );
      if (headerStored) {
        console.log("Successfully stored explicit device header");
        console.log(
          "AFTER AUTH SUCCESS - Device header content:",
          localStorage.getItem("superapp_device_header")
        );
      } else {
        console.warn("Failed to store explicit device header");
        return false;
      }
    };
    const storeVerificationSuccess = () => {
      localStorage.setItem("device_verified", "true");
      localStorage.setItem("last_verification", Date.now().toString());
      setFlowState("verificationSuccess");
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 2e3);
    };
    const handleRegisterDevice = (0, import_react2.useCallback)(async () => {
      console.log("handleRegisterDevice called");
      if (isLoading) {
        console.log("Already loading, ignoring duplicate call");
        return;
      }
      setShowPinEntry(false);
      setFlowState("verification");
      setWelcomeMessage(`Verify it's you, ${existingUserData?.handle || ""}`);
      setIsLoading(true);
      setError("");
      const safetyTimeout = setTimeout(() => {
        setIsLoading(false);
        setError("Request timed out. Please try again.");
      }, 15e3);
      try {
        sessionStorage.setItem("device_registration", "true");
        sessionStorage.setItem("device_registration_flow", "true");
        sessionStorage.setItem("pending_verification", "true");
        if (accountType === "handle" || loginMethod === "handle") {
          sessionStorage.setItem("handle_first", "true");
        }
        const metaElement = document.querySelector('meta[name="csrf-token"]');
        const csrfToken = metaElement ? metaElement.getAttribute("content") : null;
        console.log("CSRF token:", csrfToken ? "Found" : "Not found");
        if (!csrfToken) {
          console.error("CSRF token missing");
          setError("Security verification failed. Please refresh the page.");
          clearTimeout(safetyTimeout);
          setIsLoading(false);
          return;
        }
        let userIdentifier;
        if (existingUserData) {
          if (accountType === "handle" && existingUserData.handle) {
            userIdentifier = existingUserData.handle;
          } else if (accountType === "phone" && existingUserData.phone) {
            userIdentifier = existingUserData.phone;
          } else {
            userIdentifier = loginMethod === "handle" ? identifier : phone;
          }
        } else {
          userIdentifier = loginMethod === "handle" ? identifier : phone;
        }
        console.log(`Registering device for: ${userIdentifier}`);
        const deviceKey = await (0, import_deviceKey2.getStoredDeviceKey)();
        console.log(`Using device key: ${deviceKey?.substring(0, 10)}...`);
        const completeHeader = getExistingCompleteHeader();
        const requestHeaders = {
          "X-CSRF-Token": csrfToken
        };
        if (completeHeader) {
          console.log("Using complete device header for device registration:", {
            deviceId: completeHeader.deviceId.substring(0, 10) + "...",
            userGuid: completeHeader.userGuid,
            userHandle: completeHeader.userHandle
          });
          requestHeaders["X-Device-Header"] = JSON.stringify(completeHeader);
        } else {
          console.log("No complete header found - using basic header for fingerprinting only");
          const deviceCharacteristics = {
            platform: navigator.platform || "unknown",
            screenWidth: window.screen.width,
            screenHeight: window.screen.height,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            language: navigator.language || "unknown"
          };
          const basicHeader = {
            deviceId: deviceKey,
            deviceCharacteristics,
            timestamp: Date.now()
          };
          requestHeaders["X-Device-Header"] = JSON.stringify(basicHeader);
        }
        if (deviceKey) {
          requestHeaders["X-Device-Key"] = deviceKey;
        }
        console.log("Sending verify_login request with device_registration=true");
        const response = await axios_default2.post("verify_login", {
          identifier: userIdentifier,
          device_registration: true,
          auth: {
            identifier: userIdentifier,
            device_registration: true
          }
        }, {
          headers: requestHeaders,
          timeout: 15e3
          // Add timeout to prevent hanging requests
        });
        console.log("Device registration response:", response.data);
        if (response.data.status === "verification_needed") {
          if (response.data.pending_device_path) {
            sessionStorage.setItem("pending_device_path", response.data.pending_device_path);
          }
          setPhone(response.data.masked_phone || phone);
          setHandle(response.data.handle || handle);
          setWelcomeMessage(`Verify it's you, ${response.data.handle || ""}`);
          sessionStorage.setItem("current_handle", response.data.handle);
          sessionStorage.setItem("verification_in_progress", "true");
          sessionStorage.setItem("device_registration_flow", "true");
          sessionStorage.setItem("pending_verification", "true");
        } else if (response.data.status === "error") {
          setError(response.data.message || "Registration failed. Please try again.");
        } else {
          console.warn("Unexpected response status:", response.data.status);
          setError("Unable to process request. Please try again.");
        }
      } catch (err) {
        console.error("Device registration error:", err);
        console.error("Error details:", {
          message: err.message,
          stack: err.stack,
          response: err.response?.data,
          status: err.response?.status
        });
        setError("Failed to register device. Please try again.");
      } finally {
        clearTimeout(safetyTimeout);
        setIsLoading(false);
      }
    }, [isLoading, loginMethod, identifier, phone, handle, accountType, existingUserData, setIsLoading, setError, setPhone, setHandle, setWelcomeMessage, setFlowState]);
    const handleNotMyAccount = (0, import_react2.useCallback)(() => {
      setIsLoading(true);
      setError("");
      if (loginMethod === "handle" && identifier.startsWith("@")) {
        try {
          const suggestions = generateHandleSuggestions(identifier);
          setSuggestedHandles(suggestions);
          setIsHandleFirst(true);
          setFlowState("handleSuggestions");
        } catch (err) {
          console.error("Error generating handle suggestions:", err);
          setIdentifier("");
          setFlowState("loginOptions");
        }
      } else {
        setIdentifier("");
        setLoginMethod("phone");
        sessionStorage.setItem("clear_phone_entry", "true");
        setAccountType(null);
        setExistingUserData(null);
        setShowExistingAccountAlert(false);
        setFlowState("loginOptions");
      }
      setIsLoading(false);
    }, [loginMethod, identifier, setIsLoading, setError, setSuggestedHandles, setFlowState, setIdentifier]);
    (0, import_react2.useEffect)(() => {
      window.debugUnifiedLogin = {
        handleRegisterDevice,
        handleNotMyAccount,
        setFlowState,
        flowState
      };
      console.log("UnifiedLogin debug methods attached to window.debugUnifiedLogin");
      return () => {
        delete window.debugUnifiedLogin;
      };
    }, [handleRegisterDevice, handleNotMyAccount, setFlowState, flowState]);
    (0, import_react2.useEffect)(() => {
      const csrfMetaTag = document.querySelector('meta[name="csrf-token"]');
      if (csrfMetaTag) {
        window.csrfToken = csrfMetaTag.getAttribute("content");
        console.log("CSRF token loaded:", window.csrfToken?.substring(0, 10) + "...");
      } else {
        console.error("CSRF token meta tag not found!");
      }
    }, []);
    (0, import_react2.useEffect)(() => {
      console.log("UnifiedLogin: Component mounted, initializing...");
      console.log(
        "Checking session storage for account_already_exists:",
        sessionStorage.getItem("account_already_exists")
      );
      const storedTabId = localStorage.getItem("superapp_tab_id");
      const currentTabId = Math.random().toString(36).substring(2, 15);
      if (!storedTabId) {
        localStorage.setItem("superapp_tab_id", currentTabId);
        console.log("First tab initialized with ID:", currentTabId);
      } else {
        console.log("Using existing tab ID:", storedTabId);
        const redirectCount = parseInt(sessionStorage.getItem("redirect_count") || "0");
        if (redirectCount > 2 && window.location.pathname !== "/dashboard") {
          console.log("Detected potential redirect loop, stopping authentication check");
          localStorage.setItem("loop_detected", "true");
          setFlowState("loginOptions");
          return;
        }
        if (window.location.pathname === "/") {
          sessionStorage.setItem("redirect_count", (redirectCount + 1).toString());
        }
      }
      if (window.location.pathname === "/dashboard" || localStorage.getItem("authenticated_user") === "true" && !localStorage.getItem("logout_state")) {
        console.log("Already on dashboard or authenticated, skipping initialization");
        return;
      }
      if (window.location.pathname.includes("logout_confirmation")) {
        console.log("On logout confirmation page, skipping device check");
        return;
      }
      const deviceSession = sessionStorage.getItem("device_session");
      const currentHandle = sessionStorage.getItem("current_handle");
      const deviceKey = sessionStorage.getItem("device_key");
      const lastCheck = sessionStorage.getItem("last_device_check");
      const now = Date.now();
      if (deviceSession === "authenticated" && currentHandle && deviceKey && !localStorage.getItem("logout_state")) {
        console.log("Using cached device session:", currentHandle);
        localStorage.setItem("authenticated_user", "true");
        if (window.location.pathname !== "/dashboard") {
          window.location.href = "/dashboard";
        }
        return;
      }
      const alreadyExists = sessionStorage.getItem("account_already_exists");
      if (alreadyExists) {
        try {
          const data = JSON.parse(alreadyExists);
          console.log("Found existing account data:", data);
          setShowExistingAccountAlert(true);
          setAccountType(data.type);
          setExistingHandle(data.masked_handle || "");
          setIdentifier(data.phone || data.handle || "");
          setLoginMethod(data.type);
          setExistingUserData({
            type: data.type,
            handle: data.handle,
            phone: data.phone,
            masked_handle: data.masked_handle,
            masked_phone: data.masked_phone,
            pin_available: data.pin_available || false
          });
          setPinAvailable(data.pin_available || false);
          sessionStorage.removeItem("account_already_exists");
        } catch (e) {
          console.error("Error parsing account data:", e);
        }
      }
      if (lastCheck && now - parseInt(lastCheck) < 2e3) {
        console.log("Recent device check found, using cached data");
        const cachedHandle = sessionStorage.getItem("current_handle");
        const cachedPhone = sessionStorage.getItem("current_phone");
        if (cachedHandle) {
          console.log("Using cached device info:", cachedHandle);
          setHandle(cachedHandle);
          if (cachedPhone)
            setPhone(cachedPhone);
          setIsQuickVerification(true);
          setFlowState("verification");
          setIsLoading(false);
          setWelcomeMessage(`Welcome back, ${cachedHandle}!`);
        } else {
          setFlowState("loginOptions");
          setDeviceNotRegistered(true);
        }
        return;
      }
      sessionStorage.setItem("last_device_check", now.toString());
      localStorage.removeItem("loop_detected");
      checkDevice();
    }, []);
    (0, import_react2.useEffect)(() => {
      const handleStorageChange = (e) => {
        if (e.key === "authenticated_user" && e.newValue === "true") {
          console.log("Authentication detected in another tab");
          if (window.location.pathname !== "/dashboard") {
            window.location.href = "/dashboard";
          }
        }
        if (e.key === "logout_state" && e.newValue === "true") {
          console.log("Logout detected in another tab");
          sessionStorage.removeItem("device_session");
          sessionStorage.removeItem("current_handle");
          setFlowState("loginOptions");
          setDeviceNotRegistered(true);
          (0, import_deviceKey2.clearDeviceSession)();
        }
      };
      window.addEventListener("storage", handleStorageChange);
      return () => {
        window.removeEventListener("storage", handleStorageChange);
      };
    }, []);
    (0, import_react2.useEffect)(() => {
      if (flowState === "verification") {
        setIsLoading(false);
        setAutoSubmit(true);
        setTimeout(() => {
          if (verificationInputRef.current) {
            verificationInputRef.current.focus();
          }
        }, 100);
      } else if (flowState === "handleSuggestions") {
        const storedSuggestions = sessionStorage.getItem("handle_suggestions");
        if (storedSuggestions) {
          try {
            const parsedSuggestions = JSON.parse(storedSuggestions);
            setSuggestedHandles(parsedSuggestions);
            sessionStorage.removeItem("handle_suggestions");
          } catch (e) {
            console.error("Error parsing stored suggestions:", e);
          }
        }
      }
    }, [flowState]);
    (0, import_react2.useEffect)(() => {
      if (verificationCode.length === 6 && (flowState === "verification" || flowState === "deviceRegistration") && !isLoading && autoSubmit) {
        handleVerificationSubmit();
      }
    }, [verificationCode, isLoading, autoSubmit, flowState]);
    (0, import_react2.useEffect)(() => {
      if (pin.length === 4 && flowState === "pinEntry" && !isLoading) {
        handlePinVerification();
      }
    }, [pin, flowState, isLoading]);
    (0, import_react2.useEffect)(() => {
      const safetyTimeout = setTimeout(() => {
        if (isLoading) {
          console.log("Safety timeout triggered - resetting loading state");
          setIsLoading(false);
        }
      }, 2e4);
      return () => clearTimeout(safetyTimeout);
    }, [isLoading]);
    const checkDevice = async () => {
      console.log("Starting device check...");
      if (localStorage.getItem("loop_detected") === "true") {
        console.log("Loop previously detected, skipping device check");
        setFlowState("loginOptions");
        return;
      }
      const urlParams = new URLSearchParams(window.location.search);
      if (window.location.pathname.includes("logout_confirmation") || urlParams.has("logout")) {
        console.log("On logout confirmation page - skipping device check");
        return;
      }
      if (localStorage.getItem("logout_state") === "true") {
        console.log("Logout state detected in localStorage");
        localStorage.removeItem("logout_state");
        (0, import_deviceKey2.clearDeviceSession)();
        setFlowState("loginOptions");
        setDeviceNotRegistered(true);
        return;
      }
      if (shouldSkipDeviceCheck()) {
        console.log("Skipping device check: already authenticated or logging out");
        return;
      }
      const safetyTimeout = setTimeout(() => {
        console.log("Device check safety timeout triggered");
        setIsLoading(false);
        setFlowState("loginOptions");
        setDeviceNotRegistered(true);
        setError("Connection timeout. Please try again.");
      }, 15e3);
      try {
        setIsLoading(true);
        let deviceKey = await (0, import_deviceKey2.getStoredDeviceKey)();
        const previousHandle = localStorage.getItem("previous_handle");
        if (previousHandle) {
          console.log("Found previous handle in localStorage:", previousHandle);
        }
        if (sessionStorage.getItem("verification_in_progress")) {
          console.log("Verification in progress, skipping device check");
          clearTimeout(safetyTimeout);
          return;
        }
        if (!deviceKey) {
          console.log("No device key found, generating...");
          deviceKey = await (0, import_deviceKey2.generateDeviceKey)();
          if (deviceKey) {
            console.log("Storing new device key");
            (0, import_deviceKey2.storeDeviceKey)(deviceKey);
          }
        }
        const completeHeader = getExistingCompleteHeader();
        console.log("Sending device check request with key:", deviceKey?.substring(0, 10) + "...");
        const requestHeaders = {};
        if (completeHeader) {
          console.log("Using complete device header with all required fields for cross-browser authentication");
          requestHeaders["X-Device-Header"] = JSON.stringify(completeHeader);
          if (!deviceKey && completeHeader.deviceId) {
            deviceKey = completeHeader.deviceId;
            (0, import_deviceKey2.storeDeviceKey)(deviceKey);
            console.log("Using deviceId from existing header:", deviceKey.substring(0, 10) + "...");
          }
        } else {
          console.log("No complete header found - using device fingerprint for recognition only");
          const deviceFingerprint = await (0, import_deviceKey2.getDeviceFingerprint)();
          if (deviceFingerprint) {
            console.log("Using basic device fingerprint");
            try {
              const fingerprint = JSON.parse(deviceFingerprint);
              const basicHeader = {
                deviceId: deviceKey,
                deviceCharacteristics: fingerprint,
                timestamp: Date.now()
              };
              requestHeaders["X-Device-Header"] = JSON.stringify(basicHeader);
            } catch (e) {
              console.error("Error parsing device fingerprint:", e);
            }
          }
        }
        if (deviceKey) {
          requestHeaders["X-Device-Key"] = deviceKey;
        }
        const response = await axios_default2.post("check_device", {}, {
          timeout: 1e4,
          // Add timeout to prevent hanging requests
          headers: requestHeaders
        });
        console.log("Check device response:", response.data);
        if (response.data.device_key) {
          (0, import_deviceKey2.storeDeviceKey)(response.data.device_key);
        }
        if (response.data.status === "logged_out" || response.data.next === "logout_confirmation") {
          console.log("Logout state detected from server");
          (0, import_deviceKey2.clearDeviceSession)();
          clearTimeout(safetyTimeout);
          setIsLoading(false);
          return;
        }
        if (response.data.status === "authenticated") {
          console.log("Device authenticated, redirecting to dashboard");
          (0, import_deviceKey2.storeDeviceSessionData)(response.data);
          ensureDeviceHeaderCreated(response.data);
          console.log("AFTER AUTH SUCCESS - Device header content:", localStorage.getItem("superapp_device_header"));
          localStorage.setItem("authenticated_user", "true");
          setFlowState("loginSuccess");
          console.log("Authentication success - verifying device header storage");
          const headerExists = !!localStorage.getItem("superapp_device_header");
          console.log("Device header in localStorage:", headerExists ? "YES" : "NO");
          if (!headerExists && response.data.device_key && response.data.guid && response.data.handle) {
            console.log("FALLBACK: Device header missing - forcing creation");
            const headerData = {
              deviceId: response.data.device_key,
              userGuid: response.data.guid,
              userHandle: response.data.handle
            };
            localStorage.setItem("superapp_device_header", JSON.stringify(headerData));
            console.log("Forced device header creation:", !!localStorage.getItem("superapp_device_header"));
          }
          setTimeout(() => {
            window.location.href = response.data.redirect_to || "/dashboard";
          }, 500);
        } else if (response.data.status === "needs_quick_verification") {
          console.log("Device recognized but needs quick verification");
          (0, import_deviceKey2.storeDeviceSessionData)(response.data);
          setHandle(response.data.handle);
          setPhone(response.data.masked_phone);
          setIsQuickVerification(true);
          setWelcomeMessage(`Welcome back, ${response.data.handle}!`);
          setFlowState("verification");
          if (response.data.pin_available) {
            setPinAvailable(true);
          }
          setIsLoading(false);
        } else if (response.data.status === "show_options") {
          console.log("New device or no registration found, showing login options");
          setFlowState("loginOptions");
          if (response.data.device_not_registered) {
            setDeviceNotRegistered(true);
          }
        } else {
          console.log("Unknown status, defaulting to login options");
          if (response.data.guid) {
            sessionStorage.setItem("device_guid", response.data.guid);
          }
          setFlowState("loginOptions");
          setDeviceNotRegistered(true);
        }
      } catch (err) {
        console.error("Device check failed:", err);
        setError("Connection error. Please try again.");
        setFlowState("loginOptions");
        setDeviceNotRegistered(true);
      } finally {
        clearTimeout(safetyTimeout);
        setIsLoading(false);
      }
    };
    const checkPinAvailability = async (handleOrPhone) => {
      try {
        console.log("Checking PIN availability for:", handleOrPhone);
        const response = await axios_default2.get(`check_pin_availability`, {
          params: { identifier: handleOrPhone }
        });
        if (response.data && response.data.pin_available) {
          console.log("PIN is available for this user");
          setPinAvailable(true);
          return true;
        } else {
          console.log("PIN is not available for this user");
          setPinAvailable(false);
          return false;
        }
      } catch (err) {
        console.error("Error checking PIN availability:", err);
        setPinAvailable(false);
        return false;
      }
    };
    const handlePinVerification = async () => {
      if (pin.length !== 4 || isLoading)
        return;
      setIsLoading(true);
      setError("");
      const safetyTimeout = setTimeout(() => {
        setIsLoading(false);
        setError("Request timed out. Please try again.");
      }, 15e3);
      try {
        const identifier2 = existingUserData?.handle || handle || (loginMethod === "handle" ? identifier2 : phone);
        console.log("Verifying PIN for:", identifier2);
        const completeHeader = getExistingCompleteHeader();
        const requestHeaders = {};
        if (completeHeader) {
          console.log("Using complete device header for PIN verification");
          requestHeaders["X-Device-Header"] = JSON.stringify(completeHeader);
        } else {
          console.log("No complete header found for cross-browser auth during PIN verification");
        }
        const deviceKey = await (0, import_deviceKey2.getStoredDeviceKey)();
        if (deviceKey) {
          requestHeaders["X-Device-Key"] = deviceKey;
        }
        const response = await axios_default2.post("verify_pin", {
          identifier: identifier2,
          pin
        }, {
          headers: requestHeaders
        });
        console.log("PIN verification response:", response.data);
        if (response.data.status === "authenticated") {
          (0, import_deviceKey2.storeDeviceSessionData)(response.data);
          ensureDeviceHeaderCreated(response.data);
          localStorage.setItem("authenticated_user", "true");
          setIsVerificationSuccess(true);
          setFlowState("verificationSuccess");
          setTimeout(() => {
            window.location.href = response.data.redirect_to || "/dashboard";
          }, 1500);
        } else {
          throw new Error(response.data.error || "PIN verification failed");
        }
      } catch (err) {
        console.error("PIN verification error:", err);
        setError(err.response?.data?.error || err.message || "Invalid PIN");
        setPin("");
        const newAttempts = pinAttempts + 1;
        setPinAttempts(newAttempts);
        if (newAttempts >= 3) {
          setError("Too many failed attempts. Please verify with SMS.");
          setTimeout(() => {
            setFlowState("verification");
            setShowPinEntry(false);
            handleRegisterDevice();
          }, 2e3);
        }
      } finally {
        clearTimeout(safetyTimeout);
        setIsLoading(false);
      }
    };
    const appendToPin = (digit) => {
      if (pin.length < 4) {
        setPin((prev) => prev + digit);
      }
    };
    const removeLastPinDigit = () => {
      setPin((prev) => prev.slice(0, -1));
    };
    const handlePhoneInput = (e) => {
      const value = e.target.value.replace(/[^\d]/g, "");
      setPhoneNumber(value);
      const fullNumber = `${countryCode}${value}`;
      setIdentifier(fullNumber);
    };
    const formatPhoneDisplay = (number) => {
      if (!number)
        return "";
      const digits = number.replace(/[^\d]/g, "");
      if (countryCode === "+44") {
        if (digits.length <= 4)
          return digits;
        if (digits.length <= 7)
          return `${digits.slice(0, 4)} ${digits.slice(4)}`;
        return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`;
      } else {
        if (digits.length <= 4)
          return digits;
        return `${digits.slice(0, 4)} ${digits.slice(4)}`;
      }
    };
    const validatePhoneNumber = () => {
      if (countryCode === "+44" && phoneNumber.length < 10)
        return false;
      if (countryCode === "+65" && phoneNumber.length < 8)
        return false;
      return true;
    };
    const validateHandle = () => {
      if (!identifier.startsWith("@"))
        return false;
      if (identifier.length < 2)
        return false;
      return identifier.match(/^@[a-zA-Z0-9_]+$/);
    };
    const handleLoginMethodSelect = (method) => {
      setLoginMethod(method);
      setIdentifier(method === "handle" ? "@" : "");
      setPhoneNumber("");
      setError("");
      setShowExistingAccountAlert(false);
    };
    const generateHandleSuggestions = (originalHandle) => {
      const baseName = originalHandle.replace("@", "");
      const suggestions = [
        `@${baseName}1`,
        `@${baseName}2`,
        `@${baseName}_app`,
        `@${baseName}_${Math.floor(Math.random() * 1e3)}`
      ];
      return suggestions;
    };
    const maskHandle = (handle2) => {
      if (!handle2 || handle2.length <= 3)
        return handle2;
      const prefix = handle2.charAt(0);
      const firstChar = handle2.charAt(1);
      const lastChar = handle2.charAt(handle2.length - 1);
      const middleLength = handle2.length - 3;
      const masked = middleLength > 0 ? "*".repeat(Math.min(middleLength, 3)) : "";
      return `${prefix}${firstChar}${masked}${lastChar}`;
    };
    const maskPhone = (phone2) => {
      if (!phone2)
        return "";
      return "*******" + phone2.slice(-4);
    };
    const handleInitialSubmit = async () => {
      console.log("Button clicked - starting login flow");
      setError("");
      setIsLoading(true);
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
      loadingTimeoutRef.current = setTimeout(() => {
        console.log("Loading timeout triggered - resetting loading state");
        setIsLoading(false);
        setError("Request timed out. Please try again.");
        loadingTimeoutRef.current = null;
      }, 15e3);
      if (!window.csrfToken) {
        console.error("CSRF token missing");
        setError("Security verification failed. Please refresh the page.");
        setIsLoading(false);
        clearTimeout(loadingTimeoutRef.current);
        loadingTimeoutRef.current = null;
        return;
      }
      try {
        const deviceKey = await (0, import_deviceKey2.getStoredDeviceKey)();
        const completeHeader = (0, import_deviceKey2.getCompleteDeviceHeaderFromStorage)();
        const requestHeaders = {
          "X-CSRF-Token": window.csrfToken
        };
        if (completeHeader) {
          console.log("Using complete device header for authentication:", {
            deviceId: completeHeader.deviceId.substring(0, 10) + "...",
            userGuid: completeHeader.userGuid,
            userHandle: completeHeader.userHandle
          });
          requestHeaders["X-Device-Header"] = JSON.stringify(completeHeader);
        } else {
          console.log("No complete header found - using device fingerprint for recognition only");
          const deviceCharacteristics = {
            platform: navigator.platform || "unknown",
            screenWidth: window.screen.width,
            screenHeight: window.screen.height,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            language: navigator.language || "unknown",
            devicePixelRatio: window.devicePixelRatio || 1,
            browserFamily: detectBrowserFamily2(navigator.userAgent),
            colorDepth: window.screen.colorDepth
          };
          const basicHeader = {
            deviceId: deviceKey,
            timestamp: Date.now(),
            deviceCharacteristics
          };
          requestHeaders["X-Device-Header"] = JSON.stringify(basicHeader);
        }
        if (deviceKey) {
          requestHeaders["X-Device-Key"] = deviceKey;
        }
        if (loginMethod === "handle") {
          console.log("Handle flow for:", identifier);
          if (!validateHandle()) {
            setError("Please enter a valid handle starting with @");
            setIsLoading(false);
            clearTimeout(loadingTimeoutRef.current);
            loadingTimeoutRef.current = null;
            return;
          }
          try {
            console.log("Checking handle:", identifier);
            const checkResponse = await axios_default2.get(`check_handle?handle=${encodeURIComponent(identifier)}`, {
              headers: requestHeaders,
              timeout: 1e4
            });
            console.log("Handle check response:", checkResponse.data);
            if (checkResponse.data.exists) {
              if (isRegistrationFlow) {
                console.log("Registration intent, but handle exists");
                setError(`This handle is already registered. Choose another handle or login.`);
                setIsLoading(false);
                clearTimeout(loadingTimeoutRef.current);
                loadingTimeoutRef.current = null;
                return;
              } else {
                const isRecognizedDevice = checkResponse.data.is_your_device;
                const deviceConfidence = checkResponse.data.device_confidence || "low";
                const confidenceScore = checkResponse.data.confidence_score || 0;
                const pinAvailable2 = checkResponse.data.pin_available || false;
                console.log("Device recognition result:", {
                  isRecognizedDevice,
                  deviceConfidence,
                  confidenceScore,
                  pinAvailable: pinAvailable2
                });
                if (isRecognizedDevice && deviceConfidence === "high") {
                  console.log("High confidence device match - attempting fast login");
                  const fastLoginResponse = await axios_default2.post("fast_authenticate", {
                    identifier
                  }, {
                    headers: requestHeaders,
                    timeout: 1e4
                  });
                  if (fastLoginResponse.data.status === "authenticated") {
                    (0, import_deviceKey2.storeDeviceSessionData)(fastLoginResponse.data);
                    ensureDeviceHeaderCreated(fastLoginResponse.data);
                    setIsVerificationSuccess(true);
                    setFlowState("verificationSuccess");
                    setTimeout(() => {
                      window.location.href = fastLoginResponse.data.redirect_to || "/dashboard";
                    }, 1500);
                    clearTimeout(loadingTimeoutRef.current);
                    loadingTimeoutRef.current = null;
                    return;
                  }
                }
                if (isRecognizedDevice && deviceConfidence === "medium" && pinAvailable2) {
                  console.log("Medium confidence with PIN available - offering PIN verification");
                  setHandle(identifier);
                  setWelcomeMessage(`Welcome back, ${identifier}!`);
                  setFlowState("pinEntry");
                  setShowPinEntry(true);
                  setPinAvailable(true);
                  setExistingUserData({
                    handle: identifier,
                    masked_phone: checkResponse.data.masked_phone,
                    pin_available: true
                  });
                  setIsLoading(false);
                  clearTimeout(loadingTimeoutRef.current);
                  loadingTimeoutRef.current = null;
                  return;
                }
                console.log("Showing welcome back screen for handle:", identifier);
                sessionStorage.setItem("account_already_exists", JSON.stringify({
                  type: "handle",
                  handle: identifier,
                  masked_handle: checkResponse.data.masked_handle || maskHandle(identifier),
                  masked_phone: checkResponse.data.masked_phone,
                  pin_available: checkResponse.data.pin_available || false
                }));
                setShowExistingAccountAlert(true);
                setAccountType("handle");
                setExistingHandle(checkResponse.data.masked_handle || maskHandle(identifier));
                setExistingUserData({
                  handle: identifier,
                  masked_phone: checkResponse.data.masked_phone,
                  pin_available: checkResponse.data.pin_available || false
                });
                setPinAvailable(checkResponse.data.pin_available || false);
                setIsLoading(false);
                clearTimeout(loadingTimeoutRef.current);
                loadingTimeoutRef.current = null;
                return;
              }
            } else {
              if (isRegistrationFlow) {
                console.log("Handle is available for registration");
                setHandle(identifier);
                setIsHandleFirst(true);
                setFlowState("phoneEntry");
                setIsLoading(false);
                clearTimeout(loadingTimeoutRef.current);
                loadingTimeoutRef.current = null;
                return;
              } else {
                console.log("Handle not found, offering registration transition");
                setFlowState("registrationTransition");
                setIsLoading(false);
                clearTimeout(loadingTimeoutRef.current);
                loadingTimeoutRef.current = null;
                return;
              }
            }
          } catch (err) {
            console.error("Handle check error:", err);
            setError(err.response?.data?.error || "Verification failed");
            setIsLoading(false);
            clearTimeout(loadingTimeoutRef.current);
            loadingTimeoutRef.current = null;
            return;
          }
        } else {
          console.log("Phone flow for:", identifier);
          if (!validatePhoneNumber()) {
            setError(`Please enter a valid ${countryCode === "+44" ? "UK" : "Singapore"} phone number`);
            setIsLoading(false);
            clearTimeout(loadingTimeoutRef.current);
            loadingTimeoutRef.current = null;
            return;
          }
          try {
            console.log("Checking phone:", identifier);
            const checkResponse = await axios_default2.get(`check_phone?phone=${encodeURIComponent(identifier)}`, {
              headers: requestHeaders,
              timeout: 1e4
            });
            console.log("Phone check response:", checkResponse.data);
            sessionStorage.setItem("registration_phone", identifier);
            console.log("Stored phone in sessionStorage for persistence:", identifier);
            if (checkResponse.data.exists) {
              if (isRegistrationFlow) {
                console.log("Registration intent, but phone exists");
                setError(`This phone number is already registered. Use a different number or login.`);
                setIsLoading(false);
                clearTimeout(loadingTimeoutRef.current);
                loadingTimeoutRef.current = null;
                return;
              } else {
                const isRecognizedDevice = checkResponse.data.is_your_device;
                const deviceConfidence = checkResponse.data.device_confidence || "low";
                const confidenceScore = checkResponse.data.confidence_score || 0;
                const pinAvailable2 = checkResponse.data.pin_available || false;
                console.log("Device recognition result:", {
                  isRecognizedDevice,
                  deviceConfidence,
                  confidenceScore,
                  pinAvailable: pinAvailable2
                });
                if (isRecognizedDevice && deviceConfidence === "high") {
                  console.log("High confidence device match - attempting fast login");
                  const fastLoginResponse = await axios_default2.post("fast_authenticate", {
                    identifier
                  }, {
                    headers: requestHeaders,
                    timeout: 1e4
                  });
                  if (fastLoginResponse.data.status === "authenticated") {
                    (0, import_deviceKey2.storeDeviceSessionData)(fastLoginResponse.data);
                    ensureDeviceHeaderCreated(fastLoginResponse.data);
                    setIsVerificationSuccess(true);
                    setFlowState("verificationSuccess");
                    setTimeout(() => {
                      window.location.href = fastLoginResponse.data.redirect_to || "/dashboard";
                    }, 1500);
                    clearTimeout(loadingTimeoutRef.current);
                    loadingTimeoutRef.current = null;
                    return;
                  }
                }
                if (isRecognizedDevice && deviceConfidence === "medium" && pinAvailable2) {
                  console.log("Medium confidence with PIN available - offering PIN verification");
                  setHandle(checkResponse.data.handle);
                  setWelcomeMessage(`Welcome back, ${checkResponse.data.handle}!`);
                  setFlowState("pinEntry");
                  setShowPinEntry(true);
                  setPinAvailable(true);
                  setExistingUserData({
                    handle: checkResponse.data.handle,
                    masked_phone: checkResponse.data.masked_phone,
                    pin_available: true
                  });
                  setIsLoading(false);
                  clearTimeout(loadingTimeoutRef.current);
                  loadingTimeoutRef.current = null;
                  return;
                }
                console.log("Showing welcome back screen for phone:", identifier);
                sessionStorage.setItem("account_already_exists", JSON.stringify({
                  type: "phone",
                  phone: identifier,
                  handle: checkResponse.data.handle,
                  masked_handle: checkResponse.data.masked_handle,
                  masked_phone: checkResponse.data.masked_phone || maskPhone(identifier),
                  pin_available: checkResponse.data.pin_available || false
                }));
                setShowExistingAccountAlert(true);
                setAccountType("phone");
                setExistingUserData({
                  phone: identifier,
                  handle: checkResponse.data.handle,
                  masked_phone: checkResponse.data.masked_phone || maskPhone(identifier),
                  pin_available: checkResponse.data.pin_available || false
                });
                setPinAvailable(checkResponse.data.pin_available || false);
                setIsLoading(false);
                clearTimeout(loadingTimeoutRef.current);
                loadingTimeoutRef.current = null;
                return;
              }
            } else {
              if (isRegistrationFlow) {
                console.log("Phone is available for registration");
                setPhone(identifier);
                sessionStorage.setItem("registration_phone", identifier);
                setIsHandleFirst(false);
                setFlowState("handleEntry");
                setIsLoading(false);
                clearTimeout(loadingTimeoutRef.current);
                loadingTimeoutRef.current = null;
                return;
              } else {
                console.log("Phone not found, offering registration transition");
                setFlowState("registrationTransition");
                setIsLoading(false);
                clearTimeout(loadingTimeoutRef.current);
                loadingTimeoutRef.current = null;
                return;
              }
            }
          } catch (err) {
            console.error("Phone check error:", err);
            setError(err.response?.data?.error || "Verification failed");
            setIsLoading(false);
            clearTimeout(loadingTimeoutRef.current);
            loadingTimeoutRef.current = null;
            return;
          }
        }
      } catch (globalError) {
        console.error("Global error in handleInitialSubmit:", globalError);
        console.error("Global error details:", {
          message: globalError.message,
          stack: globalError.stack,
          response: globalError.response?.data,
          status: globalError.response?.status
        });
        setError("An unexpected error occurred. Please try again.");
      } finally {
        setIsLoading(false);
        if (loadingTimeoutRef.current) {
          clearTimeout(loadingTimeoutRef.current);
          loadingTimeoutRef.current = null;
        }
      }
    };
    const showOverlay2 = (message) => {
      let overlay = document.getElementById("webauthn-overlay");
      if (!overlay) {
        overlay = document.createElement("div");
        overlay.id = "webauthn-overlay";
        overlay.style.position = "fixed";
        overlay.style.top = "0";
        overlay.style.left = "0";
        overlay.style.width = "100%";
        overlay.style.height = "100%";
        overlay.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
        overlay.style.display = "flex";
        overlay.style.justifyContent = "center";
        overlay.style.alignItems = "center";
        overlay.style.zIndex = "9999";
        document.body.appendChild(overlay);
      }
      overlay.innerHTML = `
    <div style="background-color: #1F2937; padding: 2rem; border-radius: 0.5rem; text-align: center; max-width: 80%;">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-teal-500 mx-auto mb-4"></div>
      <p style="color: white; font-size: 1.25rem;">${message}</p>
    </div>
  `;
      overlay.style.display = "flex";
    };
    const hideOverlay2 = () => {
      const overlay = document.getElementById("webauthn-overlay");
      if (overlay) {
        overlay.style.display = "none";
      }
    };
    const detectBrowserFamily2 = (userAgent) => {
      if (/Chrome/i.test(userAgent))
        return "Chrome";
      if (/Firefox/i.test(userAgent))
        return "Firefox";
      if (/Safari/i.test(userAgent))
        return "Safari";
      if (/Edge|Edg/i.test(userAgent))
        return "Edge";
      if (/MSIE|Trident/i.test(userAgent))
        return "Internet Explorer";
      if (/Opera|OPR/i.test(userAgent))
        return "Opera";
      return "Unknown";
    };
    const handlePhoneSubmit = async () => {
      console.log("handlePhoneSubmit called with phone:", identifier, "handle:", handle);
      setError("");
      setIsLoading(true);
      const safetyTimeout = setTimeout(() => {
        console.log("Phone submit safety timeout triggered");
        setIsLoading(false);
        setError("Request timed out. Please try again.");
      }, 15e3);
      if (!window.csrfToken) {
        console.error("CSRF token missing");
        setError("Security verification failed. Please refresh the page.");
        setIsLoading(false);
        clearTimeout(safetyTimeout);
        return;
      }
      const phoneLength = phoneNumber.length;
      if (countryCode === "+44" && phoneLength < 10 || countryCode === "+65" && phoneLength < 8) {
        const country = countryCode === "+44" ? "UK" : "Singapore";
        setError(`Please enter a valid ${country} phone number`);
        setIsLoading(false);
        clearTimeout(safetyTimeout);
        return;
      }
      try {
        console.log("Registering with handle and phone:", handle, identifier);
        console.log("Handle-first flow:", isHandleFirst);
        const deviceKey = await (0, import_deviceKey2.getStoredDeviceKey)();
        sessionStorage.setItem("handle_first", isHandleFirst.toString());
        const requestHeaders = {
          "X-CSRF-Token": window.csrfToken
        };
        const completeHeader = getExistingCompleteHeader();
        if (completeHeader) {
          console.log("Using complete device header for phone verification");
          requestHeaders["X-Device-Header"] = JSON.stringify(completeHeader);
        } else {
          console.log("Using basic device header for fingerprinting");
          const deviceCharacteristics = {
            platform: navigator.platform || "unknown",
            screenWidth: window.screen.width,
            screenHeight: window.screen.height,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            language: navigator.language || "unknown"
          };
          const basicHeader = {
            deviceId: deviceKey,
            deviceCharacteristics,
            timestamp: Date.now()
          };
          requestHeaders["X-Device-Header"] = JSON.stringify(basicHeader);
        }
        if (deviceKey) {
          requestHeaders["X-Device-Key"] = deviceKey;
        }
        try {
          console.log("Checking if phone exists:", identifier);
          const checkResponse = await axios_default2.get(`check_phone?phone=${encodeURIComponent(identifier)}`, {
            headers: requestHeaders,
            timeout: 1e4
          });
          if (checkResponse.data.exists) {
            console.log("Phone exists, showing Account Already Exists screen");
            sessionStorage.setItem("account_already_exists", JSON.stringify({
              type: "phone",
              phone: identifier,
              handle: checkResponse.data.handle,
              masked_handle: checkResponse.data.masked_handle || maskHandle(checkResponse.data.handle || ""),
              masked_phone: checkResponse.data.masked_phone || maskPhone(identifier),
              pin_available: checkResponse.data.pin_available || false
            }));
            setShowExistingAccountAlert(true);
            setAccountType("phone");
            setExistingUserData({
              phone: identifier,
              handle: checkResponse.data.handle,
              masked_phone: checkResponse.data.masked_phone || maskPhone(identifier),
              pin_available: checkResponse.data.pin_available || false
            });
            setPinAvailable(checkResponse.data.pin_available || false);
            setFlowState("loginOptions");
            setIsLoading(false);
            clearTimeout(safetyTimeout);
            return;
          }
        } catch (checkErr) {
          console.error("Error checking phone existence:", checkErr);
        }
        console.log("Sending verify_login request for phone:", identifier);
        const response = await axios_default2.post("verify_login", {
          identifier,
          auth: {
            identifier,
            handle,
            // Also send the handle for context
            handle_first: isHandleFirst
            // Indicate handle-first flow - critical!
          }
        }, {
          headers: requestHeaders,
          timeout: 15e3
        });
        console.log("Phone verification response:", response.data);
        setPhone(response.data.masked_phone || identifier);
        setFlowState("verification");
        setWelcomeMessage("Verify your number");
        setIsLoading(false);
      } catch (err) {
        console.error("Phone verification error:", err);
        console.error("Error details:", {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status,
          url: err.config?.url
        });
        if (err.response?.data?.status === "phone_exists") {
          console.log("Phone exists (from error), showing Account Already Exists screen");
          sessionStorage.setItem("account_already_exists", JSON.stringify({
            type: "phone",
            phone: identifier,
            handle: err.response?.data?.handle,
            masked_handle: err.response?.data?.masked_handle || maskHandle(err.response?.data?.handle || ""),
            masked_phone: err.response?.data?.masked_phone || maskPhone(identifier),
            pin_available: err.response?.data?.pin_available || false
          }));
          setShowExistingAccountAlert(true);
          setAccountType("phone");
          setExistingUserData({
            phone: identifier,
            handle: err.response?.data?.handle,
            masked_phone: err.response?.data?.masked_phone || maskPhone(identifier),
            pin_available: err.response?.data?.pin_available || false
          });
          setPinAvailable(err.response?.data?.pin_available || false);
          setFlowState("loginOptions");
        } else {
          setError(err.response?.data?.error || "Failed to send verification code");
        }
      } finally {
        clearTimeout(safetyTimeout);
        setIsLoading(false);
      }
    };
    const handleHandleSubmit = async () => {
      console.log("Submitting handle:", handle);
      setError("");
      setIsLoading(true);
      const safetyTimeout = setTimeout(() => {
        console.log("Handle submit safety timeout triggered");
        setIsLoading(false);
        setError("Request timed out. Please try again.");
      }, 15e3);
      try {
        if (!handle || !handle.match(/^@[a-zA-Z0-9_]{1,29}$/)) {
          setError("Please enter a valid handle starting with @ and containing only letters, numbers, and underscores");
          setIsLoading(false);
          clearTimeout(safetyTimeout);
          return;
        }
        if (!window.csrfToken) {
          console.error("CSRF token missing");
          setError("Security verification failed. Please refresh the page.");
          setIsLoading(false);
          clearTimeout(safetyTimeout);
          return;
        }
        console.log("Creating handle:", handle);
        const phoneNumber2 = phone || sessionStorage.getItem("registration_phone");
        console.log("Using phone for registration:", phoneNumber2 ? phoneNumber2.substring(0, 4) + "****" : "None");
        if (!phoneNumber2) {
          console.error("No phone number available for registration");
          setError("Phone number required for registration. Please try again.");
          setIsLoading(false);
          clearTimeout(safetyTimeout);
          return;
        }
        const requestHeaders = {
          "X-CSRF-Token": window.csrfToken
        };
        const deviceKey = await (0, import_deviceKey2.getStoredDeviceKey)();
        if (deviceKey) {
          requestHeaders["X-Device-Key"] = deviceKey;
        }
        const deviceHeader = (0, import_deviceKey2.getDeviceHeader)();
        if (deviceHeader) {
          requestHeaders["X-Device-Header"] = JSON.stringify(deviceHeader);
        }
        const response = await axios_default2.post("create_handle", {
          handle,
          phone: phoneNumber2
          // Include the phone from sessionStorage or state
        }, {
          headers: requestHeaders,
          timeout: 15e3
        });
        console.log("Handle creation response:", response.data);
        if (response.data.status === "needs_verification") {
          setFlowState("verification");
          setVerificationCode("");
          setWelcomeMessage(response.data.message || "Verify your phone");
          setPhone(phoneNumber2);
          sessionStorage.setItem("verification_phone", phoneNumber2);
          sessionStorage.setItem("pending_handle", handle);
        } else if (response.data.status === "authenticated") {
          (0, import_deviceKey2.storeDeviceSessionData)(response.data);
          ensureDeviceHeaderCreated(response.data);
          localStorage.setItem("authenticated_user", "true");
          setIsVerificationSuccess(true);
          setFlowState("verificationSuccess");
          setTimeout(() => {
            window.location.href = response.data.redirect_to || "/dashboard";
          }, 1500);
        } else if (response.data.status === "error") {
          setError(response.data.message || "Failed to create handle");
        }
      } catch (err) {
        console.error("Handle creation error:", err);
        console.error("Error details:", {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status
        });
        if (err.response?.data?.status === "handle_exists") {
          setError("This handle is already taken. Please choose another one.");
        } else if (err.response?.data?.error === "No phone found in session") {
          const phoneNumber2 = phone || sessionStorage.getItem("registration_phone");
          setError(phoneNumber2 ? "Session error. Please try again." : "Phone number required. Please restart registration.");
        } else {
          setError(err.response?.data?.error || "Failed to create handle");
        }
      } finally {
        clearTimeout(safetyTimeout);
        setIsLoading(false);
      }
    };
    const handleVerificationSubmit = async () => {
      if (verificationCode.length !== 6 || isLoading)
        return;
      if (!window.csrfToken) {
        console.error("CSRF token missing");
        setError("Security verification failed. Please refresh the page.");
        setIsLoading(false);
        return;
      }
      setAutoSubmit(false);
      setIsLoading(true);
      setError("");
      const safetyTimeout = setTimeout(() => {
        console.log("Verification safety timeout triggered");
        setIsLoading(false);
        setError("Request timed out. Please try again.");
        setAutoSubmit(true);
      }, 15e3);
      try {
        console.log("Submitting verification code:", verificationCode);
        const deviceKey = await (0, import_deviceKey2.getStoredDeviceKey)();
        const completeHeader = (0, import_deviceKey2.getCompleteDeviceHeaderFromStorage)();
        const requestHeaders = {
          "X-CSRF-Token": window.csrfToken
        };
        if (completeHeader) {
          console.log("Using complete device header for verification submission:", {
            deviceId: completeHeader.deviceId.substring(0, 10) + "...",
            userGuid: completeHeader.userGuid,
            userHandle: completeHeader.userHandle
          });
          requestHeaders["X-Device-Header"] = JSON.stringify(completeHeader);
        } else {
          console.log("No complete header found for cross-browser auth during verification");
        }
        if (deviceKey) {
          requestHeaders["X-Device-Key"] = deviceKey;
        }
        const payload = {
          code: verificationCode,
          auth: {
            code: verificationCode
          }
        };
        if (phone) {
          payload.phone = phone;
          payload.auth.phone = phone;
        }
        if (handle) {
          payload.handle = handle;
          payload.auth.handle = handle;
        }
        if (isHandleFirst || sessionStorage.getItem("handle_first") === "true") {
          payload.handle_first = true;
          payload.auth.handle_first = true;
        }
        if (flowState === "deviceRegistration" || sessionStorage.getItem("device_registration") === "true" || sessionStorage.getItem("device_registration_flow") === "true") {
          payload.device_registration = true;
          payload.auth.device_registration = true;
        }
        console.log("Sending verification payload:", payload);
        const response = await axios_default2.post("verify_code", payload, {
          headers: requestHeaders
        });
        console.log("Verification response:", response.data);
        sessionStorage.removeItem("device_registration");
        sessionStorage.removeItem("device_registration_flow");
        sessionStorage.removeItem("handle_first");
        if (response.data.status === "authenticated") {
          (0, import_deviceKey2.storeDeviceSessionData)(response.data);
          ensureDeviceHeaderCreated(response.data);
          console.log(
            "AFTER AUTH SUCCESS - Device header content:",
            localStorage.getItem("superapp_device_header")
          );
          if (webAuthnEnabled && (0, import_deviceKey2.isWebAuthnSupported)()) {
            try {
              console.log("Starting WebAuthn registration after successful SMS verification");
              showOverlay2("Setting up secure login for your device...");
              await (0, import_deviceKey2.registerWebAuthnCredential)();
              hideOverlay2();
              console.log("WebAuthn registration process completed");
            } catch (webAuthnError) {
              console.error("WebAuthn registration error:", webAuthnError);
              hideOverlay2();
            }
          } else {
            console.log("WebAuthn not supported or disabled, skipping registration");
          }
          localStorage.setItem("authenticated_user", "true");
          setIsVerificationSuccess(true);
          setFlowState("verificationSuccess");
          sessionStorage.removeItem("verification_in_progress");
          setTimeout(() => {
            window.location.href = response.data.redirect_to || "/dashboard";
          }, 1500);
        } else if (response.data.status === "needs_handle") {
          console.log("Phone verified, now needs handle creation");
          setFlowState("createHandle");
        }
      } catch (err) {
        console.error("Verification error:", err);
        console.error("Error details:", {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status,
          url: err.config?.url
          // Add this to see the actual URL being called
        });
        setError(err.response?.data?.error || "Invalid verification code");
        setVerificationCode("");
        setAutoSubmit(true);
      } finally {
        clearTimeout(safetyTimeout);
        setIsLoading(false);
      }
    };
    const handlePinButtonClick = () => {
      console.log("PIN button clicked");
      setFlowState("pinEntry");
      setShowPinEntry(true);
      setPin("");
      setPinAttempts(0);
      setError("");
      console.log("PIN flow state set");
    };
    const shouldSkipDeviceCheck = () => {
      return window.location.pathname === "/dashboard" || sessionStorage.getItem("logging_out") === "true" || localStorage.getItem("authenticated_user") === "true" || // FIX: Check localStorage
      sessionStorage.getItem("device_session") === "authenticated" && sessionStorage.getItem("current_handle");
    };
    const handleContinueRegistration = () => {
      setIsRegistrationFlow(true);
      if (loginMethod === "handle") {
        setHandle(identifier);
        setFlowState("phoneEntry");
        setIsHandleFirst(true);
      } else {
        setPhone(identifier);
        setFlowState("handleEntry");
        setIsHandleFirst(false);
      }
    };
    const renderLoadingState = () => /* @__PURE__ */ import_react2.default.createElement("div", { className: "min-h-screen bg-gray-900 flex items-center justify-center" }, /* @__PURE__ */ import_react2.default.createElement("div", { className: "flex flex-col items-center" }, /* @__PURE__ */ import_react2.default.createElement("div", { className: "animate-spin rounded-full h-12 w-12 border-t-2 border-teal-500 mb-4" }), /* @__PURE__ */ import_react2.default.createElement("p", { className: "text-white text-lg" }, "Connecting to SuperApp...")));
    const renderDeviceNotRegistered = () => /* @__PURE__ */ import_react2.default.createElement("div", { className: "min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4" }, /* @__PURE__ */ import_react2.default.createElement("div", { className: "w-full max-w-md space-y-6 text-center" }, /* @__PURE__ */ import_react2.default.createElement("div", { className: "mb-6 flex justify-center" }, /* @__PURE__ */ import_react2.default.createElement("div", { className: "w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center" }, /* @__PURE__ */ import_react2.default.createElement(X, { className: "w-8 h-8 text-gray-400" }))), /* @__PURE__ */ import_react2.default.createElement("h1", { className: "text-2xl font-bold" }, "Device Not Registered"), /* @__PURE__ */ import_react2.default.createElement("p", { className: "text-gray-400" }, "This device is not linked to any SuperApp account"), /* @__PURE__ */ import_react2.default.createElement("div", { className: "animate-pulse flex justify-center mt-4" }, /* @__PURE__ */ import_react2.default.createElement("div", { className: "w-8 h-8 rounded-full border-t-2 border-teal-500 animate-spin" }))));
    const renderDeviceRegistered = () => /* @__PURE__ */ import_react2.default.createElement("div", { className: "min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4" }, /* @__PURE__ */ import_react2.default.createElement("div", { className: "w-full max-w-md space-y-6 text-center" }, /* @__PURE__ */ import_react2.default.createElement("div", { className: "mb-6 flex justify-center" }, /* @__PURE__ */ import_react2.default.createElement("div", { className: "w-16 h-16 rounded-full bg-teal-500 flex items-center justify-center" }, /* @__PURE__ */ import_react2.default.createElement(Check, { className: "w-8 h-8 text-white" }))), /* @__PURE__ */ import_react2.default.createElement("h1", { className: "text-2xl font-bold" }, "Device Recognized"), /* @__PURE__ */ import_react2.default.createElement("p", { className: "text-gray-400" }, "Redirecting you to dashboard..."), /* @__PURE__ */ import_react2.default.createElement("div", { className: "animate-pulse flex justify-center mt-4" }, /* @__PURE__ */ import_react2.default.createElement("div", { className: "w-8 h-8 rounded-full border-t-2 border-teal-500 animate-spin" }))));
    const renderLoginSuccess = () => /* @__PURE__ */ import_react2.default.createElement("div", { className: "min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4" }, /* @__PURE__ */ import_react2.default.createElement("div", { className: "w-full max-w-md space-y-6 text-center" }, /* @__PURE__ */ import_react2.default.createElement("div", { className: "mb-6 flex justify-center" }, /* @__PURE__ */ import_react2.default.createElement("div", { className: "w-16 h-16 rounded-full bg-teal-500 flex items-center justify-center" }, /* @__PURE__ */ import_react2.default.createElement(Check, { className: "w-8 h-8 text-white" }))), /* @__PURE__ */ import_react2.default.createElement("h1", { className: "text-2xl font-bold" }, "Login Successful"), /* @__PURE__ */ import_react2.default.createElement("p", { className: "text-gray-400" }, "Redirecting you to dashboard..."), /* @__PURE__ */ import_react2.default.createElement("div", { className: "animate-pulse flex justify-center mt-4" }, /* @__PURE__ */ import_react2.default.createElement("div", { className: "w-8 h-8 rounded-full border-t-2 border-teal-500 animate-spin" }))));
    const renderVerificationSuccess = () => /* @__PURE__ */ import_react2.default.createElement("div", { className: "min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4" }, /* @__PURE__ */ import_react2.default.createElement("div", { className: "w-full max-w-md space-y-6 text-center" }, /* @__PURE__ */ import_react2.default.createElement("div", { className: "mb-6 flex justify-center" }, /* @__PURE__ */ import_react2.default.createElement("div", { className: "w-16 h-16 rounded-full bg-teal-500 flex items-center justify-center" }, /* @__PURE__ */ import_react2.default.createElement(Check, { className: "w-8 h-8 text-white" }))), /* @__PURE__ */ import_react2.default.createElement("h1", { className: "text-2xl font-bold" }, "Device Verified Successfully!"), /* @__PURE__ */ import_react2.default.createElement("p", { className: "text-gray-400" }, "You're now signed in, and this device will remember you for future visits to SuperApp."), /* @__PURE__ */ import_react2.default.createElement("div", { className: "animate-pulse flex justify-center mt-4" }, /* @__PURE__ */ import_react2.default.createElement("div", { className: "w-8 h-8 rounded-full border-t-2 border-teal-500 animate-spin" }))));
    const renderRegistrationTransition = () => /* @__PURE__ */ import_react2.default.createElement("div", { className: "min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4" }, /* @__PURE__ */ import_react2.default.createElement("div", { className: "w-full max-w-md space-y-8" }, /* @__PURE__ */ import_react2.default.createElement("div", { className: "text-center" }, /* @__PURE__ */ import_react2.default.createElement("h1", { className: "text-2xl font-bold mb-2" }, "This ", loginMethod, " is available!"), /* @__PURE__ */ import_react2.default.createElement("p", { className: "text-gray-400" }, "Would you like to create a new account with ", identifier, "?")), /* @__PURE__ */ import_react2.default.createElement("div", { className: "space-y-4" }, /* @__PURE__ */ import_react2.default.createElement(
      "button",
      {
        onClick: handleContinueRegistration,
        className: "w-full bg-teal-500 text-white rounded-lg py-4 font-medium"
      },
      "Continue with Registration"
    ), /* @__PURE__ */ import_react2.default.createElement(
      "button",
      {
        onClick: () => setFlowState("loginOptions"),
        className: "w-full bg-gray-800 text-white rounded-lg py-4 font-medium"
      },
      "Go Back"
    ))));
    const renderPinEntry = () => {
      return /* @__PURE__ */ import_react2.default.createElement("div", { className: "min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4" }, /* @__PURE__ */ import_react2.default.createElement("div", { className: "w-full max-w-md" }, /* @__PURE__ */ import_react2.default.createElement("div", { className: "mb-8 flex justify-center" }, /* @__PURE__ */ import_react2.default.createElement("div", { className: "w-16 h-16 rounded-full bg-teal-500 flex items-center justify-center text-xl font-bold" }, existingUserData?.handle ? existingUserData.handle[0].toUpperCase() : "@")), /* @__PURE__ */ import_react2.default.createElement("div", { className: "text-center" }, /* @__PURE__ */ import_react2.default.createElement("h1", { className: "text-2xl font-bold mb-2" }, "Enter your PIN"), /* @__PURE__ */ import_react2.default.createElement("p", { className: "text-gray-400" }, "Enter your 4-digit PIN to verify it's you")), /* @__PURE__ */ import_react2.default.createElement("div", { className: "flex justify-center gap-3 my-8" }, [...Array(4)].map((_, i) => /* @__PURE__ */ import_react2.default.createElement(
        "div",
        {
          key: i,
          className: `w-12 h-14 flex items-center justify-center text-xl
                border-2 rounded-lg transition-colors
                ${pin[i] ? "border-teal-500 bg-gray-800" : "border-gray-600"}`
        },
        pin[i] ? "\u2022" : ""
      ))), /* @__PURE__ */ import_react2.default.createElement("div", { className: "grid grid-cols-3 gap-6 mb-8" }, [1, 2, 3, 4, 5, 6, 7, 8, 9, "", 0, "\u232B"].map((num, i) => /* @__PURE__ */ import_react2.default.createElement(
        "button",
        {
          key: i,
          onClick: () => {
            if (num === "\u232B") {
              removeLastPinDigit();
            } else if (num !== "") {
              appendToPin(num);
            }
          },
          className: `h-14 text-2xl font-light rounded-full
                ${num === "" ? "cursor-default" : "hover:bg-gray-800 active:bg-gray-700"}`,
          disabled: isLoading
        },
        num
      ))), error && /* @__PURE__ */ import_react2.default.createElement("div", { className: "text-red-500 text-center mb-4 flex items-center justify-center p-3 bg-red-500 bg-opacity-10 rounded-lg" }, /* @__PURE__ */ import_react2.default.createElement("span", null, error), /* @__PURE__ */ import_react2.default.createElement("button", { onClick: () => setError(""), className: "ml-2" }, /* @__PURE__ */ import_react2.default.createElement(X, { className: "w-4 h-4" }))), isLoading && /* @__PURE__ */ import_react2.default.createElement("div", { className: "text-center mb-4 text-gray-400" }, /* @__PURE__ */ import_react2.default.createElement("div", { className: "inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-teal-500 mr-2" }), "Verifying..."), /* @__PURE__ */ import_react2.default.createElement("div", { className: "flex flex-col space-y-3" }, /* @__PURE__ */ import_react2.default.createElement(
        "button",
        {
          onClick: () => {
            setFlowState("verification");
            setShowPinEntry(false);
            handleRegisterDevice();
          },
          className: "w-full text-gray-400 py-2 hover:text-white transition-colors",
          disabled: isLoading
        },
        "Use SMS verification instead"
      ), /* @__PURE__ */ import_react2.default.createElement(
        "button",
        {
          onClick: () => {
            setFlowState("loginOptions");
            setShowPinEntry(false);
          },
          className: "w-full text-gray-400 py-2 hover:text-white transition-colors",
          disabled: isLoading
        },
        "This isn't my account"
      ))));
    };
    const renderVerificationStep = () => /* @__PURE__ */ import_react2.default.createElement("div", { className: "min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4" }, /* @__PURE__ */ import_react2.default.createElement("div", { className: "w-full max-w-md" }, /* @__PURE__ */ import_react2.default.createElement("div", { className: "mb-8 flex justify-center" }, /* @__PURE__ */ import_react2.default.createElement("div", { className: "w-16 h-16 rounded-full bg-teal-500 flex items-center justify-center text-xl font-bold" }, handle ? handle[0].toUpperCase() : "S")), /* @__PURE__ */ import_react2.default.createElement("div", { className: "text-center space-y-2 mb-8" }, /* @__PURE__ */ import_react2.default.createElement("h1", { className: "text-2xl font-bold" }, welcomeMessage || (isQuickVerification ? `Welcome back, ${handle}` : "Verify your number")), /* @__PURE__ */ import_react2.default.createElement("p", { className: "text-gray-400" }, isQuickVerification ? /* @__PURE__ */ import_react2.default.createElement(import_react2.default.Fragment, null, "Please enter the code sent to ", phone, " to confirm this is your account") : `Please enter the code sent to ${phone} to confirm this is your account`)), /* @__PURE__ */ import_react2.default.createElement("div", { className: "mb-8" }, /* @__PURE__ */ import_react2.default.createElement("div", { className: "flex justify-center gap-3" }, [...Array(6)].map((_, i) => /* @__PURE__ */ import_react2.default.createElement(
      "div",
      {
        key: i,
        className: `w-12 h-14 flex items-center justify-center text-xl
                border-2 rounded-lg transition-colors
                ${verificationCode[i] ? "border-teal-500 bg-gray-800" : "border-gray-600"}`
      },
      verificationCode[i] || ""
    ))), /* @__PURE__ */ import_react2.default.createElement(
      "input",
      {
        type: "tel",
        value: verificationCode,
        onChange: (e) => {
          const value = e.target.value.replace(/[^0-9]/g, "").slice(0, 6);
          setVerificationCode(value);
        },
        ref: verificationInputRef,
        className: "sr-only",
        maxLength: 6,
        autoFocus: true
      }
    )), /* @__PURE__ */ import_react2.default.createElement("div", { className: "grid grid-cols-3 gap-6 mb-8" }, [1, 2, 3, 4, 5, 6, 7, 8, 9, "", 0, "\u232B"].map((num, i) => /* @__PURE__ */ import_react2.default.createElement(
      "button",
      {
        key: i,
        onClick: () => {
          if (num === "\u232B") {
            setVerificationCode((prev) => prev.slice(0, -1));
          } else if (num !== "") {
            setVerificationCode(
              (prev) => prev.length < 6 ? prev + num : prev
            );
          }
        },
        className: `h-14 text-2xl font-light rounded-full
              ${num === "" ? "cursor-default" : "hover:bg-gray-800 active:bg-gray-700"}`,
        disabled: isLoading
      },
      num
    ))), error && /* @__PURE__ */ import_react2.default.createElement("div", { className: "text-red-500 text-center mb-4 flex items-center justify-center p-3 bg-red-500 bg-opacity-10 rounded-lg" }, /* @__PURE__ */ import_react2.default.createElement("span", null, error), /* @__PURE__ */ import_react2.default.createElement("button", { onClick: () => setError(""), className: "ml-2" }, /* @__PURE__ */ import_react2.default.createElement(X, { className: "w-4 h-4" }))), isLoading && /* @__PURE__ */ import_react2.default.createElement("div", { className: "text-center mb-4 text-gray-400" }, /* @__PURE__ */ import_react2.default.createElement("div", { className: "inline-block animate-spin rounded-full h-5 w-5 border-t-2 border-teal-500 mr-2" }), "Verifying..."), /* @__PURE__ */ import_react2.default.createElement("div", { className: "flex justify-center mt-4" }, /* @__PURE__ */ import_react2.default.createElement(
      "button",
      {
        onClick: handleVerificationSubmit,
        disabled: verificationCode.length < 6 || isLoading,
        className: "bg-teal-500 text-white py-3 px-6 rounded-lg hover:bg-teal-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full font-medium"
      },
      isLoading ? "Verifying..." : "Verify Code"
    )), /* @__PURE__ */ import_react2.default.createElement(
      "button",
      {
        onClick: () => {
          setFlowState("loginOptions");
          setVerificationCode("");
          setIsQuickVerification(false);
          setError("");
          setIsLoading(false);
        },
        className: "text-sm text-gray-400 w-full text-center mt-4 hover:text-gray-300 transition-colors",
        disabled: isLoading
      },
      "Didn't receive code?"
    ), pinAvailable && /* @__PURE__ */ import_react2.default.createElement(
      "button",
      {
        onClick: () => {
          setFlowState("pinEntry");
          setShowPinEntry(true);
          setVerificationCode("");
        },
        className: "text-sm text-teal-400 w-full text-center mt-4 hover:text-teal-300 transition-colors",
        disabled: isLoading
      },
      "Use your PIN instead"
    )));
    const renderLoginOptions = () => /* @__PURE__ */ import_react2.default.createElement("div", { className: "min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4" }, /* @__PURE__ */ import_react2.default.createElement("div", { className: "w-full max-w-md space-y-8" }, /* @__PURE__ */ import_react2.default.createElement("div", { className: "text-center" }, /* @__PURE__ */ import_react2.default.createElement("h1", { className: "text-2xl font-bold mb-2" }, isRegistrationFlow ? "Create Your SuperApp Account" : "Welcome to SuperApp"), /* @__PURE__ */ import_react2.default.createElement("p", { className: "text-gray-400" }, isRegistrationFlow ? "Choose how you'd like to register" : "Login with an existing account or create a new one.")), showExistingAccountAlert && /* @__PURE__ */ import_react2.default.createElement("div", { className: "flex flex-col items-center text-center space-y-6 py-4" }, /* @__PURE__ */ import_react2.default.createElement("div", { className: "w-16 h-16 rounded-full bg-teal-500 flex items-center justify-center" }, accountType === "handle" ? /* @__PURE__ */ import_react2.default.createElement("span", { className: "text-white text-2xl" }, "@") : /* @__PURE__ */ import_react2.default.createElement(User, { className: "w-8 h-8 text-white" })), /* @__PURE__ */ import_react2.default.createElement("div", { className: "space-y-2" }, /* @__PURE__ */ import_react2.default.createElement("h2", { className: "text-2xl font-bold" }, "Welcome Back, ", existingHandle || existingUserData?.handle || "", "!"), /* @__PURE__ */ import_react2.default.createElement("p", { className: "text-gray-400" }, "Your device is registered with SuperApp. For your security, a quick verification is needed. After this, you'll be automatically signed in on future visits.")), /* @__PURE__ */ import_react2.default.createElement("div", { className: "space-y-3 w-full", id: "account-exists-buttons" }, /* @__PURE__ */ import_react2.default.createElement(
      "button",
      {
        id: "yes-account-btn",
        onClick: handleRegisterDevice,
        className: "w-full bg-teal-500 rounded-lg py-3 text-white font-medium hover:bg-teal-600 transition-colors"
      },
      isLoading ? /* @__PURE__ */ import_react2.default.createElement("div", { className: "flex items-center justify-center" }, /* @__PURE__ */ import_react2.default.createElement("div", { className: "animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" }), "Verifying...") : accountType === "handle" ? "Verify with SMS" : "Verify with SMS"
    ), (pinAvailable || existingUserData && existingUserData.pin_available) && /* @__PURE__ */ import_react2.default.createElement(
      "button",
      {
        id: "pin-signin-btn",
        onClick: handlePinButtonClick,
        className: "w-full bg-gray-800 hover:bg-gray-700 rounded-lg py-3 text-white font-medium transition-colors"
      },
      "Verify with PIN"
    ), /* @__PURE__ */ import_react2.default.createElement(
      "button",
      {
        id: "no-account-btn",
        onClick: handleNotMyAccount,
        className: "w-full bg-gray-800 hover:bg-gray-700 rounded-lg py-3 text-white font-medium transition-colors"
      },
      accountType === "handle" ? "Not you? Use different handle" : "Not you? Use different number"
    ))), !showExistingAccountAlert && /* @__PURE__ */ import_react2.default.createElement(import_react2.default.Fragment, null, /* @__PURE__ */ import_react2.default.createElement("div", { className: "bg-gray-800 p-1 rounded-lg flex mb-6" }, /* @__PURE__ */ import_react2.default.createElement(
      "button",
      {
        onClick: () => handleLoginMethodSelect("handle"),
        className: `flex-1 flex items-center justify-center gap-2 py-3 rounded-md transition-colors ${loginMethod === "handle" ? "bg-teal-600 text-white" : "bg-transparent text-gray-400 hover:text-white"}`
      },
      /* @__PURE__ */ import_react2.default.createElement(User, { size: 18 }),
      /* @__PURE__ */ import_react2.default.createElement("span", null, "Handle")
    ), /* @__PURE__ */ import_react2.default.createElement(
      "button",
      {
        onClick: () => handleLoginMethodSelect("phone"),
        className: `flex-1 flex items-center justify-center gap-2 py-3 rounded-md transition-colors ${loginMethod === "phone" ? "bg-teal-600 text-white" : "bg-transparent text-gray-400 hover:text-white"}`
      },
      /* @__PURE__ */ import_react2.default.createElement(Phone, { size: 18 }),
      /* @__PURE__ */ import_react2.default.createElement("span", null, "Phone")
    )), /* @__PURE__ */ import_react2.default.createElement("div", { className: "relative" }, loginMethod === "phone" ? /* @__PURE__ */ import_react2.default.createElement("div", { className: "flex" }, /* @__PURE__ */ import_react2.default.createElement(
      "button",
      {
        onClick: () => setShowCountrySelect(!showCountrySelect),
        className: "bg-gray-800 rounded-l-lg py-4 px-4 flex items-center gap-2 border-r border-gray-700",
        disabled: isLoading
      },
      countryCode === "+44" ? "\u{1F1EC}\u{1F1E7}" : "\u{1F1F8}\u{1F1EC}",
      " ",
      countryCode,
      " ",
      /* @__PURE__ */ import_react2.default.createElement(ChevronDown, { size: 16, className: "text-gray-400" })
    ), /* @__PURE__ */ import_react2.default.createElement(
      "input",
      {
        type: "tel",
        value: formatPhoneDisplay(phoneNumber),
        onChange: handlePhoneInput,
        placeholder: countryCode === "+44" ? "7XXX XXX XXX" : "XXXX XXXX",
        className: "flex-1 bg-gray-800 border-0 rounded-r-lg py-4 px-6 text-lg\n                             focus:ring-2 focus:ring-teal-500 focus:outline-none",
        disabled: isLoading,
        autoFocus: true
      }
    )) : /* @__PURE__ */ import_react2.default.createElement("div", { className: "relative" }, /* @__PURE__ */ import_react2.default.createElement("div", { className: "absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none" }, /* @__PURE__ */ import_react2.default.createElement("span", { className: "text-gray-400" }, "@")), /* @__PURE__ */ import_react2.default.createElement(
      "input",
      {
        type: "text",
        value: identifier.replace("@", ""),
        onChange: (e) => setIdentifier("@" + e.target.value.replace("@", "")),
        placeholder: "username",
        className: "w-full bg-gray-800 border-0 rounded-lg py-4 pl-10 pr-6 text-lg\n                             focus:ring-2 focus:ring-teal-500 focus:outline-none",
        disabled: isLoading,
        autoFocus: true
      }
    ))), showCountrySelect && /* @__PURE__ */ import_react2.default.createElement("div", { className: "absolute mt-2 w-40 bg-gray-800 rounded-lg shadow-lg z-10 overflow-hidden" }, /* @__PURE__ */ import_react2.default.createElement(
      "button",
      {
        onClick: () => {
          setCountryCode("+44");
          setShowCountrySelect(false);
          setPhoneNumber("");
        },
        className: "w-full px-4 py-3 text-left hover:bg-gray-700 flex items-center gap-2 transition-colors"
      },
      "\u{1F1EC}\u{1F1E7} United Kingdom"
    ), /* @__PURE__ */ import_react2.default.createElement(
      "button",
      {
        onClick: () => {
          setCountryCode("+65");
          setShowCountrySelect(false);
          setPhoneNumber("");
        },
        className: "w-full px-4 py-3 text-left hover:bg-gray-700 flex items-center gap-2 transition-colors"
      },
      "\u{1F1F8}\u{1F1EC} Singapore"
    )), /* @__PURE__ */ import_react2.default.createElement(
      "button",
      {
        onClick: handleInitialSubmit,
        disabled: isLoading || !identifier || (loginMethod === "handle" ? !validateHandle() : !validatePhoneNumber()),
        className: "w-full bg-teal-500 text-white rounded-lg py-4 font-medium\n                      disabled:opacity-50 disabled:cursor-not-allowed\n                      hover:bg-teal-600 transition-colors flex items-center justify-center"
      },
      isLoading ? /* @__PURE__ */ import_react2.default.createElement("div", { className: "flex items-center justify-center" }, /* @__PURE__ */ import_react2.default.createElement("div", { className: "animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" }), "Processing...") : /* @__PURE__ */ import_react2.default.createElement("span", { className: "flex items-center" }, "Continue ", /* @__PURE__ */ import_react2.default.createElement(ArrowRight, { size: 18, className: "ml-2" }))
    ), /* @__PURE__ */ import_react2.default.createElement(
      "button",
      {
        onClick: () => setIsRegistrationFlow(!isRegistrationFlow),
        className: "w-full text-gray-400 py-2 mt-4 hover:text-white transition-colors"
      },
      isRegistrationFlow ? "Already have an account? Sign in" : "Don't have an account? Create account"
    )), error && !showExistingAccountAlert && /* @__PURE__ */ import_react2.default.createElement("div", { className: "text-red-500 text-center flex items-center justify-center p-3 bg-red-500 bg-opacity-10 rounded-lg" }, /* @__PURE__ */ import_react2.default.createElement(Lock, { size: 16, className: "mr-2" }), /* @__PURE__ */ import_react2.default.createElement("span", null, error), /* @__PURE__ */ import_react2.default.createElement("button", { onClick: () => setError(""), className: "ml-2" }, /* @__PURE__ */ import_react2.default.createElement(X, { className: "w-4 h-4" })))));
    const renderHandleEntry = () => /* @__PURE__ */ import_react2.default.createElement("div", { className: "min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4" }, /* @__PURE__ */ import_react2.default.createElement("div", { className: "w-full max-w-md space-y-8" }, /* @__PURE__ */ import_react2.default.createElement("div", { className: "text-center" }, /* @__PURE__ */ import_react2.default.createElement("h1", { className: "text-2xl font-bold mb-2" }, "Create your handle"), /* @__PURE__ */ import_react2.default.createElement("p", { className: "text-gray-400" }, "Choose a unique username to identify yourself")), /* @__PURE__ */ import_react2.default.createElement("div", { className: "relative" }, /* @__PURE__ */ import_react2.default.createElement("div", { className: "absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none" }, /* @__PURE__ */ import_react2.default.createElement("span", { className: "text-gray-400" }, "@")), /* @__PURE__ */ import_react2.default.createElement(
      "input",
      {
        type: "text",
        value: handle.replace("@", ""),
        onChange: (e) => setHandle("@" + e.target.value.replace("@", "")),
        placeholder: "username",
        className: "w-full bg-gray-800 border-0 rounded-lg py-4 pl-10 pr-6 text-lg\n                   focus:ring-2 focus:ring-teal-500 focus:outline-none",
        disabled: isLoading,
        autoFocus: true
      }
    )), /* @__PURE__ */ import_react2.default.createElement(
      "button",
      {
        onClick: () => {
          if (isHandleFirst) {
            setFlowState("phoneEntry");
          } else {
            handleHandleSubmit();
          }
        },
        disabled: isLoading || !handle || !handle.match(/^@[a-zA-Z0-9_]{1,29}$/),
        className: "w-full bg-teal-500 text-white rounded-lg py-4 font-medium\n                 disabled:opacity-50 disabled:cursor-not-allowed\n                 hover:bg-teal-600 transition-colors flex items-center justify-center"
      },
      isLoading ? /* @__PURE__ */ import_react2.default.createElement("div", { className: "flex items-center justify-center" }, /* @__PURE__ */ import_react2.default.createElement("div", { className: "animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" }), "Processing...") : /* @__PURE__ */ import_react2.default.createElement("span", { className: "flex items-center" }, "Continue ", /* @__PURE__ */ import_react2.default.createElement(ArrowRight, { size: 18, className: "ml-2" }))
    ), error && /* @__PURE__ */ import_react2.default.createElement("div", { className: "text-red-500 text-center flex items-center justify-center p-3 bg-red-500 bg-opacity-10 rounded-lg" }, /* @__PURE__ */ import_react2.default.createElement("span", null, error), /* @__PURE__ */ import_react2.default.createElement("button", { onClick: () => setError(""), className: "ml-2" }, /* @__PURE__ */ import_react2.default.createElement(X, { className: "w-4 h-4" })))));
    const renderPhoneEntry = () => /* @__PURE__ */ import_react2.default.createElement("div", { className: "min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4" }, /* @__PURE__ */ import_react2.default.createElement("div", { className: "w-full max-w-md space-y-8" }, /* @__PURE__ */ import_react2.default.createElement("div", { className: "text-center" }, /* @__PURE__ */ import_react2.default.createElement("h1", { className: "text-2xl font-bold mb-2" }, "Enter your phone"), /* @__PURE__ */ import_react2.default.createElement("p", { className: "text-gray-400" }, "We'll send a verification code to verify your number")), /* @__PURE__ */ import_react2.default.createElement("div", { className: "flex mb-2" }, /* @__PURE__ */ import_react2.default.createElement(
      "button",
      {
        onClick: () => setShowCountrySelect(!showCountrySelect),
        className: "bg-gray-800 rounded-l-lg py-4 px-4 flex items-center gap-2 border-r border-gray-700",
        disabled: isLoading
      },
      countryCode === "+44" ? "\u{1F1EC}\u{1F1E7}" : "\u{1F1F8}\u{1F1EC}",
      " ",
      countryCode,
      " ",
      /* @__PURE__ */ import_react2.default.createElement(ChevronDown, { size: 16, className: "text-gray-400" })
    ), /* @__PURE__ */ import_react2.default.createElement(
      "input",
      {
        type: "tel",
        value: formatPhoneDisplay(phoneNumber),
        onChange: handlePhoneInput,
        placeholder: countryCode === "+44" ? "7XXX XXX XXX" : "XXXX XXXX",
        className: "flex-1 bg-gray-800 border-0 rounded-r-lg py-4 px-6 text-lg\n                   focus:ring-2 focus:ring-teal-500 focus:outline-none",
        disabled: isLoading,
        autoFocus: true
      }
    )), showCountrySelect && /* @__PURE__ */ import_react2.default.createElement("div", { className: "absolute mt-2 w-40 bg-gray-800 rounded-lg shadow-lg z-10 overflow-hidden" }, /* @__PURE__ */ import_react2.default.createElement(
      "button",
      {
        onClick: () => {
          setCountryCode("+44");
          setShowCountrySelect(false);
          setPhoneNumber("");
        },
        className: "w-full px-4 py-3 text-left hover:bg-gray-700 flex items-center gap-2 transition-colors"
      },
      "\u{1F1EC}\u{1F1E7} United Kingdom"
    ), /* @__PURE__ */ import_react2.default.createElement(
      "button",
      {
        onClick: () => {
          setCountryCode("+65");
          setShowCountrySelect(false);
          setPhoneNumber("");
        },
        className: "w-full px-4 py-3 text-left hover:bg-gray-700 flex items-center gap-2 transition-colors"
      },
      "\u{1F1F8}\u{1F1EC} Singapore"
    )), /* @__PURE__ */ import_react2.default.createElement(
      "button",
      {
        onClick: handlePhoneSubmit,
        disabled: isLoading || !validatePhoneNumber(),
        className: "w-full bg-teal-500 text-white rounded-lg py-4 font-medium\n                 disabled:opacity-50 disabled:cursor-not-allowed\n                 hover:bg-teal-600 transition-colors flex items-center justify-center"
      },
      isLoading ? /* @__PURE__ */ import_react2.default.createElement("div", { className: "flex items-center justify-center" }, /* @__PURE__ */ import_react2.default.createElement("div", { className: "animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" }), "Sending code...") : /* @__PURE__ */ import_react2.default.createElement("span", { className: "flex items-center" }, "Send Verification Code ", /* @__PURE__ */ import_react2.default.createElement(ArrowRight, { size: 18, className: "ml-2" }))
    ), /* @__PURE__ */ import_react2.default.createElement(
      "button",
      {
        onClick: () => setFlowState("handleEntry"),
        className: "w-full bg-gray-800 text-white rounded-lg py-4 font-medium\n                 hover:bg-gray-700 transition-colors mt-4",
        disabled: isLoading
      },
      "Back"
    ), error && /* @__PURE__ */ import_react2.default.createElement("div", { className: "text-red-500 text-center flex items-center justify-center p-3 bg-red-500 bg-opacity-10 rounded-lg" }, /* @__PURE__ */ import_react2.default.createElement("span", null, error), /* @__PURE__ */ import_react2.default.createElement("button", { onClick: () => setError(""), className: "ml-2" }, /* @__PURE__ */ import_react2.default.createElement(X, { className: "w-4 h-4" })))));
    const renderCreateHandle = () => /* @__PURE__ */ import_react2.default.createElement("div", { className: "min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4" }, /* @__PURE__ */ import_react2.default.createElement("div", { className: "w-full max-w-md space-y-8" }, /* @__PURE__ */ import_react2.default.createElement("div", { className: "text-center" }, /* @__PURE__ */ import_react2.default.createElement("h1", { className: "text-2xl font-bold mb-2" }, "Create your handle"), /* @__PURE__ */ import_react2.default.createElement("p", { className: "text-gray-400" }, "This will be your unique identifier")), /* @__PURE__ */ import_react2.default.createElement("div", null, /* @__PURE__ */ import_react2.default.createElement("div", { className: "relative" }, /* @__PURE__ */ import_react2.default.createElement("div", { className: "absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none" }, /* @__PURE__ */ import_react2.default.createElement("span", { className: "text-gray-400" }, "@")), /* @__PURE__ */ import_react2.default.createElement(
      "input",
      {
        type: "text",
        value: handle.replace("@", ""),
        onChange: (e) => setHandle("@" + e.target.value.replace("@", "")),
        placeholder: "username",
        className: "w-full bg-gray-800 border-0 rounded-lg py-4 pl-10 pr-6 text-lg\n                     focus:ring-2 focus:ring-teal-500 focus:outline-none",
        disabled: isLoading,
        autoFocus: true
      }
    )), /* @__PURE__ */ import_react2.default.createElement("p", { className: "text-xs text-gray-400 mt-2 pl-2" }, "Handle must start with @ and contain only letters, numbers, and underscores")), /* @__PURE__ */ import_react2.default.createElement(
      "button",
      {
        onClick: handleHandleSubmit,
        disabled: !handle || handle.length < 2 || isLoading || !handle.match(/^@[a-zA-Z0-9_]{1,29}$/),
        className: "w-full bg-teal-500 text-white rounded-lg py-4 font-medium\n                 disabled:opacity-50 disabled:cursor-not-allowed\n                 hover:bg-teal-600 transition-colors flex items-center justify-center"
      },
      isLoading ? /* @__PURE__ */ import_react2.default.createElement("div", { className: "flex items-center justify-center" }, /* @__PURE__ */ import_react2.default.createElement("div", { className: "animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" }), "Setting up your account...") : /* @__PURE__ */ import_react2.default.createElement("span", { className: "flex items-center" }, "Create Handle ", /* @__PURE__ */ import_react2.default.createElement(ArrowRight, { size: 18, className: "ml-2" }))
    ), error && /* @__PURE__ */ import_react2.default.createElement("div", { className: "text-red-500 text-center flex items-center justify-center p-3 bg-red-500 bg-opacity-10 rounded-lg" }, /* @__PURE__ */ import_react2.default.createElement("span", null, error), /* @__PURE__ */ import_react2.default.createElement("button", { onClick: () => setError(""), className: "ml-2" }, /* @__PURE__ */ import_react2.default.createElement(X, { className: "w-4 h-4" })))));
    const renderHandleSuggestions = () => /* @__PURE__ */ import_react2.default.createElement("div", { className: "min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4" }, /* @__PURE__ */ import_react2.default.createElement("div", { className: "w-full max-w-md" }, /* @__PURE__ */ import_react2.default.createElement("div", { className: "flex items-center mb-6" }, /* @__PURE__ */ import_react2.default.createElement(
      "button",
      {
        onClick: () => setFlowState("loginOptions"),
        className: "text-gray-400 hover:text-white transition-colors"
      },
      /* @__PURE__ */ import_react2.default.createElement(ArrowLeft, { size: 20 })
    ), /* @__PURE__ */ import_react2.default.createElement("h1", { className: "text-xl font-medium ml-4" }, "Choose a handle")), /* @__PURE__ */ import_react2.default.createElement("div", { className: "flex justify-center mb-6" }, /* @__PURE__ */ import_react2.default.createElement("div", { className: "w-16 h-16 rounded-full bg-teal-500 flex items-center justify-center" }, /* @__PURE__ */ import_react2.default.createElement("span", { className: "text-2xl font-bold" }, "@"))), /* @__PURE__ */ import_react2.default.createElement("p", { className: "text-center text-gray-400 mb-6" }, "The handle you selected is already taken. Here are some available alternatives:"), /* @__PURE__ */ import_react2.default.createElement("div", { className: "space-y-2 mb-6" }, suggestedHandles.map((handle2, index) => /* @__PURE__ */ import_react2.default.createElement(
      "div",
      {
        key: index,
        onClick: () => {
          setHandle(handle2);
          setIsHandleFirst(true);
          setFlowState("phoneEntry");
        },
        className: "bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-all\n                     transform hover:translate-x-1 cursor-pointer"
      },
      /* @__PURE__ */ import_react2.default.createElement("div", { className: "flex items-center justify-between" }, /* @__PURE__ */ import_react2.default.createElement("span", { className: "font-medium" }, handle2), /* @__PURE__ */ import_react2.default.createElement(ArrowRight, { size: 16, className: "text-teal-500" }))
    ))), /* @__PURE__ */ import_react2.default.createElement("div", { className: "mt-8" }, /* @__PURE__ */ import_react2.default.createElement("p", { className: "text-sm text-gray-400 mb-2" }, "Or create your own handle:"), /* @__PURE__ */ import_react2.default.createElement("div", { className: "relative" }, /* @__PURE__ */ import_react2.default.createElement("div", { className: "absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none" }, /* @__PURE__ */ import_react2.default.createElement("span", { className: "text-gray-400" }, "@")), /* @__PURE__ */ import_react2.default.createElement(
      "input",
      {
        type: "text",
        value: customHandle || "",
        onChange: (e) => setCustomHandle(e.target.value.replace("@", "")),
        placeholder: "username",
        className: "w-full bg-gray-800 border border-gray-700 rounded-lg py-3 pl-8 pr-3\n                     focus:ring-2 focus:ring-teal-500 focus:border-transparent focus:outline-none"
      }
    )), /* @__PURE__ */ import_react2.default.createElement(
      "button",
      {
        onClick: () => {
          if (customHandle) {
            const customHandleWithAt = "@" + customHandle;
            setHandle(customHandleWithAt);
            setIsHandleFirst(true);
            setFlowState("phoneEntry");
          }
        },
        disabled: !customHandle,
        className: "w-full bg-teal-500 text-white rounded-lg py-3 mt-3 font-medium\n                   hover:bg-teal-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
      },
      /* @__PURE__ */ import_react2.default.createElement("span", { className: "flex items-center" }, "Continue ", /* @__PURE__ */ import_react2.default.createElement(ArrowRight, { size: 18, className: "ml-2" }))
    ))));
    const renderDeviceRegistration = () => {
      if (showPinEntry) {
        return renderPinEntry();
      }
      const isPhoneFlow = loginMethod === "phone";
      const userHandle = existingUserData?.handle || maskHandle(identifier);
      return /* @__PURE__ */ import_react2.default.createElement("div", { className: "min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4" }, /* @__PURE__ */ import_react2.default.createElement("div", { className: "w-full max-w-md space-y-6" }, /* @__PURE__ */ import_react2.default.createElement("div", { className: "mb-8 flex justify-center" }, /* @__PURE__ */ import_react2.default.createElement("div", { className: "w-16 h-16 rounded-full bg-teal-500 flex items-center justify-center text-xl font-bold" }, existingUserData?.handle ? existingUserData.handle[0].toUpperCase() : identifier.startsWith("@") ? identifier[1].toUpperCase() : "S")), /* @__PURE__ */ import_react2.default.createElement("div", { className: "text-center" }, /* @__PURE__ */ import_react2.default.createElement("h2", { className: "text-2xl font-bold mb-2" }, "Welcome Back, ", userHandle, "!"), /* @__PURE__ */ import_react2.default.createElement("p", { className: "text-gray-400 mb-6" }, "Your device is registered with SuperApp. For your security, a quick verification is needed. After this, you'll be automatically signed in on future visits.")), /* @__PURE__ */ import_react2.default.createElement("div", { className: "space-y-4" }, /* @__PURE__ */ import_react2.default.createElement(
        "button",
        {
          ref: yesButtonRef,
          onClick: handleRegisterDevice,
          disabled: isLoading,
          className: "w-full bg-teal-500 text-white rounded-lg py-4 font-medium hover:bg-teal-600 transition-colors disabled:opacity-50 flex items-center justify-center"
        },
        isLoading ? /* @__PURE__ */ import_react2.default.createElement("div", { className: "flex items-center justify-center" }, /* @__PURE__ */ import_react2.default.createElement("div", { className: "animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" }), "Processing...") : /* @__PURE__ */ import_react2.default.createElement("span", { className: "flex items-center" }, "Verify with SMS ", /* @__PURE__ */ import_react2.default.createElement(ArrowRight, { size: 18, className: "ml-2" }))
      ), (pinAvailable || existingUserData && existingUserData.pin_available) && /* @__PURE__ */ import_react2.default.createElement(
        "button",
        {
          onClick: handlePinButtonClick,
          disabled: isLoading,
          className: "w-full bg-gray-800 text-white rounded-lg py-4 font-medium hover:bg-gray-700 transition-colors disabled:opacity-50 flex items-center justify-center"
        },
        /* @__PURE__ */ import_react2.default.createElement("span", { className: "flex items-center" }, "Verify with PIN ", /* @__PURE__ */ import_react2.default.createElement(ArrowRight, { size: 18, className: "ml-2" }))
      ), /* @__PURE__ */ import_react2.default.createElement(
        "button",
        {
          ref: noButtonRef,
          onClick: handleNotMyAccount,
          disabled: isLoading,
          className: "w-full bg-gray-700 text-white rounded-lg py-4 font-medium hover:bg-gray-600 transition-colors"
        },
        "Not ",
        userHandle,
        "? ",
        isPhoneFlow ? "Use Different Phone" : "Use Different Handle"
      )), error && /* @__PURE__ */ import_react2.default.createElement("div", { className: "text-red-500 text-center flex items-center justify-center p-3 bg-red-500 bg-opacity-10 rounded-lg" }, /* @__PURE__ */ import_react2.default.createElement("span", null, error), /* @__PURE__ */ import_react2.default.createElement("button", { onClick: () => setError(""), className: "ml-2" }, /* @__PURE__ */ import_react2.default.createElement(X, { className: "w-4 h-4" })))));
    };
    return /* @__PURE__ */ import_react2.default.createElement(import_react2.default.Fragment, null, flowState === "pinEntry" && renderPinEntry(), flowState !== "pinEntry" && /* @__PURE__ */ import_react2.default.createElement(import_react2.default.Fragment, null, flowState === "checking" && renderLoadingState(), flowState === "deviceRegistered" && renderDeviceRegistered(), flowState === "loginSuccess" && renderLoginSuccess(), flowState === "deviceNotRegistered" && renderDeviceNotRegistered(), flowState === "loginOptions" && renderLoginOptions(), flowState === "handleEntry" && renderHandleEntry(), flowState === "phoneEntry" && renderPhoneEntry(), flowState === "deviceRegistration" && renderDeviceRegistration(), flowState === "verification" && renderVerificationStep(), flowState === "createHandle" && renderCreateHandle(), flowState === "handleSuggestions" && renderHandleSuggestions(), flowState === "verificationSuccess" && renderVerificationSuccess(), flowState === "registrationTransition" && renderRegistrationTransition()));
  };
  var UnifiedLogin_default = UnifiedLogin;

  // app/javascript/entrypoints/server_rendering.js
  global.React = import_react3.default;
  global.ReactDOMServer = import_server.default;
  global.UnifiedLogin = UnifiedLogin_default;
})();
/*! Bundled license information:

react/cjs/react.development.js:
  (**
   * @license React
   * react.development.js
   *
   * Copyright (c) Facebook, Inc. and its affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)

react-dom/cjs/react-dom-server-legacy.browser.development.js:
  (**
   * @license React
   * react-dom-server-legacy.browser.development.js
   *
   * Copyright (c) Facebook, Inc. and its affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)

react-dom/cjs/react-dom-server.browser.development.js:
  (**
   * @license React
   * react-dom-server.browser.development.js
   *
   * Copyright (c) Facebook, Inc. and its affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)

lucide-react/dist/esm/defaultAttributes.js:
  (**
   * @license lucide-react v0.316.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   *)

lucide-react/dist/esm/createLucideIcon.js:
  (**
   * @license lucide-react v0.316.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   *)

lucide-react/dist/esm/icons/arrow-left.js:
  (**
   * @license lucide-react v0.316.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   *)

lucide-react/dist/esm/icons/arrow-right.js:
  (**
   * @license lucide-react v0.316.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   *)

lucide-react/dist/esm/icons/check.js:
  (**
   * @license lucide-react v0.316.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   *)

lucide-react/dist/esm/icons/chevron-down.js:
  (**
   * @license lucide-react v0.316.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   *)

lucide-react/dist/esm/icons/lock.js:
  (**
   * @license lucide-react v0.316.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   *)

lucide-react/dist/esm/icons/phone.js:
  (**
   * @license lucide-react v0.316.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   *)

lucide-react/dist/esm/icons/user.js:
  (**
   * @license lucide-react v0.316.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   *)

lucide-react/dist/esm/icons/x.js:
  (**
   * @license lucide-react v0.316.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   *)

lucide-react/dist/esm/lucide-react.js:
  (**
   * @license lucide-react v0.316.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   *)
*/
;
