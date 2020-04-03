
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.head.appendChild(r) })(window.document);
function noop() { }
function assign(tar, src) {
    // @ts-ignore
    for (const k in src)
        tar[k] = src[k];
    return tar;
}
function add_location(element, file, line, column, char) {
    element.__svelte_meta = {
        loc: { file, line, column, char }
    };
}
function run(fn) {
    return fn();
}
function blank_object() {
    return Object.create(null);
}
function run_all(fns) {
    fns.forEach(run);
}
function is_function(thing) {
    return typeof thing === 'function';
}
function safe_not_equal(a, b) {
    return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
}
function validate_store(store, name) {
    if (store != null && typeof store.subscribe !== 'function') {
        throw new Error(`'${name}' is not a store with a 'subscribe' method`);
    }
}
function subscribe(store, ...callbacks) {
    if (store == null) {
        return noop;
    }
    const unsub = store.subscribe(...callbacks);
    return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
}
function component_subscribe(component, store, callback) {
    component.$$.on_destroy.push(subscribe(store, callback));
}
function create_slot(definition, ctx, $$scope, fn) {
    if (definition) {
        const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
        return definition[0](slot_ctx);
    }
}
function get_slot_context(definition, ctx, $$scope, fn) {
    return definition[1] && fn
        ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
        : $$scope.ctx;
}
function get_slot_changes(definition, $$scope, dirty, fn) {
    if (definition[2] && fn) {
        const lets = definition[2](fn(dirty));
        if (typeof $$scope.dirty === 'object') {
            const merged = [];
            const len = Math.max($$scope.dirty.length, lets.length);
            for (let i = 0; i < len; i += 1) {
                merged[i] = $$scope.dirty[i] | lets[i];
            }
            return merged;
        }
        return $$scope.dirty | lets;
    }
    return $$scope.dirty;
}
function null_to_empty(value) {
    return value == null ? '' : value;
}
function set_store_value(store, ret, value = ret) {
    store.set(value);
    return ret;
}

function append(target, node) {
    target.appendChild(node);
}
function insert(target, node, anchor) {
    target.insertBefore(node, anchor || null);
}
function detach(node) {
    node.parentNode.removeChild(node);
}
function destroy_each(iterations, detaching) {
    for (let i = 0; i < iterations.length; i += 1) {
        if (iterations[i])
            iterations[i].d(detaching);
    }
}
function element(name) {
    return document.createElement(name);
}
function text(data) {
    return document.createTextNode(data);
}
function space() {
    return text(' ');
}
function empty() {
    return text('');
}
function listen(node, event, handler, options) {
    node.addEventListener(event, handler, options);
    return () => node.removeEventListener(event, handler, options);
}
function prevent_default(fn) {
    return function (event) {
        event.preventDefault();
        // @ts-ignore
        return fn.call(this, event);
    };
}
function attr(node, attribute, value) {
    if (value == null)
        node.removeAttribute(attribute);
    else if (node.getAttribute(attribute) !== value)
        node.setAttribute(attribute, value);
}
function get_binding_group_value(group) {
    const value = [];
    for (let i = 0; i < group.length; i += 1) {
        if (group[i].checked)
            value.push(group[i].__value);
    }
    return value;
}
function to_number(value) {
    return value === '' ? undefined : +value;
}
function children(element) {
    return Array.from(element.childNodes);
}
function set_input_value(input, value) {
    if (value != null || input.value) {
        input.value = value;
    }
}
function set_style(node, key, value, important) {
    node.style.setProperty(key, value, important ? 'important' : '');
}
function select_option(select, value) {
    for (let i = 0; i < select.options.length; i += 1) {
        const option = select.options[i];
        if (option.__value === value) {
            option.selected = true;
            return;
        }
    }
}
function select_value(select) {
    const selected_option = select.querySelector(':checked') || select.options[0];
    return selected_option && selected_option.__value;
}
function toggle_class(element, name, toggle) {
    element.classList[toggle ? 'add' : 'remove'](name);
}
function custom_event(type, detail) {
    const e = document.createEvent('CustomEvent');
    e.initCustomEvent(type, false, false, detail);
    return e;
}
class HtmlTag {
    constructor(html, anchor = null) {
        this.e = element('div');
        this.a = anchor;
        this.u(html);
    }
    m(target, anchor = null) {
        for (let i = 0; i < this.n.length; i += 1) {
            insert(target, this.n[i], anchor);
        }
        this.t = target;
    }
    u(html) {
        this.e.innerHTML = html;
        this.n = Array.from(this.e.childNodes);
    }
    p(html) {
        this.d();
        this.u(html);
        this.m(this.t, this.a);
    }
    d() {
        this.n.forEach(detach);
    }
}

let current_component;
function set_current_component(component) {
    current_component = component;
}
function get_current_component() {
    if (!current_component)
        throw new Error(`Function called outside component initialization`);
    return current_component;
}
function onMount(fn) {
    get_current_component().$$.on_mount.push(fn);
}
function onDestroy(fn) {
    get_current_component().$$.on_destroy.push(fn);
}
function createEventDispatcher() {
    const component = get_current_component();
    return (type, detail) => {
        const callbacks = component.$$.callbacks[type];
        if (callbacks) {
            // TODO are there situations where events could be dispatched
            // in a server (non-DOM) environment?
            const event = custom_event(type, detail);
            callbacks.slice().forEach(fn => {
                fn.call(component, event);
            });
        }
    };
}
// TODO figure out if we still want to support
// shorthand events, or if we want to implement
// a real bubbling mechanism
function bubble(component, event) {
    const callbacks = component.$$.callbacks[event.type];
    if (callbacks) {
        callbacks.slice().forEach(fn => fn(event));
    }
}

const dirty_components = [];
const binding_callbacks = [];
const render_callbacks = [];
const flush_callbacks = [];
const resolved_promise = Promise.resolve();
let update_scheduled = false;
function schedule_update() {
    if (!update_scheduled) {
        update_scheduled = true;
        resolved_promise.then(flush);
    }
}
function add_render_callback(fn) {
    render_callbacks.push(fn);
}
const seen_callbacks = new Set();
function flush() {
    do {
        // first, call beforeUpdate functions
        // and update components
        while (dirty_components.length) {
            const component = dirty_components.shift();
            set_current_component(component);
            update(component.$$);
        }
        while (binding_callbacks.length)
            binding_callbacks.pop()();
        // then, once components are updated, call
        // afterUpdate functions. This may cause
        // subsequent updates...
        for (let i = 0; i < render_callbacks.length; i += 1) {
            const callback = render_callbacks[i];
            if (!seen_callbacks.has(callback)) {
                // ...so guard against infinite loops
                seen_callbacks.add(callback);
                callback();
            }
        }
        render_callbacks.length = 0;
    } while (dirty_components.length);
    while (flush_callbacks.length) {
        flush_callbacks.pop()();
    }
    update_scheduled = false;
    seen_callbacks.clear();
}
function update($$) {
    if ($$.fragment !== null) {
        $$.update();
        run_all($$.before_update);
        const dirty = $$.dirty;
        $$.dirty = [-1];
        $$.fragment && $$.fragment.p($$.ctx, dirty);
        $$.after_update.forEach(add_render_callback);
    }
}
const outroing = new Set();
let outros;
function group_outros() {
    outros = {
        r: 0,
        c: [],
        p: outros // parent group
    };
}
function check_outros() {
    if (!outros.r) {
        run_all(outros.c);
    }
    outros = outros.p;
}
function transition_in(block, local) {
    if (block && block.i) {
        outroing.delete(block);
        block.i(local);
    }
}
function transition_out(block, local, detach, callback) {
    if (block && block.o) {
        if (outroing.has(block))
            return;
        outroing.add(block);
        outros.c.push(() => {
            outroing.delete(block);
            if (callback) {
                if (detach)
                    block.d(1);
                callback();
            }
        });
        block.o(local);
    }
}

const globals = (typeof window !== 'undefined' ? window : global);
function create_component(block) {
    block && block.c();
}
function mount_component(component, target, anchor) {
    const { fragment, on_mount, on_destroy, after_update } = component.$$;
    fragment && fragment.m(target, anchor);
    // onMount happens before the initial afterUpdate
    add_render_callback(() => {
        const new_on_destroy = on_mount.map(run).filter(is_function);
        if (on_destroy) {
            on_destroy.push(...new_on_destroy);
        }
        else {
            // Edge case - component was destroyed immediately,
            // most likely as a result of a binding initialising
            run_all(new_on_destroy);
        }
        component.$$.on_mount = [];
    });
    after_update.forEach(add_render_callback);
}
function destroy_component(component, detaching) {
    const $$ = component.$$;
    if ($$.fragment !== null) {
        run_all($$.on_destroy);
        $$.fragment && $$.fragment.d(detaching);
        // TODO null out other refs, including component.$$ (but need to
        // preserve final state?)
        $$.on_destroy = $$.fragment = null;
        $$.ctx = [];
    }
}
function make_dirty(component, i) {
    if (component.$$.dirty[0] === -1) {
        dirty_components.push(component);
        schedule_update();
        component.$$.dirty.fill(0);
    }
    component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
}
function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
    const parent_component = current_component;
    set_current_component(component);
    const prop_values = options.props || {};
    const $$ = component.$$ = {
        fragment: null,
        ctx: null,
        // state
        props,
        update: noop,
        not_equal,
        bound: blank_object(),
        // lifecycle
        on_mount: [],
        on_destroy: [],
        before_update: [],
        after_update: [],
        context: new Map(parent_component ? parent_component.$$.context : []),
        // everything else
        callbacks: blank_object(),
        dirty
    };
    let ready = false;
    $$.ctx = instance
        ? instance(component, prop_values, (i, ret, ...rest) => {
            const value = rest.length ? rest[0] : ret;
            if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                if ($$.bound[i])
                    $$.bound[i](value);
                if (ready)
                    make_dirty(component, i);
            }
            return ret;
        })
        : [];
    $$.update();
    ready = true;
    run_all($$.before_update);
    // `false` as a special case of no DOM component
    $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
    if (options.target) {
        if (options.hydrate) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            $$.fragment && $$.fragment.l(children(options.target));
        }
        else {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            $$.fragment && $$.fragment.c();
        }
        if (options.intro)
            transition_in(component.$$.fragment);
        mount_component(component, options.target, options.anchor);
        flush();
    }
    set_current_component(parent_component);
}
class SvelteComponent {
    $destroy() {
        destroy_component(this, 1);
        this.$destroy = noop;
    }
    $on(type, callback) {
        const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
        callbacks.push(callback);
        return () => {
            const index = callbacks.indexOf(callback);
            if (index !== -1)
                callbacks.splice(index, 1);
        };
    }
    $set() {
        // overridden by instance, if it has props
    }
}

function dispatch_dev(type, detail) {
    document.dispatchEvent(custom_event(type, Object.assign({ version: '3.18.1' }, detail)));
}
function append_dev(target, node) {
    dispatch_dev("SvelteDOMInsert", { target, node });
    append(target, node);
}
function insert_dev(target, node, anchor) {
    dispatch_dev("SvelteDOMInsert", { target, node, anchor });
    insert(target, node, anchor);
}
function detach_dev(node) {
    dispatch_dev("SvelteDOMRemove", { node });
    detach(node);
}
function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
    const modifiers = options === true ? ["capture"] : options ? Array.from(Object.keys(options)) : [];
    if (has_prevent_default)
        modifiers.push('preventDefault');
    if (has_stop_propagation)
        modifiers.push('stopPropagation');
    dispatch_dev("SvelteDOMAddEventListener", { node, event, handler, modifiers });
    const dispose = listen(node, event, handler, options);
    return () => {
        dispatch_dev("SvelteDOMRemoveEventListener", { node, event, handler, modifiers });
        dispose();
    };
}
function attr_dev(node, attribute, value) {
    attr(node, attribute, value);
    if (value == null)
        dispatch_dev("SvelteDOMRemoveAttribute", { node, attribute });
    else
        dispatch_dev("SvelteDOMSetAttribute", { node, attribute, value });
}
function prop_dev(node, property, value) {
    node[property] = value;
    dispatch_dev("SvelteDOMSetProperty", { node, property, value });
}
function set_data_dev(text, data) {
    data = '' + data;
    if (text.data === data)
        return;
    dispatch_dev("SvelteDOMSetData", { node: text, data });
    text.data = data;
}
class SvelteComponentDev extends SvelteComponent {
    constructor(options) {
        if (!options || (!options.target && !options.$$inline)) {
            throw new Error(`'target' is a required option`);
        }
        super();
    }
    $destroy() {
        super.$destroy();
        this.$destroy = () => {
            console.warn(`Component was already destroyed`); // eslint-disable-line no-console
        };
    }
}

function convert (str, loose) {
	if (str instanceof RegExp) return { keys:false, pattern:str };
	var c, o, tmp, ext, keys=[], pattern='', arr = str.split('/');
	arr[0] || arr.shift();

	while (tmp = arr.shift()) {
		c = tmp[0];
		if (c === '*') {
			keys.push('wild');
			pattern += '/(.*)';
		} else if (c === ':') {
			o = tmp.indexOf('?', 1);
			ext = tmp.indexOf('.', 1);
			keys.push( tmp.substring(1, !!~o ? o : !!~ext ? ext : tmp.length) );
			pattern += !!~o && !~ext ? '(?:/([^/]+?))?' : '/([^/]+?)';
			if (!!~ext) pattern += (!!~o ? '?' : '') + '\\' + tmp.substring(ext);
		} else {
			pattern += '/' + tmp;
		}
	}

	return {
		keys: keys,
		pattern: new RegExp('^' + pattern + (loose ? '(?=$|\/)' : '\/?$'), 'i')
	};
}

function Navaid(base, on404) {
	var rgx, routes=[], $={};

	var fmt = $.format = function (uri) {
		if (!uri) return uri;
		uri = '/' + uri.replace(/^\/|\/$/g, '');
		return rgx.test(uri) && uri.replace(rgx, '/');
	};

	base = '/' + (base || '').replace(/^\/|\/$/g, '');
	rgx = base == '/' ? /^\/+/ : new RegExp('^\\' + base + '(?=\\/|$)\\/?', 'i');

	$.route = function (uri, replace) {
		if (uri[0] == '/' && !rgx.test(uri)) uri = base + uri;
		history[(replace ? 'replace' : 'push') + 'State'](uri, null, uri);
	};

	$.on = function (pat, fn) {
		(pat = convert(pat)).fn = fn;
		routes.push(pat);
		return $;
	};

	$.run = function (uri) {
		var i=0, params={}, arr, obj;
		if (uri = fmt(uri || location.pathname)) {
			uri = uri.match(/[^\?#]*/)[0];
			for (; i < routes.length; i++) {
				if (arr = (obj=routes[i]).pattern.exec(uri)) {
					for (i=0; i < obj.keys.length;) {
						params[obj.keys[i]] = arr[++i] || null;
					}
					obj.fn(params); // todo loop?
					return $;
				}
			}
			if (on404) on404(uri);
		}
		return $;
	};

	$.listen = function () {
		wrap('push');
		wrap('replace');

		function run(e) {
			$.run();
		}

		function click(e) {
			var x = e.target.closest('a'), y = x && x.getAttribute('href');
			if (e.ctrlKey || e.metaKey || e.altKey || e.shiftKey || e.button || e.defaultPrevented) return;
			if (!y || x.target || x.host !== location.host) return;
			if (y[0] != '/' || rgx.test(y)) {
				e.preventDefault();
				$.route(y);
			}
		}

		addEventListener('popstate', run);
		addEventListener('replacestate', run);
		addEventListener('pushstate', run);
		addEventListener('click', click);

		$.unlisten = function () {
			removeEventListener('popstate', run);
			removeEventListener('replacestate', run);
			removeEventListener('pushstate', run);
			removeEventListener('click', click);
		};

		return $.run();
	};

	return $;
}

function wrap(type, fn) {
	if (history[type]) return;
	history[type] = type;
	fn = history[type += 'State'];
	history[type] = function (uri) {
		var ev = new Event(type.toLowerCase());
		ev.uri = uri;
		fn.apply(this, arguments);
		return dispatchEvent(ev);
	};
}

/* ./src/routes/About.html generated by Svelte v3.18.1 */

const file = "./src/routes/About.html";

function create_fragment(ctx) {
	let t0;
	let h1;
	let t2;
	let div0;
	let h30;
	let t4;
	let ol;
	let li0;
	let t5;
	let br0;
	let t6;
	let t7;
	let li1;
	let t9;
	let li2;
	let t11;
	let li3;
	let t12;
	let br1;
	let t13;
	let t14;
	let li4;
	let t16;
	let li5;
	let t17;
	let kbd;
	let t19;
	let t20;
	let li6;
	let t22;
	let div1;
	let h31;
	let t23;
	let mark0;
	let t25;
	let p;
	let t26;
	let mark1;
	let small0;
	let t28;
	let ul2;
	let li10;
	let t29;
	let ul0;
	let li7;
	let t31;
	let li8;
	let t33;
	let li9;
	let t35;
	let li13;
	let t36;
	let ul1;
	let li11;
	let t38;
	let li12;
	let t40;
	let div2;
	let h32;
	let t41;
	let mark2;
	let t43;
	let ul4;
	let li16;
	let t44;
	let ul3;
	let li14;
	let t46;
	let li15;
	let t47;
	let mark3;
	let small1;
	let t49;
	let li17;
	let t50;
	let br2;
	let t51;
	let t52;
	let li18;
	let t54;
	let div3;
	let h33;
	let t55;
	let mark4;
	let t57;
	let ul6;
	let li21;
	let t58;
	let ul5;
	let li19;
	let t60;
	let li20;
	let t61;
	let mark5;
	let small2;
	let t63;
	let li22;
	let t65;
	let li23;
	let t67;
	let div4;
	let h34;
	let t68;
	let mark6;

	const block = {
		c: function create() {
			t0 = space();
			h1 = element("h1");
			h1.textContent = "導覽";
			t2 = space();
			div0 = element("div");
			h30 = element("h3");
			h30.textContent = "0. 共通";
			t4 = space();
			ol = element("ol");
			li0 = element("li");
			t5 = text("有三角符號的標題可點擊展現更多內容，");
			br0 = element("br");
			t6 = text("並且會記住開閤狀態");
			t7 = space();
			li1 = element("li");
			li1.textContent = "點擊屬性圖示 => 屬性相剋圖";
			t9 = space();
			li2 = element("li");
			li2.textContent = "招式與寶可夢同屬性時，字體樣式會加粗提示";
			t11 = space();
			li3 = element("li");
			t12 = text("表格標頭有漸層者即為當前排序欄，");
			br1 = element("br");
			t13 = text("點擊切換排序欄或方向");
			t14 = space();
			li4 = element("li");
			li4.textContent = "部份表格標頭滑鼠懸停可顯示標頭說明";
			t16 = space();
			li5 = element("li");
			t17 = text("先按鍵盤 ");
			kbd = element("kbd");
			kbd.textContent = "Shift";
			t19 = text(" 鍵再點表格標題，即可增加次排序欄");
			t20 = space();
			li6 = element("li");
			li6.textContent = "下方的留言首次需點開才會載入";
			t22 = space();
			div1 = element("div");
			h31 = element("h3");
			t23 = text("1. [關鍵字] 搜尋 ");
			mark0 = element("mark");
			mark0.textContent = "/Home";
			t25 = space();
			p = element("p");
			t26 = text("以 [關鍵字] 搜尋 [寶可夢] / [招式] ");
			mark1 = element("mark");
			small0 = element("small");
			small0.textContent = "/?q=kwd";
			t28 = space();
			ul2 = element("ul");
			li10 = element("li");
			t29 = text("寶可夢:\n      ");
			ul0 = element("ul");
			li7 = element("li");
			li7.textContent = "Pokedex(數字)";
			t31 = space();
			li8 = element("li");
			li8.textContent = "名字(zh, en)";
			t33 = space();
			li9 = element("li");
			li9.textContent = "屬性(en)";
			t35 = space();
			li13 = element("li");
			t36 = text("招式:\n      ");
			ul1 = element("ul");
			li11 = element("li");
			li11.textContent = "名字(zh, en)";
			t38 = space();
			li12 = element("li");
			li12.textContent = "屬性(en)";
			t40 = space();
			div2 = element("div");
			h32 = element("h3");
			t41 = text("2. 招式列表 ");
			mark2 = element("mark");
			mark2.textContent = "/Move";
			t43 = space();
			ul4 = element("ul");
			li16 = element("li");
			t44 = text("屬性過濾\n      ");
			ul3 = element("ul");
			li14 = element("li");
			li14.textContent = "點擊可單獨列出某一屬性的招式";
			t46 = space();
			li15 = element("li");
			t47 = text("圖示下方中文字可取得該屬性連結 ");
			mark3 = element("mark");
			small1 = element("small");
			small1.textContent = "/move#fire";
			t49 = space();
			li17 = element("li");
			t50 = text("PVP / PVE 切換鈕");
			br2 = element("br");
			t51 = text("\n      切換該招式在各模式下的數值");
			t52 = space();
			li18 = element("li");
			li18.textContent = "點擊招式名稱 => 招式頁";
			t54 = space();
			div3 = element("div");
			h33 = element("h3");
			t55 = text("3. 寶可夢列表 ");
			mark4 = element("mark");
			mark4.textContent = "/Pokemon";
			t57 = space();
			ul6 = element("ul");
			li21 = element("li");
			t58 = text("屬性過濾\n      ");
			ul5 = element("ul");
			li19 = element("li");
			li19.textContent = "點擊可單獨列出某一屬性的寶可夢";
			t60 = space();
			li20 = element("li");
			t61 = text("圖示下方中文字可取得該屬性連結 ");
			mark5 = element("mark");
			small2 = element("small");
			small2.textContent = "/pokemon#fire";
			t63 = space();
			li22 = element("li");
			li22.textContent = "點擊寶可夢名稱 => 寶可夢頁";
			t65 = space();
			li23 = element("li");
			li23.textContent = "寶可夢頁下方可模擬對戰方屬性，進而更新各招式數值";
			t67 = space();
			div4 = element("div");
			h34 = element("h3");
			t68 = text("4. 雜項 ");
			mark6 = element("mark");
			mark6.textContent = "/Info";
			document.title = "About";
			add_location(h1, file, 4, 0, 53);
			add_location(h30, file, 7, 2, 87);
			add_location(br0, file, 9, 39, 148);
			attr_dev(li0, "class", "mb-2");
			add_location(li0, file, 9, 4, 113);
			attr_dev(li1, "class", "mb-2");
			add_location(li1, file, 10, 4, 171);
			attr_dev(li2, "class", "mb-2");
			add_location(li2, file, 11, 4, 213);
			add_location(br1, file, 12, 37, 293);
			attr_dev(li3, "class", "mb-2");
			add_location(li3, file, 12, 4, 260);
			attr_dev(li4, "class", "mb-2");
			add_location(li4, file, 13, 4, 317);
			add_location(kbd, file, 14, 26, 383);
			attr_dev(li5, "class", "mb-2");
			add_location(li5, file, 14, 4, 361);
			attr_dev(li6, "class", "mb-2");
			add_location(li6, file, 15, 4, 426);
			add_location(ol, file, 8, 2, 104);
			attr_dev(div0, "class", "card");
			add_location(div0, file, 6, 0, 66);
			attr_dev(mark0, "class", "svelte-flao0k");
			add_location(mark0, file, 20, 18, 516);
			add_location(h31, file, 20, 2, 500);
			add_location(small0, file, 22, 34, 580);
			attr_dev(mark1, "class", "svelte-flao0k");
			add_location(mark1, file, 22, 28, 574);
			add_location(p, file, 21, 2, 542);
			add_location(li7, file, 28, 8, 676);
			add_location(li8, file, 29, 8, 705);
			add_location(li9, file, 30, 8, 733);
			add_location(ul0, file, 27, 6, 663);
			attr_dev(li10, "class", "mb-2");
			add_location(li10, file, 25, 4, 628);
			add_location(li11, file, 36, 8, 822);
			add_location(li12, file, 37, 8, 850);
			add_location(ul1, file, 35, 6, 809);
			attr_dev(li13, "class", "mb-2");
			add_location(li13, file, 33, 4, 775);
			add_location(ul2, file, 24, 2, 619);
			attr_dev(div1, "class", "card");
			add_location(div1, file, 19, 0, 479);
			attr_dev(mark2, "class", "svelte-flao0k");
			add_location(mark2, file, 44, 14, 937);
			add_location(h32, file, 44, 2, 925);
			add_location(li14, file, 49, 8, 1020);
			add_location(small1, file, 50, 34, 1078);
			attr_dev(mark3, "class", "svelte-flao0k");
			add_location(mark3, file, 50, 28, 1072);
			add_location(li15, file, 50, 8, 1052);
			add_location(ul3, file, 48, 6, 1007);
			attr_dev(li16, "class", "mb-2");
			add_location(li16, file, 46, 4, 972);
			add_location(br2, file, 54, 19, 1179);
			attr_dev(li17, "class", "mb-2");
			add_location(li17, file, 53, 4, 1142);
			attr_dev(li18, "class", "mb-2");
			add_location(li18, file, 57, 4, 1218);
			add_location(ul4, file, 45, 2, 963);
			attr_dev(div2, "class", "card");
			add_location(div2, file, 43, 0, 904);
			attr_dev(mark4, "class", "svelte-flao0k");
			add_location(mark4, file, 64, 15, 1316);
			add_location(h33, file, 64, 2, 1303);
			add_location(li19, file, 69, 8, 1402);
			add_location(small2, file, 70, 34, 1461);
			attr_dev(mark5, "class", "svelte-flao0k");
			add_location(mark5, file, 70, 28, 1455);
			add_location(li20, file, 70, 8, 1435);
			add_location(ul5, file, 68, 6, 1389);
			attr_dev(li21, "class", "mb-2");
			add_location(li21, file, 66, 4, 1354);
			attr_dev(li22, "class", "mb-2");
			add_location(li22, file, 73, 4, 1528);
			add_location(li23, file, 76, 4, 1582);
			add_location(ul6, file, 65, 2, 1345);
			attr_dev(div3, "class", "card");
			add_location(div3, file, 63, 0, 1282);
			attr_dev(mark6, "class", "svelte-flao0k");
			add_location(mark6, file, 83, 12, 1675);
			add_location(h34, file, 83, 2, 1665);
			attr_dev(div4, "class", "card");
			add_location(div4, file, 82, 0, 1644);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, t0, anchor);
			insert_dev(target, h1, anchor);
			insert_dev(target, t2, anchor);
			insert_dev(target, div0, anchor);
			append_dev(div0, h30);
			append_dev(div0, t4);
			append_dev(div0, ol);
			append_dev(ol, li0);
			append_dev(li0, t5);
			append_dev(li0, br0);
			append_dev(li0, t6);
			append_dev(ol, t7);
			append_dev(ol, li1);
			append_dev(ol, t9);
			append_dev(ol, li2);
			append_dev(ol, t11);
			append_dev(ol, li3);
			append_dev(li3, t12);
			append_dev(li3, br1);
			append_dev(li3, t13);
			append_dev(ol, t14);
			append_dev(ol, li4);
			append_dev(ol, t16);
			append_dev(ol, li5);
			append_dev(li5, t17);
			append_dev(li5, kbd);
			append_dev(li5, t19);
			append_dev(ol, t20);
			append_dev(ol, li6);
			insert_dev(target, t22, anchor);
			insert_dev(target, div1, anchor);
			append_dev(div1, h31);
			append_dev(h31, t23);
			append_dev(h31, mark0);
			append_dev(div1, t25);
			append_dev(div1, p);
			append_dev(p, t26);
			append_dev(p, mark1);
			append_dev(mark1, small0);
			append_dev(div1, t28);
			append_dev(div1, ul2);
			append_dev(ul2, li10);
			append_dev(li10, t29);
			append_dev(li10, ul0);
			append_dev(ul0, li7);
			append_dev(ul0, t31);
			append_dev(ul0, li8);
			append_dev(ul0, t33);
			append_dev(ul0, li9);
			append_dev(ul2, t35);
			append_dev(ul2, li13);
			append_dev(li13, t36);
			append_dev(li13, ul1);
			append_dev(ul1, li11);
			append_dev(ul1, t38);
			append_dev(ul1, li12);
			insert_dev(target, t40, anchor);
			insert_dev(target, div2, anchor);
			append_dev(div2, h32);
			append_dev(h32, t41);
			append_dev(h32, mark2);
			append_dev(div2, t43);
			append_dev(div2, ul4);
			append_dev(ul4, li16);
			append_dev(li16, t44);
			append_dev(li16, ul3);
			append_dev(ul3, li14);
			append_dev(ul3, t46);
			append_dev(ul3, li15);
			append_dev(li15, t47);
			append_dev(li15, mark3);
			append_dev(mark3, small1);
			append_dev(ul4, t49);
			append_dev(ul4, li17);
			append_dev(li17, t50);
			append_dev(li17, br2);
			append_dev(li17, t51);
			append_dev(ul4, t52);
			append_dev(ul4, li18);
			insert_dev(target, t54, anchor);
			insert_dev(target, div3, anchor);
			append_dev(div3, h33);
			append_dev(h33, t55);
			append_dev(h33, mark4);
			append_dev(div3, t57);
			append_dev(div3, ul6);
			append_dev(ul6, li21);
			append_dev(li21, t58);
			append_dev(li21, ul5);
			append_dev(ul5, li19);
			append_dev(ul5, t60);
			append_dev(ul5, li20);
			append_dev(li20, t61);
			append_dev(li20, mark5);
			append_dev(mark5, small2);
			append_dev(ul6, t63);
			append_dev(ul6, li22);
			append_dev(ul6, t65);
			append_dev(ul6, li23);
			insert_dev(target, t67, anchor);
			insert_dev(target, div4, anchor);
			append_dev(div4, h34);
			append_dev(h34, t68);
			append_dev(h34, mark6);
		},
		p: noop,
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(t0);
			if (detaching) detach_dev(h1);
			if (detaching) detach_dev(t2);
			if (detaching) detach_dev(div0);
			if (detaching) detach_dev(t22);
			if (detaching) detach_dev(div1);
			if (detaching) detach_dev(t40);
			if (detaching) detach_dev(div2);
			if (detaching) detach_dev(t54);
			if (detaching) detach_dev(div3);
			if (detaching) detach_dev(t67);
			if (detaching) detach_dev(div4);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

class About extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, null, create_fragment, safe_not_equal, {});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "About",
			options,
			id: create_fragment.name
		});
	}
}

const matchOperatorsRegex = /[|\\{}()[\]^$+*?.-]/g;

var escapeStringRegexp = string => {
	if (typeof string !== 'string') {
		throw new TypeError('Expected a string');
	}

	return string.replace(matchOperatorsRegex, '\\$&');
};

const subscriber_queue = [];
/**
 * Creates a `Readable` store that allows reading by subscription.
 * @param value initial value
 * @param {StartStopNotifier}start start and stop notifications for subscriptions
 */
function readable(value, start) {
    return {
        subscribe: writable(value, start).subscribe,
    };
}
/**
 * Create a `Writable` store that allows both updating and reading by subscription.
 * @param {*=}value initial value
 * @param {StartStopNotifier=}start start and stop notifications for subscriptions
 */
function writable(value, start = noop) {
    let stop;
    const subscribers = [];
    function set(new_value) {
        if (safe_not_equal(value, new_value)) {
            value = new_value;
            if (stop) { // store is ready
                const run_queue = !subscriber_queue.length;
                for (let i = 0; i < subscribers.length; i += 1) {
                    const s = subscribers[i];
                    s[1]();
                    subscriber_queue.push(s, value);
                }
                if (run_queue) {
                    for (let i = 0; i < subscriber_queue.length; i += 2) {
                        subscriber_queue[i][0](subscriber_queue[i + 1]);
                    }
                    subscriber_queue.length = 0;
                }
            }
        }
    }
    function update(fn) {
        set(fn(value));
    }
    function subscribe(run, invalidate = noop) {
        const subscriber = [run, invalidate];
        subscribers.push(subscriber);
        if (subscribers.length === 1) {
            stop = start(set) || noop;
        }
        run(value);
        return () => {
            const index = subscribers.indexOf(subscriber);
            if (index !== -1) {
                subscribers.splice(index, 1);
            }
            if (subscribers.length === 0) {
                stop();
                stop = null;
            }
        };
    }
    return { set, update, subscribe };
}
function derived(stores, fn, initial_value) {
    const single = !Array.isArray(stores);
    const stores_array = single
        ? [stores]
        : stores;
    const auto = fn.length < 2;
    return readable(initial_value, (set) => {
        let inited = false;
        const values = [];
        let pending = 0;
        let cleanup = noop;
        const sync = () => {
            if (pending) {
                return;
            }
            cleanup();
            const result = fn(single ? values[0] : values, set);
            if (auto) {
                set(result);
            }
            else {
                cleanup = is_function(result) ? result : noop;
            }
        };
        const unsubscribers = stores_array.map((store, i) => subscribe(store, (value) => {
            values[i] = value;
            pending &= ~(1 << i);
            if (inited) {
                sync();
            }
        }, () => {
            pending |= (1 << i);
        }));
        inited = true;
        sync();
        return function stop() {
            run_all(unsubscribers);
            cleanup();
        };
    });
}

var CPM = {
  '1': 0.094,
  '1.5': 0.135137432,
  '2': 0.16639787,
  '2.5': 0.192650919,
  '3': 0.21573247,
  '3.5': 0.236572661,
  '4': 0.25572005,
  '4.5': 0.273530381,
  '5': 0.29024988,
  '5.5': 0.306057377,
  '6': 0.3210876,
  '6.5': 0.335445036,
  '7': 0.34921268,
  '7.5': 0.362457751,
  '8': 0.37523559,
  '8.5': 0.387592406,
  '9': 0.39956728,
  '9.5': 0.411193551,
  '10': 0.42250001,
  '10.5': 0.432926419,
  '11': 0.44310755,
  '11.5': 0.453059958,
  '12': 0.46279839,
  '12.5': 0.472336083,
  '13': 0.48168495,
  '13.5': 0.4908558,
  '14': 0.49985844,
  '14.5': 0.508701765,
  '15': 0.51739395,
  '15.5': 0.525942511,
  '16': 0.53435433,
  '16.5': 0.542635767,
  '17': 0.55079269,
  '17.5': 0.558830576,
  '18': 0.56675452,
  '18.5': 0.574569153,
  '19': 0.58227891,
  '19.5': 0.589887917,
  '20': 0.59740001,
  '20.5': 0.604818814,
  '21': 0.61215729,
  '21.5': 0.619399365,
  '22': 0.62656713,
  '22.5': 0.633644533,
  '23': 0.64065295,
  '23.5': 0.647576426,
  '24': 0.65443563,
  '24.5': 0.661214806,
  '25': 0.667934,
  '25.5': 0.674577537,
  '26': 0.68116492,
  '26.5': 0.687680648,
  '27': 0.69414365,
  '27.5': 0.700538673,
  '28': 0.70688421,
  '28.5': 0.713164996,
  '29': 0.71939909,
  '29.5': 0.725571552,
  '30': 0.7317,
  '30.5': 0.734741009,
  '31': 0.73776948,
  '31.5': 0.740785574,
  '32': 0.74378943,
  '32.5': 0.746781211,
  '33': 0.74976104,
  '33.5': 0.752729087,
  '34': 0.75568551,
  '34.5': 0.758630378,
  '35': 0.76156384,
  '35.5': 0.764486065,
  '36': 0.76739717,
  '36.5': 0.770297266,
  '37': 0.7731865,
  '37.5': 0.776064962,
  '38': 0.77893275,
  '38.5': 0.781790055,
  '39': 0.78463697,
  '39.5': 0.787473578,
  '40': 0.79030001,
  '40.5': 0.7931164,
  '41': 0.79530001,
};

function genOptions(v, l = v) {
  return `<option value="${v}" label="${l}"></option>`;
}
function cdnImgSrc(imgsrc, size = 200) {
  // return imgsrc;
  // return `https://imageproxy.pimg.tw/resize?maxwidth=${size}&maxheigth=${size}&url=${imgsrc}`;
  return `https://images.weserv.nl/?w=${size}&il&url=${imgsrc}`;
}

const ASSET_FOLDER = 'https://github.com/ZeChrales/PogoAssets/raw/master/';

function queryMoveName(mid, movebase) {
  let _m = movebase.find(m => m.mid === mid);
  if (!_m) {
    console.log('gg', mid);
  }
  return _m && _m.moveId;
}

function decompressJSON(json) {
  let { pmProps, moveProps } = json;

  json.moves = json.moves.map(moveArr => {
    let moveObj = moveArr.reduce((all, value, index) => {
      all[moveProps[index]] = value;
      return all;
    }, {});
    return moveObj;
  });

  json.pokemon = json.pokemon.map(pmDataArr => {
    let pmObj = pmDataArr.reduce((pm, value, index) => {
      let prop = pmProps[index];
      switch(prop) {
        case 'types':
          value = value.split(',');
          break;

        case 'fastMoves':
        case 'chargedMoves':
        case 'legacyMoves':
          value = value && value.split(',').map((mid) => queryMoveName(mid, json.moves));
          break;
      }

      if (value !== null) {
        pm[prop] = value;
      }
      return pm;
    }, {});
    return pmObj;
  });

  return json;
}



function handlePm(pms) {
  // for checking
  let dexMap = pms.map(p => p.dex);
  dexMap.forEach((dex, idx) => {
    let indexOfFirstDex = dexMap.indexOf(dex);
    let form = '';
    if (idx !== indexOfFirstDex) {
      form = pms[idx].id.replace(/^.+_/, '_');
    }

    let pm = pms[idx];
    pm.uid = `${dex}${form}`;

    if (pm.name.indexOf(' ') !== -1) {
      pm.formName = pm.name.split(' ');
    }

    let _cphp = calPmCPHP({
      atk: pm._atk,
      def: pm._def,
      sta: pm._sta,
    }, [15, 15, 15, 40]);

    pm.maxcp = _cphp.cp;
    pm.maxhp = _cphp.hp;
    pm.tank = pm._def * pm._sta;
    pm.tankStr = fixNum(pm.tank / 100, 0);
    if (!pm.genderMF) {
      pm.genderMF = [0, 0];
    }
  });
  return pms.filter(Boolean);
}




function calPmCPHP(base, adsl) {
  let [a, d, s, l] = adsl;
  let mFactor = CPM[l];
  let ADS = (base.atk + a) * Math.pow((base.def + d) * (base.sta + s), 0.5);
  let total = ADS * Math.pow(mFactor, 2.0);

  return {
    cp: Math.max(10, Math.floor(total / 10)),
    hp: Math.max(10, Math.floor((base.sta + s) * mFactor)),
  };
}



function handleMove(moves) {
  return moves.map(m => {
    // m.isFast = !!m.energyGain;
    if (m.isFast) {
      m.ept = fixNum(m.energyGain / m.turn);
      m.dpt = fixNum(m.power / m.turn);
      m.eptxdpt = fixNum((m.power * m.energyGain) / (m.turn * m.turn));
    } else {
      m.dpe = fixNum(m.power / m.energy);
      if (!m.effect) {
        m.effect = '';
      }
    }
    m.pve_dps = fixNum(m.pve_power / m.pve_duration);
    m.pve_eps = fixNum(m.pve_energyDelta / m.pve_duration);
    m.pve_dpe = fixNum(m.pve_power / -m.pve_energyDelta);
    m.pve_dpsxdpe = fixNum(m.pve_power * m.pve_power / (m.pve_duration * -m.pve_energyDelta));
    return m;
  });
}





function copy(obj) {
  return JSON.parse(JSON.stringify(obj));
}


// [].flat polyfill
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flat
function flatten(arr, depth = 1) {
  if (Array.prototype.flat) {
    return arr.flat(depth);
  }
  const stack = [...arr];
  const res = [];
  while(stack.length) {
    // pop value from stack
    const next = stack.pop();
    if(Array.isArray(next)) {
      // push back array items, won't modify the original input
      stack.push(...next);
    } else {
      res.push(next);
    }
  }
  // reverse to restore input order
  return res.reverse();
}




function fixNum(num, d = 2, toStr) {
  let op = (+num).toFixed(d);
  return toStr ? op : +op;
}





const STORAGE_KEY = 'POKEDEX';
function saveItem(data) {
  if (!data || !data.key) { return false;}
  let odata = getItem() || {};

  odata[data.key] = data.value;

  localStorage.setItem(STORAGE_KEY, JSON.stringify(odata));
}
function getItem(key) {
  let data = localStorage.getItem(STORAGE_KEY);
  if (!data) { return null; }
  data = JSON.parse(data);

  return key ? data[key] : data;
}

const pokemons = writable([]);
const moves = writable([]);
const family = writable({ waiting: true });
const maxDex = writable(0);
const router = writable(null);

Promise.all(
  ['gm.min.json', 'allF.json']
    .map(i =>
      fetch(i).then(r => r.json())
    )
)
.then(d => {
  if (d[0].pmProps) {
    d[0] = decompressJSON(d[0]);
  }
  pokemons.set(handlePm(d[0].pokemon));
  moves.set(handleMove(d[0].moves));
  family.set(d[1]);
  maxDex.set(d[0].pokemon[d[0].pokemon.length - 1].dex);
  console.log('gm done:', d);
});

const datalist = derived(
  pokemons,
  $pokemons =>
    $pokemons.map(pm =>
      genOptions(pm.uid, `${pm.name}, ${pm.id.slice(0, 1).toUpperCase()}${pm.id.slice(1)}`)).join('')
);







const isOsDarktheme = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
const localSettings = getItem('settings') || {};
const openFirst = [
  'pm_family',
  'types',
  'fmove',
  'cmove',
  'fastmove',
  'chargemove',
  'pvp_buff',
  'cost_calc',
  'type_table',
  'move-pair',
  'types-🛡️',
];
const _settings = {
  details: localSettings.details || openFirst.reduce((all, n) => {
    all[n] = true;
    return all;
  }, {}),
  io: localSettings.io || {},
};


const settings = writable(_settings);
settings.subscribe(value => {
  saveItem({
    key: 'settings',
    value,
  });
});


const typeTarget = writable(null);

/* ./src/routes/Home.html generated by Svelte v3.18.1 */
const file$1 = "./src/routes/Home.html";

function get_each_context(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[7] = list[i];
	return child_ctx;
}

function get_each_context_1(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[7] = list[i];
	return child_ctx;
}

// (52:6) {#each result[0] as item}
function create_each_block_1(ctx) {
	let li;
	let a;
	let t0;
	let t1_value = /*item*/ ctx[7].dex + "";
	let t1;
	let t2;
	let t3_value = /*item*/ ctx[7].name + "";
	let t3;
	let t4;
	let t5_value = /*item*/ ctx[7].id + "";
	let t5;
	let a_href_value;
	let t6;

	const block = {
		c: function create() {
			li = element("li");
			a = element("a");
			t0 = text("#");
			t1 = text(t1_value);
			t2 = space();
			t3 = text(t3_value);
			t4 = space();
			t5 = text(t5_value);
			t6 = space();
			attr_dev(a, "class", "result-link svelte-i9nx2y");
			attr_dev(a, "href", a_href_value = "./pokemon/" + /*item*/ ctx[7].uid);
			add_location(a, file$1, 53, 10, 1117);
			attr_dev(li, "class", "mb-1");
			add_location(li, file$1, 52, 8, 1089);
		},
		m: function mount(target, anchor) {
			insert_dev(target, li, anchor);
			append_dev(li, a);
			append_dev(a, t0);
			append_dev(a, t1);
			append_dev(a, t2);
			append_dev(a, t3);
			append_dev(a, t4);
			append_dev(a, t5);
			insert_dev(target, t6, anchor);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*result*/ 2 && t1_value !== (t1_value = /*item*/ ctx[7].dex + "")) set_data_dev(t1, t1_value);
			if (dirty & /*result*/ 2 && t3_value !== (t3_value = /*item*/ ctx[7].name + "")) set_data_dev(t3, t3_value);
			if (dirty & /*result*/ 2 && t5_value !== (t5_value = /*item*/ ctx[7].id + "")) set_data_dev(t5, t5_value);

			if (dirty & /*result*/ 2 && a_href_value !== (a_href_value = "./pokemon/" + /*item*/ ctx[7].uid)) {
				attr_dev(a, "href", a_href_value);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(li);
			if (detaching) detach_dev(t6);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block_1.name,
		type: "each",
		source: "(52:6) {#each result[0] as item}",
		ctx
	});

	return block;
}

// (66:6) {#each result[1] as item}
function create_each_block(ctx) {
	let li;
	let a;
	let t0_value = /*item*/ ctx[7].name + "";
	let t0;
	let t1;
	let t2_value = /*item*/ ctx[7].moveId + "";
	let t2;
	let a_href_value;
	let t3;

	const block = {
		c: function create() {
			li = element("li");
			a = element("a");
			t0 = text(t0_value);
			t1 = space();
			t2 = text(t2_value);
			t3 = space();
			attr_dev(a, "class", "result-link svelte-i9nx2y");
			attr_dev(a, "href", a_href_value = "./move/" + /*item*/ ctx[7].moveId);
			add_location(a, file$1, 67, 10, 1461);
			attr_dev(li, "class", "mb-1");
			add_location(li, file$1, 66, 8, 1433);
		},
		m: function mount(target, anchor) {
			insert_dev(target, li, anchor);
			append_dev(li, a);
			append_dev(a, t0);
			append_dev(a, t1);
			append_dev(a, t2);
			insert_dev(target, t3, anchor);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*result*/ 2 && t0_value !== (t0_value = /*item*/ ctx[7].name + "")) set_data_dev(t0, t0_value);
			if (dirty & /*result*/ 2 && t2_value !== (t2_value = /*item*/ ctx[7].moveId + "")) set_data_dev(t2, t2_value);

			if (dirty & /*result*/ 2 && a_href_value !== (a_href_value = "./move/" + /*item*/ ctx[7].moveId)) {
				attr_dev(a, "href", a_href_value);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(li);
			if (detaching) detach_dev(t3);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block.name,
		type: "each",
		source: "(66:6) {#each result[1] as item}",
		ctx
	});

	return block;
}

function create_fragment$1(ctx) {
	let div1;
	let div0;
	let t0;
	let input;
	let t1;
	let details0;
	let summary0;
	let t3;
	let ul0;
	let t4;
	let details1;
	let summary1;
	let t6;
	let ul1;
	let dispose;
	let each_value_1 = /*result*/ ctx[1][0];
	let each_blocks_1 = [];

	for (let i = 0; i < each_value_1.length; i += 1) {
		each_blocks_1[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
	}

	let each_value = /*result*/ ctx[1][1];
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
	}

	const block = {
		c: function create() {
			div1 = element("div");
			div0 = element("div");
			t0 = text("Q ");
			input = element("input");
			t1 = space();
			details0 = element("details");
			summary0 = element("summary");
			summary0.textContent = "PM";
			t3 = space();
			ul0 = element("ul");

			for (let i = 0; i < each_blocks_1.length; i += 1) {
				each_blocks_1[i].c();
			}

			t4 = space();
			details1 = element("details");
			summary1 = element("summary");
			summary1.textContent = "MOVE";
			t6 = space();
			ul1 = element("ul");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			attr_dev(input, "type", "search");
			add_location(input, file$1, 45, 6, 937);
			attr_dev(div0, "class", "pt-4");
			add_location(div0, file$1, 44, 2, 912);
			add_location(summary0, file$1, 49, 4, 1018);
			add_location(ul0, file$1, 50, 4, 1044);
			details0.open = true;
			attr_dev(details0, "class", "mb-6");
			add_location(details0, file$1, 48, 2, 986);
			add_location(summary1, file$1, 63, 4, 1360);
			add_location(ul1, file$1, 64, 4, 1388);
			details1.open = true;
			add_location(details1, file$1, 62, 2, 1341);
			attr_dev(div1, "class", "card");
			add_location(div1, file$1, 43, 0, 891);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, div1, anchor);
			append_dev(div1, div0);
			append_dev(div0, t0);
			append_dev(div0, input);
			set_input_value(input, /*q*/ ctx[0]);
			append_dev(div1, t1);
			append_dev(div1, details0);
			append_dev(details0, summary0);
			append_dev(details0, t3);
			append_dev(details0, ul0);

			for (let i = 0; i < each_blocks_1.length; i += 1) {
				each_blocks_1[i].m(ul0, null);
			}

			append_dev(div1, t4);
			append_dev(div1, details1);
			append_dev(details1, summary1);
			append_dev(details1, t6);
			append_dev(details1, ul1);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(ul1, null);
			}

			dispose = listen_dev(input, "input", /*input_input_handler*/ ctx[6]);
		},
		p: function update(ctx, [dirty]) {
			if (dirty & /*q*/ 1) {
				set_input_value(input, /*q*/ ctx[0]);
			}

			if (dirty & /*result*/ 2) {
				each_value_1 = /*result*/ ctx[1][0];
				let i;

				for (i = 0; i < each_value_1.length; i += 1) {
					const child_ctx = get_each_context_1(ctx, each_value_1, i);

					if (each_blocks_1[i]) {
						each_blocks_1[i].p(child_ctx, dirty);
					} else {
						each_blocks_1[i] = create_each_block_1(child_ctx);
						each_blocks_1[i].c();
						each_blocks_1[i].m(ul0, null);
					}
				}

				for (; i < each_blocks_1.length; i += 1) {
					each_blocks_1[i].d(1);
				}

				each_blocks_1.length = each_value_1.length;
			}

			if (dirty & /*result*/ 2) {
				each_value = /*result*/ ctx[1][1];
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(ul1, null);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value.length;
			}
		},
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(div1);
			destroy_each(each_blocks_1, detaching);
			destroy_each(each_blocks, detaching);
			dispose();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$1.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance($$self, $$props, $$invalidate) {
	let $pokemons;
	let $moves;
	validate_store(pokemons, "pokemons");
	component_subscribe($$self, pokemons, $$value => $$invalidate(2, $pokemons = $$value));
	validate_store(moves, "moves");
	component_subscribe($$self, moves, $$value => $$invalidate(3, $moves = $$value));
	let q = new URLSearchParams(location.search).get("q") || "";
	let result = [[], []];

	function queryPm(kwd) {
		let r = new RegExp(escapeStringRegexp(kwd), "i");

		return $pokemons.filter(pm => {
			return r.test(pm.uid) || r.test(pm.name) || r.test(pm.id) || r.test(pm.types);
		});
	}

	function queryMove(kwd) {
		let r = new RegExp(escapeStringRegexp(kwd), "i");

		return $moves.filter(move => {
			return r.test(move.name) || r.test(move.moveId) || r.test(move.type);
		});
	}

	function input_input_handler() {
		q = this.value;
		$$invalidate(0, q);
	}

	$$self.$capture_state = () => {
		return {};
	};

	$$self.$inject_state = $$props => {
		if ("q" in $$props) $$invalidate(0, q = $$props.q);
		if ("result" in $$props) $$invalidate(1, result = $$props.result);
		if ("$pokemons" in $$props) pokemons.set($pokemons = $$props.$pokemons);
		if ("$moves" in $$props) moves.set($moves = $$props.$moves);
	};

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*$pokemons, q*/ 5) {
			 {
				if ($pokemons.length) {
					$$invalidate(1, result = q ? [queryPm(q), queryMove(q)] : [[], []]);
				}
			}
		}

		if ($$self.$$.dirty & /*q*/ 1) {
			 {
				window.history.replaceState(null, "", q ? `?q=${q}` : "");
			}
		}
	};

	return [q, result, $pokemons, $moves, queryPm, queryMove, input_input_handler];
}

class Home extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance, create_fragment$1, safe_not_equal, {});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Home",
			options,
			id: create_fragment$1.name
		});
	}
}

function unwrapExports (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var build = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
function compareStrings(sA, sB) {
    return sA > sB ? 1 : sA < sB ? -1 : 0;
}
exports.compareStrings = compareStrings;
function compareNumbers(sA, sB) {
    return sA - sB;
}
exports.compareNumbers = compareNumbers;
function reverse(r) {
    return -r;
}
exports.reverse = reverse;
function compareStringsCaseInsensitive(sA, sB) {
    return sA.localeCompare(sB, undefined, {
        sensitivity: 'base',
    });
}
exports.compareStringsCaseInsensitive = compareStringsCaseInsensitive;
function sortFunction(gen) {
    return (a, b) => {
        for (let comp of gen(a, b)) {
            if (comp) {
                return comp;
            }
        }
        return 0;
    };
}
exports.sortFunction = sortFunction;

});

unwrapExports(build);
var build_1 = build.compareStrings;
var build_2 = build.compareNumbers;
var build_3 = build.reverse;
var build_4 = build.compareStringsCaseInsensitive;
var build_5 = build.sortFunction;

/* node_modules/svelte-tablesort/TableSort.svelte generated by Svelte v3.18.1 */
const file$2 = "node_modules/svelte-tablesort/TableSort.svelte";
const get_tfoot_slot_changes = dirty => ({});
const get_tfoot_slot_context = ctx => ({});
const get_tbody_slot_changes = dirty => ({ item: dirty & /*sortedItems*/ 4 });
const get_tbody_slot_context = ctx => ({ item: /*item*/ ctx[11] });

function get_each_context$1(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[11] = list[i];
	return child_ctx;
}

const get_thead_slot_changes = dirty => ({});
const get_thead_slot_context = ctx => ({});

// (112:8) {#each sortedItems as item}
function create_each_block$1(ctx) {
	let current;
	const tbody_slot_template = /*$$slots*/ ctx[9].tbody;
	const tbody_slot = create_slot(tbody_slot_template, ctx, /*$$scope*/ ctx[8], get_tbody_slot_context);

	const block = {
		c: function create() {
			if (tbody_slot) tbody_slot.c();
		},
		m: function mount(target, anchor) {
			if (tbody_slot) {
				tbody_slot.m(target, anchor);
			}

			current = true;
		},
		p: function update(ctx, dirty) {
			if (tbody_slot && tbody_slot.p && dirty & /*$$scope, sortedItems*/ 260) {
				tbody_slot.p(get_slot_context(tbody_slot_template, ctx, /*$$scope*/ ctx[8], get_tbody_slot_context), get_slot_changes(tbody_slot_template, /*$$scope*/ ctx[8], dirty, get_tbody_slot_changes));
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(tbody_slot, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(tbody_slot, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (tbody_slot) tbody_slot.d(detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block$1.name,
		type: "each",
		source: "(112:8) {#each sortedItems as item}",
		ctx
	});

	return block;
}

function create_fragment$2(ctx) {
	let table;
	let thead_1;
	let t0;
	let tbody;
	let t1;
	let tfoot;
	let table_class_value;
	let current;
	const thead_slot_template = /*$$slots*/ ctx[9].thead;
	const thead_slot = create_slot(thead_slot_template, ctx, /*$$scope*/ ctx[8], get_thead_slot_context);
	let each_value = /*sortedItems*/ ctx[2];
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
	}

	const out = i => transition_out(each_blocks[i], 1, 1, () => {
		each_blocks[i] = null;
	});

	const tfoot_slot_template = /*$$slots*/ ctx[9].tfoot;
	const tfoot_slot = create_slot(tfoot_slot_template, ctx, /*$$scope*/ ctx[8], get_tfoot_slot_context);

	const block = {
		c: function create() {
			table = element("table");
			thead_1 = element("thead");
			if (thead_slot) thead_slot.c();
			t0 = space();
			tbody = element("tbody");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			t1 = space();
			tfoot = element("tfoot");
			if (tfoot_slot) tfoot_slot.c();
			attr_dev(thead_1, "class", "svelte-refm3f");
			add_location(thead_1, file$2, 107, 4, 3956);
			add_location(tbody, file$2, 110, 4, 4029);
			add_location(tfoot, file$2, 115, 4, 4147);
			attr_dev(table, "class", table_class_value = "" + (CLASSNAME_TABLE + " " + /*className*/ ctx[0]));
			add_location(table, file$2, 106, 0, 3906);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, table, anchor);
			append_dev(table, thead_1);

			if (thead_slot) {
				thead_slot.m(thead_1, null);
			}

			/*thead_1_binding*/ ctx[10](thead_1);
			append_dev(table, t0);
			append_dev(table, tbody);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(tbody, null);
			}

			append_dev(table, t1);
			append_dev(table, tfoot);

			if (tfoot_slot) {
				tfoot_slot.m(tfoot, null);
			}

			current = true;
		},
		p: function update(ctx, [dirty]) {
			if (thead_slot && thead_slot.p && dirty & /*$$scope*/ 256) {
				thead_slot.p(get_slot_context(thead_slot_template, ctx, /*$$scope*/ ctx[8], get_thead_slot_context), get_slot_changes(thead_slot_template, /*$$scope*/ ctx[8], dirty, get_thead_slot_changes));
			}

			if (dirty & /*$$scope, sortedItems*/ 260) {
				each_value = /*sortedItems*/ ctx[2];
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context$1(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
						transition_in(each_blocks[i], 1);
					} else {
						each_blocks[i] = create_each_block$1(child_ctx);
						each_blocks[i].c();
						transition_in(each_blocks[i], 1);
						each_blocks[i].m(tbody, null);
					}
				}

				group_outros();

				for (i = each_value.length; i < each_blocks.length; i += 1) {
					out(i);
				}

				check_outros();
			}

			if (tfoot_slot && tfoot_slot.p && dirty & /*$$scope*/ 256) {
				tfoot_slot.p(get_slot_context(tfoot_slot_template, ctx, /*$$scope*/ ctx[8], get_tfoot_slot_context), get_slot_changes(tfoot_slot_template, /*$$scope*/ ctx[8], dirty, get_tfoot_slot_changes));
			}

			if (!current || dirty & /*className*/ 1 && table_class_value !== (table_class_value = "" + (CLASSNAME_TABLE + " " + /*className*/ ctx[0]))) {
				attr_dev(table, "class", table_class_value);
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(thead_slot, local);

			for (let i = 0; i < each_value.length; i += 1) {
				transition_in(each_blocks[i]);
			}

			transition_in(tfoot_slot, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(thead_slot, local);
			each_blocks = each_blocks.filter(Boolean);

			for (let i = 0; i < each_blocks.length; i += 1) {
				transition_out(each_blocks[i]);
			}

			transition_out(tfoot_slot, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(table);
			if (thead_slot) thead_slot.d(detaching);
			/*thead_1_binding*/ ctx[10](null);
			destroy_each(each_blocks, detaching);
			if (tfoot_slot) tfoot_slot.d(detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$2.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

const CLASSNAME_TABLE = "tablesort";
const CLASSNAME_SORTABLE = "sortable";
const CLASSNAME_ASC = "ascending";
const CLASSNAME_DESC = "descending";

function instance$1($$self, $$props, $$invalidate) {
	let { items } = $$props;
	let { class: className = "" } = $$props;
	let thead;
	let sortOrder = [[]];

	const sorted = function (arr, sortOrder) {
		arr.sort(build_5(function* (a, b) {
			for (let [fieldName, r] of sortOrder) {
				const reverse = r === 0 ? 1 : -1;

				if (typeof a[fieldName] === "number") {
					yield reverse * build_2(a[fieldName], b[fieldName]);
				} else {
					yield reverse * build_1(a[fieldName], b[fieldName]);
				}
			}
		}));

		return arr;
	};

	function updateSortOrder(th, push) {
		const fieldName = th.dataset.sort;

		if (push) {
			if (sortOrder[sortOrder.length - 1][0] === fieldName) {
				$$invalidate(4, sortOrder[sortOrder.length - 1] = [fieldName, (sortOrder[sortOrder.length - 1][1] + 1) % 2], sortOrder);
			} else {
				$$invalidate(4, sortOrder = [...sortOrder, [fieldName, 0]]);
			}
		} else {
			if (sortOrder.length === 1 && sortOrder[0][0] === fieldName) {
				$$invalidate(4, sortOrder[0] = [fieldName, (sortOrder[0][1] + 1) % 2], sortOrder);
			} else {
				resetClasses();
				$$invalidate(4, sortOrder = [[fieldName, 0]]);
			}
		}

		th.className = CLASSNAME_SORTABLE + " " + (sortOrder[sortOrder.length - 1][1]
		? CLASSNAME_DESC
		: CLASSNAME_ASC);
	}

	function resetClasses() {
		const th = thead.getElementsByTagName("th");

		for (let i = 0; i < th.length; i++) {
			if (th[i].dataset.sort) {
				th[i].className = CLASSNAME_SORTABLE;
			}
		}
	}

	onMount(() => {
		const th = thead.getElementsByTagName("th");

		for (let i = 0; i < th.length; i++) {
			if (th[i].dataset.sort) {
				th[i].className = CLASSNAME_SORTABLE;
				th[i].onclick = event => updateSortOrder(th[i], event.shiftKey);
			}

			if (th[i].dataset.sortInitial === "descending") {
				th[i].className = CLASSNAME_SORTABLE + " " + CLASSNAME_DESC;
				$$invalidate(4, sortOrder = [...sortOrder, [th[i].dataset.sort, 1]]);
			} else if (th[i].dataset.sortInitial != undefined) {
				th[i].className = CLASSNAME_SORTABLE + " " + CLASSNAME_ASC;
				$$invalidate(4, sortOrder = [...sortOrder, [th[i].dataset.sort, 0]]);
			}
		}
	});

	const writable_props = ["items", "class"];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<TableSort> was created with unknown prop '${key}'`);
	});

	let { $$slots = {}, $$scope } = $$props;

	function thead_1_binding($$value) {
		binding_callbacks[$$value ? "unshift" : "push"](() => {
			$$invalidate(1, thead = $$value);
		});
	}

	$$self.$set = $$props => {
		if ("items" in $$props) $$invalidate(3, items = $$props.items);
		if ("class" in $$props) $$invalidate(0, className = $$props.class);
		if ("$$scope" in $$props) $$invalidate(8, $$scope = $$props.$$scope);
	};

	$$self.$capture_state = () => {
		return {
			items,
			className,
			thead,
			sortOrder,
			sortedItems
		};
	};

	$$self.$inject_state = $$props => {
		if ("items" in $$props) $$invalidate(3, items = $$props.items);
		if ("className" in $$props) $$invalidate(0, className = $$props.className);
		if ("thead" in $$props) $$invalidate(1, thead = $$props.thead);
		if ("sortOrder" in $$props) $$invalidate(4, sortOrder = $$props.sortOrder);
		if ("sortedItems" in $$props) $$invalidate(2, sortedItems = $$props.sortedItems);
	};

	let sortedItems;

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*items, sortOrder*/ 24) {
			 $$invalidate(2, sortedItems = sorted([...items], sortOrder));
		}
	};

	return [
		className,
		thead,
		sortedItems,
		items,
		sortOrder,
		sorted,
		updateSortOrder,
		resetClasses,
		$$scope,
		$$slots,
		thead_1_binding
	];
}

class TableSort extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance$1, create_fragment$2, safe_not_equal, { items: 3, class: 0 });

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "TableSort",
			options,
			id: create_fragment$2.name
		});

		const { ctx } = this.$$;
		const props = options.props || {};

		if (/*items*/ ctx[3] === undefined && !("items" in props)) {
			console.warn("<TableSort> was created without expected prop 'items'");
		}
	}

	get items() {
		throw new Error("<TableSort>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set items(value) {
		throw new Error("<TableSort>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get class() {
		throw new Error("<TableSort>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set class(value) {
		throw new Error("<TableSort>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

const TYPE_RATIO = 1.6;

const types = ['normal', 'fighting', 'flying', 'poison', 'ground', 'rock', 'bug', 'ghost', 'steel', 'fire', 'water', 'grass', 'electric', 'psychic', 'ice', 'dragon', 'dark', 'fairy'];

const types_zh = ['普', '鬥', '飛', '毒', '地', '岩', '蟲', '鬼', '鋼', '火', '水', '草', '電', '念', '冰', '龍', '惡', '妖'];

const pvp_eff = [
  {
    type: 'buff',
    value: [5, 6, 7, 8].map(i => fixNum(i / 4)),
  },
  {
    type: 'debuff',
    value: [5, 6, 7, 8].map(i => fixNum(4 / i)),
  },
];

const effAttckTable = [
  [0, 0, 0, 0, 0, -1, 0, -2, -1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [1, 0, -1, -1, 0, 1, -1, -2, 1, 0, 0, 0, 0, -1, 1, 0, 1, -1],
  [0, 1, 0, 0, 0, -1, 1, 0, -1, 0, 0, 1, -1, 0, 0, 0, 0, 0],
  [0, 0, 0, -1, -1, -1, 0, -1, -2, 0, 0, 1, 0, 0, 0, 0, 0, 1],
  [0, 0, -2, 1, 0, 1, -1, 0, 1, 1, 0, -1, 1, 0, 0, 0, 0, 0],
  [0, -1, 1, 0, -1, 0, 1, 0, -1, 1, 0, 0, 0, 0, 1, 0, 0, 0],
  [0, -1, -1, -1, 0, 0, 0, -1, -1, -1, 0, 1, 0, 1, 0, 0, 1, -1],
  [-2, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, -1, 0],
  [0, 0, 0, 0, 0, 1, 0, 0, -1, -1, -1, 0, -1, 0, 1, 0, 0, 1],
  [0, 0, 0, 0, 0, -1, 1, 0, 1, -1, -1, 1, 0, 0, 1, -1, 0, 0],
  [0, 0, 0, 0, 1, 1, 0, 0, 0, 1, -1, -1, 0, 0, 0, -1, 0, 0],
  [0, 0, -1, -1, 1, 1, -1, 0, -1, -1, 1, -1, 0, 0, 0, -1, 0, 0],
  [0, 0, 1, 0, -2, 0, 0, 0, 0, 0, 1, -1, -1, 0, 0, -1, 0, 0],
  [0, 1, 0, 1, 0, 0, 0, 0, -1, 0, 0, 0, 0, -1, 0, 0, -2, 0],
  [0, 0, 1, 0, 1, 0, 0, 0, -1, -1, -1, 1, 0, 0, -1, 1, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, -1, 0, 0, 0, 0, 0, 0, 1, 0, -2],
  [0, -1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, -1, -1],
  [0, 1, 0, -1, 0, 0, 0, 0, -1, -1, 0, 0, 0, 0, 0, 1, 1, 0]
];

let op = types.map(type => ({
  type,
  effs: [[], [], [], []],
}));


effAttckTable.forEach((atk_factors, atk_idx) => {
  atk_factors.forEach((atk_factor, def_idx) => {
    if (atk_factor) {
      op[atk_idx].effs[atk_factor > 0 ? 0 : 1].push({ type: types[def_idx], factor: atk_factor });
      op[def_idx].effs[atk_factor > 0 ? 2 : 3].push({ type: types[atk_idx], factor: atk_factor });
    }
  });
});


function typeIndex(type) {
  return types.findIndex(t => t === type);
}

function queryTypeEffect(atkType, defType1, defType2) {
  if (!defType1 && !defType2) {
    return 1;
  }

  let eff = [
    // uni types
    ...new Set(
      // remove falsy type
      [defType1, defType2].filter(Boolean)
    )
  ]
  .map(typeIndex) // defIndex
  .map(i => effAttckTable[typeIndex(atkType)][i]) // each type effect
  .reduce((all, i) => all + i, 0); // sum

  return Math.pow(TYPE_RATIO, eff);
}

/* ./src/components/Details.html generated by Svelte v3.18.1 */
const file$3 = "./src/components/Details.html";

function create_fragment$3(ctx) {
	let details;
	let details_open_value;
	let current;
	let dispose;
	const default_slot_template = /*$$slots*/ ctx[6].default;
	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[5], null);

	const block = {
		c: function create() {
			details = element("details");
			if (default_slot) default_slot.c();
			details.open = details_open_value = /*$settings*/ ctx[2].details[/*type*/ ctx[0]] || null;
			attr_dev(details, "class", /*className*/ ctx[1]);
			add_location(details, file$3, 18, 0, 336);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, details, anchor);

			if (default_slot) {
				default_slot.m(details, null);
			}

			current = true;
			dispose = listen_dev(details, "toggle", /*toggle*/ ctx[3], false, false, false);
		},
		p: function update(ctx, [dirty]) {
			if (default_slot && default_slot.p && dirty & /*$$scope*/ 32) {
				default_slot.p(get_slot_context(default_slot_template, ctx, /*$$scope*/ ctx[5], null), get_slot_changes(default_slot_template, /*$$scope*/ ctx[5], dirty, null));
			}

			if (!current || dirty & /*$settings, type*/ 5 && details_open_value !== (details_open_value = /*$settings*/ ctx[2].details[/*type*/ ctx[0]] || null)) {
				prop_dev(details, "open", details_open_value);
			}

			if (!current || dirty & /*className*/ 2) {
				attr_dev(details, "class", /*className*/ ctx[1]);
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(default_slot, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(default_slot, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(details);
			if (default_slot) default_slot.d(detaching);
			dispose();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$3.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$2($$self, $$props, $$invalidate) {
	let $settings;
	validate_store(settings, "settings");
	component_subscribe($$self, settings, $$value => $$invalidate(2, $settings = $$value));
	const dispatch = createEventDispatcher();
	let { type } = $$props;
	let { class: className = "" } = $$props;

	function toggle(e) {
		set_store_value(settings, $settings.details[type] = e.target.open, $settings);
		dispatch("toggle", { open: e.target.open });
	}

	const writable_props = ["type", "class"];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Details> was created with unknown prop '${key}'`);
	});

	let { $$slots = {}, $$scope } = $$props;

	$$self.$set = $$props => {
		if ("type" in $$props) $$invalidate(0, type = $$props.type);
		if ("class" in $$props) $$invalidate(1, className = $$props.class);
		if ("$$scope" in $$props) $$invalidate(5, $$scope = $$props.$$scope);
	};

	$$self.$capture_state = () => {
		return { type, className, $settings };
	};

	$$self.$inject_state = $$props => {
		if ("type" in $$props) $$invalidate(0, type = $$props.type);
		if ("className" in $$props) $$invalidate(1, className = $$props.className);
		if ("$settings" in $$props) settings.set($settings = $$props.$settings);
	};

	return [type, className, $settings, toggle, dispatch, $$scope, $$slots];
}

class Details extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance$2, create_fragment$3, safe_not_equal, { type: 0, class: 1 });

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Details",
			options,
			id: create_fragment$3.name
		});

		const { ctx } = this.$$;
		const props = options.props || {};

		if (/*type*/ ctx[0] === undefined && !("type" in props)) {
			console.warn("<Details> was created without expected prop 'type'");
		}
	}

	get type() {
		throw new Error("<Details>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set type(value) {
		throw new Error("<Details>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get class() {
		throw new Error("<Details>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set class(value) {
		throw new Error("<Details>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* ./src/components/TypeIcon.html generated by Svelte v3.18.1 */

const { console: console_1 } = globals;
const file$4 = "./src/components/TypeIcon.html";

function create_fragment$4(ctx) {
	let div;
	let div_class_value;
	let dispose;

	const block = {
		c: function create() {
			div = element("div");
			attr_dev(div, "class", div_class_value = "type-icon " + /*className*/ ctx[0]);
			attr_dev(div, "data-type", /*type*/ ctx[1]);
			attr_dev(div, "title", /*type*/ ctx[1]);
			add_location(div, file$4, 16, 0, 253);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);

			dispose = listen_dev(
				div,
				"click",
				function () {
					if (is_function(/*click*/ ctx[2](/*type*/ ctx[1]))) /*click*/ ctx[2](/*type*/ ctx[1]).apply(this, arguments);
				},
				false,
				false,
				false
			);
		},
		p: function update(new_ctx, [dirty]) {
			ctx = new_ctx;

			if (dirty & /*className*/ 1 && div_class_value !== (div_class_value = "type-icon " + /*className*/ ctx[0])) {
				attr_dev(div, "class", div_class_value);
			}

			if (dirty & /*type*/ 2) {
				attr_dev(div, "data-type", /*type*/ ctx[1]);
			}

			if (dirty & /*type*/ 2) {
				attr_dev(div, "title", /*type*/ ctx[1]);
			}
		},
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			dispose();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$4.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$3($$self, $$props, $$invalidate) {
	let $typeTarget;
	validate_store(typeTarget, "typeTarget");
	component_subscribe($$self, typeTarget, $$value => $$invalidate(3, $typeTarget = $$value));
	let { class: className = "" } = $$props;
	let { type } = $$props;

	let { click = type => e => {
		console.log("click type", type);
		e.preventDefault();
		set_store_value(typeTarget, $typeTarget = type);
	} } = $$props;

	const writable_props = ["class", "type", "click"];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1.warn(`<TypeIcon> was created with unknown prop '${key}'`);
	});

	$$self.$set = $$props => {
		if ("class" in $$props) $$invalidate(0, className = $$props.class);
		if ("type" in $$props) $$invalidate(1, type = $$props.type);
		if ("click" in $$props) $$invalidate(2, click = $$props.click);
	};

	$$self.$capture_state = () => {
		return { className, type, click, $typeTarget };
	};

	$$self.$inject_state = $$props => {
		if ("className" in $$props) $$invalidate(0, className = $$props.className);
		if ("type" in $$props) $$invalidate(1, type = $$props.type);
		if ("click" in $$props) $$invalidate(2, click = $$props.click);
		if ("$typeTarget" in $$props) typeTarget.set($typeTarget = $$props.$typeTarget);
	};

	return [className, type, click];
}

class TypeIcon extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance$3, create_fragment$4, safe_not_equal, { class: 0, type: 1, click: 2 });

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "TypeIcon",
			options,
			id: create_fragment$4.name
		});

		const { ctx } = this.$$;
		const props = options.props || {};

		if (/*type*/ ctx[1] === undefined && !("type" in props)) {
			console_1.warn("<TypeIcon> was created without expected prop 'type'");
		}
	}

	get class() {
		throw new Error("<TypeIcon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set class(value) {
		throw new Error("<TypeIcon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get type() {
		throw new Error("<TypeIcon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set type(value) {
		throw new Error("<TypeIcon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get click() {
		throw new Error("<TypeIcon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set click(value) {
		throw new Error("<TypeIcon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* ./src/components/MoveChart.html generated by Svelte v3.18.1 */
const file$5 = "./src/components/MoveChart.html";

function get_each_context$2(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[3] = list[i];
	return child_ctx;
}

function get_each_context_1$1(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[3] = list[i];
	return child_ctx;
}

// (74:8) {#each moves.fast as m}
function create_each_block_1$1(ctx) {
	let a;
	let t0;
	let span;
	let t1_value = /*m*/ ctx[3].name + "";
	let t1;
	let sup;
	let t2_value = (/*m*/ ctx[3].turn || "") + "";
	let t2;
	let t3;
	let a_href_value;
	let current;

	const typeicon = new TypeIcon({
			props: { type: /*m*/ ctx[3].type },
			$$inline: true
		});

	const block = {
		c: function create() {
			a = element("a");
			create_component(typeicon.$$.fragment);
			t0 = space();
			span = element("span");
			t1 = text(t1_value);
			sup = element("sup");
			t2 = text(t2_value);
			t3 = space();
			add_location(sup, file$5, 85, 22, 1987);
			attr_dev(span, "class", "text svelte-n0t6gr");
			add_location(span, file$5, 84, 12, 1945);
			attr_dev(a, "class", "chart-dot text-nowrap text-no-decoration svelte-n0t6gr");
			attr_dev(a, "href", a_href_value = "./move/" + /*m*/ ctx[3].moveId);
			set_style(a, "--pve_dps", /*m*/ ctx[3].pve_dps);
			set_style(a, "--pve_eps", /*m*/ ctx[3].pve_eps);
			set_style(a, "--dpt", /*m*/ ctx[3].dpt);
			set_style(a, "--ept", /*m*/ ctx[3].ept);
			add_location(a, file$5, 74, 10, 1623);
		},
		m: function mount(target, anchor) {
			insert_dev(target, a, anchor);
			mount_component(typeicon, a, null);
			append_dev(a, t0);
			append_dev(a, span);
			append_dev(span, t1);
			append_dev(span, sup);
			append_dev(sup, t2);
			append_dev(a, t3);
			current = true;
		},
		p: function update(ctx, dirty) {
			const typeicon_changes = {};
			if (dirty & /*moves*/ 1) typeicon_changes.type = /*m*/ ctx[3].type;
			typeicon.$set(typeicon_changes);
			if ((!current || dirty & /*moves*/ 1) && t1_value !== (t1_value = /*m*/ ctx[3].name + "")) set_data_dev(t1, t1_value);
			if ((!current || dirty & /*moves*/ 1) && t2_value !== (t2_value = (/*m*/ ctx[3].turn || "") + "")) set_data_dev(t2, t2_value);

			if (!current || dirty & /*moves*/ 1 && a_href_value !== (a_href_value = "./move/" + /*m*/ ctx[3].moveId)) {
				attr_dev(a, "href", a_href_value);
			}

			if (!current || dirty & /*moves*/ 1) {
				set_style(a, "--pve_dps", /*m*/ ctx[3].pve_dps);
			}

			if (!current || dirty & /*moves*/ 1) {
				set_style(a, "--pve_eps", /*m*/ ctx[3].pve_eps);
			}

			if (!current || dirty & /*moves*/ 1) {
				set_style(a, "--dpt", /*m*/ ctx[3].dpt);
			}

			if (!current || dirty & /*moves*/ 1) {
				set_style(a, "--ept", /*m*/ ctx[3].ept);
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(typeicon.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(typeicon.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(a);
			destroy_component(typeicon);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block_1$1.name,
		type: "each",
		source: "(74:8) {#each moves.fast as m}",
		ctx
	});

	return block;
}

// (107:8) {#each moves.charge as m}
function create_each_block$2(ctx) {
	let a;
	let t0;
	let span;
	let t1_value = /*m*/ ctx[3].name + "";
	let t1;
	let t2;
	let a_href_value;
	let current;

	const typeicon = new TypeIcon({
			props: { type: /*m*/ ctx[3].type },
			$$inline: true
		});

	const block = {
		c: function create() {
			a = element("a");
			create_component(typeicon.$$.fragment);
			t0 = space();
			span = element("span");
			t1 = text(t1_value);
			t2 = space();
			attr_dev(span, "class", "text svelte-n0t6gr");
			add_location(span, file$5, 117, 12, 2897);
			attr_dev(a, "class", "chart-dot text-nowrap text-no-decoration svelte-n0t6gr");
			attr_dev(a, "href", a_href_value = "./move/" + /*m*/ ctx[3].moveId);
			set_style(a, "--pve_dps", /*m*/ ctx[3].pve_dps);
			set_style(a, "--pve_dpe", /*m*/ ctx[3].pve_dpe);
			set_style(a, "--dpe", /*m*/ ctx[3].dpe);
			set_style(a, "--energy", /*m*/ ctx[3].energy);
			add_location(a, file$5, 107, 10, 2569);
		},
		m: function mount(target, anchor) {
			insert_dev(target, a, anchor);
			mount_component(typeicon, a, null);
			append_dev(a, t0);
			append_dev(a, span);
			append_dev(span, t1);
			append_dev(a, t2);
			current = true;
		},
		p: function update(ctx, dirty) {
			const typeicon_changes = {};
			if (dirty & /*moves*/ 1) typeicon_changes.type = /*m*/ ctx[3].type;
			typeicon.$set(typeicon_changes);
			if ((!current || dirty & /*moves*/ 1) && t1_value !== (t1_value = /*m*/ ctx[3].name + "")) set_data_dev(t1, t1_value);

			if (!current || dirty & /*moves*/ 1 && a_href_value !== (a_href_value = "./move/" + /*m*/ ctx[3].moveId)) {
				attr_dev(a, "href", a_href_value);
			}

			if (!current || dirty & /*moves*/ 1) {
				set_style(a, "--pve_dps", /*m*/ ctx[3].pve_dps);
			}

			if (!current || dirty & /*moves*/ 1) {
				set_style(a, "--pve_dpe", /*m*/ ctx[3].pve_dpe);
			}

			if (!current || dirty & /*moves*/ 1) {
				set_style(a, "--dpe", /*m*/ ctx[3].dpe);
			}

			if (!current || dirty & /*moves*/ 1) {
				set_style(a, "--energy", /*m*/ ctx[3].energy);
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(typeicon.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(typeicon.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(a);
			destroy_component(typeicon);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block$2.name,
		type: "each",
		source: "(107:8) {#each moves.charge as m}",
		ctx
	});

	return block;
}

// (60:0) <Details type="movechart" class="card">
function create_default_slot(ctx) {
	let summary0;
	let h30;
	let t1;
	let div2;
	let details0;
	let summary1;
	let h31;
	let t3;
	let div0;
	let div0_data_x_value;
	let div0_data_y_value;
	let t4;
	let hr;
	let t5;
	let details1;
	let summary2;
	let h32;
	let t7;
	let div1;
	let div1_data_x_value;
	let div1_data_y_value;
	let t8;
	let blockquote;
	let t9;
	let a;
	let cite;
	let current;
	let each_value_1 = /*moves*/ ctx[0].fast;
	let each_blocks_1 = [];

	for (let i = 0; i < each_value_1.length; i += 1) {
		each_blocks_1[i] = create_each_block_1$1(get_each_context_1$1(ctx, each_value_1, i));
	}

	const out = i => transition_out(each_blocks_1[i], 1, 1, () => {
		each_blocks_1[i] = null;
	});

	let each_value = /*moves*/ ctx[0].charge;
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
	}

	const out_1 = i => transition_out(each_blocks[i], 1, 1, () => {
		each_blocks[i] = null;
	});

	const block = {
		c: function create() {
			summary0 = element("summary");
			h30 = element("h3");
			h30.textContent = "Chart";
			t1 = space();
			div2 = element("div");
			details0 = element("details");
			summary1 = element("summary");
			h31 = element("h3");
			h31.textContent = "FAST";
			t3 = space();
			div0 = element("div");

			for (let i = 0; i < each_blocks_1.length; i += 1) {
				each_blocks_1[i].c();
			}

			t4 = space();
			hr = element("hr");
			t5 = space();
			details1 = element("details");
			summary2 = element("summary");
			h32 = element("h3");
			h32.textContent = "CHARGE";
			t7 = space();
			div1 = element("div");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			t8 = space();
			blockquote = element("blockquote");
			t9 = text("inspired from:\n      ");
			a = element("a");
			cite = element("cite");
			cite.textContent = "https://redd.it/btxqh9";
			add_location(h30, file$5, 60, 11, 1189);
			add_location(summary0, file$5, 60, 2, 1180);
			add_location(h31, file$5, 64, 15, 1257);
			add_location(summary1, file$5, 64, 6, 1248);
			attr_dev(div0, "class", "chart fast pos-r svelte-n0t6gr");
			attr_dev(div0, "data-x", div0_data_x_value = /*ispve*/ ctx[1] ? "DPS" : "DPT");
			attr_dev(div0, "data-y", div0_data_y_value = /*ispve*/ ctx[1] ? "EPS" : "EPT");

			set_style(div0, "--max-x", /*ispve*/ ctx[1]
			? /*max*/ ctx[2].fast.pve_dps
			: /*max*/ ctx[2].fast.pvp_dpt);

			set_style(div0, "--max-y", /*ispve*/ ctx[1]
			? /*max*/ ctx[2].fast.pve_eps
			: /*max*/ ctx[2].fast.pvp_ept);

			toggle_class(div0, "ispve", /*ispve*/ ctx[1]);
			add_location(div0, file$5, 65, 6, 1287);
			details0.open = true;
			add_location(details0, file$5, 63, 4, 1227);
			add_location(hr, file$5, 92, 4, 2097);
			add_location(h32, file$5, 95, 15, 2137);
			add_location(summary2, file$5, 95, 6, 2128);
			attr_dev(div1, "class", "chart charge pos-r svelte-n0t6gr");
			attr_dev(div1, "data-x", div1_data_x_value = /*ispve*/ ctx[1] ? "DPS" : "DPE");
			attr_dev(div1, "data-y", div1_data_y_value = /*ispve*/ ctx[1] ? "DPE" : "ENERGY");

			set_style(div1, "--max-x", /*ispve*/ ctx[1]
			? /*max*/ ctx[2].charge.pve_dps
			: /*max*/ ctx[2].charge.pvp_dpe);

			set_style(div1, "--max-y", /*ispve*/ ctx[1]
			? /*max*/ ctx[2].charge.pve_dpe
			: /*max*/ ctx[2].charge.pvp_energy);

			set_style(div1, "--d", /*ispve*/ ctx[1] ? "135deg" : "45deg");
			toggle_class(div1, "ispve", /*ispve*/ ctx[1]);
			add_location(div1, file$5, 97, 6, 2170);
			details1.open = true;
			add_location(details1, file$5, 94, 4, 2107);
			add_location(cite, file$5, 129, 8, 3192);
			attr_dev(a, "href", "https://www.reddit.com/r/TheSilphRoad/comments/btxqh9/pvp_fast_moves_update_28th_may_now_including/.compact");
			add_location(a, file$5, 128, 6, 3065);
			add_location(blockquote, file$5, 126, 4, 3025);
			add_location(div2, file$5, 62, 2, 1217);
		},
		m: function mount(target, anchor) {
			insert_dev(target, summary0, anchor);
			append_dev(summary0, h30);
			insert_dev(target, t1, anchor);
			insert_dev(target, div2, anchor);
			append_dev(div2, details0);
			append_dev(details0, summary1);
			append_dev(summary1, h31);
			append_dev(details0, t3);
			append_dev(details0, div0);

			for (let i = 0; i < each_blocks_1.length; i += 1) {
				each_blocks_1[i].m(div0, null);
			}

			append_dev(div2, t4);
			append_dev(div2, hr);
			append_dev(div2, t5);
			append_dev(div2, details1);
			append_dev(details1, summary2);
			append_dev(summary2, h32);
			append_dev(details1, t7);
			append_dev(details1, div1);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(div1, null);
			}

			append_dev(div2, t8);
			append_dev(div2, blockquote);
			append_dev(blockquote, t9);
			append_dev(blockquote, a);
			append_dev(a, cite);
			current = true;
		},
		p: function update(ctx, dirty) {
			if (dirty & /*moves*/ 1) {
				each_value_1 = /*moves*/ ctx[0].fast;
				let i;

				for (i = 0; i < each_value_1.length; i += 1) {
					const child_ctx = get_each_context_1$1(ctx, each_value_1, i);

					if (each_blocks_1[i]) {
						each_blocks_1[i].p(child_ctx, dirty);
						transition_in(each_blocks_1[i], 1);
					} else {
						each_blocks_1[i] = create_each_block_1$1(child_ctx);
						each_blocks_1[i].c();
						transition_in(each_blocks_1[i], 1);
						each_blocks_1[i].m(div0, null);
					}
				}

				group_outros();

				for (i = each_value_1.length; i < each_blocks_1.length; i += 1) {
					out(i);
				}

				check_outros();
			}

			if (!current || dirty & /*ispve*/ 2 && div0_data_x_value !== (div0_data_x_value = /*ispve*/ ctx[1] ? "DPS" : "DPT")) {
				attr_dev(div0, "data-x", div0_data_x_value);
			}

			if (!current || dirty & /*ispve*/ 2 && div0_data_y_value !== (div0_data_y_value = /*ispve*/ ctx[1] ? "EPS" : "EPT")) {
				attr_dev(div0, "data-y", div0_data_y_value);
			}

			if (!current || dirty & /*ispve, max*/ 6) {
				set_style(div0, "--max-x", /*ispve*/ ctx[1]
				? /*max*/ ctx[2].fast.pve_dps
				: /*max*/ ctx[2].fast.pvp_dpt);
			}

			if (!current || dirty & /*ispve, max*/ 6) {
				set_style(div0, "--max-y", /*ispve*/ ctx[1]
				? /*max*/ ctx[2].fast.pve_eps
				: /*max*/ ctx[2].fast.pvp_ept);
			}

			if (dirty & /*ispve*/ 2) {
				toggle_class(div0, "ispve", /*ispve*/ ctx[1]);
			}

			if (dirty & /*moves*/ 1) {
				each_value = /*moves*/ ctx[0].charge;
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context$2(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
						transition_in(each_blocks[i], 1);
					} else {
						each_blocks[i] = create_each_block$2(child_ctx);
						each_blocks[i].c();
						transition_in(each_blocks[i], 1);
						each_blocks[i].m(div1, null);
					}
				}

				group_outros();

				for (i = each_value.length; i < each_blocks.length; i += 1) {
					out_1(i);
				}

				check_outros();
			}

			if (!current || dirty & /*ispve*/ 2 && div1_data_x_value !== (div1_data_x_value = /*ispve*/ ctx[1] ? "DPS" : "DPE")) {
				attr_dev(div1, "data-x", div1_data_x_value);
			}

			if (!current || dirty & /*ispve*/ 2 && div1_data_y_value !== (div1_data_y_value = /*ispve*/ ctx[1] ? "DPE" : "ENERGY")) {
				attr_dev(div1, "data-y", div1_data_y_value);
			}

			if (!current || dirty & /*ispve, max*/ 6) {
				set_style(div1, "--max-x", /*ispve*/ ctx[1]
				? /*max*/ ctx[2].charge.pve_dps
				: /*max*/ ctx[2].charge.pvp_dpe);
			}

			if (!current || dirty & /*ispve, max*/ 6) {
				set_style(div1, "--max-y", /*ispve*/ ctx[1]
				? /*max*/ ctx[2].charge.pve_dpe
				: /*max*/ ctx[2].charge.pvp_energy);
			}

			if (!current || dirty & /*ispve*/ 2) {
				set_style(div1, "--d", /*ispve*/ ctx[1] ? "135deg" : "45deg");
			}

			if (dirty & /*ispve*/ 2) {
				toggle_class(div1, "ispve", /*ispve*/ ctx[1]);
			}
		},
		i: function intro(local) {
			if (current) return;

			for (let i = 0; i < each_value_1.length; i += 1) {
				transition_in(each_blocks_1[i]);
			}

			for (let i = 0; i < each_value.length; i += 1) {
				transition_in(each_blocks[i]);
			}

			current = true;
		},
		o: function outro(local) {
			each_blocks_1 = each_blocks_1.filter(Boolean);

			for (let i = 0; i < each_blocks_1.length; i += 1) {
				transition_out(each_blocks_1[i]);
			}

			each_blocks = each_blocks.filter(Boolean);

			for (let i = 0; i < each_blocks.length; i += 1) {
				transition_out(each_blocks[i]);
			}

			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(summary0);
			if (detaching) detach_dev(t1);
			if (detaching) detach_dev(div2);
			destroy_each(each_blocks_1, detaching);
			destroy_each(each_blocks, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot.name,
		type: "slot",
		source: "(60:0) <Details type=\\\"movechart\\\" class=\\\"card\\\">",
		ctx
	});

	return block;
}

function create_fragment$5(ctx) {
	let current;

	const details = new Details({
			props: {
				type: "movechart",
				class: "card",
				$$slots: { default: [create_default_slot] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	const block = {
		c: function create() {
			create_component(details.$$.fragment);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			mount_component(details, target, anchor);
			current = true;
		},
		p: function update(ctx, [dirty]) {
			const details_changes = {};

			if (dirty & /*$$scope, ispve, max, moves*/ 263) {
				details_changes.$$scope = { dirty, ctx };
			}

			details.$set(details_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(details.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(details.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(details, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$5.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$4($$self, $$props, $$invalidate) {
	let { moves = {} } = $$props;
	let { ispve = false } = $$props;
	let max = {};
	
	const writable_props = ["moves", "ispve"];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<MoveChart> was created with unknown prop '${key}'`);
	});

	$$self.$set = $$props => {
		if ("moves" in $$props) $$invalidate(0, moves = $$props.moves);
		if ("ispve" in $$props) $$invalidate(1, ispve = $$props.ispve);
	};

	$$self.$capture_state = () => {
		return { moves, ispve, max };
	};

	$$self.$inject_state = $$props => {
		if ("moves" in $$props) $$invalidate(0, moves = $$props.moves);
		if ("ispve" in $$props) $$invalidate(1, ispve = $$props.ispve);
		if ("max" in $$props) $$invalidate(2, max = $$props.max);
	};

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*moves, max*/ 5) {
			 {
				$$invalidate(2, max = ["fast", "charge"].reduce(
					(ooo, type) => {
						ooo[type] = moves[type].reduce(
							(oi, m) => {
								if (type === "fast") {
									oi.pve_dps.push(m.pve_dps);
									oi.pve_eps.push(m.pve_eps);
									oi.pvp_dpt.push(m.dpt);
									oi.pvp_ept.push(m.ept);
								} else {
									oi.pve_dps.push(m.pve_dps);
									oi.pve_dpe.push(m.pve_dpe);
									oi.pvp_dpe.push(m.dpe);
									oi.pvp_energy.push(m.energy);
								}

								return oi;
							},
							{
								// fast
								pve_dps: [],
								pve_eps: [],
								pvp_dpt: [],
								pvp_ept: [],
								// charge
								pve_dps: [],
								pve_dpe: [],
								pvp_dpe: [],
								pvp_energy: []
							}
						);

						return ooo;
					},
					{}
				));

				let sort = (a, b) => {
					return b - a;
				};

				for (let i in max) {
					for (let j in max[i]) {
						if (max[i][j].length) {
							$$invalidate(2, max[i][j] = max[i][j].sort(sort)[0], max);
						}
					}
				}
			}
		}
	};

	return [moves, ispve, max];
}

class MoveChart extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance$4, create_fragment$5, safe_not_equal, { moves: 0, ispve: 1 });

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "MoveChart",
			options,
			id: create_fragment$5.name
		});
	}

	get moves() {
		throw new Error("<MoveChart>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set moves(value) {
		throw new Error("<MoveChart>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get ispve() {
		throw new Error("<MoveChart>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set ispve(value) {
		throw new Error("<MoveChart>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* ./src/components/TypeFilter.html generated by Svelte v3.18.1 */
const file$6 = "./src/components/TypeFilter.html";

function get_each_context$3(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[5] = list[i];
	child_ctx[7] = i;
	return child_ctx;
}

// (22:2) {#each eff as eff_item, index}
function create_each_block$3(ctx) {
	let div;
	let t0;
	let a;
	let small;
	let t1_value = types_zh[/*index*/ ctx[7]] + "";
	let t1;
	let a_href_value;
	let t2;
	let current;
	let dispose;

	const typeicon = new TypeIcon({
			props: {
				type: /*eff_item*/ ctx[5].type,
				class: /*eff_item*/ ctx[5].type === /*type*/ ctx[0]
				? "filter-icon active"
				: "filter-icon",
				click: /*_clickType*/ ctx[2].bind(/*eff_item*/ ctx[5].type)
			},
			$$inline: true
		});

	const block = {
		c: function create() {
			div = element("div");
			create_component(typeicon.$$.fragment);
			t0 = space();
			a = element("a");
			small = element("small");
			t1 = text(t1_value);
			t2 = space();
			attr_dev(small, "class", "title svelte-7wvapr");
			add_location(small, file$6, 32, 8, 771);
			attr_dev(a, "class", "text-no-decoration");
			attr_dev(a, "href", a_href_value = "./" + /*route*/ ctx[1] + "#" + /*eff_item*/ ctx[5].type);
			add_location(a, file$6, 28, 6, 652);
			attr_dev(div, "class", "mb-2 text-center");
			add_location(div, file$6, 22, 4, 446);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			mount_component(typeicon, div, null);
			append_dev(div, t0);
			append_dev(div, a);
			append_dev(a, small);
			append_dev(small, t1);
			append_dev(div, t2);
			current = true;
			dispose = listen_dev(a, "click", prevent_default(/*click_handler*/ ctx[4]), false, true, false);
		},
		p: function update(ctx, dirty) {
			const typeicon_changes = {};

			if (dirty & /*type*/ 1) typeicon_changes.class = /*eff_item*/ ctx[5].type === /*type*/ ctx[0]
			? "filter-icon active"
			: "filter-icon";

			typeicon.$set(typeicon_changes);

			if (!current || dirty & /*route*/ 2 && a_href_value !== (a_href_value = "./" + /*route*/ ctx[1] + "#" + /*eff_item*/ ctx[5].type)) {
				attr_dev(a, "href", a_href_value);
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(typeicon.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(typeicon.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			destroy_component(typeicon);
			dispose();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block$3.name,
		type: "each",
		source: "(22:2) {#each eff as eff_item, index}",
		ctx
	});

	return block;
}

function create_fragment$6(ctx) {
	let div;
	let current;
	let each_value = op;
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block$3(get_each_context$3(ctx, each_value, i));
	}

	const out = i => transition_out(each_blocks[i], 1, 1, () => {
		each_blocks[i] = null;
	});

	const block = {
		c: function create() {
			div = element("div");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			attr_dev(div, "class", "df fxw-w jc-c filter-icons svelte-7wvapr");
			add_location(div, file$6, 20, 0, 368);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(div, null);
			}

			current = true;
		},
		p: function update(ctx, [dirty]) {
			if (dirty & /*route, eff, types_zh, type, _clickType*/ 7) {
				each_value = op;
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context$3(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
						transition_in(each_blocks[i], 1);
					} else {
						each_blocks[i] = create_each_block$3(child_ctx);
						each_blocks[i].c();
						transition_in(each_blocks[i], 1);
						each_blocks[i].m(div, null);
					}
				}

				group_outros();

				for (i = each_value.length; i < each_blocks.length; i += 1) {
					out(i);
				}

				check_outros();
			}
		},
		i: function intro(local) {
			if (current) return;

			for (let i = 0; i < each_value.length; i += 1) {
				transition_in(each_blocks[i]);
			}

			current = true;
		},
		o: function outro(local) {
			each_blocks = each_blocks.filter(Boolean);

			for (let i = 0; i < each_blocks.length; i += 1) {
				transition_out(each_blocks[i]);
			}

			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			destroy_each(each_blocks, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$6.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$5($$self, $$props, $$invalidate) {
	const dispatch = createEventDispatcher();
	let { type } = $$props;
	let { route = "" } = $$props;

	function _clickType(_type) {
		dispatch("clicktype", { type: _type });
	}

	
	const writable_props = ["type", "route"];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<TypeFilter> was created with unknown prop '${key}'`);
	});

	function click_handler(event) {
		bubble($$self, event);
	}

	$$self.$set = $$props => {
		if ("type" in $$props) $$invalidate(0, type = $$props.type);
		if ("route" in $$props) $$invalidate(1, route = $$props.route);
	};

	$$self.$capture_state = () => {
		return { type, route };
	};

	$$self.$inject_state = $$props => {
		if ("type" in $$props) $$invalidate(0, type = $$props.type);
		if ("route" in $$props) $$invalidate(1, route = $$props.route);
	};

	return [type, route, _clickType, dispatch, click_handler];
}

class TypeFilter extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance$5, create_fragment$6, safe_not_equal, { type: 0, route: 1 });

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "TypeFilter",
			options,
			id: create_fragment$6.name
		});

		const { ctx } = this.$$;
		const props = options.props || {};

		if (/*type*/ ctx[0] === undefined && !("type" in props)) {
			console.warn("<TypeFilter> was created without expected prop 'type'");
		}
	}

	get type() {
		throw new Error("<TypeFilter>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set type(value) {
		throw new Error("<TypeFilter>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get route() {
		throw new Error("<TypeFilter>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set route(value) {
		throw new Error("<TypeFilter>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* ./src/components/Switcher.html generated by Svelte v3.18.1 */
const file$7 = "./src/components/Switcher.html";

function create_fragment$7(ctx) {
	let div1;
	let label;
	let input;
	let t0;
	let span0;
	let t1;
	let div0;
	let span1;
	let t3;
	let span2;
	let dispose;

	const block = {
		c: function create() {
			div1 = element("div");
			label = element("label");
			input = element("input");
			t0 = space();
			span0 = element("span");
			t1 = space();
			div0 = element("div");
			span1 = element("span");
			span1.textContent = "PVP";
			t3 = space();
			span2 = element("span");
			span2.textContent = "PVE";
			attr_dev(input, "class", "switcher-input hidden-checkbox");
			attr_dev(input, "type", "checkbox");
			add_location(input, file$7, 7, 4, 161);
			attr_dev(span0, "class", "switcher-icon ml-2 mr-2 svelte-1dpnw4f");
			add_location(span0, file$7, 8, 4, 263);
			attr_dev(span1, "class", "switcher-text");
			add_location(span1, file$7, 10, 6, 338);
			attr_dev(span2, "class", "switcher-text");
			add_location(span2, file$7, 11, 6, 383);
			attr_dev(div0, "class", "pt-2");
			add_location(div0, file$7, 9, 4, 313);
			attr_dev(label, "class", "switcher df jc-c fxw-w mb-2 mt-2 ml-a mr-a svelte-1dpnw4f");
			add_location(label, file$7, 6, 2, 98);
			attr_dev(div1, "class", "card card-switcher svelte-1dpnw4f");
			add_location(div1, file$7, 5, 0, 63);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, div1, anchor);
			append_dev(div1, label);
			append_dev(label, input);
			input.checked = /*$settings*/ ctx[0].io.ispve;
			append_dev(label, t0);
			append_dev(label, span0);
			append_dev(label, t1);
			append_dev(label, div0);
			append_dev(div0, span1);
			append_dev(div0, t3);
			append_dev(div0, span2);
			dispose = listen_dev(input, "change", /*input_change_handler*/ ctx[1]);
		},
		p: function update(ctx, [dirty]) {
			if (dirty & /*$settings*/ 1) {
				input.checked = /*$settings*/ ctx[0].io.ispve;
			}
		},
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(div1);
			dispose();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$7.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$6($$self, $$props, $$invalidate) {
	let $settings;
	validate_store(settings, "settings");
	component_subscribe($$self, settings, $$value => $$invalidate(0, $settings = $$value));

	function input_change_handler() {
		$settings.io.ispve = this.checked;
		settings.set($settings);
	}

	$$self.$capture_state = () => {
		return {};
	};

	$$self.$inject_state = $$props => {
		if ("$settings" in $$props) settings.set($settings = $$props.$settings);
	};

	return [$settings, input_change_handler];
}

class Switcher extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance$6, create_fragment$7, safe_not_equal, {});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Switcher",
			options,
			id: create_fragment$7.name
		});
	}
}

/* ./src/components/Ruby.html generated by Svelte v3.18.1 */

const file$8 = "./src/components/Ruby.html";
const get_rt_slot_changes = dirty => ({});
const get_rt_slot_context = ctx => ({});
const get_rb_slot_changes = dirty => ({});
const get_rb_slot_context = ctx => ({});

function create_fragment$8(ctx) {
	let div1;
	let t;
	let div0;
	let div1_class_value;
	let current;
	const rb_slot_template = /*$$slots*/ ctx[2].rb;
	const rb_slot = create_slot(rb_slot_template, ctx, /*$$scope*/ ctx[1], get_rb_slot_context);
	const rt_slot_template = /*$$slots*/ ctx[2].rt;
	const rt_slot = create_slot(rt_slot_template, ctx, /*$$scope*/ ctx[1], get_rt_slot_context);

	const block = {
		c: function create() {
			div1 = element("div");
			if (rb_slot) rb_slot.c();
			t = space();
			div0 = element("div");
			if (rt_slot) rt_slot.c();
			attr_dev(div0, "class", "rt svelte-1rubdd8");
			add_location(div0, file$8, 10, 2, 149);
			attr_dev(div1, "class", div1_class_value = "" + (null_to_empty(/*className*/ ctx[0]) + " svelte-1rubdd8"));
			add_location(div1, file$8, 8, 0, 102);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, div1, anchor);

			if (rb_slot) {
				rb_slot.m(div1, null);
			}

			append_dev(div1, t);
			append_dev(div1, div0);

			if (rt_slot) {
				rt_slot.m(div0, null);
			}

			current = true;
		},
		p: function update(ctx, [dirty]) {
			if (rb_slot && rb_slot.p && dirty & /*$$scope*/ 2) {
				rb_slot.p(get_slot_context(rb_slot_template, ctx, /*$$scope*/ ctx[1], get_rb_slot_context), get_slot_changes(rb_slot_template, /*$$scope*/ ctx[1], dirty, get_rb_slot_changes));
			}

			if (rt_slot && rt_slot.p && dirty & /*$$scope*/ 2) {
				rt_slot.p(get_slot_context(rt_slot_template, ctx, /*$$scope*/ ctx[1], get_rt_slot_context), get_slot_changes(rt_slot_template, /*$$scope*/ ctx[1], dirty, get_rt_slot_changes));
			}

			if (!current || dirty & /*className*/ 1 && div1_class_value !== (div1_class_value = "" + (null_to_empty(/*className*/ ctx[0]) + " svelte-1rubdd8"))) {
				attr_dev(div1, "class", div1_class_value);
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(rb_slot, local);
			transition_in(rt_slot, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(rb_slot, local);
			transition_out(rt_slot, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div1);
			if (rb_slot) rb_slot.d(detaching);
			if (rt_slot) rt_slot.d(detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$8.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$7($$self, $$props, $$invalidate) {
	let { class: className = "df fd-c ai-c text-center" } = $$props;
	const writable_props = ["class"];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Ruby> was created with unknown prop '${key}'`);
	});

	let { $$slots = {}, $$scope } = $$props;

	$$self.$set = $$props => {
		if ("class" in $$props) $$invalidate(0, className = $$props.class);
		if ("$$scope" in $$props) $$invalidate(1, $$scope = $$props.$$scope);
	};

	$$self.$capture_state = () => {
		return { className };
	};

	$$self.$inject_state = $$props => {
		if ("className" in $$props) $$invalidate(0, className = $$props.className);
	};

	return [className, $$scope, $$slots];
}

class Ruby extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance$7, create_fragment$8, safe_not_equal, { class: 0 });

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Ruby",
			options,
			id: create_fragment$8.name
		});
	}

	get class() {
		throw new Error("<Ruby>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set class(value) {
		throw new Error("<Ruby>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* ./src/routes/MoveList.html generated by Svelte v3.18.1 */
const file$9 = "./src/routes/MoveList.html";

// (60:2) <Details type="move_filter" class="card">
function create_default_slot_6(ctx) {
	let summary;
	let h3;
	let t1;
	let current;

	const typefilter = new TypeFilter({
			props: { type: /*type*/ ctx[1], route: "move" },
			$$inline: true
		});

	typefilter.$on("clicktype", /*clicktype*/ ctx[3]);

	const block = {
		c: function create() {
			summary = element("summary");
			h3 = element("h3");
			h3.textContent = "Filter";
			t1 = space();
			create_component(typefilter.$$.fragment);
			add_location(h3, file$9, 60, 13, 1333);
			add_location(summary, file$9, 60, 4, 1324);
		},
		m: function mount(target, anchor) {
			insert_dev(target, summary, anchor);
			append_dev(summary, h3);
			insert_dev(target, t1, anchor);
			mount_component(typefilter, target, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
			const typefilter_changes = {};
			if (dirty & /*type*/ 2) typefilter_changes.type = /*type*/ ctx[1];
			typefilter.$set(typefilter_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(typefilter.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(typefilter.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(summary);
			if (detaching) detach_dev(t1);
			destroy_component(typefilter, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot_6.name,
		type: "slot",
		source: "(60:2) <Details type=\\\"move_filter\\\" class=\\\"card\\\">",
		ctx
	});

	return block;
}

// (74:6) <tr slot="thead">
function create_thead_slot_1(ctx) {
	let tr;
	let th0;
	let t1;
	let th1;
	let t3;
	let th2;
	let t4;
	let th2_hidden_value;
	let t5;
	let th3;
	let t6;
	let th3_hidden_value;
	let t7;
	let th4;
	let t8;
	let th4_hidden_value;
	let t9;
	let th5;
	let t10;
	let th5_hidden_value;
	let t11;
	let th6;
	let t12;
	let th6_hidden_value;
	let t13;
	let th7;
	let t14;
	let t15;
	let th8;
	let t16;
	let t17;
	let th9;
	let t18;
	let t19;
	let th10;
	let t20;
	let t21;
	let th11;
	let t22;
	let t23;
	let th12;
	let t24;

	const block = {
		c: function create() {
			tr = element("tr");
			th0 = element("th");
			th0.textContent = "@";
			t1 = space();
			th1 = element("th");
			th1.textContent = "Name";
			t3 = space();
			th2 = element("th");
			t4 = text("D");
			t5 = space();
			th3 = element("th");
			t6 = text("E");
			t7 = space();
			th4 = element("th");
			t8 = text("T");
			t9 = space();
			th5 = element("th");
			t10 = text("DPS");
			t11 = space();
			th6 = element("th");
			t12 = text("EPS");
			t13 = space();
			th7 = element("th");
			t14 = text("D");
			t15 = space();
			th8 = element("th");
			t16 = text("E");
			t17 = space();
			th9 = element("th");
			t18 = text("T");
			t19 = space();
			th10 = element("th");
			t20 = text("DPT");
			t21 = space();
			th11 = element("th");
			t22 = text("EPT");
			t23 = space();
			th12 = element("th");
			t24 = text("Π");
			attr_dev(th0, "data-sort", "type");
			attr_dev(th0, "data-sort-initial", "");
			add_location(th0, file$9, 74, 8, 1653);
			attr_dev(th1, "data-sort", "name");
			add_location(th1, file$9, 75, 8, 1707);
			th2.hidden = th2_hidden_value = !/*ispve*/ ctx[2];
			attr_dev(th2, "data-sort", "pve_power");
			attr_dev(th2, "title", "Damage");
			add_location(th2, file$9, 78, 8, 1768);
			th3.hidden = th3_hidden_value = !/*ispve*/ ctx[2];
			attr_dev(th3, "data-sort", "pve_energyDelta");
			attr_dev(th3, "title", "Energy");
			add_location(th3, file$9, 79, 8, 1840);
			th4.hidden = th4_hidden_value = !/*ispve*/ ctx[2];
			attr_dev(th4, "data-sort", "pve_duration");
			attr_dev(th4, "title", "Time(s)");
			add_location(th4, file$9, 80, 8, 1918);
			th5.hidden = th5_hidden_value = !/*ispve*/ ctx[2];
			attr_dev(th5, "data-sort", "pve_dps");
			attr_dev(th5, "title", "DPS");
			add_location(th5, file$9, 81, 8, 1994);
			th6.hidden = th6_hidden_value = !/*ispve*/ ctx[2];
			attr_dev(th6, "data-sort", "pve_eps");
			attr_dev(th6, "title", "EPS");
			add_location(th6, file$9, 82, 8, 2063);
			th7.hidden = /*ispve*/ ctx[2];
			attr_dev(th7, "data-sort", "power");
			attr_dev(th7, "title", "Damage");
			add_location(th7, file$9, 85, 8, 2154);
			th8.hidden = /*ispve*/ ctx[2];
			attr_dev(th8, "data-sort", "energyGain");
			attr_dev(th8, "title", "Energy");
			add_location(th8, file$9, 86, 8, 2221);
			th9.hidden = /*ispve*/ ctx[2];
			attr_dev(th9, "data-sort", "turn");
			attr_dev(th9, "title", "Turn");
			add_location(th9, file$9, 87, 8, 2293);
			th10.hidden = /*ispve*/ ctx[2];
			attr_dev(th10, "data-sort", "dpt");
			add_location(th10, file$9, 88, 8, 2357);
			th11.hidden = /*ispve*/ ctx[2];
			attr_dev(th11, "data-sort", "ept");
			add_location(th11, file$9, 89, 8, 2409);
			th12.hidden = /*ispve*/ ctx[2];
			attr_dev(th12, "data-sort", "eptxdpt");
			attr_dev(th12, "title", "EPT x DPT");
			add_location(th12, file$9, 90, 8, 2461);
			attr_dev(tr, "slot", "thead");
			add_location(tr, file$9, 73, 6, 1627);
		},
		m: function mount(target, anchor) {
			insert_dev(target, tr, anchor);
			append_dev(tr, th0);
			append_dev(tr, t1);
			append_dev(tr, th1);
			append_dev(tr, t3);
			append_dev(tr, th2);
			append_dev(th2, t4);
			append_dev(tr, t5);
			append_dev(tr, th3);
			append_dev(th3, t6);
			append_dev(tr, t7);
			append_dev(tr, th4);
			append_dev(th4, t8);
			append_dev(tr, t9);
			append_dev(tr, th5);
			append_dev(th5, t10);
			append_dev(tr, t11);
			append_dev(tr, th6);
			append_dev(th6, t12);
			append_dev(tr, t13);
			append_dev(tr, th7);
			append_dev(th7, t14);
			append_dev(tr, t15);
			append_dev(tr, th8);
			append_dev(th8, t16);
			append_dev(tr, t17);
			append_dev(tr, th9);
			append_dev(th9, t18);
			append_dev(tr, t19);
			append_dev(tr, th10);
			append_dev(th10, t20);
			append_dev(tr, t21);
			append_dev(tr, th11);
			append_dev(th11, t22);
			append_dev(tr, t23);
			append_dev(tr, th12);
			append_dev(th12, t24);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*ispve*/ 4 && th2_hidden_value !== (th2_hidden_value = !/*ispve*/ ctx[2])) {
				prop_dev(th2, "hidden", th2_hidden_value);
			}

			if (dirty & /*ispve*/ 4 && th3_hidden_value !== (th3_hidden_value = !/*ispve*/ ctx[2])) {
				prop_dev(th3, "hidden", th3_hidden_value);
			}

			if (dirty & /*ispve*/ 4 && th4_hidden_value !== (th4_hidden_value = !/*ispve*/ ctx[2])) {
				prop_dev(th4, "hidden", th4_hidden_value);
			}

			if (dirty & /*ispve*/ 4 && th5_hidden_value !== (th5_hidden_value = !/*ispve*/ ctx[2])) {
				prop_dev(th5, "hidden", th5_hidden_value);
			}

			if (dirty & /*ispve*/ 4 && th6_hidden_value !== (th6_hidden_value = !/*ispve*/ ctx[2])) {
				prop_dev(th6, "hidden", th6_hidden_value);
			}

			if (dirty & /*ispve*/ 4) {
				prop_dev(th7, "hidden", /*ispve*/ ctx[2]);
			}

			if (dirty & /*ispve*/ 4) {
				prop_dev(th8, "hidden", /*ispve*/ ctx[2]);
			}

			if (dirty & /*ispve*/ 4) {
				prop_dev(th9, "hidden", /*ispve*/ ctx[2]);
			}

			if (dirty & /*ispve*/ 4) {
				prop_dev(th10, "hidden", /*ispve*/ ctx[2]);
			}

			if (dirty & /*ispve*/ 4) {
				prop_dev(th11, "hidden", /*ispve*/ ctx[2]);
			}

			if (dirty & /*ispve*/ 4) {
				prop_dev(th12, "hidden", /*ispve*/ ctx[2]);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(tr);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_thead_slot_1.name,
		type: "slot",
		source: "(74:6) <tr slot=\\\"thead\\\">",
		ctx
	});

	return block;
}

// (100:14) <div slot="rb">
function create_rb_slot_1(ctx) {
	let div;
	let t_value = /*item*/ ctx[7].name + "";
	let t;

	const block = {
		c: function create() {
			div = element("div");
			t = text(t_value);
			attr_dev(div, "slot", "rb");
			add_location(div, file$9, 99, 14, 2742);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			append_dev(div, t);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*item*/ 128 && t_value !== (t_value = /*item*/ ctx[7].name + "")) set_data_dev(t, t_value);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_rb_slot_1.name,
		type: "slot",
		source: "(100:14) <div slot=\\\"rb\\\">",
		ctx
	});

	return block;
}

// (101:14) <div slot="rt" class="text-ellipsis" title={item.moveId}>
function create_rt_slot_1(ctx) {
	let div;
	let t_value = /*item*/ ctx[7].moveId + "";
	let t;
	let div_title_value;

	const block = {
		c: function create() {
			div = element("div");
			t = text(t_value);
			attr_dev(div, "slot", "rt");
			attr_dev(div, "class", "text-ellipsis");
			attr_dev(div, "title", div_title_value = /*item*/ ctx[7].moveId);
			add_location(div, file$9, 100, 14, 2789);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			append_dev(div, t);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*item*/ 128 && t_value !== (t_value = /*item*/ ctx[7].moveId + "")) set_data_dev(t, t_value);

			if (dirty & /*item*/ 128 && div_title_value !== (div_title_value = /*item*/ ctx[7].moveId)) {
				attr_dev(div, "title", div_title_value);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_rt_slot_1.name,
		type: "slot",
		source: "(101:14) <div slot=\\\"rt\\\" class=\\\"text-ellipsis\\\" title={item.moveId}>",
		ctx
	});

	return block;
}

// (99:12) <Ruby class="x">
function create_default_slot_5(ctx) {
	let t;

	const block = {
		c: function create() {
			t = space();
		},
		m: function mount(target, anchor) {
			insert_dev(target, t, anchor);
		},
		p: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(t);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot_5.name,
		type: "slot",
		source: "(99:12) <Ruby class=\\\"x\\\">",
		ctx
	});

	return block;
}

// (93:6) <tr slot="tbody" let:item={item}>
function create_tbody_slot_1(ctx) {
	let tr;
	let td0;
	let t0;
	let td1;
	let a;
	let a_href_value;
	let t1;
	let td2;

	let t2_value = (/*ispve*/ ctx[2]
	? /*item*/ ctx[7].pve_power
	: /*item*/ ctx[7].power) + "";

	let t2;
	let t3;
	let td3;

	let t4_value = (/*ispve*/ ctx[2]
	? /*item*/ ctx[7].pve_energyDelta
	: /*item*/ ctx[7].energyGain) + "";

	let t4;
	let t5;
	let td4;

	let t6_value = (/*ispve*/ ctx[2]
	? /*item*/ ctx[7].pve_duration
	: /*item*/ ctx[7].turn) + "";

	let t6;
	let t7;
	let td5;

	let t8_value = (/*ispve*/ ctx[2]
	? /*item*/ ctx[7].pve_dps
	: /*item*/ ctx[7].dpt) + "";

	let t8;
	let t9;
	let td6;

	let t10_value = (/*ispve*/ ctx[2]
	? /*item*/ ctx[7].pve_eps
	: /*item*/ ctx[7].ept) + "";

	let t10;
	let t11;
	let td7;
	let t12_value = /*item*/ ctx[7].eptxdpt + "";
	let t12;
	let current;

	const typeicon = new TypeIcon({
			props: { type: /*item*/ ctx[7].type },
			$$inline: true
		});

	const ruby = new Ruby({
			props: {
				class: "x",
				$$slots: {
					default: [create_default_slot_5],
					rt: [create_rt_slot_1],
					rb: [create_rb_slot_1]
				},
				$$scope: { ctx }
			},
			$$inline: true
		});

	const block = {
		c: function create() {
			tr = element("tr");
			td0 = element("td");
			create_component(typeicon.$$.fragment);
			t0 = space();
			td1 = element("td");
			a = element("a");
			create_component(ruby.$$.fragment);
			t1 = space();
			td2 = element("td");
			t2 = text(t2_value);
			t3 = space();
			td3 = element("td");
			t4 = text(t4_value);
			t5 = space();
			td4 = element("td");
			t6 = text(t6_value);
			t7 = space();
			td5 = element("td");
			t8 = text(t8_value);
			t9 = space();
			td6 = element("td");
			t10 = text(t10_value);
			t11 = space();
			td7 = element("td");
			t12 = text(t12_value);
			add_location(td0, file$9, 93, 8, 2585);
			attr_dev(a, "href", a_href_value = "./move/" + /*item*/ ctx[7].moveId);
			add_location(a, file$9, 97, 10, 2667);
			add_location(td1, file$9, 96, 8, 2652);
			add_location(td2, file$9, 105, 8, 2924);
			add_location(td3, file$9, 106, 8, 2979);
			add_location(td4, file$9, 107, 8, 3045);
			add_location(td5, file$9, 108, 8, 3102);
			add_location(td6, file$9, 109, 8, 3153);
			td7.hidden = /*ispve*/ ctx[2];
			add_location(td7, file$9, 124, 8, 3818);
			attr_dev(tr, "slot", "tbody");
			add_location(tr, file$9, 92, 6, 2543);
		},
		m: function mount(target, anchor) {
			insert_dev(target, tr, anchor);
			append_dev(tr, td0);
			mount_component(typeicon, td0, null);
			append_dev(tr, t0);
			append_dev(tr, td1);
			append_dev(td1, a);
			mount_component(ruby, a, null);
			append_dev(tr, t1);
			append_dev(tr, td2);
			append_dev(td2, t2);
			append_dev(tr, t3);
			append_dev(tr, td3);
			append_dev(td3, t4);
			append_dev(tr, t5);
			append_dev(tr, td4);
			append_dev(td4, t6);
			append_dev(tr, t7);
			append_dev(tr, td5);
			append_dev(td5, t8);
			append_dev(tr, t9);
			append_dev(tr, td6);
			append_dev(td6, t10);
			append_dev(tr, t11);
			append_dev(tr, td7);
			append_dev(td7, t12);
			current = true;
		},
		p: function update(ctx, dirty) {
			const typeicon_changes = {};
			if (dirty & /*item*/ 128) typeicon_changes.type = /*item*/ ctx[7].type;
			typeicon.$set(typeicon_changes);
			const ruby_changes = {};

			if (dirty & /*$$scope, item*/ 384) {
				ruby_changes.$$scope = { dirty, ctx };
			}

			ruby.$set(ruby_changes);

			if (!current || dirty & /*item*/ 128 && a_href_value !== (a_href_value = "./move/" + /*item*/ ctx[7].moveId)) {
				attr_dev(a, "href", a_href_value);
			}

			if ((!current || dirty & /*ispve, item*/ 132) && t2_value !== (t2_value = (/*ispve*/ ctx[2]
			? /*item*/ ctx[7].pve_power
			: /*item*/ ctx[7].power) + "")) set_data_dev(t2, t2_value);

			if ((!current || dirty & /*ispve, item*/ 132) && t4_value !== (t4_value = (/*ispve*/ ctx[2]
			? /*item*/ ctx[7].pve_energyDelta
			: /*item*/ ctx[7].energyGain) + "")) set_data_dev(t4, t4_value);

			if ((!current || dirty & /*ispve, item*/ 132) && t6_value !== (t6_value = (/*ispve*/ ctx[2]
			? /*item*/ ctx[7].pve_duration
			: /*item*/ ctx[7].turn) + "")) set_data_dev(t6, t6_value);

			if ((!current || dirty & /*ispve, item*/ 132) && t8_value !== (t8_value = (/*ispve*/ ctx[2]
			? /*item*/ ctx[7].pve_dps
			: /*item*/ ctx[7].dpt) + "")) set_data_dev(t8, t8_value);

			if ((!current || dirty & /*ispve, item*/ 132) && t10_value !== (t10_value = (/*ispve*/ ctx[2]
			? /*item*/ ctx[7].pve_eps
			: /*item*/ ctx[7].ept) + "")) set_data_dev(t10, t10_value);

			if ((!current || dirty & /*item*/ 128) && t12_value !== (t12_value = /*item*/ ctx[7].eptxdpt + "")) set_data_dev(t12, t12_value);

			if (!current || dirty & /*ispve*/ 4) {
				prop_dev(td7, "hidden", /*ispve*/ ctx[2]);
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(typeicon.$$.fragment, local);
			transition_in(ruby.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(typeicon.$$.fragment, local);
			transition_out(ruby.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(tr);
			destroy_component(typeicon);
			destroy_component(ruby);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_tbody_slot_1.name,
		type: "slot",
		source: "(93:6) <tr slot=\\\"tbody\\\" let:item={item}>",
		ctx
	});

	return block;
}

// (70:4) <TableSort       items={_moves.fast}       class="sticky-thead ml-a mr-a"     >
function create_default_slot_4(ctx) {
	let t;

	const block = {
		c: function create() {
			t = space();
		},
		m: function mount(target, anchor) {
			insert_dev(target, t, anchor);
		},
		p: noop,
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(t);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot_4.name,
		type: "slot",
		source: "(70:4) <TableSort       items={_moves.fast}       class=\\\"sticky-thead ml-a mr-a\\\"     >",
		ctx
	});

	return block;
}

// (67:2) <Details type="fastmove" class="card">
function create_default_slot_3(ctx) {
	let summary;
	let h3;
	let t1;
	let current;

	const tablesort = new TableSort({
			props: {
				items: /*_moves*/ ctx[0].fast,
				class: "sticky-thead ml-a mr-a",
				$$slots: {
					default: [create_default_slot_4],
					tbody: [
						create_tbody_slot_1,
						({ item }) => ({ 7: item }),
						({ item }) => item ? 128 : 0
					],
					thead: [create_thead_slot_1]
				},
				$$scope: { ctx }
			},
			$$inline: true
		});

	const block = {
		c: function create() {
			summary = element("summary");
			h3 = element("h3");
			h3.textContent = "Fast";
			t1 = space();
			create_component(tablesort.$$.fragment);
			add_location(h3, file$9, 67, 13, 1512);
			add_location(summary, file$9, 67, 4, 1503);
		},
		m: function mount(target, anchor) {
			insert_dev(target, summary, anchor);
			append_dev(summary, h3);
			insert_dev(target, t1, anchor);
			mount_component(tablesort, target, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
			const tablesort_changes = {};
			if (dirty & /*_moves*/ 1) tablesort_changes.items = /*_moves*/ ctx[0].fast;

			if (dirty & /*$$scope, ispve, item*/ 388) {
				tablesort_changes.$$scope = { dirty, ctx };
			}

			tablesort.$set(tablesort_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(tablesort.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(tablesort.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(summary);
			if (detaching) detach_dev(t1);
			destroy_component(tablesort, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot_3.name,
		type: "slot",
		source: "(67:2) <Details type=\\\"fastmove\\\" class=\\\"card\\\">",
		ctx
	});

	return block;
}

// (137:6) <tr slot="thead">
function create_thead_slot(ctx) {
	let tr;
	let th0;
	let t1;
	let th1;
	let t3;
	let th2;
	let t4;
	let th2_hidden_value;
	let t5;
	let th3;
	let t6;
	let th3_hidden_value;
	let t7;
	let th4;
	let t8;
	let th4_hidden_value;
	let t9;
	let th5;
	let t10;
	let th5_hidden_value;
	let t11;
	let th6;
	let t12;
	let th6_hidden_value;
	let t13;
	let th7;
	let t14;
	let th7_hidden_value;
	let t15;
	let th8;
	let t16;
	let th8_hidden_value;
	let t17;
	let th9;
	let t18;
	let t19;
	let th10;
	let t20;
	let t21;
	let th11;
	let t22;
	let t23;
	let th12;
	let t24;

	const block = {
		c: function create() {
			tr = element("tr");
			th0 = element("th");
			th0.textContent = "@";
			t1 = space();
			th1 = element("th");
			th1.textContent = "Name";
			t3 = space();
			th2 = element("th");
			t4 = text("D");
			t5 = space();
			th3 = element("th");
			t6 = text("E");
			t7 = space();
			th4 = element("th");
			t8 = text("T");
			t9 = space();
			th5 = element("th");
			t10 = text("⚡");
			t11 = space();
			th6 = element("th");
			t12 = text("DPS");
			t13 = space();
			th7 = element("th");
			t14 = text("DPE");
			t15 = space();
			th8 = element("th");
			t16 = text("Π");
			t17 = space();
			th9 = element("th");
			t18 = text("D");
			t19 = space();
			th10 = element("th");
			t20 = text("E");
			t21 = space();
			th11 = element("th");
			t22 = text("DPE");
			t23 = space();
			th12 = element("th");
			t24 = text("Effect");
			attr_dev(th0, "data-sort", "type");
			attr_dev(th0, "data-sort-initial", "");
			add_location(th0, file$9, 137, 8, 4108);
			attr_dev(th1, "data-sort", "name");
			attr_dev(th1, "class", "sticky-left");
			add_location(th1, file$9, 138, 8, 4162);
			th2.hidden = th2_hidden_value = !/*ispve*/ ctx[2];
			attr_dev(th2, "data-sort", "pve_power");
			attr_dev(th2, "title", "Damage");
			add_location(th2, file$9, 141, 8, 4243);
			th3.hidden = th3_hidden_value = !/*ispve*/ ctx[2];
			attr_dev(th3, "data-sort", "pve_energyDelta");
			attr_dev(th3, "title", "Energy");
			add_location(th3, file$9, 142, 8, 4315);
			th4.hidden = th4_hidden_value = !/*ispve*/ ctx[2];
			attr_dev(th4, "data-sort", "pve_duration");
			attr_dev(th4, "title", "Time(s)");
			add_location(th4, file$9, 143, 8, 4393);
			th5.hidden = th5_hidden_value = !/*ispve*/ ctx[2];
			attr_dev(th5, "data-sort", "pve_damageWindowStart");
			attr_dev(th5, "title", "Active(s)");
			add_location(th5, file$9, 144, 8, 4469);
			th6.hidden = th6_hidden_value = !/*ispve*/ ctx[2];
			attr_dev(th6, "data-sort", "pve_dps");
			attr_dev(th6, "title", "DPS");
			add_location(th6, file$9, 145, 8, 4556);
			th7.hidden = th7_hidden_value = !/*ispve*/ ctx[2];
			attr_dev(th7, "data-sort", "pve_dpe");
			attr_dev(th7, "title", "DPE");
			add_location(th7, file$9, 146, 8, 4625);
			th8.hidden = th8_hidden_value = !/*ispve*/ ctx[2];
			attr_dev(th8, "data-sort", "pve_dpsxdpe");
			attr_dev(th8, "title", "DPS x DPE");
			add_location(th8, file$9, 147, 8, 4694);
			th9.hidden = /*ispve*/ ctx[2];
			attr_dev(th9, "data-sort", "power");
			attr_dev(th9, "title", "Damage");
			add_location(th9, file$9, 150, 8, 4793);
			th10.hidden = /*ispve*/ ctx[2];
			attr_dev(th10, "data-sort", "energy");
			attr_dev(th10, "title", "Energy");
			add_location(th10, file$9, 151, 8, 4860);
			th11.hidden = /*ispve*/ ctx[2];
			attr_dev(th11, "data-sort", "dpe");
			add_location(th11, file$9, 152, 8, 4928);
			th12.hidden = /*ispve*/ ctx[2];
			attr_dev(th12, "data-sort", "effect");
			add_location(th12, file$9, 153, 8, 4980);
			attr_dev(tr, "slot", "thead");
			add_location(tr, file$9, 136, 6, 4082);
		},
		m: function mount(target, anchor) {
			insert_dev(target, tr, anchor);
			append_dev(tr, th0);
			append_dev(tr, t1);
			append_dev(tr, th1);
			append_dev(tr, t3);
			append_dev(tr, th2);
			append_dev(th2, t4);
			append_dev(tr, t5);
			append_dev(tr, th3);
			append_dev(th3, t6);
			append_dev(tr, t7);
			append_dev(tr, th4);
			append_dev(th4, t8);
			append_dev(tr, t9);
			append_dev(tr, th5);
			append_dev(th5, t10);
			append_dev(tr, t11);
			append_dev(tr, th6);
			append_dev(th6, t12);
			append_dev(tr, t13);
			append_dev(tr, th7);
			append_dev(th7, t14);
			append_dev(tr, t15);
			append_dev(tr, th8);
			append_dev(th8, t16);
			append_dev(tr, t17);
			append_dev(tr, th9);
			append_dev(th9, t18);
			append_dev(tr, t19);
			append_dev(tr, th10);
			append_dev(th10, t20);
			append_dev(tr, t21);
			append_dev(tr, th11);
			append_dev(th11, t22);
			append_dev(tr, t23);
			append_dev(tr, th12);
			append_dev(th12, t24);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*ispve*/ 4 && th2_hidden_value !== (th2_hidden_value = !/*ispve*/ ctx[2])) {
				prop_dev(th2, "hidden", th2_hidden_value);
			}

			if (dirty & /*ispve*/ 4 && th3_hidden_value !== (th3_hidden_value = !/*ispve*/ ctx[2])) {
				prop_dev(th3, "hidden", th3_hidden_value);
			}

			if (dirty & /*ispve*/ 4 && th4_hidden_value !== (th4_hidden_value = !/*ispve*/ ctx[2])) {
				prop_dev(th4, "hidden", th4_hidden_value);
			}

			if (dirty & /*ispve*/ 4 && th5_hidden_value !== (th5_hidden_value = !/*ispve*/ ctx[2])) {
				prop_dev(th5, "hidden", th5_hidden_value);
			}

			if (dirty & /*ispve*/ 4 && th6_hidden_value !== (th6_hidden_value = !/*ispve*/ ctx[2])) {
				prop_dev(th6, "hidden", th6_hidden_value);
			}

			if (dirty & /*ispve*/ 4 && th7_hidden_value !== (th7_hidden_value = !/*ispve*/ ctx[2])) {
				prop_dev(th7, "hidden", th7_hidden_value);
			}

			if (dirty & /*ispve*/ 4 && th8_hidden_value !== (th8_hidden_value = !/*ispve*/ ctx[2])) {
				prop_dev(th8, "hidden", th8_hidden_value);
			}

			if (dirty & /*ispve*/ 4) {
				prop_dev(th9, "hidden", /*ispve*/ ctx[2]);
			}

			if (dirty & /*ispve*/ 4) {
				prop_dev(th10, "hidden", /*ispve*/ ctx[2]);
			}

			if (dirty & /*ispve*/ 4) {
				prop_dev(th11, "hidden", /*ispve*/ ctx[2]);
			}

			if (dirty & /*ispve*/ 4) {
				prop_dev(th12, "hidden", /*ispve*/ ctx[2]);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(tr);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_thead_slot.name,
		type: "slot",
		source: "(137:6) <tr slot=\\\"thead\\\">",
		ctx
	});

	return block;
}

// (163:14) <div slot="rb">
function create_rb_slot(ctx) {
	let div;
	let t_value = /*item*/ ctx[7].name + "";
	let t;

	const block = {
		c: function create() {
			div = element("div");
			t = text(t_value);
			attr_dev(div, "slot", "rb");
			add_location(div, file$9, 162, 14, 5314);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			append_dev(div, t);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*item*/ 128 && t_value !== (t_value = /*item*/ ctx[7].name + "")) set_data_dev(t, t_value);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_rb_slot.name,
		type: "slot",
		source: "(163:14) <div slot=\\\"rb\\\">",
		ctx
	});

	return block;
}

// (164:14) <div slot="rt" class="text-ellipsis" title={item.moveId}>
function create_rt_slot(ctx) {
	let div;
	let t_value = /*item*/ ctx[7].moveId + "";
	let t;
	let div_title_value;

	const block = {
		c: function create() {
			div = element("div");
			t = text(t_value);
			attr_dev(div, "slot", "rt");
			attr_dev(div, "class", "text-ellipsis");
			attr_dev(div, "title", div_title_value = /*item*/ ctx[7].moveId);
			add_location(div, file$9, 163, 14, 5361);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			append_dev(div, t);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*item*/ 128 && t_value !== (t_value = /*item*/ ctx[7].moveId + "")) set_data_dev(t, t_value);

			if (dirty & /*item*/ 128 && div_title_value !== (div_title_value = /*item*/ ctx[7].moveId)) {
				attr_dev(div, "title", div_title_value);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_rt_slot.name,
		type: "slot",
		source: "(164:14) <div slot=\\\"rt\\\" class=\\\"text-ellipsis\\\" title={item.moveId}>",
		ctx
	});

	return block;
}

// (162:12) <Ruby class="x">
function create_default_slot_2(ctx) {
	let t;

	const block = {
		c: function create() {
			t = space();
		},
		m: function mount(target, anchor) {
			insert_dev(target, t, anchor);
		},
		p: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(t);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot_2.name,
		type: "slot",
		source: "(162:12) <Ruby class=\\\"x\\\">",
		ctx
	});

	return block;
}

// (156:6) <tr slot="tbody" let:item={item}>
function create_tbody_slot(ctx) {
	let tr;
	let td0;
	let t0;
	let td1;
	let a;
	let a_href_value;
	let t1;
	let td2;
	let t2_value = /*item*/ ctx[7].pve_power + "";
	let t2;
	let td2_hidden_value;
	let t3;
	let td3;
	let t4_value = /*item*/ ctx[7].pve_energyDelta + "";
	let t4;
	let td3_hidden_value;
	let t5;
	let td4;
	let t6_value = /*item*/ ctx[7].pve_duration + "";
	let t6;
	let td4_hidden_value;
	let t7;
	let td5;
	let t8_value = /*item*/ ctx[7].pve_damageWindowStart + "";
	let t8;
	let td5_hidden_value;
	let t9;
	let td6;
	let t10_value = /*item*/ ctx[7].pve_dps + "";
	let t10;
	let td6_hidden_value;
	let t11;
	let td7;
	let t12_value = /*item*/ ctx[7].pve_dpe + "";
	let t12;
	let td7_hidden_value;
	let t13;
	let td8;
	let t14_value = /*item*/ ctx[7].pve_dpsxdpe + "";
	let t14;
	let td8_hidden_value;
	let t15;
	let td9;
	let t16_value = /*item*/ ctx[7].power + "";
	let t16;
	let t17;
	let td10;
	let t18_value = /*item*/ ctx[7].energy + "";
	let t18;
	let t19;
	let td11;
	let t20_value = /*item*/ ctx[7].dpe + "";
	let t20;
	let t21;
	let td12;
	let raw_value = (effText(/*item*/ ctx[7].effect) || "") + "";
	let current;

	const typeicon = new TypeIcon({
			props: {
				type: /*item*/ ctx[7].type,
				class: "d-ib"
			},
			$$inline: true
		});

	const ruby = new Ruby({
			props: {
				class: "x",
				$$slots: {
					default: [create_default_slot_2],
					rt: [create_rt_slot],
					rb: [create_rb_slot]
				},
				$$scope: { ctx }
			},
			$$inline: true
		});

	const block = {
		c: function create() {
			tr = element("tr");
			td0 = element("td");
			create_component(typeicon.$$.fragment);
			t0 = space();
			td1 = element("td");
			a = element("a");
			create_component(ruby.$$.fragment);
			t1 = space();
			td2 = element("td");
			t2 = text(t2_value);
			t3 = space();
			td3 = element("td");
			t4 = text(t4_value);
			t5 = space();
			td4 = element("td");
			t6 = text(t6_value);
			t7 = space();
			td5 = element("td");
			t8 = text(t8_value);
			t9 = space();
			td6 = element("td");
			t10 = text(t10_value);
			t11 = space();
			td7 = element("td");
			t12 = text(t12_value);
			t13 = space();
			td8 = element("td");
			t14 = text(t14_value);
			t15 = space();
			td9 = element("td");
			t16 = text(t16_value);
			t17 = space();
			td10 = element("td");
			t18 = text(t18_value);
			t19 = space();
			td11 = element("td");
			t20 = text(t20_value);
			t21 = space();
			td12 = element("td");
			attr_dev(td0, "class", "p-0 text-center");
			add_location(td0, file$9, 156, 8, 5090);
			attr_dev(a, "href", a_href_value = "./move/" + /*item*/ ctx[7].moveId);
			add_location(a, file$9, 160, 10, 5239);
			attr_dev(td1, "class", "sticky-left text-left");
			add_location(td1, file$9, 159, 8, 5194);
			td2.hidden = td2_hidden_value = !/*ispve*/ ctx[2];
			add_location(td2, file$9, 169, 8, 5517);
			td3.hidden = td3_hidden_value = !/*ispve*/ ctx[2];
			attr_dev(td3, "class", "energy-bar");
			set_style(td3, "--bgzx", -/*item*/ ctx[7].pve_energyDelta + "%");
			add_location(td3, file$9, 170, 8, 5567);
			td4.hidden = td4_hidden_value = !/*ispve*/ ctx[2];
			add_location(td4, file$9, 173, 8, 5703);
			td5.hidden = td5_hidden_value = !/*ispve*/ ctx[2];
			add_location(td5, file$9, 174, 8, 5756);
			td6.hidden = td6_hidden_value = !/*ispve*/ ctx[2];
			add_location(td6, file$9, 175, 8, 5818);
			td7.hidden = td7_hidden_value = !/*ispve*/ ctx[2];
			add_location(td7, file$9, 176, 8, 5866);
			td8.hidden = td8_hidden_value = !/*ispve*/ ctx[2];
			add_location(td8, file$9, 177, 8, 5914);
			td9.hidden = /*ispve*/ ctx[2];
			add_location(td9, file$9, 180, 8, 5988);
			td10.hidden = /*ispve*/ ctx[2];
			attr_dev(td10, "class", "energy-bar");
			set_style(td10, "--bgzx", /*item*/ ctx[7].energy + "%");
			add_location(td10, file$9, 181, 8, 6033);
			td11.hidden = /*ispve*/ ctx[2];
			add_location(td11, file$9, 184, 8, 6149);
			td12.hidden = /*ispve*/ ctx[2];
			attr_dev(td12, "class", "effect text-left fz-s svelte-rw9rz");
			add_location(td12, file$9, 185, 8, 6192);
			attr_dev(tr, "slot", "tbody");
			add_location(tr, file$9, 155, 6, 5048);
		},
		m: function mount(target, anchor) {
			insert_dev(target, tr, anchor);
			append_dev(tr, td0);
			mount_component(typeicon, td0, null);
			append_dev(tr, t0);
			append_dev(tr, td1);
			append_dev(td1, a);
			mount_component(ruby, a, null);
			append_dev(tr, t1);
			append_dev(tr, td2);
			append_dev(td2, t2);
			append_dev(tr, t3);
			append_dev(tr, td3);
			append_dev(td3, t4);
			append_dev(tr, t5);
			append_dev(tr, td4);
			append_dev(td4, t6);
			append_dev(tr, t7);
			append_dev(tr, td5);
			append_dev(td5, t8);
			append_dev(tr, t9);
			append_dev(tr, td6);
			append_dev(td6, t10);
			append_dev(tr, t11);
			append_dev(tr, td7);
			append_dev(td7, t12);
			append_dev(tr, t13);
			append_dev(tr, td8);
			append_dev(td8, t14);
			append_dev(tr, t15);
			append_dev(tr, td9);
			append_dev(td9, t16);
			append_dev(tr, t17);
			append_dev(tr, td10);
			append_dev(td10, t18);
			append_dev(tr, t19);
			append_dev(tr, td11);
			append_dev(td11, t20);
			append_dev(tr, t21);
			append_dev(tr, td12);
			td12.innerHTML = raw_value;
			current = true;
		},
		p: function update(ctx, dirty) {
			const typeicon_changes = {};
			if (dirty & /*item*/ 128) typeicon_changes.type = /*item*/ ctx[7].type;
			typeicon.$set(typeicon_changes);
			const ruby_changes = {};

			if (dirty & /*$$scope, item*/ 384) {
				ruby_changes.$$scope = { dirty, ctx };
			}

			ruby.$set(ruby_changes);

			if (!current || dirty & /*item*/ 128 && a_href_value !== (a_href_value = "./move/" + /*item*/ ctx[7].moveId)) {
				attr_dev(a, "href", a_href_value);
			}

			if ((!current || dirty & /*item*/ 128) && t2_value !== (t2_value = /*item*/ ctx[7].pve_power + "")) set_data_dev(t2, t2_value);

			if (!current || dirty & /*ispve*/ 4 && td2_hidden_value !== (td2_hidden_value = !/*ispve*/ ctx[2])) {
				prop_dev(td2, "hidden", td2_hidden_value);
			}

			if ((!current || dirty & /*item*/ 128) && t4_value !== (t4_value = /*item*/ ctx[7].pve_energyDelta + "")) set_data_dev(t4, t4_value);

			if (!current || dirty & /*ispve*/ 4 && td3_hidden_value !== (td3_hidden_value = !/*ispve*/ ctx[2])) {
				prop_dev(td3, "hidden", td3_hidden_value);
			}

			if (!current || dirty & /*item*/ 128) {
				set_style(td3, "--bgzx", -/*item*/ ctx[7].pve_energyDelta + "%");
			}

			if ((!current || dirty & /*item*/ 128) && t6_value !== (t6_value = /*item*/ ctx[7].pve_duration + "")) set_data_dev(t6, t6_value);

			if (!current || dirty & /*ispve*/ 4 && td4_hidden_value !== (td4_hidden_value = !/*ispve*/ ctx[2])) {
				prop_dev(td4, "hidden", td4_hidden_value);
			}

			if ((!current || dirty & /*item*/ 128) && t8_value !== (t8_value = /*item*/ ctx[7].pve_damageWindowStart + "")) set_data_dev(t8, t8_value);

			if (!current || dirty & /*ispve*/ 4 && td5_hidden_value !== (td5_hidden_value = !/*ispve*/ ctx[2])) {
				prop_dev(td5, "hidden", td5_hidden_value);
			}

			if ((!current || dirty & /*item*/ 128) && t10_value !== (t10_value = /*item*/ ctx[7].pve_dps + "")) set_data_dev(t10, t10_value);

			if (!current || dirty & /*ispve*/ 4 && td6_hidden_value !== (td6_hidden_value = !/*ispve*/ ctx[2])) {
				prop_dev(td6, "hidden", td6_hidden_value);
			}

			if ((!current || dirty & /*item*/ 128) && t12_value !== (t12_value = /*item*/ ctx[7].pve_dpe + "")) set_data_dev(t12, t12_value);

			if (!current || dirty & /*ispve*/ 4 && td7_hidden_value !== (td7_hidden_value = !/*ispve*/ ctx[2])) {
				prop_dev(td7, "hidden", td7_hidden_value);
			}

			if ((!current || dirty & /*item*/ 128) && t14_value !== (t14_value = /*item*/ ctx[7].pve_dpsxdpe + "")) set_data_dev(t14, t14_value);

			if (!current || dirty & /*ispve*/ 4 && td8_hidden_value !== (td8_hidden_value = !/*ispve*/ ctx[2])) {
				prop_dev(td8, "hidden", td8_hidden_value);
			}

			if ((!current || dirty & /*item*/ 128) && t16_value !== (t16_value = /*item*/ ctx[7].power + "")) set_data_dev(t16, t16_value);

			if (!current || dirty & /*ispve*/ 4) {
				prop_dev(td9, "hidden", /*ispve*/ ctx[2]);
			}

			if ((!current || dirty & /*item*/ 128) && t18_value !== (t18_value = /*item*/ ctx[7].energy + "")) set_data_dev(t18, t18_value);

			if (!current || dirty & /*ispve*/ 4) {
				prop_dev(td10, "hidden", /*ispve*/ ctx[2]);
			}

			if (!current || dirty & /*item*/ 128) {
				set_style(td10, "--bgzx", /*item*/ ctx[7].energy + "%");
			}

			if ((!current || dirty & /*item*/ 128) && t20_value !== (t20_value = /*item*/ ctx[7].dpe + "")) set_data_dev(t20, t20_value);

			if (!current || dirty & /*ispve*/ 4) {
				prop_dev(td11, "hidden", /*ispve*/ ctx[2]);
			}

			if ((!current || dirty & /*item*/ 128) && raw_value !== (raw_value = (effText(/*item*/ ctx[7].effect) || "") + "")) td12.innerHTML = raw_value;
			if (!current || dirty & /*ispve*/ 4) {
				prop_dev(td12, "hidden", /*ispve*/ ctx[2]);
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(typeicon.$$.fragment, local);
			transition_in(ruby.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(typeicon.$$.fragment, local);
			transition_out(ruby.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(tr);
			destroy_component(typeicon);
			destroy_component(ruby);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_tbody_slot.name,
		type: "slot",
		source: "(156:6) <tr slot=\\\"tbody\\\" let:item={item}>",
		ctx
	});

	return block;
}

// (133:4) <TableSort       items={_moves.charge}       class="sticky-thead narrow ml-a mr-a"     >
function create_default_slot_1(ctx) {
	let t;

	const block = {
		c: function create() {
			t = space();
		},
		m: function mount(target, anchor) {
			insert_dev(target, t, anchor);
		},
		p: noop,
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(t);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot_1.name,
		type: "slot",
		source: "(133:4) <TableSort       items={_moves.charge}       class=\\\"sticky-thead narrow ml-a mr-a\\\"     >",
		ctx
	});

	return block;
}

// (130:2) <Details type="chargemove" class="card">
function create_default_slot$1(ctx) {
	let summary;
	let h3;
	let t1;
	let current;

	const tablesort = new TableSort({
			props: {
				items: /*_moves*/ ctx[0].charge,
				class: "sticky-thead narrow ml-a mr-a",
				$$slots: {
					default: [create_default_slot_1],
					tbody: [
						create_tbody_slot,
						({ item }) => ({ 7: item }),
						({ item }) => item ? 128 : 0
					],
					thead: [create_thead_slot]
				},
				$$scope: { ctx }
			},
			$$inline: true
		});

	const block = {
		c: function create() {
			summary = element("summary");
			h3 = element("h3");
			h3.textContent = "Charge";
			t1 = space();
			create_component(tablesort.$$.fragment);
			add_location(h3, file$9, 130, 13, 3956);
			add_location(summary, file$9, 130, 4, 3947);
		},
		m: function mount(target, anchor) {
			insert_dev(target, summary, anchor);
			append_dev(summary, h3);
			insert_dev(target, t1, anchor);
			mount_component(tablesort, target, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
			const tablesort_changes = {};
			if (dirty & /*_moves*/ 1) tablesort_changes.items = /*_moves*/ ctx[0].charge;

			if (dirty & /*$$scope, ispve, item*/ 388) {
				tablesort_changes.$$scope = { dirty, ctx };
			}

			tablesort.$set(tablesort_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(tablesort.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(tablesort.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(summary);
			if (detaching) detach_dev(t1);
			destroy_component(tablesort, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot$1.name,
		type: "slot",
		source: "(130:2) <Details type=\\\"chargemove\\\" class=\\\"card\\\">",
		ctx
	});

	return block;
}

function create_fragment$9(ctx) {
	let t0;
	let section;
	let t1;
	let t2;
	let t3;
	let t4;
	let current;

	const details0 = new Details({
			props: {
				type: "move_filter",
				class: "card",
				$$slots: { default: [create_default_slot_6] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	const switcher = new Switcher({ $$inline: true });

	const details1 = new Details({
			props: {
				type: "fastmove",
				class: "card",
				$$slots: { default: [create_default_slot_3] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	const details2 = new Details({
			props: {
				type: "chargemove",
				class: "card",
				$$slots: { default: [create_default_slot$1] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	const movechart = new MoveChart({
			props: {
				moves: /*_moves*/ ctx[0],
				ispve: /*ispve*/ ctx[2]
			},
			$$inline: true
		});

	const block = {
		c: function create() {
			t0 = space();
			section = element("section");
			create_component(details0.$$.fragment);
			t1 = space();
			create_component(switcher.$$.fragment);
			t2 = space();
			create_component(details1.$$.fragment);
			t3 = space();
			create_component(details2.$$.fragment);
			t4 = space();
			create_component(movechart.$$.fragment);
			document.title = "Move";
			attr_dev(section, "class", "move-list svelte-rw9rz");
			add_location(section, file$9, 57, 0, 1247);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, t0, anchor);
			insert_dev(target, section, anchor);
			mount_component(details0, section, null);
			append_dev(section, t1);
			mount_component(switcher, section, null);
			append_dev(section, t2);
			mount_component(details1, section, null);
			append_dev(section, t3);
			mount_component(details2, section, null);
			append_dev(section, t4);
			mount_component(movechart, section, null);
			current = true;
		},
		p: function update(ctx, [dirty]) {
			const details0_changes = {};

			if (dirty & /*$$scope, type*/ 258) {
				details0_changes.$$scope = { dirty, ctx };
			}

			details0.$set(details0_changes);
			const details1_changes = {};

			if (dirty & /*$$scope, _moves, ispve*/ 261) {
				details1_changes.$$scope = { dirty, ctx };
			}

			details1.$set(details1_changes);
			const details2_changes = {};

			if (dirty & /*$$scope, _moves, ispve*/ 261) {
				details2_changes.$$scope = { dirty, ctx };
			}

			details2.$set(details2_changes);
			const movechart_changes = {};
			if (dirty & /*_moves*/ 1) movechart_changes.moves = /*_moves*/ ctx[0];
			if (dirty & /*ispve*/ 4) movechart_changes.ispve = /*ispve*/ ctx[2];
			movechart.$set(movechart_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(details0.$$.fragment, local);
			transition_in(switcher.$$.fragment, local);
			transition_in(details1.$$.fragment, local);
			transition_in(details2.$$.fragment, local);
			transition_in(movechart.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(details0.$$.fragment, local);
			transition_out(switcher.$$.fragment, local);
			transition_out(details1.$$.fragment, local);
			transition_out(details2.$$.fragment, local);
			transition_out(movechart.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(t0);
			if (detaching) detach_dev(section);
			destroy_component(details0);
			destroy_component(switcher);
			destroy_component(details1);
			destroy_component(details2);
			destroy_component(movechart);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$9.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function effText(eff) {
	return eff.split(", ").map(i => `<span class="d-ib">${i}</span>`).join("");
}

function instance$8($$self, $$props, $$invalidate) {
	let $settings;
	let $moves;
	validate_store(settings, "settings");
	component_subscribe($$self, settings, $$value => $$invalidate(4, $settings = $$value));
	validate_store(moves, "moves");
	component_subscribe($$self, moves, $$value => $$invalidate(5, $moves = $$value));
	let _moves;
	let type = location.hash ? location.hash.replace("#", "") : "";
	

	function clicktype(e) {
		let _type = e.detail.type;
		$$invalidate(1, type = _type === type ? null : _type);
	}

	function moveHandle(moves) {
		if (type) {
			moves = moves.filter(m => m.type === type);
		}

		return moves.reduce(
			(all, m) => {
				all[m.isFast ? "fast" : "charge"].push(m);
				return all;
			},
			{ fast: [], charge: [] }
		);
	}

	$$self.$capture_state = () => {
		return {};
	};

	$$self.$inject_state = $$props => {
		if ("_moves" in $$props) $$invalidate(0, _moves = $$props._moves);
		if ("type" in $$props) $$invalidate(1, type = $$props.type);
		if ("ispve" in $$props) $$invalidate(2, ispve = $$props.ispve);
		if ("$settings" in $$props) settings.set($settings = $$props.$settings);
		if ("$moves" in $$props) moves.set($moves = $$props.$moves);
	};

	let ispve;

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*$settings*/ 16) {
			 $$invalidate(2, ispve = $settings.io.ispve);
		}

		if ($$self.$$.dirty & /*type, $moves*/ 34) {
			 {
				if (type && !op.some(_eff => _eff.type === type)) {
					$$invalidate(1, type = null);
				}

				$$invalidate(0, _moves = moveHandle($moves));
			}
		}
	};

	return [_moves, type, ispve, clicktype];
}

class MoveList extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance$8, create_fragment$9, safe_not_equal, {});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "MoveList",
			options,
			id: create_fragment$9.name
		});
	}
}

/* ./src/routes/PokemonList.html generated by Svelte v3.18.1 */
const file$a = "./src/routes/PokemonList.html";

function get_each_context$4(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[6] = list[i];
	return child_ctx;
}

function get_each_context_1$2(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[20] = list[i];
	child_ctx[22] = i;
	return child_ctx;
}

// (113:10) {#each genDex as gen, i}
function create_each_block_1$2(ctx) {
	let button;
	let t0;
	let t1_value = /*i*/ ctx[22] + 1 + "";
	let t1;
	let t2;
	let dispose;

	function click_handler(...args) {
		return /*click_handler*/ ctx[15](/*gen*/ ctx[20], ...args);
	}

	const block = {
		c: function create() {
			button = element("button");
			t0 = text("G");
			t1 = text(t1_value);
			t2 = space();
			add_location(button, file$a, 113, 12, 2514);
		},
		m: function mount(target, anchor) {
			insert_dev(target, button, anchor);
			append_dev(button, t0);
			append_dev(button, t1);
			append_dev(button, t2);
			dispose = listen_dev(button, "click", click_handler, false, false, false);
		},
		p: function update(new_ctx, dirty) {
			ctx = new_ctx;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(button);
			dispose();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block_1$2.name,
		type: "each",
		source: "(113:10) {#each genDex as gen, i}",
		ctx
	});

	return block;
}

// (78:4) <Details type="dex_filter">
function create_default_slot_3$1(ctx) {
	let summary;
	let t1;
	let div3;
	let div1;
	let input0;
	let input0_updating = false;
	let t2;
	let div0;
	let input1;
	let t3;
	let br;
	let t4;
	let input2;
	let t5;
	let input3;
	let input3_updating = false;
	let t6;
	let div2;
	let dispose;

	function input0_input_handler() {
		input0_updating = true;
		/*input0_input_handler*/ ctx[11].call(input0);
	}

	function input3_input_handler() {
		input3_updating = true;
		/*input3_input_handler*/ ctx[14].call(input3);
	}

	let each_value_1 = /*genDex*/ ctx[7];
	let each_blocks = [];

	for (let i = 0; i < each_value_1.length; i += 1) {
		each_blocks[i] = create_each_block_1$2(get_each_context_1$2(ctx, each_value_1, i));
	}

	const block = {
		c: function create() {
			summary = element("summary");
			summary.textContent = "Dex";
			t1 = space();
			div3 = element("div");
			div1 = element("div");
			input0 = element("input");
			t2 = space();
			div0 = element("div");
			input1 = element("input");
			t3 = space();
			br = element("br");
			t4 = space();
			input2 = element("input");
			t5 = space();
			input3 = element("input");
			t6 = space();
			div2 = element("div");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			attr_dev(summary, "class", "mb-4");
			add_location(summary, file$a, 78, 6, 1611);
			attr_dev(input0, "type", "number");
			attr_dev(input0, "max", /*$maxDex*/ ctx[4]);
			attr_dev(input0, "min", "1");
			attr_dev(input0, "step", "1");
			set_style(input0, "order", /*dexRangeMin*/ ctx[1] * 2);
			add_location(input0, file$a, 84, 10, 1729);
			attr_dev(input1, "type", "range");
			attr_dev(input1, "max", /*$maxDex*/ ctx[4]);
			attr_dev(input1, "min", "1");
			attr_dev(input1, "step", "1");
			add_location(input1, file$a, 91, 12, 1960);
			add_location(br, file$a, 96, 12, 2092);
			attr_dev(input2, "type", "range");
			attr_dev(input2, "max", /*$maxDex*/ ctx[4]);
			attr_dev(input2, "min", "1");
			attr_dev(input2, "step", "1");
			add_location(input2, file$a, 98, 12, 2110);
			set_style(div0, "order", /*dexRangeMin*/ ctx[1] + /*dexRangeMax*/ ctx[2]);
			add_location(div0, file$a, 90, 10, 1899);
			attr_dev(input3, "type", "number");
			attr_dev(input3, "max", /*$maxDex*/ ctx[4]);
			attr_dev(input3, "min", "1");
			attr_dev(input3, "step", "1");
			set_style(input3, "order", /*dexRangeMax*/ ctx[2] * 2);
			add_location(input3, file$a, 104, 10, 2257);
			attr_dev(div1, "class", "df jc-c");
			add_location(div1, file$a, 83, 8, 1697);
			attr_dev(div2, "class", "df jc-c mb-4");
			add_location(div2, file$a, 111, 8, 2440);
			attr_dev(div3, "class", "mb-2");
			add_location(div3, file$a, 82, 6, 1670);
		},
		m: function mount(target, anchor) {
			insert_dev(target, summary, anchor);
			insert_dev(target, t1, anchor);
			insert_dev(target, div3, anchor);
			append_dev(div3, div1);
			append_dev(div1, input0);
			set_input_value(input0, /*dexRangeMin*/ ctx[1]);
			append_dev(div1, t2);
			append_dev(div1, div0);
			append_dev(div0, input1);
			set_input_value(input1, /*dexRangeMin*/ ctx[1]);
			append_dev(div0, t3);
			append_dev(div0, br);
			append_dev(div0, t4);
			append_dev(div0, input2);
			set_input_value(input2, /*dexRangeMax*/ ctx[2]);
			append_dev(div1, t5);
			append_dev(div1, input3);
			set_input_value(input3, /*dexRangeMax*/ ctx[2]);
			append_dev(div3, t6);
			append_dev(div3, div2);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(div2, null);
			}

			dispose = [
				listen_dev(input0, "input", input0_input_handler),
				listen_dev(input1, "change", /*input1_change_input_handler*/ ctx[12]),
				listen_dev(input1, "input", /*input1_change_input_handler*/ ctx[12]),
				listen_dev(input2, "change", /*input2_change_input_handler*/ ctx[13]),
				listen_dev(input2, "input", /*input2_change_input_handler*/ ctx[13]),
				listen_dev(input3, "input", input3_input_handler)
			];
		},
		p: function update(ctx, dirty) {
			if (dirty & /*$maxDex*/ 16) {
				attr_dev(input0, "max", /*$maxDex*/ ctx[4]);
			}

			if (dirty & /*dexRangeMin*/ 2) {
				set_style(input0, "order", /*dexRangeMin*/ ctx[1] * 2);
			}

			if (!input0_updating && dirty & /*dexRangeMin*/ 2) {
				set_input_value(input0, /*dexRangeMin*/ ctx[1]);
			}

			input0_updating = false;

			if (dirty & /*$maxDex*/ 16) {
				attr_dev(input1, "max", /*$maxDex*/ ctx[4]);
			}

			if (dirty & /*dexRangeMin*/ 2) {
				set_input_value(input1, /*dexRangeMin*/ ctx[1]);
			}

			if (dirty & /*$maxDex*/ 16) {
				attr_dev(input2, "max", /*$maxDex*/ ctx[4]);
			}

			if (dirty & /*dexRangeMax*/ 4) {
				set_input_value(input2, /*dexRangeMax*/ ctx[2]);
			}

			if (dirty & /*dexRangeMin, dexRangeMax*/ 6) {
				set_style(div0, "order", /*dexRangeMin*/ ctx[1] + /*dexRangeMax*/ ctx[2]);
			}

			if (dirty & /*$maxDex*/ 16) {
				attr_dev(input3, "max", /*$maxDex*/ ctx[4]);
			}

			if (dirty & /*dexRangeMax*/ 4) {
				set_style(input3, "order", /*dexRangeMax*/ ctx[2] * 2);
			}

			if (!input3_updating && dirty & /*dexRangeMax*/ 4) {
				set_input_value(input3, /*dexRangeMax*/ ctx[2]);
			}

			input3_updating = false;

			if (dirty & /*setRange, genDex*/ 640) {
				each_value_1 = /*genDex*/ ctx[7];
				let i;

				for (i = 0; i < each_value_1.length; i += 1) {
					const child_ctx = get_each_context_1$2(ctx, each_value_1, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block_1$2(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(div2, null);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value_1.length;
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(summary);
			if (detaching) detach_dev(t1);
			if (detaching) detach_dev(div3);
			destroy_each(each_blocks, detaching);
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot_3$1.name,
		type: "slot",
		source: "(78:4) <Details type=\\\"dex_filter\\\">",
		ctx
	});

	return block;
}

// (71:2) <Details type="pm_filter" class="card">
function create_default_slot_2$1(ctx) {
	let summary;
	let h3;
	let t1;
	let t2;
	let current;

	const typefilter = new TypeFilter({
			props: { type: /*type*/ ctx[6], route: "pokemon" },
			$$inline: true
		});

	typefilter.$on("clicktype", /*clicktype*/ ctx[8]);

	const details = new Details({
			props: {
				type: "dex_filter",
				$$slots: { default: [create_default_slot_3$1] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	const block = {
		c: function create() {
			summary = element("summary");
			h3 = element("h3");
			h3.textContent = "Filter";
			t1 = space();
			create_component(typefilter.$$.fragment);
			t2 = space();
			create_component(details.$$.fragment);
			add_location(h3, file$a, 72, 6, 1468);
			add_location(summary, file$a, 71, 4, 1452);
		},
		m: function mount(target, anchor) {
			insert_dev(target, summary, anchor);
			append_dev(summary, h3);
			insert_dev(target, t1, anchor);
			mount_component(typefilter, target, anchor);
			insert_dev(target, t2, anchor);
			mount_component(details, target, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
			const typefilter_changes = {};
			if (dirty & /*type*/ 64) typefilter_changes.type = /*type*/ ctx[6];
			typefilter.$set(typefilter_changes);
			const details_changes = {};

			if (dirty & /*$$scope, $maxDex, dexRangeMax, dexRangeMin*/ 8388630) {
				details_changes.$$scope = { dirty, ctx };
			}

			details.$set(details_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(typefilter.$$.fragment, local);
			transition_in(details.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(typefilter.$$.fragment, local);
			transition_out(details.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(summary);
			if (detaching) detach_dev(t1);
			destroy_component(typefilter, detaching);
			if (detaching) detach_dev(t2);
			destroy_component(details, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot_2$1.name,
		type: "slot",
		source: "(71:2) <Details type=\\\"pm_filter\\\" class=\\\"card\\\">",
		ctx
	});

	return block;
}

// (123:2) {#if $pokemons.length}
function create_if_block(ctx) {
	let div;
	let div_hidden_value;
	let current;

	const tablesort = new TableSort({
			props: {
				items: /*_pokemons*/ ctx[0],
				class: "pokemon-table sticky-thead narrow text-right ml-a mr-a",
				$$slots: {
					default: [create_default_slot$2],
					tfoot: [create_tfoot_slot],
					tbody: [
						create_tbody_slot$1,
						({ item }) => ({ 17: item }),
						({ item }) => item ? 131072 : 0
					],
					thead: [create_thead_slot$1]
				},
				$$scope: { ctx }
			},
			$$inline: true
		});

	const block = {
		c: function create() {
			div = element("div");
			create_component(tablesort.$$.fragment);
			attr_dev(div, "class", "card card__pokemon-table pt-4 svelte-dcd87g");
			div.hidden = div_hidden_value = !/*$pokemons*/ ctx[3].length;
			toggle_class(div, "show-all", /*$settings*/ ctx[5].io.showAllTable);
			add_location(div, file$a, 123, 2, 2712);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			mount_component(tablesort, div, null);
			current = true;
		},
		p: function update(ctx, dirty) {
			const tablesort_changes = {};
			if (dirty & /*_pokemons*/ 1) tablesort_changes.items = /*_pokemons*/ ctx[0];

			if (dirty & /*$$scope, $settings, item*/ 8519712) {
				tablesort_changes.$$scope = { dirty, ctx };
			}

			tablesort.$set(tablesort_changes);

			if (!current || dirty & /*$pokemons*/ 8 && div_hidden_value !== (div_hidden_value = !/*$pokemons*/ ctx[3].length)) {
				prop_dev(div, "hidden", div_hidden_value);
			}

			if (dirty & /*$settings*/ 32) {
				toggle_class(div, "show-all", /*$settings*/ ctx[5].io.showAllTable);
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(tablesort.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(tablesort.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			destroy_component(tablesort);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block.name,
		type: "if",
		source: "(123:2) {#if $pokemons.length}",
		ctx
	});

	return block;
}

// (133:6) <tr slot="thead">
function create_thead_slot$1(ctx) {
	let tr;
	let th0;
	let t1;
	let th1;
	let t3;
	let th2;
	let div;
	let t5;
	let th3;
	let t7;
	let th4;
	let t9;
	let th5;
	let t11;
	let th6;
	let t13;
	let th7;
	let t15;
	let th8;

	const block = {
		c: function create() {
			tr = element("tr");
			th0 = element("th");
			th0.textContent = "#";
			t1 = space();
			th1 = element("th");
			th1.textContent = "@";
			t3 = space();
			th2 = element("th");
			div = element("div");
			div.textContent = "Name";
			t5 = space();
			th3 = element("th");
			th3.textContent = "CP";
			t7 = space();
			th4 = element("th");
			th4.textContent = "HP";
			t9 = space();
			th5 = element("th");
			th5.textContent = "Atk";
			t11 = space();
			th6 = element("th");
			th6.textContent = "Def";
			t13 = space();
			th7 = element("th");
			th7.textContent = "Sta";
			t15 = space();
			th8 = element("th");
			th8.textContent = "Tank";
			attr_dev(th0, "data-sort", "dex");
			attr_dev(th0, "data-sort-initial", "");
			add_location(th0, file$a, 133, 8, 2987);
			attr_dev(th1, "data-sort", "types");
			add_location(th1, file$a, 134, 8, 3040);
			attr_dev(div, "class", "text-left");
			add_location(div, file$a, 135, 29, 3098);
			attr_dev(th2, "data-sort", "name");
			add_location(th2, file$a, 135, 8, 3077);
			attr_dev(th3, "data-sort", "maxcp");
			attr_dev(th3, "title", "max CP");
			add_location(th3, file$a, 136, 8, 3145);
			attr_dev(th4, "data-sort", "maxhp");
			attr_dev(th4, "title", "max HP");
			add_location(th4, file$a, 137, 8, 3198);
			attr_dev(th5, "data-sort", "_atk");
			attr_dev(th5, "title", "base Atk");
			add_location(th5, file$a, 138, 8, 3251);
			attr_dev(th6, "data-sort", "_def");
			attr_dev(th6, "title", "base Def");
			add_location(th6, file$a, 139, 8, 3306);
			attr_dev(th7, "data-sort", "_sta");
			attr_dev(th7, "title", "base Sta");
			add_location(th7, file$a, 140, 8, 3361);
			attr_dev(th8, "data-sort", "tank");
			attr_dev(th8, "title", "Def x Sta");
			add_location(th8, file$a, 141, 8, 3416);
			attr_dev(tr, "slot", "thead");
			add_location(tr, file$a, 132, 6, 2961);
		},
		m: function mount(target, anchor) {
			insert_dev(target, tr, anchor);
			append_dev(tr, th0);
			append_dev(tr, t1);
			append_dev(tr, th1);
			append_dev(tr, t3);
			append_dev(tr, th2);
			append_dev(th2, div);
			append_dev(tr, t5);
			append_dev(tr, th3);
			append_dev(tr, t7);
			append_dev(tr, th4);
			append_dev(tr, t9);
			append_dev(tr, th5);
			append_dev(tr, t11);
			append_dev(tr, th6);
			append_dev(tr, t13);
			append_dev(tr, th7);
			append_dev(tr, t15);
			append_dev(tr, th8);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(tr);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_thead_slot$1.name,
		type: "slot",
		source: "(133:6) <tr slot=\\\"thead\\\">",
		ctx
	});

	return block;
}

// (147:10) {#each item.types as type}
function create_each_block$4(ctx) {
	let current;

	const typeicon = new TypeIcon({
			props: { type: /*type*/ ctx[6], class: "d-ib" },
			$$inline: true
		});

	const block = {
		c: function create() {
			create_component(typeicon.$$.fragment);
		},
		m: function mount(target, anchor) {
			mount_component(typeicon, target, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
			const typeicon_changes = {};
			if (dirty & /*item*/ 131072) typeicon_changes.type = /*type*/ ctx[6];
			typeicon.$set(typeicon_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(typeicon.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(typeicon.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(typeicon, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block$4.name,
		type: "each",
		source: "(147:10) {#each item.types as type}",
		ctx
	});

	return block;
}

// (158:12) {:else}
function create_else_block(ctx) {
	let t_value = /*item*/ ctx[17].name + "";
	let t;

	const block = {
		c: function create() {
			t = text(t_value);
		},
		m: function mount(target, anchor) {
			insert_dev(target, t, anchor);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*item*/ 131072 && t_value !== (t_value = /*item*/ ctx[17].name + "")) set_data_dev(t, t_value);
		},
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(t);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_else_block.name,
		type: "else",
		source: "(158:12) {:else}",
		ctx
	});

	return block;
}

// (153:12) {#if item.formName}
function create_if_block_1(ctx) {
	let current;

	const ruby = new Ruby({
			props: {
				class: "x",
				$$slots: {
					default: [create_default_slot_1$1],
					rt: [create_rt_slot$1],
					rb: [create_rb_slot$1]
				},
				$$scope: { ctx }
			},
			$$inline: true
		});

	const block = {
		c: function create() {
			create_component(ruby.$$.fragment);
		},
		m: function mount(target, anchor) {
			mount_component(ruby, target, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
			const ruby_changes = {};

			if (dirty & /*$$scope, item*/ 8519680) {
				ruby_changes.$$scope = { dirty, ctx };
			}

			ruby.$set(ruby_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(ruby.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(ruby.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(ruby, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_1.name,
		type: "if",
		source: "(153:12) {#if item.formName}",
		ctx
	});

	return block;
}

// (155:16) <div slot="rb">
function create_rb_slot$1(ctx) {
	let div;
	let t_value = /*item*/ ctx[17].formName[0] + "";
	let t;

	const block = {
		c: function create() {
			div = element("div");
			t = text(t_value);
			attr_dev(div, "slot", "rb");
			add_location(div, file$a, 154, 16, 3845);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			append_dev(div, t);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*item*/ 131072 && t_value !== (t_value = /*item*/ ctx[17].formName[0] + "")) set_data_dev(t, t_value);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_rb_slot$1.name,
		type: "slot",
		source: "(155:16) <div slot=\\\"rb\\\">",
		ctx
	});

	return block;
}

// (156:16) <div slot="rt">
function create_rt_slot$1(ctx) {
	let div;
	let t_value = /*item*/ ctx[17].formName[1] + "";
	let t;

	const block = {
		c: function create() {
			div = element("div");
			t = text(t_value);
			attr_dev(div, "slot", "rt");
			add_location(div, file$a, 155, 16, 3901);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			append_dev(div, t);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*item*/ 131072 && t_value !== (t_value = /*item*/ ctx[17].formName[1] + "")) set_data_dev(t, t_value);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_rt_slot$1.name,
		type: "slot",
		source: "(156:16) <div slot=\\\"rt\\\">",
		ctx
	});

	return block;
}

// (154:14) <Ruby class="x">
function create_default_slot_1$1(ctx) {
	let t;

	const block = {
		c: function create() {
			t = space();
		},
		m: function mount(target, anchor) {
			insert_dev(target, t, anchor);
		},
		p: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(t);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot_1$1.name,
		type: "slot",
		source: "(154:14) <Ruby class=\\\"x\\\">",
		ctx
	});

	return block;
}

// (144:6) <tr slot="tbody" let:item={item}>
function create_tbody_slot$1(ctx) {
	let tr;
	let td0;
	let t0_value = /*item*/ ctx[17].dex + "";
	let t0;
	let t1;
	let td1;
	let t2;
	let td2;
	let a;
	let current_block_type_index;
	let if_block;
	let a_href_value;
	let a_title_value;
	let t3;
	let td3;
	let t4_value = /*item*/ ctx[17].maxcp + "";
	let t4;
	let t5;
	let td4;
	let t6_value = /*item*/ ctx[17].maxhp + "";
	let t6;
	let t7;
	let td5;
	let t8_value = /*item*/ ctx[17]._atk + "";
	let t8;
	let t9;
	let td6;
	let t10_value = /*item*/ ctx[17]._def + "";
	let t10;
	let t11;
	let td7;
	let t12_value = /*item*/ ctx[17]._sta + "";
	let t12;
	let t13;
	let td8;
	let t14_value = /*item*/ ctx[17].tankStr + "";
	let t14;
	let current;
	let each_value = /*item*/ ctx[17].types;
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block$4(get_each_context$4(ctx, each_value, i));
	}

	const out = i => transition_out(each_blocks[i], 1, 1, () => {
		each_blocks[i] = null;
	});

	const if_block_creators = [create_if_block_1, create_else_block];
	const if_blocks = [];

	function select_block_type(ctx, dirty) {
		if (/*item*/ ctx[17].formName) return 0;
		return 1;
	}

	current_block_type_index = select_block_type(ctx);
	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

	const block = {
		c: function create() {
			tr = element("tr");
			td0 = element("td");
			t0 = text(t0_value);
			t1 = space();
			td1 = element("td");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			t2 = space();
			td2 = element("td");
			a = element("a");
			if_block.c();
			t3 = space();
			td3 = element("td");
			t4 = text(t4_value);
			t5 = space();
			td4 = element("td");
			t6 = text(t6_value);
			t7 = space();
			td5 = element("td");
			t8 = text(t8_value);
			t9 = space();
			td6 = element("td");
			t10 = text(t10_value);
			t11 = space();
			td7 = element("td");
			t12 = text(t12_value);
			t13 = space();
			td8 = element("td");
			t14 = text(t14_value);
			add_location(td0, file$a, 144, 8, 3525);
			add_location(td1, file$a, 145, 8, 3553);
			attr_dev(a, "href", a_href_value = "./pokemon/" + /*item*/ ctx[17].uid);
			attr_dev(a, "title", a_title_value = /*item*/ ctx[17].id);
			add_location(a, file$a, 151, 10, 3718);
			attr_dev(td2, "class", "text-left");
			add_location(td2, file$a, 150, 8, 3685);
			add_location(td3, file$a, 162, 8, 4064);
			add_location(td4, file$a, 163, 8, 4094);
			add_location(td5, file$a, 164, 8, 4124);
			add_location(td6, file$a, 165, 8, 4153);
			add_location(td7, file$a, 166, 8, 4182);
			add_location(td8, file$a, 167, 8, 4211);
			attr_dev(tr, "slot", "tbody");
			add_location(tr, file$a, 143, 6, 3483);
		},
		m: function mount(target, anchor) {
			insert_dev(target, tr, anchor);
			append_dev(tr, td0);
			append_dev(td0, t0);
			append_dev(tr, t1);
			append_dev(tr, td1);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(td1, null);
			}

			append_dev(tr, t2);
			append_dev(tr, td2);
			append_dev(td2, a);
			if_blocks[current_block_type_index].m(a, null);
			append_dev(tr, t3);
			append_dev(tr, td3);
			append_dev(td3, t4);
			append_dev(tr, t5);
			append_dev(tr, td4);
			append_dev(td4, t6);
			append_dev(tr, t7);
			append_dev(tr, td5);
			append_dev(td5, t8);
			append_dev(tr, t9);
			append_dev(tr, td6);
			append_dev(td6, t10);
			append_dev(tr, t11);
			append_dev(tr, td7);
			append_dev(td7, t12);
			append_dev(tr, t13);
			append_dev(tr, td8);
			append_dev(td8, t14);
			current = true;
		},
		p: function update(ctx, dirty) {
			if ((!current || dirty & /*item*/ 131072) && t0_value !== (t0_value = /*item*/ ctx[17].dex + "")) set_data_dev(t0, t0_value);

			if (dirty & /*item*/ 131072) {
				each_value = /*item*/ ctx[17].types;
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context$4(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
						transition_in(each_blocks[i], 1);
					} else {
						each_blocks[i] = create_each_block$4(child_ctx);
						each_blocks[i].c();
						transition_in(each_blocks[i], 1);
						each_blocks[i].m(td1, null);
					}
				}

				group_outros();

				for (i = each_value.length; i < each_blocks.length; i += 1) {
					out(i);
				}

				check_outros();
			}

			let previous_block_index = current_block_type_index;
			current_block_type_index = select_block_type(ctx);

			if (current_block_type_index === previous_block_index) {
				if_blocks[current_block_type_index].p(ctx, dirty);
			} else {
				group_outros();

				transition_out(if_blocks[previous_block_index], 1, 1, () => {
					if_blocks[previous_block_index] = null;
				});

				check_outros();
				if_block = if_blocks[current_block_type_index];

				if (!if_block) {
					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
					if_block.c();
				}

				transition_in(if_block, 1);
				if_block.m(a, null);
			}

			if (!current || dirty & /*item*/ 131072 && a_href_value !== (a_href_value = "./pokemon/" + /*item*/ ctx[17].uid)) {
				attr_dev(a, "href", a_href_value);
			}

			if (!current || dirty & /*item*/ 131072 && a_title_value !== (a_title_value = /*item*/ ctx[17].id)) {
				attr_dev(a, "title", a_title_value);
			}

			if ((!current || dirty & /*item*/ 131072) && t4_value !== (t4_value = /*item*/ ctx[17].maxcp + "")) set_data_dev(t4, t4_value);
			if ((!current || dirty & /*item*/ 131072) && t6_value !== (t6_value = /*item*/ ctx[17].maxhp + "")) set_data_dev(t6, t6_value);
			if ((!current || dirty & /*item*/ 131072) && t8_value !== (t8_value = /*item*/ ctx[17]._atk + "")) set_data_dev(t8, t8_value);
			if ((!current || dirty & /*item*/ 131072) && t10_value !== (t10_value = /*item*/ ctx[17]._def + "")) set_data_dev(t10, t10_value);
			if ((!current || dirty & /*item*/ 131072) && t12_value !== (t12_value = /*item*/ ctx[17]._sta + "")) set_data_dev(t12, t12_value);
			if ((!current || dirty & /*item*/ 131072) && t14_value !== (t14_value = /*item*/ ctx[17].tankStr + "")) set_data_dev(t14, t14_value);
		},
		i: function intro(local) {
			if (current) return;

			for (let i = 0; i < each_value.length; i += 1) {
				transition_in(each_blocks[i]);
			}

			transition_in(if_block);
			current = true;
		},
		o: function outro(local) {
			each_blocks = each_blocks.filter(Boolean);

			for (let i = 0; i < each_blocks.length; i += 1) {
				transition_out(each_blocks[i]);
			}

			transition_out(if_block);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(tr);
			destroy_each(each_blocks, detaching);
			if_blocks[current_block_type_index].d();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_tbody_slot$1.name,
		type: "slot",
		source: "(144:6) <tr slot=\\\"tbody\\\" let:item={item}>",
		ctx
	});

	return block;
}

// (176:6) <tr slot="tfoot" class="sticky-bottom">
function create_tfoot_slot(ctx) {
	let tr0;
	let td;
	let tr1;
	let th0;
	let label;
	let input;
	let t0;
	let t1;
	let th1;
	let t3;
	let th2;
	let t5;
	let th3;
	let t7;
	let th4;
	let t9;
	let th5;
	let t11;
	let th6;
	let dispose;

	const block = {
		c: function create() {
			tr0 = element("tr");
			td = element("td");
			tr1 = element("tr");
			th0 = element("th");
			label = element("label");
			input = element("input");
			t0 = text("\n            Show all?");
			t1 = space();
			th1 = element("th");
			th1.textContent = "CP";
			t3 = space();
			th2 = element("th");
			th2.textContent = "HP";
			t5 = space();
			th3 = element("th");
			th3.textContent = "Atk";
			t7 = space();
			th4 = element("th");
			th4.textContent = "Def";
			t9 = space();
			th5 = element("th");
			th5.textContent = "Sta";
			t11 = space();
			th6 = element("th");
			th6.textContent = "Tank";
			attr_dev(td, "colspan", "8");
			add_location(td, file$a, 172, 8, 4281);
			attr_dev(tr0, "slot", "tfoot");
			add_location(tr0, file$a, 171, 6, 4255);
			attr_dev(input, "type", "checkbox");
			add_location(input, file$a, 183, 12, 4581);
			attr_dev(label, "class", "label ai-c");
			add_location(label, file$a, 182, 10, 4542);
			attr_dev(th0, "colspan", "3");
			attr_dev(th0, "class", "show-all-btn text-left svelte-dcd87g");
			add_location(th0, file$a, 181, 8, 4484);
			attr_dev(th1, "title", "max CP");
			attr_dev(th1, "class", "svelte-dcd87g");
			add_location(th1, file$a, 189, 8, 4736);
			attr_dev(th2, "title", "max HP");
			attr_dev(th2, "class", "svelte-dcd87g");
			add_location(th2, file$a, 190, 8, 4771);
			attr_dev(th3, "title", "base Atk");
			attr_dev(th3, "class", "svelte-dcd87g");
			add_location(th3, file$a, 191, 8, 4806);
			attr_dev(th4, "title", "base Def");
			attr_dev(th4, "class", "svelte-dcd87g");
			add_location(th4, file$a, 192, 8, 4844);
			attr_dev(th5, "title", "base Sta");
			attr_dev(th5, "class", "svelte-dcd87g");
			add_location(th5, file$a, 193, 8, 4882);
			attr_dev(th6, "title", "Def x Sta");
			attr_dev(th6, "class", "svelte-dcd87g");
			add_location(th6, file$a, 194, 8, 4920);
			attr_dev(tr1, "slot", "tfoot");
			attr_dev(tr1, "class", "sticky-bottom svelte-dcd87g");
			add_location(tr1, file$a, 175, 6, 4322);
		},
		m: function mount(target, anchor) {
			insert_dev(target, tr0, anchor);
			append_dev(tr0, td);
			insert_dev(target, tr1, anchor);
			append_dev(tr1, th0);
			append_dev(th0, label);
			append_dev(label, input);
			input.checked = /*$settings*/ ctx[5].io.showAllTable;
			append_dev(label, t0);
			append_dev(tr1, t1);
			append_dev(tr1, th1);
			append_dev(tr1, t3);
			append_dev(tr1, th2);
			append_dev(tr1, t5);
			append_dev(tr1, th3);
			append_dev(tr1, t7);
			append_dev(tr1, th4);
			append_dev(tr1, t9);
			append_dev(tr1, th5);
			append_dev(tr1, t11);
			append_dev(tr1, th6);
			dispose = listen_dev(input, "change", /*input_change_handler*/ ctx[16]);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*$settings*/ 32) {
				input.checked = /*$settings*/ ctx[5].io.showAllTable;
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(tr0);
			if (detaching) detach_dev(tr1);
			dispose();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_tfoot_slot.name,
		type: "slot",
		source: "(176:6) <tr slot=\\\"tfoot\\\" class=\\\"sticky-bottom\\\">",
		ctx
	});

	return block;
}

// (129:4) <TableSort       items={_pokemons}       class="pokemon-table sticky-thead narrow text-right ml-a mr-a"     >
function create_default_slot$2(ctx) {
	let t0;
	let t1;
	let t2;

	const block = {
		c: function create() {
			t0 = space();
			t1 = space();
			t2 = space();
		},
		m: function mount(target, anchor) {
			insert_dev(target, t0, anchor);
			insert_dev(target, t1, anchor);
			insert_dev(target, t2, anchor);
		},
		p: noop,
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(t0);
			if (detaching) detach_dev(t1);
			if (detaching) detach_dev(t2);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot$2.name,
		type: "slot",
		source: "(129:4) <TableSort       items={_pokemons}       class=\\\"pokemon-table sticky-thead narrow text-right ml-a mr-a\\\"     >",
		ctx
	});

	return block;
}

function create_fragment$a(ctx) {
	let t0;
	let section;
	let t1;
	let current;

	const details = new Details({
			props: {
				type: "pm_filter",
				class: "card",
				$$slots: { default: [create_default_slot_2$1] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	let if_block = /*$pokemons*/ ctx[3].length && create_if_block(ctx);

	const block = {
		c: function create() {
			t0 = space();
			section = element("section");
			create_component(details.$$.fragment);
			t1 = space();
			if (if_block) if_block.c();
			document.title = "Pokemon";
			add_location(section, file$a, 68, 0, 1395);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, t0, anchor);
			insert_dev(target, section, anchor);
			mount_component(details, section, null);
			append_dev(section, t1);
			if (if_block) if_block.m(section, null);
			current = true;
		},
		p: function update(ctx, [dirty]) {
			const details_changes = {};

			if (dirty & /*$$scope, $maxDex, dexRangeMax, dexRangeMin, type*/ 8388694) {
				details_changes.$$scope = { dirty, ctx };
			}

			details.$set(details_changes);

			if (/*$pokemons*/ ctx[3].length) {
				if (if_block) {
					if_block.p(ctx, dirty);
					transition_in(if_block, 1);
				} else {
					if_block = create_if_block(ctx);
					if_block.c();
					transition_in(if_block, 1);
					if_block.m(section, null);
				}
			} else if (if_block) {
				group_outros();

				transition_out(if_block, 1, 1, () => {
					if_block = null;
				});

				check_outros();
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(details.$$.fragment, local);
			transition_in(if_block);
			current = true;
		},
		o: function outro(local) {
			transition_out(details.$$.fragment, local);
			transition_out(if_block);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(t0);
			if (detaching) detach_dev(section);
			destroy_component(details);
			if (if_block) if_block.d();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$a.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$9($$self, $$props, $$invalidate) {
	let $pokemons;
	let $maxDex;
	let $settings;
	validate_store(pokemons, "pokemons");
	component_subscribe($$self, pokemons, $$value => $$invalidate(3, $pokemons = $$value));
	validate_store(maxDex, "maxDex");
	component_subscribe($$self, maxDex, $$value => $$invalidate(4, $maxDex = $$value));
	validate_store(settings, "settings");
	component_subscribe($$self, settings, $$value => $$invalidate(5, $settings = $$value));
	let _pokemons = [];
	let type = location.hash ? location.hash.replace("#", "") : "";
	let dexRangeMin = 1;
	let dexRangeMax = 1;
	let genDex = [[1, 151], [152, 251], [252, 386], [387, 493], [494, 694]];
	

	function clicktype(e) {
		let _type = e.detail.type;
		$$invalidate(6, type = _type === type ? null : _type);
	}

	function setRange(r1, r2) {
		$$invalidate(1, dexRangeMin = r1);
		$$invalidate(2, dexRangeMax = r2);
	}

	function pmGOGOGO(pokemons, type, dexMin, dexMax) {
		let [min, max] = [dexMin, dexMax].sort();

		if (type) {
			pokemons = pokemons.filter(pm => pm.types.indexOf(type) !== -1);
		}

		if (min !== 1 || max < $maxDex) {
			pokemons = pokemons.filter(pm => pm.dex >= min && pm.dex <= max);
		}

		return pokemons;
	}

	function input0_input_handler() {
		dexRangeMin = to_number(this.value);
		$$invalidate(1, dexRangeMin);
	}

	function input1_change_input_handler() {
		dexRangeMin = to_number(this.value);
		$$invalidate(1, dexRangeMin);
	}

	function input2_change_input_handler() {
		dexRangeMax = to_number(this.value);
		($$invalidate(2, dexRangeMax), $$invalidate(4, $maxDex));
	}

	function input3_input_handler() {
		dexRangeMax = to_number(this.value);
		($$invalidate(2, dexRangeMax), $$invalidate(4, $maxDex));
	}

	const click_handler = gen => setRange(gen[0], gen[1]);

	function input_change_handler() {
		$settings.io.showAllTable = this.checked;
		settings.set($settings);
	}

	$$self.$capture_state = () => {
		return {};
	};

	$$self.$inject_state = $$props => {
		if ("_pokemons" in $$props) $$invalidate(0, _pokemons = $$props._pokemons);
		if ("type" in $$props) $$invalidate(6, type = $$props.type);
		if ("dexRangeMin" in $$props) $$invalidate(1, dexRangeMin = $$props.dexRangeMin);
		if ("dexRangeMax" in $$props) $$invalidate(2, dexRangeMax = $$props.dexRangeMax);
		if ("genDex" in $$props) $$invalidate(7, genDex = $$props.genDex);
		if ("$pokemons" in $$props) pokemons.set($pokemons = $$props.$pokemons);
		if ("$maxDex" in $$props) maxDex.set($maxDex = $$props.$maxDex);
		if ("$settings" in $$props) settings.set($settings = $$props.$settings);
	};

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*$maxDex*/ 16) {
			 {
				$$invalidate(2, dexRangeMax = $maxDex);
			}
		}

		if ($$self.$$.dirty & /*$pokemons, type, dexRangeMin, dexRangeMax*/ 78) {
			 {
				if ($pokemons.length) {
					if (type && !op.some(_eff => _eff.type === type)) {
						$$invalidate(6, type = null);
					}

					$$invalidate(0, _pokemons = pmGOGOGO($pokemons, type, dexRangeMin, dexRangeMax));
				}
			}
		}
	};

	return [
		_pokemons,
		dexRangeMin,
		dexRangeMax,
		$pokemons,
		$maxDex,
		$settings,
		type,
		genDex,
		clicktype,
		setRange,
		pmGOGOGO,
		input0_input_handler,
		input1_change_input_handler,
		input2_change_input_handler,
		input3_input_handler,
		click_handler,
		input_change_handler
	];
}

class PokemonList extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance$9, create_fragment$a, safe_not_equal, {});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "PokemonList",
			options,
			id: create_fragment$a.name
		});
	}
}

/* ./src/components/TypeFactor.html generated by Svelte v3.18.1 */

const { Object: Object_1 } = globals;
const file$b = "./src/components/TypeFactor.html";

function get_each_context_1$3(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[7] = list[i];
	return child_ctx;
}

function get_each_context$5(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[4] = list[i];
	return child_ctx;
}

function get_each_context_2(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[7] = list[i];
	return child_ctx;
}

// (58:8) {#each types as type}
function create_each_block_2(ctx) {
	let current;

	const typeicon = new TypeIcon({
			props: { type: /*type*/ ctx[7], class: "mr-1" },
			$$inline: true
		});

	const block = {
		c: function create() {
			create_component(typeicon.$$.fragment);
		},
		m: function mount(target, anchor) {
			mount_component(typeicon, target, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
			const typeicon_changes = {};
			if (dirty & /*types*/ 1) typeicon_changes.type = /*type*/ ctx[7];
			typeicon.$set(typeicon_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(typeicon.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(typeicon.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(typeicon, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block_2.name,
		type: "each",
		source: "(58:8) {#each types as type}",
		ctx
	});

	return block;
}

// (71:8) {#each factor[1] as type}
function create_each_block_1$3(ctx) {
	let current;

	const typeicon = new TypeIcon({
			props: { class: "mr-1", type: /*type*/ ctx[7] },
			$$inline: true
		});

	const block = {
		c: function create() {
			create_component(typeicon.$$.fragment);
		},
		m: function mount(target, anchor) {
			mount_component(typeicon, target, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
			const typeicon_changes = {};
			if (dirty & /*renderTypeFactor*/ 4) typeicon_changes.type = /*type*/ ctx[7];
			typeicon.$set(typeicon_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(typeicon.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(typeicon.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(typeicon, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block_1$3.name,
		type: "each",
		source: "(71:8) {#each factor[1] as type}",
		ctx
	});

	return block;
}

// (66:4) {#each renderTypeFactor as factor}
function create_each_block$5(ctx) {
	let div;
	let t;
	let div_data_factor_value;
	let current;
	let each_value_1 = /*factor*/ ctx[4][1];
	let each_blocks = [];

	for (let i = 0; i < each_value_1.length; i += 1) {
		each_blocks[i] = create_each_block_1$3(get_each_context_1$3(ctx, each_value_1, i));
	}

	const out = i => transition_out(each_blocks[i], 1, 1, () => {
		each_blocks[i] = null;
	});

	const block = {
		c: function create() {
			div = element("div");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			t = space();
			attr_dev(div, "class", "types-factor d-if fxw-w mb-5 pb-1 ml-2 mr-2 svelte-1wjr6ah");
			attr_dev(div, "data-factor", div_data_factor_value = /*factor*/ ctx[4][0]);
			set_style(div, "order", /*factor*/ ctx[4][0]);
			set_style(div, "--factor", "'x" + getFactorText(/*factor*/ ctx[4][0]) + "'");
			add_location(div, file$b, 66, 6, 1412);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(div, null);
			}

			append_dev(div, t);
			current = true;
		},
		p: function update(ctx, dirty) {
			if (dirty & /*renderTypeFactor*/ 4) {
				each_value_1 = /*factor*/ ctx[4][1];
				let i;

				for (i = 0; i < each_value_1.length; i += 1) {
					const child_ctx = get_each_context_1$3(ctx, each_value_1, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
						transition_in(each_blocks[i], 1);
					} else {
						each_blocks[i] = create_each_block_1$3(child_ctx);
						each_blocks[i].c();
						transition_in(each_blocks[i], 1);
						each_blocks[i].m(div, t);
					}
				}

				group_outros();

				for (i = each_value_1.length; i < each_blocks.length; i += 1) {
					out(i);
				}

				check_outros();
			}

			if (!current || dirty & /*renderTypeFactor*/ 4 && div_data_factor_value !== (div_data_factor_value = /*factor*/ ctx[4][0])) {
				attr_dev(div, "data-factor", div_data_factor_value);
			}

			if (!current || dirty & /*renderTypeFactor*/ 4) {
				set_style(div, "order", /*factor*/ ctx[4][0]);
			}

			if (!current || dirty & /*renderTypeFactor*/ 4) {
				set_style(div, "--factor", "'x" + getFactorText(/*factor*/ ctx[4][0]) + "'");
			}
		},
		i: function intro(local) {
			if (current) return;

			for (let i = 0; i < each_value_1.length; i += 1) {
				transition_in(each_blocks[i]);
			}

			current = true;
		},
		o: function outro(local) {
			each_blocks = each_blocks.filter(Boolean);

			for (let i = 0; i < each_blocks.length; i += 1) {
				transition_out(each_blocks[i]);
			}

			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			destroy_each(each_blocks, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block$5.name,
		type: "each",
		source: "(66:4) {#each renderTypeFactor as factor}",
		ctx
	});

	return block;
}

// (53:0) <Details type="types-{role}" class="card">
function create_default_slot$3(ctx) {
	let summary;
	let h3;
	let t0;
	let t1;
	let t2;
	let div0;
	let t3;
	let div1;
	let current;
	let each_value_2 = /*types*/ ctx[0];
	let each_blocks_1 = [];

	for (let i = 0; i < each_value_2.length; i += 1) {
		each_blocks_1[i] = create_each_block_2(get_each_context_2(ctx, each_value_2, i));
	}

	const out = i => transition_out(each_blocks_1[i], 1, 1, () => {
		each_blocks_1[i] = null;
	});

	let each_value = /*renderTypeFactor*/ ctx[2];
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block$5(get_each_context$5(ctx, each_value, i));
	}

	const out_1 = i => transition_out(each_blocks[i], 1, 1, () => {
		each_blocks[i] = null;
	});

	const block = {
		c: function create() {
			summary = element("summary");
			h3 = element("h3");
			t0 = text("各屬性招式傷害係數(");
			t1 = text(/*role*/ ctx[1]);
			t2 = text(")\n      ");
			div0 = element("div");

			for (let i = 0; i < each_blocks_1.length; i += 1) {
				each_blocks_1[i].c();
			}

			t3 = space();
			div1 = element("div");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			attr_dev(div0, "class", "d-if");
			add_location(div0, file$b, 56, 6, 1180);
			add_location(h3, file$b, 54, 4, 1145);
			add_location(summary, file$b, 53, 2, 1131);
			attr_dev(div1, "class", "df fd-rr fxw-w jc-se");
			add_location(div1, file$b, 64, 2, 1332);
		},
		m: function mount(target, anchor) {
			insert_dev(target, summary, anchor);
			append_dev(summary, h3);
			append_dev(h3, t0);
			append_dev(h3, t1);
			append_dev(h3, t2);
			append_dev(h3, div0);

			for (let i = 0; i < each_blocks_1.length; i += 1) {
				each_blocks_1[i].m(div0, null);
			}

			insert_dev(target, t3, anchor);
			insert_dev(target, div1, anchor);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(div1, null);
			}

			current = true;
		},
		p: function update(ctx, dirty) {
			if (!current || dirty & /*role*/ 2) set_data_dev(t1, /*role*/ ctx[1]);

			if (dirty & /*types*/ 1) {
				each_value_2 = /*types*/ ctx[0];
				let i;

				for (i = 0; i < each_value_2.length; i += 1) {
					const child_ctx = get_each_context_2(ctx, each_value_2, i);

					if (each_blocks_1[i]) {
						each_blocks_1[i].p(child_ctx, dirty);
						transition_in(each_blocks_1[i], 1);
					} else {
						each_blocks_1[i] = create_each_block_2(child_ctx);
						each_blocks_1[i].c();
						transition_in(each_blocks_1[i], 1);
						each_blocks_1[i].m(div0, null);
					}
				}

				group_outros();

				for (i = each_value_2.length; i < each_blocks_1.length; i += 1) {
					out(i);
				}

				check_outros();
			}

			if (dirty & /*renderTypeFactor, getFactorText*/ 4) {
				each_value = /*renderTypeFactor*/ ctx[2];
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context$5(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
						transition_in(each_blocks[i], 1);
					} else {
						each_blocks[i] = create_each_block$5(child_ctx);
						each_blocks[i].c();
						transition_in(each_blocks[i], 1);
						each_blocks[i].m(div1, null);
					}
				}

				group_outros();

				for (i = each_value.length; i < each_blocks.length; i += 1) {
					out_1(i);
				}

				check_outros();
			}
		},
		i: function intro(local) {
			if (current) return;

			for (let i = 0; i < each_value_2.length; i += 1) {
				transition_in(each_blocks_1[i]);
			}

			for (let i = 0; i < each_value.length; i += 1) {
				transition_in(each_blocks[i]);
			}

			current = true;
		},
		o: function outro(local) {
			each_blocks_1 = each_blocks_1.filter(Boolean);

			for (let i = 0; i < each_blocks_1.length; i += 1) {
				transition_out(each_blocks_1[i]);
			}

			each_blocks = each_blocks.filter(Boolean);

			for (let i = 0; i < each_blocks.length; i += 1) {
				transition_out(each_blocks[i]);
			}

			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(summary);
			destroy_each(each_blocks_1, detaching);
			if (detaching) detach_dev(t3);
			if (detaching) detach_dev(div1);
			destroy_each(each_blocks, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot$3.name,
		type: "slot",
		source: "(53:0) <Details type=\\\"types-{role}\\\" class=\\\"card\\\">",
		ctx
	});

	return block;
}

function create_fragment$b(ctx) {
	let current;

	const details = new Details({
			props: {
				type: "types-" + /*role*/ ctx[1],
				class: "card",
				$$slots: { default: [create_default_slot$3] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	const block = {
		c: function create() {
			create_component(details.$$.fragment);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			mount_component(details, target, anchor);
			current = true;
		},
		p: function update(ctx, [dirty]) {
			const details_changes = {};
			if (dirty & /*role*/ 2) details_changes.type = "types-" + /*role*/ ctx[1];

			if (dirty & /*$$scope, renderTypeFactor, types, role*/ 4103) {
				details_changes.$$scope = { dirty, ctx };
			}

			details.$set(details_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(details.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(details.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(details, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$b.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function getFactorText(factor) {
	return fixNum(Math.pow(8 / 5, factor));
}

function instance$a($$self, $$props, $$invalidate) {
	let { types = [] } = $$props;
	let { role = "🛡️" } = $$props;
	const o_types = op.map(i => i.type);
	let renderTypeFactor = [];
	const writable_props = ["types", "role"];

	Object_1.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<TypeFactor> was created with unknown prop '${key}'`);
	});

	$$self.$set = $$props => {
		if ("types" in $$props) $$invalidate(0, types = $$props.types);
		if ("role" in $$props) $$invalidate(1, role = $$props.role);
	};

	$$self.$capture_state = () => {
		return { types, role, renderTypeFactor };
	};

	$$self.$inject_state = $$props => {
		if ("types" in $$props) $$invalidate(0, types = $$props.types);
		if ("role" in $$props) $$invalidate(1, role = $$props.role);
		if ("renderTypeFactor" in $$props) $$invalidate(2, renderTypeFactor = $$props.renderTypeFactor);
	};

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*types, role, renderTypeFactor*/ 7) {
			 {
				let effTable = o_types.reduce(
					(all, t) => {
						all[t] = 0;
						return all;
					},
					{}
				);

				types.forEach(type => {
					let targetEffs = op.find(e => e.type === type).effs;
					let queryEffs;

					if (role === "🛡️") {
						queryEffs = targetEffs[2].concat(targetEffs[3]);
					} else {
						queryEffs = targetEffs[0].concat(targetEffs[1]);
					}

					queryEffs.forEach(t => {
						effTable[t.type] += t.factor;
					});
				});

				$$invalidate(2, renderTypeFactor = Object.values(effTable).reduce(
					(all, i, index) => {
						if (!i) {
							return all;
						}

						if (!all[i]) {
							all[i] = [];
						}

						all[i].push(o_types[index]);
						return all;
					},
					{}
				));

				$$invalidate(2, renderTypeFactor = Object.keys(renderTypeFactor).map(i => [i, renderTypeFactor[i]]));
			}
		}
	};

	return [types, role, renderTypeFactor];
}

class TypeFactor extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance$a, create_fragment$b, safe_not_equal, { types: 0, role: 1 });

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "TypeFactor",
			options,
			id: create_fragment$b.name
		});
	}

	get types() {
		throw new Error("<TypeFactor>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set types(value) {
		throw new Error("<TypeFactor>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get role() {
		throw new Error("<TypeFactor>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set role(value) {
		throw new Error("<TypeFactor>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* ./src/routes/MovePage.html generated by Svelte v3.18.1 */
const file$c = "./src/routes/MovePage.html";

// (51:0) {#if move}
function create_if_block$1(ctx) {
	let div3;
	let section;
	let h2;
	let t0;
	let t1;
	let div0;
	let t2;
	let t3_value = (/*move*/ ctx[0].isFast ? "Fast" : "Charge") + "";
	let t3;
	let t4;
	let t5;
	let div2;
	let table0;
	let tr0;
	let th0;
	let t7;
	let tr1;
	let td0;
	let t9;
	let td1;
	let t10_value = /*move*/ ctx[0].power + "";
	let t10;
	let t11;
	let t12;
	let table1;
	let tr2;
	let th1;
	let t14;
	let tr3;
	let td2;
	let t16;
	let td3;
	let t17_value = /*move*/ ctx[0].pve_power + "";
	let t17;
	let t18;
	let tr4;
	let td4;
	let t20;
	let td5;
	let t21_value = /*move*/ ctx[0].pve_energyDelta + "";
	let t21;
	let t22;
	let tr5;
	let td6;
	let t24;
	let td7;
	let t25_value = /*move*/ ctx[0].pve_dps + "";
	let t25;
	let t26;
	let t27;
	let tr6;
	let td8;
	let t29;
	let td9;
	let t30_value = /*move*/ ctx[0].pve_damageWindowStart + "";
	let t30;
	let small0;
	let t32;
	let tr7;
	let td10;
	let t34;
	let td11;
	let t35_value = /*move*/ ctx[0].pve_duration + "";
	let t35;
	let small1;
	let t37;
	let tr8;
	let td12;
	let div1;
	let small2;
	let t39;
	let t40;
	let current;

	const ruby = new Ruby({
			props: {
				class: "_",
				$$slots: {
					default: [create_default_slot_2$2],
					rt: [create_rt_slot$2],
					rb: [create_rb_slot$2]
				},
				$$scope: { ctx }
			},
			$$inline: true
		});

	const typeicon = new TypeIcon({
			props: { type: /*move*/ ctx[0].type },
			$$inline: true
		});

	function select_block_type(ctx, dirty) {
		if (/*move*/ ctx[0].isFast) return create_if_block_2;
		return create_else_block_1;
	}

	let current_block_type = select_block_type(ctx);
	let if_block0 = current_block_type(ctx);

	function select_block_type_1(ctx, dirty) {
		if (/*move*/ ctx[0].isFast) return create_if_block_1$1;
		return create_else_block$1;
	}

	let current_block_type_1 = select_block_type_1(ctx);
	let if_block1 = current_block_type_1(ctx);

	const typefactor = new TypeFactor({
			props: {
				types: [/*move*/ ctx[0].type],
				role: "⚔️"
			},
			$$inline: true
		});

	const details = new Details({
			props: {
				type: "samemove",
				class: "card",
				$$slots: { default: [create_default_slot$4] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	const block = {
		c: function create() {
			div3 = element("div");
			section = element("section");
			h2 = element("h2");
			create_component(ruby.$$.fragment);
			t0 = space();
			create_component(typeicon.$$.fragment);
			t1 = space();
			div0 = element("div");
			t2 = text("[ ");
			t3 = text(t3_value);
			t4 = text(" ]");
			t5 = space();
			div2 = element("div");
			table0 = element("table");
			tr0 = element("tr");
			th0 = element("th");
			th0.textContent = "PVP";
			t7 = space();
			tr1 = element("tr");
			td0 = element("td");
			td0.textContent = "Power";
			t9 = space();
			td1 = element("td");
			t10 = text(t10_value);
			t11 = space();
			if_block0.c();
			t12 = space();
			table1 = element("table");
			tr2 = element("tr");
			th1 = element("th");
			th1.textContent = "PVE";
			t14 = space();
			tr3 = element("tr");
			td2 = element("td");
			td2.textContent = "Power";
			t16 = space();
			td3 = element("td");
			t17 = text(t17_value);
			t18 = space();
			tr4 = element("tr");
			td4 = element("td");
			td4.textContent = "Energy";
			t20 = space();
			td5 = element("td");
			t21 = text(t21_value);
			t22 = space();
			tr5 = element("tr");
			td6 = element("td");
			td6.textContent = "DPS";
			t24 = space();
			td7 = element("td");
			t25 = text(t25_value);
			t26 = space();
			if_block1.c();
			t27 = space();
			tr6 = element("tr");
			td8 = element("td");
			td8.textContent = "Active";
			t29 = space();
			td9 = element("td");
			t30 = text(t30_value);
			small0 = element("small");
			small0.textContent = "s";
			t32 = space();
			tr7 = element("tr");
			td10 = element("td");
			td10.textContent = "Time";
			t34 = space();
			td11 = element("td");
			t35 = text(t35_value);
			small1 = element("small");
			small1.textContent = "s";
			t37 = space();
			tr8 = element("tr");
			td12 = element("td");
			div1 = element("div");
			small2 = element("small");
			small2.textContent = "5s";
			t39 = space();
			create_component(typefactor.$$.fragment);
			t40 = space();
			create_component(details.$$.fragment);
			attr_dev(h2, "class", "d-if");
			add_location(h2, file$c, 53, 6, 1016);
			attr_dev(div0, "class", "text-center mb-2");
			add_location(div0, file$c, 61, 6, 1220);
			attr_dev(th0, "colspan", "2");
			add_location(th0, file$c, 68, 12, 1402);
			add_location(tr0, file$c, 67, 10, 1385);
			attr_dev(td0, "title", "傷害");
			add_location(td0, file$c, 74, 12, 1499);
			add_location(td1, file$c, 75, 12, 1537);
			add_location(tr1, file$c, 73, 10, 1482);
			attr_dev(table0, "class", "mb-4");
			add_location(table0, file$c, 66, 8, 1354);
			attr_dev(th1, "colspan", "2");
			add_location(th1, file$c, 131, 12, 2752);
			add_location(tr2, file$c, 130, 10, 2735);
			attr_dev(td2, "title", "傷害");
			add_location(td2, file$c, 137, 12, 2849);
			add_location(td3, file$c, 138, 12, 2887);
			add_location(tr3, file$c, 136, 10, 2832);
			attr_dev(td4, "title", "能量");
			add_location(td4, file$c, 142, 12, 2957);
			set_style(td5, "--bgzx", -/*move*/ ctx[0].pve_energyDelta + "%");
			toggle_class(td5, "energy-bar", !/*move*/ ctx[0].isFast);
			add_location(td5, file$c, 143, 12, 2996);
			add_location(tr4, file$c, 141, 10, 2940);
			attr_dev(td6, "title", "DPS");
			add_location(td6, file$c, 152, 12, 3216);
			add_location(td7, file$c, 153, 12, 3253);
			add_location(tr5, file$c, 151, 10, 3199);
			attr_dev(td8, "title", "黃光(秒)");
			add_location(td8, file$c, 172, 12, 3731);
			add_location(small0, file$c, 173, 44, 3805);
			add_location(td9, file$c, 173, 12, 3773);
			add_location(tr6, file$c, 171, 10, 3714);
			attr_dev(td10, "title", "耗時(秒)");
			add_location(td10, file$c, 176, 12, 3870);
			add_location(small1, file$c, 177, 35, 3933);
			add_location(td11, file$c, 177, 12, 3910);
			add_location(tr7, file$c, 175, 10, 3853);
			add_location(small2, file$c, 184, 16, 4231);
			attr_dev(div1, "class", "damage-window text-right");
			set_style(div1, "--ds", /*move*/ ctx[0].pve_damageWindowStart / 5);
			set_style(div1, "--de", /*move*/ ctx[0].pve_damageWindowEnd / 5);
			set_style(div1, "--da", /*move*/ ctx[0].pve_duration / 5);
			add_location(div1, file$c, 181, 14, 4029);
			attr_dev(td12, "colspan", "2");
			add_location(td12, file$c, 180, 12, 3998);
			add_location(tr8, file$c, 179, 10, 3981);
			add_location(table1, file$c, 129, 8, 2717);
			attr_dev(div2, "class", "df fxw-w jc-se");
			add_location(div2, file$c, 65, 6, 1317);
			attr_dev(section, "class", "card");
			add_location(section, file$c, 52, 4, 987);
			add_location(div3, file$c, 51, 2, 977);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div3, anchor);
			append_dev(div3, section);
			append_dev(section, h2);
			mount_component(ruby, h2, null);
			append_dev(h2, t0);
			mount_component(typeicon, h2, null);
			append_dev(section, t1);
			append_dev(section, div0);
			append_dev(div0, t2);
			append_dev(div0, t3);
			append_dev(div0, t4);
			append_dev(section, t5);
			append_dev(section, div2);
			append_dev(div2, table0);
			append_dev(table0, tr0);
			append_dev(tr0, th0);
			append_dev(table0, t7);
			append_dev(table0, tr1);
			append_dev(tr1, td0);
			append_dev(tr1, t9);
			append_dev(tr1, td1);
			append_dev(td1, t10);
			append_dev(table0, t11);
			if_block0.m(table0, null);
			append_dev(div2, t12);
			append_dev(div2, table1);
			append_dev(table1, tr2);
			append_dev(tr2, th1);
			append_dev(table1, t14);
			append_dev(table1, tr3);
			append_dev(tr3, td2);
			append_dev(tr3, t16);
			append_dev(tr3, td3);
			append_dev(td3, t17);
			append_dev(table1, t18);
			append_dev(table1, tr4);
			append_dev(tr4, td4);
			append_dev(tr4, t20);
			append_dev(tr4, td5);
			append_dev(td5, t21);
			append_dev(table1, t22);
			append_dev(table1, tr5);
			append_dev(tr5, td6);
			append_dev(tr5, t24);
			append_dev(tr5, td7);
			append_dev(td7, t25);
			append_dev(table1, t26);
			if_block1.m(table1, null);
			append_dev(table1, t27);
			append_dev(table1, tr6);
			append_dev(tr6, td8);
			append_dev(tr6, t29);
			append_dev(tr6, td9);
			append_dev(td9, t30);
			append_dev(td9, small0);
			append_dev(table1, t32);
			append_dev(table1, tr7);
			append_dev(tr7, td10);
			append_dev(tr7, t34);
			append_dev(tr7, td11);
			append_dev(td11, t35);
			append_dev(td11, small1);
			append_dev(table1, t37);
			append_dev(table1, tr8);
			append_dev(tr8, td12);
			append_dev(td12, div1);
			append_dev(div1, small2);
			append_dev(div3, t39);
			mount_component(typefactor, div3, null);
			append_dev(div3, t40);
			mount_component(details, div3, null);
			current = true;
		},
		p: function update(ctx, dirty) {
			const ruby_changes = {};

			if (dirty & /*$$scope, move*/ 129) {
				ruby_changes.$$scope = { dirty, ctx };
			}

			ruby.$set(ruby_changes);
			const typeicon_changes = {};
			if (dirty & /*move*/ 1) typeicon_changes.type = /*move*/ ctx[0].type;
			typeicon.$set(typeicon_changes);
			if ((!current || dirty & /*move*/ 1) && t3_value !== (t3_value = (/*move*/ ctx[0].isFast ? "Fast" : "Charge") + "")) set_data_dev(t3, t3_value);
			if ((!current || dirty & /*move*/ 1) && t10_value !== (t10_value = /*move*/ ctx[0].power + "")) set_data_dev(t10, t10_value);

			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block0) {
				if_block0.p(ctx, dirty);
			} else {
				if_block0.d(1);
				if_block0 = current_block_type(ctx);

				if (if_block0) {
					if_block0.c();
					if_block0.m(table0, null);
				}
			}

			if ((!current || dirty & /*move*/ 1) && t17_value !== (t17_value = /*move*/ ctx[0].pve_power + "")) set_data_dev(t17, t17_value);
			if ((!current || dirty & /*move*/ 1) && t21_value !== (t21_value = /*move*/ ctx[0].pve_energyDelta + "")) set_data_dev(t21, t21_value);

			if (!current || dirty & /*move*/ 1) {
				set_style(td5, "--bgzx", -/*move*/ ctx[0].pve_energyDelta + "%");
			}

			if (dirty & /*move*/ 1) {
				toggle_class(td5, "energy-bar", !/*move*/ ctx[0].isFast);
			}

			if ((!current || dirty & /*move*/ 1) && t25_value !== (t25_value = /*move*/ ctx[0].pve_dps + "")) set_data_dev(t25, t25_value);

			if (current_block_type_1 === (current_block_type_1 = select_block_type_1(ctx)) && if_block1) {
				if_block1.p(ctx, dirty);
			} else {
				if_block1.d(1);
				if_block1 = current_block_type_1(ctx);

				if (if_block1) {
					if_block1.c();
					if_block1.m(table1, t27);
				}
			}

			if ((!current || dirty & /*move*/ 1) && t30_value !== (t30_value = /*move*/ ctx[0].pve_damageWindowStart + "")) set_data_dev(t30, t30_value);
			if ((!current || dirty & /*move*/ 1) && t35_value !== (t35_value = /*move*/ ctx[0].pve_duration + "")) set_data_dev(t35, t35_value);

			if (!current || dirty & /*move*/ 1) {
				set_style(div1, "--ds", /*move*/ ctx[0].pve_damageWindowStart / 5);
			}

			if (!current || dirty & /*move*/ 1) {
				set_style(div1, "--de", /*move*/ ctx[0].pve_damageWindowEnd / 5);
			}

			if (!current || dirty & /*move*/ 1) {
				set_style(div1, "--da", /*move*/ ctx[0].pve_duration / 5);
			}

			const typefactor_changes = {};
			if (dirty & /*move*/ 1) typefactor_changes.types = [/*move*/ ctx[0].type];
			typefactor.$set(typefactor_changes);
			const details_changes = {};

			if (dirty & /*$$scope, pms*/ 130) {
				details_changes.$$scope = { dirty, ctx };
			}

			details.$set(details_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(ruby.$$.fragment, local);
			transition_in(typeicon.$$.fragment, local);
			transition_in(typefactor.$$.fragment, local);
			transition_in(details.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(ruby.$$.fragment, local);
			transition_out(typeicon.$$.fragment, local);
			transition_out(typefactor.$$.fragment, local);
			transition_out(details.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div3);
			destroy_component(ruby);
			destroy_component(typeicon);
			if_block0.d();
			if_block1.d();
			destroy_component(typefactor);
			destroy_component(details);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$1.name,
		type: "if",
		source: "(51:0) {#if move}",
		ctx
	});

	return block;
}

// (56:10) <div slot="rb">
function create_rb_slot$2(ctx) {
	let div;
	let t_value = /*move*/ ctx[0].name + "";
	let t;

	const block = {
		c: function create() {
			div = element("div");
			t = text(t_value);
			attr_dev(div, "slot", "rb");
			add_location(div, file$c, 55, 10, 1069);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			append_dev(div, t);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*move*/ 1 && t_value !== (t_value = /*move*/ ctx[0].name + "")) set_data_dev(t, t_value);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_rb_slot$2.name,
		type: "slot",
		source: "(56:10) <div slot=\\\"rb\\\">",
		ctx
	});

	return block;
}

// (57:10) <div slot="rt">
function create_rt_slot$2(ctx) {
	let div;
	let t_value = /*move*/ ctx[0].moveId + "";
	let t;

	const block = {
		c: function create() {
			div = element("div");
			t = text(t_value);
			attr_dev(div, "slot", "rt");
			add_location(div, file$c, 56, 10, 1112);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			append_dev(div, t);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*move*/ 1 && t_value !== (t_value = /*move*/ ctx[0].moveId + "")) set_data_dev(t, t_value);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_rt_slot$2.name,
		type: "slot",
		source: "(57:10) <div slot=\\\"rt\\\">",
		ctx
	});

	return block;
}

// (55:8) <Ruby class="_">
function create_default_slot_2$2(ctx) {
	let t;

	const block = {
		c: function create() {
			t = space();
		},
		m: function mount(target, anchor) {
			insert_dev(target, t, anchor);
		},
		p: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(t);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot_2$2.name,
		type: "slot",
		source: "(55:8) <Ruby class=\\\"_\\\">",
		ctx
	});

	return block;
}

// (106:10) {:else}
function create_else_block_1(ctx) {
	let tr0;
	let td0;
	let t1;
	let td1;
	let t2;
	let t3_value = /*move*/ ctx[0].energy + "";
	let t3;
	let t4;
	let tr1;
	let td2;
	let t6;
	let td3;
	let t7_value = /*move*/ ctx[0].dpe + "";
	let t7;
	let t8;
	let if_block_anchor;
	let if_block = /*move*/ ctx[0].effect && create_if_block_3(ctx);

	const block = {
		c: function create() {
			tr0 = element("tr");
			td0 = element("td");
			td0.textContent = "Energy";
			t1 = space();
			td1 = element("td");
			t2 = text("-");
			t3 = text(t3_value);
			t4 = space();
			tr1 = element("tr");
			td2 = element("td");
			td2.textContent = "DPE";
			t6 = space();
			td3 = element("td");
			t7 = text(t7_value);
			t8 = space();
			if (if_block) if_block.c();
			if_block_anchor = empty();
			attr_dev(td0, "title", "能量(出)");
			add_location(td0, file$c, 108, 14, 2187);
			attr_dev(td1, "class", "energy-bar");
			set_style(td1, "--bgzx", /*move*/ ctx[0].energy + "%");
			add_location(td1, file$c, 109, 14, 2231);
			add_location(tr0, file$c, 107, 12, 2168);
			add_location(td2, file$c, 113, 14, 2355);
			add_location(td3, file$c, 114, 14, 2382);
			add_location(tr1, file$c, 112, 12, 2336);
		},
		m: function mount(target, anchor) {
			insert_dev(target, tr0, anchor);
			append_dev(tr0, td0);
			append_dev(tr0, t1);
			append_dev(tr0, td1);
			append_dev(td1, t2);
			append_dev(td1, t3);
			insert_dev(target, t4, anchor);
			insert_dev(target, tr1, anchor);
			append_dev(tr1, td2);
			append_dev(tr1, t6);
			append_dev(tr1, td3);
			append_dev(td3, t7);
			insert_dev(target, t8, anchor);
			if (if_block) if_block.m(target, anchor);
			insert_dev(target, if_block_anchor, anchor);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*move*/ 1 && t3_value !== (t3_value = /*move*/ ctx[0].energy + "")) set_data_dev(t3, t3_value);

			if (dirty & /*move*/ 1) {
				set_style(td1, "--bgzx", /*move*/ ctx[0].energy + "%");
			}

			if (dirty & /*move*/ 1 && t7_value !== (t7_value = /*move*/ ctx[0].dpe + "")) set_data_dev(t7, t7_value);

			if (/*move*/ ctx[0].effect) {
				if (if_block) {
					if_block.p(ctx, dirty);
				} else {
					if_block = create_if_block_3(ctx);
					if_block.c();
					if_block.m(if_block_anchor.parentNode, if_block_anchor);
				}
			} else if (if_block) {
				if_block.d(1);
				if_block = null;
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(tr0);
			if (detaching) detach_dev(t4);
			if (detaching) detach_dev(tr1);
			if (detaching) detach_dev(t8);
			if (if_block) if_block.d(detaching);
			if (detaching) detach_dev(if_block_anchor);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_else_block_1.name,
		type: "else",
		source: "(106:10) {:else}",
		ctx
	});

	return block;
}

// (79:10) {#if move.isFast}
function create_if_block_2(ctx) {
	let tr0;
	let td0;
	let t1;
	let td1;
	let t2_value = /*move*/ ctx[0].energyGain + "";
	let t2;
	let t3;
	let tr1;
	let td2;
	let t5;
	let td3;
	let t6_value = /*move*/ ctx[0].turn + "";
	let t6;
	let t7;
	let tr2;
	let td4;
	let t9;
	let td5;
	let t10_value = /*move*/ ctx[0].ept + "";
	let t10;
	let t11;
	let tr3;
	let td6;
	let t13;
	let td7;
	let t14_value = /*move*/ ctx[0].dpt + "";
	let t14;
	let t15;
	let tr4;
	let td8;
	let t17;
	let td9;
	let t18_value = /*move*/ ctx[0].eptxdpt + "";
	let t18;

	const block = {
		c: function create() {
			tr0 = element("tr");
			td0 = element("td");
			td0.textContent = "Energy";
			t1 = space();
			td1 = element("td");
			t2 = text(t2_value);
			t3 = space();
			tr1 = element("tr");
			td2 = element("td");
			td2.textContent = "Turn";
			t5 = space();
			td3 = element("td");
			t6 = text(t6_value);
			t7 = space();
			tr2 = element("tr");
			td4 = element("td");
			td4.textContent = "EPT";
			t9 = space();
			td5 = element("td");
			t10 = text(t10_value);
			t11 = space();
			tr3 = element("tr");
			td6 = element("td");
			td6.textContent = "DPT";
			t13 = space();
			td7 = element("td");
			t14 = text(t14_value);
			t15 = space();
			tr4 = element("tr");
			td8 = element("td");
			td8.textContent = "EPT x DPT";
			t17 = space();
			td9 = element("td");
			t18 = text(t18_value);
			attr_dev(td0, "title", "能量(得)");
			add_location(td0, file$c, 81, 14, 1636);
			add_location(td1, file$c, 82, 14, 1680);
			add_location(tr0, file$c, 80, 12, 1617);
			attr_dev(td2, "title", "回合");
			add_location(td2, file$c, 86, 14, 1757);
			add_location(td3, file$c, 87, 14, 1796);
			add_location(tr1, file$c, 85, 12, 1738);
			add_location(td4, file$c, 91, 14, 1867);
			add_location(td5, file$c, 92, 14, 1894);
			add_location(tr2, file$c, 90, 12, 1848);
			add_location(td6, file$c, 96, 14, 1964);
			add_location(td7, file$c, 97, 14, 1991);
			add_location(tr3, file$c, 95, 12, 1945);
			add_location(td8, file$c, 101, 14, 2061);
			add_location(td9, file$c, 102, 14, 2094);
			add_location(tr4, file$c, 100, 12, 2042);
		},
		m: function mount(target, anchor) {
			insert_dev(target, tr0, anchor);
			append_dev(tr0, td0);
			append_dev(tr0, t1);
			append_dev(tr0, td1);
			append_dev(td1, t2);
			insert_dev(target, t3, anchor);
			insert_dev(target, tr1, anchor);
			append_dev(tr1, td2);
			append_dev(tr1, t5);
			append_dev(tr1, td3);
			append_dev(td3, t6);
			insert_dev(target, t7, anchor);
			insert_dev(target, tr2, anchor);
			append_dev(tr2, td4);
			append_dev(tr2, t9);
			append_dev(tr2, td5);
			append_dev(td5, t10);
			insert_dev(target, t11, anchor);
			insert_dev(target, tr3, anchor);
			append_dev(tr3, td6);
			append_dev(tr3, t13);
			append_dev(tr3, td7);
			append_dev(td7, t14);
			insert_dev(target, t15, anchor);
			insert_dev(target, tr4, anchor);
			append_dev(tr4, td8);
			append_dev(tr4, t17);
			append_dev(tr4, td9);
			append_dev(td9, t18);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*move*/ 1 && t2_value !== (t2_value = /*move*/ ctx[0].energyGain + "")) set_data_dev(t2, t2_value);
			if (dirty & /*move*/ 1 && t6_value !== (t6_value = /*move*/ ctx[0].turn + "")) set_data_dev(t6, t6_value);
			if (dirty & /*move*/ 1 && t10_value !== (t10_value = /*move*/ ctx[0].ept + "")) set_data_dev(t10, t10_value);
			if (dirty & /*move*/ 1 && t14_value !== (t14_value = /*move*/ ctx[0].dpt + "")) set_data_dev(t14, t14_value);
			if (dirty & /*move*/ 1 && t18_value !== (t18_value = /*move*/ ctx[0].eptxdpt + "")) set_data_dev(t18, t18_value);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(tr0);
			if (detaching) detach_dev(t3);
			if (detaching) detach_dev(tr1);
			if (detaching) detach_dev(t7);
			if (detaching) detach_dev(tr2);
			if (detaching) detach_dev(t11);
			if (detaching) detach_dev(tr3);
			if (detaching) detach_dev(t15);
			if (detaching) detach_dev(tr4);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_2.name,
		type: "if",
		source: "(79:10) {#if move.isFast}",
		ctx
	});

	return block;
}

// (118:12) {#if move.effect}
function create_if_block_3(ctx) {
	let tr;
	let td;
	let t0;
	let div;
	let t1_value = /*move*/ ctx[0].effect + "";
	let t1;

	const block = {
		c: function create() {
			tr = element("tr");
			td = element("td");
			t0 = text("Effect\n                  ");
			div = element("div");
			t1 = text(t1_value);
			attr_dev(div, "class", "move-effect fz-s pt-1 svelte-tt3bvc");
			add_location(div, file$c, 121, 18, 2557);
			attr_dev(td, "title", "效果");
			attr_dev(td, "colspan", "2");
			add_location(td, file$c, 119, 16, 2486);
			add_location(tr, file$c, 118, 14, 2465);
		},
		m: function mount(target, anchor) {
			insert_dev(target, tr, anchor);
			append_dev(tr, td);
			append_dev(td, t0);
			append_dev(td, div);
			append_dev(div, t1);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*move*/ 1 && t1_value !== (t1_value = /*move*/ ctx[0].effect + "")) set_data_dev(t1, t1_value);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(tr);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_3.name,
		type: "if",
		source: "(118:12) {#if move.effect}",
		ctx
	});

	return block;
}

// (162:10) {:else}
function create_else_block$1(ctx) {
	let tr0;
	let td0;
	let t1;
	let td1;
	let t2_value = /*move*/ ctx[0].pve_dpe + "";
	let t2;
	let t3;
	let tr1;
	let td2;
	let t5;
	let td3;
	let t6_value = /*move*/ ctx[0].pve_dpsxdpe + "";
	let t6;

	const block = {
		c: function create() {
			tr0 = element("tr");
			td0 = element("td");
			td0.textContent = "DPE";
			t1 = space();
			td1 = element("td");
			t2 = text(t2_value);
			t3 = space();
			tr1 = element("tr");
			td2 = element("td");
			td2.textContent = "DPS*DPE";
			t5 = space();
			td3 = element("td");
			t6 = text(t6_value);
			attr_dev(td0, "title", "DPE");
			add_location(td0, file$c, 163, 14, 3483);
			add_location(td1, file$c, 164, 14, 3522);
			add_location(tr0, file$c, 162, 12, 3464);
			attr_dev(td2, "title", "DPS*DPE");
			add_location(td2, file$c, 167, 14, 3595);
			add_location(td3, file$c, 168, 14, 3642);
			add_location(tr1, file$c, 166, 12, 3576);
		},
		m: function mount(target, anchor) {
			insert_dev(target, tr0, anchor);
			append_dev(tr0, td0);
			append_dev(tr0, t1);
			append_dev(tr0, td1);
			append_dev(td1, t2);
			insert_dev(target, t3, anchor);
			insert_dev(target, tr1, anchor);
			append_dev(tr1, td2);
			append_dev(tr1, t5);
			append_dev(tr1, td3);
			append_dev(td3, t6);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*move*/ 1 && t2_value !== (t2_value = /*move*/ ctx[0].pve_dpe + "")) set_data_dev(t2, t2_value);
			if (dirty & /*move*/ 1 && t6_value !== (t6_value = /*move*/ ctx[0].pve_dpsxdpe + "")) set_data_dev(t6, t6_value);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(tr0);
			if (detaching) detach_dev(t3);
			if (detaching) detach_dev(tr1);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_else_block$1.name,
		type: "else",
		source: "(162:10) {:else}",
		ctx
	});

	return block;
}

// (157:10) {#if move.isFast}
function create_if_block_1$1(ctx) {
	let tr;
	let td0;
	let t1;
	let td1;
	let t2_value = /*move*/ ctx[0].pve_eps + "";
	let t2;

	const block = {
		c: function create() {
			tr = element("tr");
			td0 = element("td");
			td0.textContent = "EPS";
			t1 = space();
			td1 = element("td");
			t2 = text(t2_value);
			attr_dev(td0, "title", "EPS");
			add_location(td0, file$c, 158, 14, 3353);
			add_location(td1, file$c, 159, 14, 3392);
			add_location(tr, file$c, 157, 12, 3334);
		},
		m: function mount(target, anchor) {
			insert_dev(target, tr, anchor);
			append_dev(tr, td0);
			append_dev(tr, t1);
			append_dev(tr, td1);
			append_dev(td1, t2);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*move*/ 1 && t2_value !== (t2_value = /*move*/ ctx[0].pve_eps + "")) set_data_dev(t2, t2_value);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(tr);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_1$1.name,
		type: "if",
		source: "(157:10) {#if move.isFast}",
		ctx
	});

	return block;
}

// (201:8) <tr slot="thead">
function create_thead_slot$2(ctx) {
	let tr;
	let th0;
	let t1;
	let th1;
	let t3;
	let th2;
	let t5;
	let th3;
	let t7;
	let th4;

	const block = {
		c: function create() {
			tr = element("tr");
			th0 = element("th");
			th0.textContent = "Dex";
			t1 = space();
			th1 = element("th");
			th1.textContent = "Name";
			t3 = space();
			th2 = element("th");
			th2.textContent = "Atk";
			t5 = space();
			th3 = element("th");
			th3.textContent = "CP";
			t7 = space();
			th4 = element("th");
			th4.textContent = "Tank";
			attr_dev(th0, "data-sort", "dex");
			add_location(th0, file$c, 201, 10, 4587);
			attr_dev(th1, "data-sort", "name");
			add_location(th1, file$c, 202, 10, 4626);
			attr_dev(th2, "data-sort", "atk");
			add_location(th2, file$c, 203, 10, 4667);
			attr_dev(th3, "data-sort", "maxcp");
			add_location(th3, file$c, 204, 10, 4706);
			attr_dev(th4, "data-sort", "tankStr");
			attr_dev(th4, "data-sort-initial", "descending");
			attr_dev(th4, "title", "Def x Sta");
			add_location(th4, file$c, 205, 10, 4746);
			attr_dev(tr, "slot", "thead");
			add_location(tr, file$c, 200, 8, 4559);
		},
		m: function mount(target, anchor) {
			insert_dev(target, tr, anchor);
			append_dev(tr, th0);
			append_dev(tr, t1);
			append_dev(tr, th1);
			append_dev(tr, t3);
			append_dev(tr, th2);
			append_dev(tr, t5);
			append_dev(tr, th3);
			append_dev(tr, t7);
			append_dev(tr, th4);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(tr);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_thead_slot$2.name,
		type: "slot",
		source: "(201:8) <tr slot=\\\"thead\\\">",
		ctx
	});

	return block;
}

// (208:8) <tr slot="tbody" let:item={item}>
function create_tbody_slot$2(ctx) {
	let tr;
	let td0;
	let t0_value = /*item*/ ctx[6].dex + "";
	let t0;
	let t1;
	let td1;
	let a;
	let t2_value = /*item*/ ctx[6].name + "";
	let t2;
	let a_href_value;
	let td1_class_value;
	let t3;
	let td2;
	let t4_value = /*item*/ ctx[6].atk + "";
	let t4;
	let t5;
	let td3;
	let t6_value = /*item*/ ctx[6].maxcp + "";
	let t6;
	let t7;
	let td4;
	let t8_value = /*item*/ ctx[6].tankStr + "";
	let t8;

	const block = {
		c: function create() {
			tr = element("tr");
			td0 = element("td");
			t0 = text(t0_value);
			t1 = space();
			td1 = element("td");
			a = element("a");
			t2 = text(t2_value);
			t3 = space();
			td2 = element("td");
			t4 = text(t4_value);
			t5 = space();
			td3 = element("td");
			t6 = text(t6_value);
			t7 = space();
			td4 = element("td");
			t8 = text(t8_value);
			add_location(td0, file$c, 208, 10, 4895);
			attr_dev(a, "href", a_href_value = "./pokemon/" + /*item*/ ctx[6].uid);
			add_location(a, file$c, 210, 12, 4977);
			attr_dev(td1, "class", td1_class_value = /*item*/ ctx[6].stab ? "is-stab" : "");
			add_location(td1, file$c, 209, 10, 4925);
			add_location(td2, file$c, 212, 10, 5050);
			add_location(td3, file$c, 213, 10, 5080);
			attr_dev(td4, "class", "fz-s");
			add_location(td4, file$c, 214, 10, 5112);
			attr_dev(tr, "slot", "tbody");
			add_location(tr, file$c, 207, 8, 4851);
		},
		m: function mount(target, anchor) {
			insert_dev(target, tr, anchor);
			append_dev(tr, td0);
			append_dev(td0, t0);
			append_dev(tr, t1);
			append_dev(tr, td1);
			append_dev(td1, a);
			append_dev(a, t2);
			append_dev(tr, t3);
			append_dev(tr, td2);
			append_dev(td2, t4);
			append_dev(tr, t5);
			append_dev(tr, td3);
			append_dev(td3, t6);
			append_dev(tr, t7);
			append_dev(tr, td4);
			append_dev(td4, t8);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*item*/ 64 && t0_value !== (t0_value = /*item*/ ctx[6].dex + "")) set_data_dev(t0, t0_value);
			if (dirty & /*item*/ 64 && t2_value !== (t2_value = /*item*/ ctx[6].name + "")) set_data_dev(t2, t2_value);

			if (dirty & /*item*/ 64 && a_href_value !== (a_href_value = "./pokemon/" + /*item*/ ctx[6].uid)) {
				attr_dev(a, "href", a_href_value);
			}

			if (dirty & /*item*/ 64 && td1_class_value !== (td1_class_value = /*item*/ ctx[6].stab ? "is-stab" : "")) {
				attr_dev(td1, "class", td1_class_value);
			}

			if (dirty & /*item*/ 64 && t4_value !== (t4_value = /*item*/ ctx[6].atk + "")) set_data_dev(t4, t4_value);
			if (dirty & /*item*/ 64 && t6_value !== (t6_value = /*item*/ ctx[6].maxcp + "")) set_data_dev(t6, t6_value);
			if (dirty & /*item*/ 64 && t8_value !== (t8_value = /*item*/ ctx[6].tankStr + "")) set_data_dev(t8, t8_value);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(tr);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_tbody_slot$2.name,
		type: "slot",
		source: "(208:8) <tr slot=\\\"tbody\\\" let:item={item}>",
		ctx
	});

	return block;
}

// (200:6) <TableSort items={pms} class="ml-a mr-a">
function create_default_slot_1$2(ctx) {
	let t;

	const block = {
		c: function create() {
			t = space();
		},
		m: function mount(target, anchor) {
			insert_dev(target, t, anchor);
		},
		p: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(t);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot_1$2.name,
		type: "slot",
		source: "(200:6) <TableSort items={pms} class=\\\"ml-a mr-a\\\">",
		ctx
	});

	return block;
}

// (197:4) <Details type="samemove" class="card">
function create_default_slot$4(ctx) {
	let summary;
	let h3;
	let t1;
	let current;

	const tablesort = new TableSort({
			props: {
				items: /*pms*/ ctx[1],
				class: "ml-a mr-a",
				$$slots: {
					default: [create_default_slot_1$2],
					tbody: [
						create_tbody_slot$2,
						({ item }) => ({ 6: item }),
						({ item }) => item ? 64 : 0
					],
					thead: [create_thead_slot$2]
				},
				$$scope: { ctx }
			},
			$$inline: true
		});

	const block = {
		c: function create() {
			summary = element("summary");
			h3 = element("h3");
			h3.textContent = "Pokemon with this Move";
			t1 = space();
			create_component(tablesort.$$.fragment);
			add_location(h3, file$c, 197, 15, 4460);
			add_location(summary, file$c, 197, 6, 4451);
		},
		m: function mount(target, anchor) {
			insert_dev(target, summary, anchor);
			append_dev(summary, h3);
			insert_dev(target, t1, anchor);
			mount_component(tablesort, target, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
			const tablesort_changes = {};
			if (dirty & /*pms*/ 2) tablesort_changes.items = /*pms*/ ctx[1];

			if (dirty & /*$$scope, item*/ 192) {
				tablesort_changes.$$scope = { dirty, ctx };
			}

			tablesort.$set(tablesort_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(tablesort.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(tablesort.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(summary);
			if (detaching) detach_dev(t1);
			destroy_component(tablesort, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot$4.name,
		type: "slot",
		source: "(197:4) <Details type=\\\"samemove\\\" class=\\\"card\\\">",
		ctx
	});

	return block;
}

function create_fragment$c(ctx) {
	let title_value;
	let t;
	let if_block_anchor;
	let current;
	document.title = title_value = "Move: " + (/*move*/ ctx[0] && /*move*/ ctx[0].name || "");
	let if_block = /*move*/ ctx[0] && create_if_block$1(ctx);

	const block = {
		c: function create() {
			t = space();
			if (if_block) if_block.c();
			if_block_anchor = empty();
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, t, anchor);
			if (if_block) if_block.m(target, anchor);
			insert_dev(target, if_block_anchor, anchor);
			current = true;
		},
		p: function update(ctx, [dirty]) {
			if ((!current || dirty & /*move*/ 1) && title_value !== (title_value = "Move: " + (/*move*/ ctx[0] && /*move*/ ctx[0].name || ""))) {
				document.title = title_value;
			}

			if (/*move*/ ctx[0]) {
				if (if_block) {
					if_block.p(ctx, dirty);
					transition_in(if_block, 1);
				} else {
					if_block = create_if_block$1(ctx);
					if_block.c();
					transition_in(if_block, 1);
					if_block.m(if_block_anchor.parentNode, if_block_anchor);
				}
			} else if (if_block) {
				group_outros();

				transition_out(if_block, 1, 1, () => {
					if_block = null;
				});

				check_outros();
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(if_block);
			current = true;
		},
		o: function outro(local) {
			transition_out(if_block);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(t);
			if (if_block) if_block.d(detaching);
			if (detaching) detach_dev(if_block_anchor);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$c.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$b($$self, $$props, $$invalidate) {
	let $moves;
	let $pokemons;
	validate_store(moves, "moves");
	component_subscribe($$self, moves, $$value => $$invalidate(3, $moves = $$value));
	validate_store(pokemons, "pokemons");
	component_subscribe($$self, pokemons, $$value => $$invalidate(4, $pokemons = $$value));
	let { params = {} } = $$props;
	let move;
	let pms;
	const mt = ["fastMoves", "chargedMoves", "legacyMoves"];
	const writable_props = ["params"];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<MovePage> was created with unknown prop '${key}'`);
	});

	$$self.$set = $$props => {
		if ("params" in $$props) $$invalidate(2, params = $$props.params);
	};

	$$self.$capture_state = () => {
		return { params, move, pms, $moves, $pokemons };
	};

	$$self.$inject_state = $$props => {
		if ("params" in $$props) $$invalidate(2, params = $$props.params);
		if ("move" in $$props) $$invalidate(0, move = $$props.move);
		if ("pms" in $$props) $$invalidate(1, pms = $$props.pms);
		if ("$moves" in $$props) moves.set($moves = $$props.$moves);
		if ("$pokemons" in $$props) pokemons.set($pokemons = $$props.$pokemons);
	};

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*$moves, params, $pokemons, move*/ 29) {
			 {
				if ($moves.length) {
					$$invalidate(0, move = $moves.find(pm => pm.moveId === params.moveId));

					$$invalidate(1, pms = $pokemons.filter(pm => {
						return mt.some(t => pm[t] && pm[t].includes(params.moveId));
					}).map(pm => {
						return {
							dex: pm.dex,
							uid: pm.uid,
							name: pm.name,
							maxcp: pm.maxcp,
							tankStr: pm.tankStr,
							atk: pm._atk,
							stab: pm.types.includes(move.type)
						};
					}));
				}
			}
		}
	};

	return [move, pms, params];
}

class MovePage extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance$b, create_fragment$c, safe_not_equal, { params: 2 });

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "MovePage",
			options,
			id: create_fragment$c.name
		});
	}

	get params() {
		throw new Error("<MovePage>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set params(value) {
		throw new Error("<MovePage>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* ./src/components/Custom-CP.html generated by Svelte v3.18.1 */
const file$d = "./src/components/Custom-CP.html";

function get_each_context$6(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[8] = list[i];
	child_ctx[9] = list;
	child_ctx[10] = i;
	return child_ctx;
}

// (58:6) {#each customeInputs as input}
function create_each_block$6(ctx) {
	let tr;
	let td0;
	let label;
	let t0_value = /*input*/ ctx[8].title + "";
	let t0;
	let label_for_value;
	let t1;
	let td1;
	let input0;
	let input0_max_value;
	let input0_min_value;
	let input0_step_value;
	let input0_id_value;
	let input0_updating = false;
	let t2;
	let td2;
	let input1;
	let input1_max_value;
	let input1_min_value;
	let input1_step_value;
	let dispose;

	function input0_input_handler() {
		input0_updating = true;
		/*input0_input_handler*/ ctx[5].call(input0, /*input*/ ctx[8]);
	}

	function input1_change_input_handler() {
		/*input1_change_input_handler*/ ctx[6].call(input1, /*input*/ ctx[8]);
	}

	const block = {
		c: function create() {
			tr = element("tr");
			td0 = element("td");
			label = element("label");
			t0 = text(t0_value);
			t1 = space();
			td1 = element("td");
			input0 = element("input");
			t2 = space();
			td2 = element("td");
			input1 = element("input");
			attr_dev(label, "for", label_for_value = "c_" + /*input*/ ctx[8].title);
			add_location(label, file$d, 60, 12, 886);
			add_location(td0, file$d, 59, 10, 869);
			attr_dev(input0, "type", "number");
			attr_dev(input0, "class", "w-100 text-center mb-0");
			attr_dev(input0, "max", input0_max_value = /*input*/ ctx[8].max);
			attr_dev(input0, "min", input0_min_value = /*input*/ ctx[8].min);
			attr_dev(input0, "step", input0_step_value = /*input*/ ctx[8].step);
			attr_dev(input0, "id", input0_id_value = "c_" + /*input*/ ctx[8].title);
			add_location(input0, file$d, 65, 12, 1008);
			add_location(td1, file$d, 64, 10, 991);
			attr_dev(input1, "type", "range");
			attr_dev(input1, "class", "mb-0");
			attr_dev(input1, "max", input1_max_value = /*input*/ ctx[8].max);
			attr_dev(input1, "min", input1_min_value = /*input*/ ctx[8].min);
			attr_dev(input1, "step", input1_step_value = /*input*/ ctx[8].step);
			add_location(input1, file$d, 73, 12, 1269);
			add_location(td2, file$d, 72, 10, 1252);
			add_location(tr, file$d, 58, 8, 854);
		},
		m: function mount(target, anchor) {
			insert_dev(target, tr, anchor);
			append_dev(tr, td0);
			append_dev(td0, label);
			append_dev(label, t0);
			append_dev(tr, t1);
			append_dev(tr, td1);
			append_dev(td1, input0);
			set_input_value(input0, /*input*/ ctx[8].value);
			append_dev(tr, t2);
			append_dev(tr, td2);
			append_dev(td2, input1);
			set_input_value(input1, /*input*/ ctx[8].value);

			dispose = [
				listen_dev(input0, "input", input0_input_handler),
				listen_dev(input1, "change", input1_change_input_handler),
				listen_dev(input1, "input", input1_change_input_handler)
			];
		},
		p: function update(new_ctx, dirty) {
			ctx = new_ctx;
			if (dirty & /*customeInputs*/ 1 && t0_value !== (t0_value = /*input*/ ctx[8].title + "")) set_data_dev(t0, t0_value);

			if (dirty & /*customeInputs*/ 1 && label_for_value !== (label_for_value = "c_" + /*input*/ ctx[8].title)) {
				attr_dev(label, "for", label_for_value);
			}

			if (dirty & /*customeInputs*/ 1 && input0_max_value !== (input0_max_value = /*input*/ ctx[8].max)) {
				attr_dev(input0, "max", input0_max_value);
			}

			if (dirty & /*customeInputs*/ 1 && input0_min_value !== (input0_min_value = /*input*/ ctx[8].min)) {
				attr_dev(input0, "min", input0_min_value);
			}

			if (dirty & /*customeInputs*/ 1 && input0_step_value !== (input0_step_value = /*input*/ ctx[8].step)) {
				attr_dev(input0, "step", input0_step_value);
			}

			if (dirty & /*customeInputs*/ 1 && input0_id_value !== (input0_id_value = "c_" + /*input*/ ctx[8].title)) {
				attr_dev(input0, "id", input0_id_value);
			}

			if (!input0_updating && dirty & /*customeInputs*/ 1) {
				set_input_value(input0, /*input*/ ctx[8].value);
			}

			input0_updating = false;

			if (dirty & /*customeInputs*/ 1 && input1_max_value !== (input1_max_value = /*input*/ ctx[8].max)) {
				attr_dev(input1, "max", input1_max_value);
			}

			if (dirty & /*customeInputs*/ 1 && input1_min_value !== (input1_min_value = /*input*/ ctx[8].min)) {
				attr_dev(input1, "min", input1_min_value);
			}

			if (dirty & /*customeInputs*/ 1 && input1_step_value !== (input1_step_value = /*input*/ ctx[8].step)) {
				attr_dev(input1, "step", input1_step_value);
			}

			if (dirty & /*customeInputs*/ 1) {
				set_input_value(input1, /*input*/ ctx[8].value);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(tr);
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block$6.name,
		type: "each",
		source: "(58:6) {#each customeInputs as input}",
		ctx
	});

	return block;
}

// (48:0) <Details type="customcp">
function create_default_slot$5(ctx) {
	let summary;
	let t1;
	let div;
	let table;
	let colgroup;
	let col0;
	let t2;
	let col1;
	let t3;
	let col2;
	let t4;
	let t5;
	let tr;
	let td0;
	let t6;
	let t7_value = /*calcResult*/ ctx[1].cp + "";
	let t7;
	let t8;
	let br;
	let t9;
	let t10_value = /*calcResult*/ ctx[1].hp + "";
	let t10;
	let t11;
	let td1;
	let current;
	let each_value = /*customeInputs*/ ctx[0];
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block$6(get_each_context$6(ctx, each_value, i));
	}

	const default_slot_template = /*$$slots*/ ctx[4].default;
	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[7], null);

	const block = {
		c: function create() {
			summary = element("summary");
			summary.textContent = "Custom IV & Lv";
			t1 = space();
			div = element("div");
			table = element("table");
			colgroup = element("colgroup");
			col0 = element("col");
			t2 = space();
			col1 = element("col");
			t3 = space();
			col2 = element("col");
			t4 = space();

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			t5 = space();
			tr = element("tr");
			td0 = element("td");
			t6 = text("CP: ");
			t7 = text(t7_value);
			t8 = space();
			br = element("br");
			t9 = text("\n          HP: ");
			t10 = text(t10_value);
			t11 = space();
			td1 = element("td");
			if (default_slot) default_slot.c();
			attr_dev(summary, "class", "custom-summary");
			add_location(summary, file$d, 48, 2, 607);
			add_location(col0, file$d, 52, 8, 739);
			attr_dev(col1, "width", "85");
			add_location(col1, file$d, 53, 8, 755);
			add_location(col2, file$d, 54, 8, 782);
			add_location(colgroup, file$d, 51, 6, 720);
			add_location(br, file$d, 85, 10, 1572);
			attr_dev(td0, "colspan", "2");
			attr_dev(td0, "class", "text-left");
			add_location(td0, file$d, 83, 8, 1497);
			add_location(td1, file$d, 88, 8, 1629);
			add_location(tr, file$d, 82, 6, 1484);
			attr_dev(table, "class", "custom-cp text-center");
			add_location(table, file$d, 50, 4, 676);
			add_location(div, file$d, 49, 2, 666);
		},
		m: function mount(target, anchor) {
			insert_dev(target, summary, anchor);
			insert_dev(target, t1, anchor);
			insert_dev(target, div, anchor);
			append_dev(div, table);
			append_dev(table, colgroup);
			append_dev(colgroup, col0);
			append_dev(colgroup, t2);
			append_dev(colgroup, col1);
			append_dev(colgroup, t3);
			append_dev(colgroup, col2);
			append_dev(table, t4);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(table, null);
			}

			append_dev(table, t5);
			append_dev(table, tr);
			append_dev(tr, td0);
			append_dev(td0, t6);
			append_dev(td0, t7);
			append_dev(td0, t8);
			append_dev(td0, br);
			append_dev(td0, t9);
			append_dev(td0, t10);
			append_dev(tr, t11);
			append_dev(tr, td1);

			if (default_slot) {
				default_slot.m(td1, null);
			}

			current = true;
		},
		p: function update(ctx, dirty) {
			if (dirty & /*customeInputs*/ 1) {
				each_value = /*customeInputs*/ ctx[0];
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context$6(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block$6(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(table, t5);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value.length;
			}

			if ((!current || dirty & /*calcResult*/ 2) && t7_value !== (t7_value = /*calcResult*/ ctx[1].cp + "")) set_data_dev(t7, t7_value);
			if ((!current || dirty & /*calcResult*/ 2) && t10_value !== (t10_value = /*calcResult*/ ctx[1].hp + "")) set_data_dev(t10, t10_value);

			if (default_slot && default_slot.p && dirty & /*$$scope*/ 128) {
				default_slot.p(get_slot_context(default_slot_template, ctx, /*$$scope*/ ctx[7], null), get_slot_changes(default_slot_template, /*$$scope*/ ctx[7], dirty, null));
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(default_slot, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(default_slot, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(summary);
			if (detaching) detach_dev(t1);
			if (detaching) detach_dev(div);
			destroy_each(each_blocks, detaching);
			if (default_slot) default_slot.d(detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot$5.name,
		type: "slot",
		source: "(48:0) <Details type=\\\"customcp\\\">",
		ctx
	});

	return block;
}

function create_fragment$d(ctx) {
	let current;

	const details = new Details({
			props: {
				type: "customcp",
				$$slots: { default: [create_default_slot$5] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	const block = {
		c: function create() {
			create_component(details.$$.fragment);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			mount_component(details, target, anchor);
			current = true;
		},
		p: function update(ctx, [dirty]) {
			const details_changes = {};

			if (dirty & /*$$scope, calcResult, customeInputs*/ 131) {
				details_changes.$$scope = { dirty, ctx };
			}

			details.$set(details_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(details.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(details.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(details, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$d.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$c($$self, $$props, $$invalidate) {
	let { ads } = $$props;
	let { lv = 20 } = $$props;

	let customeInputs = [
		{
			title: "A",
			min: 0,
			max: 15,
			step: 1,
			value: 15
		},
		{
			title: "D",
			min: 0,
			max: 15,
			step: 1,
			value: 15
		},
		{
			title: "S",
			min: 0,
			max: 15,
			step: 1,
			value: 15
		},
		{
			title: "Lv",
			min: 1,
			max: 41,
			step: 0.5,
			value: 20
		}
	];

	const writable_props = ["ads", "lv"];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Custom_CP> was created with unknown prop '${key}'`);
	});

	let { $$slots = {}, $$scope } = $$props;

	function input0_input_handler(input) {
		input.value = to_number(this.value);
		($$invalidate(0, customeInputs), $$invalidate(3, lv));
	}

	function input1_change_input_handler(input) {
		input.value = to_number(this.value);
		($$invalidate(0, customeInputs), $$invalidate(3, lv));
	}

	$$self.$set = $$props => {
		if ("ads" in $$props) $$invalidate(2, ads = $$props.ads);
		if ("lv" in $$props) $$invalidate(3, lv = $$props.lv);
		if ("$$scope" in $$props) $$invalidate(7, $$scope = $$props.$$scope);
	};

	$$self.$capture_state = () => {
		return { ads, lv, customeInputs, calcResult };
	};

	$$self.$inject_state = $$props => {
		if ("ads" in $$props) $$invalidate(2, ads = $$props.ads);
		if ("lv" in $$props) $$invalidate(3, lv = $$props.lv);
		if ("customeInputs" in $$props) $$invalidate(0, customeInputs = $$props.customeInputs);
		if ("calcResult" in $$props) $$invalidate(1, calcResult = $$props.calcResult);
	};

	let calcResult;

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*lv*/ 8) {
			 {
				$$invalidate(0, customeInputs[3].value = lv, customeInputs);
			}
		}

		if ($$self.$$.dirty & /*ads, customeInputs*/ 5) {
			 $$invalidate(1, calcResult = calPmCPHP(ads, customeInputs.map(i => i.value)));
		}
	};

	return [
		customeInputs,
		calcResult,
		ads,
		lv,
		$$slots,
		input0_input_handler,
		input1_change_input_handler,
		$$scope
	];
}

class Custom_CP extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance$c, create_fragment$d, safe_not_equal, { ads: 2, lv: 3 });

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Custom_CP",
			options,
			id: create_fragment$d.name
		});

		const { ctx } = this.$$;
		const props = options.props || {};

		if (/*ads*/ ctx[2] === undefined && !("ads" in props)) {
			console.warn("<Custom_CP> was created without expected prop 'ads'");
		}
	}

	get ads() {
		throw new Error("<Custom_CP>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set ads(value) {
		throw new Error("<Custom_CP>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get lv() {
		throw new Error("<Custom_CP>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set lv(value) {
		throw new Error("<Custom_CP>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* ./src/components/Dialog.html generated by Svelte v3.18.1 */

const file$e = "./src/components/Dialog.html";

function create_fragment$e(ctx) {
	let div1;
	let div0;
	let t;
	let current;
	let dispose;
	const default_slot_template = /*$$slots*/ ctx[3].default;
	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[2], null);

	const block = {
		c: function create() {
			div1 = element("div");
			div0 = element("div");
			t = space();
			if (default_slot) default_slot.c();
			attr_dev(div0, "class", "dialog-overlay svelte-1a1ehom");
			add_location(div0, file$e, 8, 2, 100);
			attr_dev(div1, "class", "dialog svelte-1a1ehom");
			div1.hidden = /*hidden*/ ctx[0];
			add_location(div1, file$e, 7, 0, 61);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, div1, anchor);
			append_dev(div1, div0);
			append_dev(div1, t);

			if (default_slot) {
				default_slot.m(div1, null);
			}

			current = true;
			dispose = listen_dev(div0, "click", /*closeFn*/ ctx[1], false, false, false);
		},
		p: function update(ctx, [dirty]) {
			if (default_slot && default_slot.p && dirty & /*$$scope*/ 4) {
				default_slot.p(get_slot_context(default_slot_template, ctx, /*$$scope*/ ctx[2], null), get_slot_changes(default_slot_template, /*$$scope*/ ctx[2], dirty, null));
			}

			if (!current || dirty & /*hidden*/ 1) {
				prop_dev(div1, "hidden", /*hidden*/ ctx[0]);
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(default_slot, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(default_slot, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div1);
			if (default_slot) default_slot.d(detaching);
			dispose();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$e.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$d($$self, $$props, $$invalidate) {
	let { hidden } = $$props;
	let { closeFn } = $$props;
	const writable_props = ["hidden", "closeFn"];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Dialog> was created with unknown prop '${key}'`);
	});

	let { $$slots = {}, $$scope } = $$props;

	$$self.$set = $$props => {
		if ("hidden" in $$props) $$invalidate(0, hidden = $$props.hidden);
		if ("closeFn" in $$props) $$invalidate(1, closeFn = $$props.closeFn);
		if ("$$scope" in $$props) $$invalidate(2, $$scope = $$props.$$scope);
	};

	$$self.$capture_state = () => {
		return { hidden, closeFn };
	};

	$$self.$inject_state = $$props => {
		if ("hidden" in $$props) $$invalidate(0, hidden = $$props.hidden);
		if ("closeFn" in $$props) $$invalidate(1, closeFn = $$props.closeFn);
	};

	return [hidden, closeFn, $$scope, $$slots];
}

class Dialog extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance$d, create_fragment$e, safe_not_equal, { hidden: 0, closeFn: 1 });

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Dialog",
			options,
			id: create_fragment$e.name
		});

		const { ctx } = this.$$;
		const props = options.props || {};

		if (/*hidden*/ ctx[0] === undefined && !("hidden" in props)) {
			console.warn("<Dialog> was created without expected prop 'hidden'");
		}

		if (/*closeFn*/ ctx[1] === undefined && !("closeFn" in props)) {
			console.warn("<Dialog> was created without expected prop 'closeFn'");
		}
	}

	get hidden() {
		throw new Error("<Dialog>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set hidden(value) {
		throw new Error("<Dialog>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get closeFn() {
		throw new Error("<Dialog>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set closeFn(value) {
		throw new Error("<Dialog>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* ./src/components/IV-Dialog.html generated by Svelte v3.18.1 */
const file$f = "./src/components/IV-Dialog.html";

function get_each_context$7(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[1] = list[i];
	return child_ctx;
}

function get_each_context_2$1(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[21] = list[i];
	return child_ctx;
}

function get_each_context_3(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[21] = list[i];
	return child_ctx;
}

function get_each_context_1$4(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[18] = list[i];
	return child_ctx;
}

function get_each_context_4(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[1] = list[i];
	return child_ctx;
}

function get_each_context_5(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[1] = list[i];
	return child_ctx;
}

// (76:6) {#if cpList}
function create_if_block$2(ctx) {
	let table;
	let thead;
	let tr;
	let t0;
	let th0;
	let t2;
	let th1;
	let t4;
	let th2;
	let t6;
	let th3;
	let t8;
	let t9;
	let tbody;
	let t10;
	let div;
	let label;
	let input;
	let t11;
	let span;
	let dispose;
	let each_value_5 = /*selectedLvs*/ ctx[3];
	let each_blocks_2 = [];

	for (let i = 0; i < each_value_5.length; i += 1) {
		each_blocks_2[i] = create_each_block_5(get_each_context_5(ctx, each_value_5, i));
	}

	let each_value_4 = /*selectedLvs*/ ctx[3];
	let each_blocks_1 = [];

	for (let i = 0; i < each_value_4.length; i += 1) {
		each_blocks_1[i] = create_each_block_4(get_each_context_4(ctx, each_value_4, i));
	}

	let each_value_1 = /*cpList*/ ctx[5];
	let each_blocks = [];

	for (let i = 0; i < each_value_1.length; i += 1) {
		each_blocks[i] = create_each_block_1$4(get_each_context_1$4(ctx, each_value_1, i));
	}

	const block = {
		c: function create() {
			table = element("table");
			thead = element("thead");
			tr = element("tr");

			for (let i = 0; i < each_blocks_2.length; i += 1) {
				each_blocks_2[i].c();
			}

			t0 = space();
			th0 = element("th");
			th0.textContent = "A";
			t2 = space();
			th1 = element("th");
			th1.textContent = "D";
			t4 = space();
			th2 = element("th");
			th2.textContent = "S";
			t6 = space();
			th3 = element("th");
			th3.textContent = "IV";
			t8 = space();

			for (let i = 0; i < each_blocks_1.length; i += 1) {
				each_blocks_1[i].c();
			}

			t9 = space();
			tbody = element("tbody");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			t10 = space();
			div = element("div");
			label = element("label");
			input = element("input");
			t11 = space();
			span = element("span");
			span.textContent = "show all?";
			attr_dev(th0, "class", "svelte-1mkwfor");
			add_location(th0, file$f, 82, 14, 1904);
			attr_dev(th1, "class", "svelte-1mkwfor");
			add_location(th1, file$f, 83, 14, 1929);
			attr_dev(th2, "class", "svelte-1mkwfor");
			add_location(th2, file$f, 84, 14, 1954);
			attr_dev(th3, "class", "svelte-1mkwfor");
			add_location(th3, file$f, 85, 14, 1979);
			attr_dev(tr, "class", "svelte-1mkwfor");
			add_location(tr, file$f, 78, 12, 1767);
			attr_dev(thead, "class", "thead pokemon-table sticky-thead svelte-1mkwfor");
			add_location(thead, file$f, 77, 10, 1706);
			attr_dev(tbody, "class", "svelte-1mkwfor");
			add_location(tbody, file$f, 91, 10, 2160);
			attr_dev(table, "class", "ml-a mr-a text-right svelte-1mkwfor");
			toggle_class(table, "is-shall-all", /*showAllList*/ ctx[2]);
			add_location(table, file$f, 76, 8, 1626);
			attr_dev(input, "type", "checkbox");
			add_location(input, file$f, 111, 12, 2766);
			add_location(span, file$f, 112, 12, 2829);
			attr_dev(label, "class", "label");
			add_location(label, file$f, 110, 10, 2732);
			attr_dev(div, "class", "read-more text-center mt-2 mb-2 svelte-1mkwfor");
			add_location(div, file$f, 109, 8, 2676);
		},
		m: function mount(target, anchor) {
			insert_dev(target, table, anchor);
			append_dev(table, thead);
			append_dev(thead, tr);

			for (let i = 0; i < each_blocks_2.length; i += 1) {
				each_blocks_2[i].m(tr, null);
			}

			append_dev(tr, t0);
			append_dev(tr, th0);
			append_dev(tr, t2);
			append_dev(tr, th1);
			append_dev(tr, t4);
			append_dev(tr, th2);
			append_dev(tr, t6);
			append_dev(tr, th3);
			append_dev(tr, t8);

			for (let i = 0; i < each_blocks_1.length; i += 1) {
				each_blocks_1[i].m(tr, null);
			}

			append_dev(table, t9);
			append_dev(table, tbody);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(tbody, null);
			}

			insert_dev(target, t10, anchor);
			insert_dev(target, div, anchor);
			append_dev(div, label);
			append_dev(label, input);
			input.checked = /*showAllList*/ ctx[2];
			append_dev(label, t11);
			append_dev(label, span);
			dispose = listen_dev(input, "change", /*input_change_handler*/ ctx[13]);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*selectedLvs*/ 8) {
				each_value_5 = /*selectedLvs*/ ctx[3];
				let i;

				for (i = 0; i < each_value_5.length; i += 1) {
					const child_ctx = get_each_context_5(ctx, each_value_5, i);

					if (each_blocks_2[i]) {
						each_blocks_2[i].p(child_ctx, dirty);
					} else {
						each_blocks_2[i] = create_each_block_5(child_ctx);
						each_blocks_2[i].c();
						each_blocks_2[i].m(tr, t0);
					}
				}

				for (; i < each_blocks_2.length; i += 1) {
					each_blocks_2[i].d(1);
				}

				each_blocks_2.length = each_value_5.length;
			}

			if (dirty & /*selectedLvs*/ 8) {
				each_value_4 = /*selectedLvs*/ ctx[3];
				let i;

				for (i = 0; i < each_value_4.length; i += 1) {
					const child_ctx = get_each_context_4(ctx, each_value_4, i);

					if (each_blocks_1[i]) {
						each_blocks_1[i].p(child_ctx, dirty);
					} else {
						each_blocks_1[i] = create_each_block_4(child_ctx);
						each_blocks_1[i].c();
						each_blocks_1[i].m(tr, null);
					}
				}

				for (; i < each_blocks_1.length; i += 1) {
					each_blocks_1[i].d(1);
				}

				each_blocks_1.length = each_value_4.length;
			}

			if (dirty & /*cpList, selectedLvs*/ 40) {
				each_value_1 = /*cpList*/ ctx[5];
				let i;

				for (i = 0; i < each_value_1.length; i += 1) {
					const child_ctx = get_each_context_1$4(ctx, each_value_1, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block_1$4(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(tbody, null);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value_1.length;
			}

			if (dirty & /*showAllList*/ 4) {
				toggle_class(table, "is-shall-all", /*showAllList*/ ctx[2]);
			}

			if (dirty & /*showAllList*/ 4) {
				input.checked = /*showAllList*/ ctx[2];
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(table);
			destroy_each(each_blocks_2, detaching);
			destroy_each(each_blocks_1, detaching);
			destroy_each(each_blocks, detaching);
			if (detaching) detach_dev(t10);
			if (detaching) detach_dev(div);
			dispose();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$2.name,
		type: "if",
		source: "(76:6) {#if cpList}",
		ctx
	});

	return block;
}

// (80:14) {#each selectedLvs as lv}
function create_each_block_5(ctx) {
	let th;
	let t0;
	let sup;
	let t1_value = /*lv*/ ctx[1] + "";
	let t1;

	const block = {
		c: function create() {
			th = element("th");
			t0 = text("CP");
			sup = element("sup");
			t1 = text(t1_value);
			attr_dev(sup, "class", "fw-n");
			add_location(sup, file$f, 80, 22, 1834);
			attr_dev(th, "class", "svelte-1mkwfor");
			add_location(th, file$f, 80, 16, 1828);
		},
		m: function mount(target, anchor) {
			insert_dev(target, th, anchor);
			append_dev(th, t0);
			append_dev(th, sup);
			append_dev(sup, t1);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*selectedLvs*/ 8 && t1_value !== (t1_value = /*lv*/ ctx[1] + "")) set_data_dev(t1, t1_value);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(th);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block_5.name,
		type: "each",
		source: "(80:14) {#each selectedLvs as lv}",
		ctx
	});

	return block;
}

// (87:14) {#each selectedLvs as lv}
function create_each_block_4(ctx) {
	let th;
	let t;
	let th_hidden_value;

	const block = {
		c: function create() {
			th = element("th");
			t = text("HP");
			th.hidden = th_hidden_value = /*selectedLvs*/ ctx[3].length > 1;
			attr_dev(th, "class", "svelte-1mkwfor");
			add_location(th, file$f, 87, 16, 2047);
		},
		m: function mount(target, anchor) {
			insert_dev(target, th, anchor);
			append_dev(th, t);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*selectedLvs*/ 8 && th_hidden_value !== (th_hidden_value = /*selectedLvs*/ ctx[3].length > 1)) {
				prop_dev(th, "hidden", th_hidden_value);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(th);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block_4.name,
		type: "each",
		source: "(87:14) {#each selectedLvs as lv}",
		ctx
	});

	return block;
}

// (95:16) {#each item.data as d}
function create_each_block_3(ctx) {
	let td;
	let t_value = /*d*/ ctx[21].cp + "";
	let t;

	const block = {
		c: function create() {
			td = element("td");
			t = text(t_value);
			attr_dev(td, "class", "svelte-1mkwfor");
			add_location(td, file$f, 95, 18, 2279);
		},
		m: function mount(target, anchor) {
			insert_dev(target, td, anchor);
			append_dev(td, t);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*cpList*/ 32 && t_value !== (t_value = /*d*/ ctx[21].cp + "")) set_data_dev(t, t_value);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(td);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block_3.name,
		type: "each",
		source: "(95:16) {#each item.data as d}",
		ctx
	});

	return block;
}

// (102:16) {#each item.data as d}
function create_each_block_2$1(ctx) {
	let td;
	let t_value = /*d*/ ctx[21].hp + "";
	let t;
	let td_hidden_value;

	const block = {
		c: function create() {
			td = element("td");
			t = text(t_value);
			td.hidden = td_hidden_value = /*selectedLvs*/ ctx[3].length > 1;
			attr_dev(td, "class", "svelte-1mkwfor");
			add_location(td, file$f, 102, 18, 2519);
		},
		m: function mount(target, anchor) {
			insert_dev(target, td, anchor);
			append_dev(td, t);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*cpList*/ 32 && t_value !== (t_value = /*d*/ ctx[21].hp + "")) set_data_dev(t, t_value);

			if (dirty & /*selectedLvs*/ 8 && td_hidden_value !== (td_hidden_value = /*selectedLvs*/ ctx[3].length > 1)) {
				prop_dev(td, "hidden", td_hidden_value);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(td);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block_2$1.name,
		type: "each",
		source: "(102:16) {#each item.data as d}",
		ctx
	});

	return block;
}

// (93:12) {#each cpList as item}
function create_each_block_1$4(ctx) {
	let tr;
	let t0;
	let td0;
	let t1_value = /*item*/ ctx[18].atk + "";
	let t1;
	let t2;
	let td1;
	let t3_value = /*item*/ ctx[18].def + "";
	let t3;
	let t4;
	let td2;
	let t5_value = /*item*/ ctx[18].sta + "";
	let t5;
	let t6;
	let td3;
	let t7_value = /*item*/ ctx[18].iv + "";
	let t7;
	let t8;
	let t9;
	let each_value_3 = /*item*/ ctx[18].data;
	let each_blocks_1 = [];

	for (let i = 0; i < each_value_3.length; i += 1) {
		each_blocks_1[i] = create_each_block_3(get_each_context_3(ctx, each_value_3, i));
	}

	let each_value_2 = /*item*/ ctx[18].data;
	let each_blocks = [];

	for (let i = 0; i < each_value_2.length; i += 1) {
		each_blocks[i] = create_each_block_2$1(get_each_context_2$1(ctx, each_value_2, i));
	}

	const block = {
		c: function create() {
			tr = element("tr");

			for (let i = 0; i < each_blocks_1.length; i += 1) {
				each_blocks_1[i].c();
			}

			t0 = space();
			td0 = element("td");
			t1 = text(t1_value);
			t2 = space();
			td1 = element("td");
			t3 = text(t3_value);
			t4 = space();
			td2 = element("td");
			t5 = text(t5_value);
			t6 = space();
			td3 = element("td");
			t7 = text(t7_value);
			t8 = space();

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			t9 = space();
			attr_dev(td0, "class", "svelte-1mkwfor");
			add_location(td0, file$f, 97, 16, 2335);
			attr_dev(td1, "class", "svelte-1mkwfor");
			add_location(td1, file$f, 98, 16, 2371);
			attr_dev(td2, "class", "svelte-1mkwfor");
			add_location(td2, file$f, 99, 16, 2407);
			attr_dev(td3, "class", "svelte-1mkwfor");
			add_location(td3, file$f, 100, 16, 2443);
			attr_dev(tr, "class", "svelte-1mkwfor");
			add_location(tr, file$f, 93, 14, 2217);
		},
		m: function mount(target, anchor) {
			insert_dev(target, tr, anchor);

			for (let i = 0; i < each_blocks_1.length; i += 1) {
				each_blocks_1[i].m(tr, null);
			}

			append_dev(tr, t0);
			append_dev(tr, td0);
			append_dev(td0, t1);
			append_dev(tr, t2);
			append_dev(tr, td1);
			append_dev(td1, t3);
			append_dev(tr, t4);
			append_dev(tr, td2);
			append_dev(td2, t5);
			append_dev(tr, t6);
			append_dev(tr, td3);
			append_dev(td3, t7);
			append_dev(tr, t8);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(tr, null);
			}

			append_dev(tr, t9);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*cpList*/ 32) {
				each_value_3 = /*item*/ ctx[18].data;
				let i;

				for (i = 0; i < each_value_3.length; i += 1) {
					const child_ctx = get_each_context_3(ctx, each_value_3, i);

					if (each_blocks_1[i]) {
						each_blocks_1[i].p(child_ctx, dirty);
					} else {
						each_blocks_1[i] = create_each_block_3(child_ctx);
						each_blocks_1[i].c();
						each_blocks_1[i].m(tr, t0);
					}
				}

				for (; i < each_blocks_1.length; i += 1) {
					each_blocks_1[i].d(1);
				}

				each_blocks_1.length = each_value_3.length;
			}

			if (dirty & /*cpList*/ 32 && t1_value !== (t1_value = /*item*/ ctx[18].atk + "")) set_data_dev(t1, t1_value);
			if (dirty & /*cpList*/ 32 && t3_value !== (t3_value = /*item*/ ctx[18].def + "")) set_data_dev(t3, t3_value);
			if (dirty & /*cpList*/ 32 && t5_value !== (t5_value = /*item*/ ctx[18].sta + "")) set_data_dev(t5, t5_value);
			if (dirty & /*cpList*/ 32 && t7_value !== (t7_value = /*item*/ ctx[18].iv + "")) set_data_dev(t7, t7_value);

			if (dirty & /*selectedLvs, cpList*/ 40) {
				each_value_2 = /*item*/ ctx[18].data;
				let i;

				for (i = 0; i < each_value_2.length; i += 1) {
					const child_ctx = get_each_context_2$1(ctx, each_value_2, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block_2$1(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(tr, t9);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value_2.length;
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(tr);
			destroy_each(each_blocks_1, detaching);
			destroy_each(each_blocks, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block_1$4.name,
		type: "each",
		source: "(93:12) {#each cpList as item}",
		ctx
	});

	return block;
}

// (122:8) {#each selectableLvs as lv}
function create_each_block$7(ctx) {
	let label;
	let input;
	let input_value_value;
	let input_disabled_value;
	let t0;
	let div;
	let t1_value = /*lv*/ ctx[1].value + "";
	let t1;
	let t2;
	let dispose;

	const block = {
		c: function create() {
			label = element("label");
			input = element("input");
			t0 = space();
			div = element("div");
			t1 = text(t1_value);
			t2 = space();
			attr_dev(input, "class", "label-checkbox hidden-checkbox");
			attr_dev(input, "type", "checkbox");
			input.__value = input_value_value = /*lv*/ ctx[1].value;
			input.value = input.__value;
			input.disabled = input_disabled_value = /*lv*/ ctx[1].disabled;
			/*$$binding_groups*/ ctx[15][0].push(input);
			add_location(input, file$f, 123, 12, 3117);
			attr_dev(div, "class", "label-text pt-1 pb-1 w-100 svelte-1mkwfor");
			add_location(div, file$f, 128, 12, 3312);
			attr_dev(label, "class", "lvs-label label svelte-1mkwfor");
			add_location(label, file$f, 122, 10, 3073);
		},
		m: function mount(target, anchor) {
			insert_dev(target, label, anchor);
			append_dev(label, input);
			input.checked = ~/*selectedLvs*/ ctx[3].indexOf(input.__value);
			append_dev(label, t0);
			append_dev(label, div);
			append_dev(div, t1);
			append_dev(label, t2);
			dispose = listen_dev(input, "change", /*input_change_handler_1*/ ctx[14]);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*selectableLvs*/ 16 && input_value_value !== (input_value_value = /*lv*/ ctx[1].value)) {
				prop_dev(input, "__value", input_value_value);
			}

			input.value = input.__value;

			if (dirty & /*selectableLvs*/ 16 && input_disabled_value !== (input_disabled_value = /*lv*/ ctx[1].disabled)) {
				prop_dev(input, "disabled", input_disabled_value);
			}

			if (dirty & /*selectedLvs*/ 8) {
				input.checked = ~/*selectedLvs*/ ctx[3].indexOf(input.__value);
			}

			if (dirty & /*selectableLvs*/ 16 && t1_value !== (t1_value = /*lv*/ ctx[1].value + "")) set_data_dev(t1, t1_value);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(label);
			/*$$binding_groups*/ ctx[15][0].splice(/*$$binding_groups*/ ctx[15][0].indexOf(input), 1);
			dispose();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block$7.name,
		type: "each",
		source: "(122:8) {#each selectableLvs as lv}",
		ctx
	});

	return block;
}

// (71:0) <Dialog closeFn={close} hidden={hidden}>
function create_default_slot$6(ctx) {
	let div1;
	let details0;
	let summary0;
	let t0;
	let t1;
	let t2;
	let t3;
	let t4;
	let details1;
	let summary1;
	let t6;
	let div0;
	let if_block = /*cpList*/ ctx[5] && create_if_block$2(ctx);
	let each_value = /*selectableLvs*/ ctx[4];
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block$7(get_each_context$7(ctx, each_value, i));
	}

	const block = {
		c: function create() {
			div1 = element("div");
			details0 = element("details");
			summary0 = element("summary");
			t0 = text("Lv [");
			t1 = text(/*selectedLvs*/ ctx[3]);
			t2 = text("] CP list");
			t3 = space();
			if (if_block) if_block.c();
			t4 = space();
			details1 = element("details");
			summary1 = element("summary");
			summary1.textContent = "Lv?";
			t6 = space();
			div0 = element("div");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			attr_dev(summary0, "class", "sticky top-0 svelte-1mkwfor");
			add_location(summary0, file$f, 74, 6, 1532);
			attr_dev(details0, "class", "mb-4");
			details0.open = true;
			add_location(details0, file$f, 73, 4, 1498);
			attr_dev(summary1, "class", "sticky top-0 svelte-1mkwfor");
			add_location(summary1, file$f, 119, 6, 2947);
			attr_dev(div0, "class", "lvs text-center");
			add_location(div0, file$f, 120, 6, 2997);
			attr_dev(details1, "class", "mb-4");
			add_location(details1, file$f, 118, 4, 2918);
			attr_dev(div1, "class", "card iv-card svelte-1mkwfor");
			add_location(div1, file$f, 71, 2, 1466);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div1, anchor);
			append_dev(div1, details0);
			append_dev(details0, summary0);
			append_dev(summary0, t0);
			append_dev(summary0, t1);
			append_dev(summary0, t2);
			append_dev(details0, t3);
			if (if_block) if_block.m(details0, null);
			append_dev(div1, t4);
			append_dev(div1, details1);
			append_dev(details1, summary1);
			append_dev(details1, t6);
			append_dev(details1, div0);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(div0, null);
			}
		},
		p: function update(ctx, dirty) {
			if (dirty & /*selectedLvs*/ 8) set_data_dev(t1, /*selectedLvs*/ ctx[3]);

			if (/*cpList*/ ctx[5]) {
				if (if_block) {
					if_block.p(ctx, dirty);
				} else {
					if_block = create_if_block$2(ctx);
					if_block.c();
					if_block.m(details0, null);
				}
			} else if (if_block) {
				if_block.d(1);
				if_block = null;
			}

			if (dirty & /*selectableLvs, selectedLvs*/ 24) {
				each_value = /*selectableLvs*/ ctx[4];
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context$7(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block$7(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(div0, null);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value.length;
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div1);
			if (if_block) if_block.d();
			destroy_each(each_blocks, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot$6.name,
		type: "slot",
		source: "(71:0) <Dialog closeFn={close} hidden={hidden}>",
		ctx
	});

	return block;
}

function create_fragment$f(ctx) {
	let current;

	const dialog = new Dialog({
			props: {
				closeFn: /*close*/ ctx[6],
				hidden: /*hidden*/ ctx[0],
				$$slots: { default: [create_default_slot$6] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	const block = {
		c: function create() {
			create_component(dialog.$$.fragment);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			mount_component(dialog, target, anchor);
			current = true;
		},
		p: function update(ctx, [dirty]) {
			const dialog_changes = {};
			if (dirty & /*hidden*/ 1) dialog_changes.hidden = /*hidden*/ ctx[0];

			if (dirty & /*$$scope, selectableLvs, selectedLvs, showAllList, cpList*/ 1073741884) {
				dialog_changes.$$scope = { dirty, ctx };
			}

			dialog.$set(dialog_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(dialog.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(dialog.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(dialog, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$f.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$e($$self, $$props, $$invalidate) {
	let { hidden = true } = $$props;
	let { ads } = $$props;
	let { lv = 20 } = $$props;
	const dispatch = createEventDispatcher();
	let showAllList = false;
	let selectedLvs = [lv];
	let selectableLvs = new Array(40).fill(1).map((i, j) => ({ value: j + 1, disabled: false }));
	let ivRange = [10, 11, 12, 13, 14, 15].reverse();

	let ivList = flatten(
		ivRange.map(atk => ivRange.map(def => ivRange.map(sta => ({
			atk,
			def,
			sta,
			iv: Math.round((atk + def + sta) / 0.45)
		})))),
		2
	);

	let cpList;

	function close() {
		dispatch("close");
	}

	function checkDisabledLv(lv) {
		return selectedLvs.length >= 3 && selectedLvs.indexOf(lv) === -1 || selectedLvs.length === 1 && selectedLvs.indexOf(lv) === 0;
	}

	function genCPList() {
		return ivList.map(iv => {
			let { atk, def, sta } = iv;

			return {
				...iv,
				data: selectedLvs.map(lv => {
					let { cp, hp } = calPmCPHP(ads, [atk, def, sta, lv]);
					return { lv, cp, hp };
				})
			};
		});
	}

	const writable_props = ["hidden", "ads", "lv"];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<IV_Dialog> was created with unknown prop '${key}'`);
	});

	const $$binding_groups = [[]];

	function input_change_handler() {
		showAllList = this.checked;
		$$invalidate(2, showAllList);
	}

	function input_change_handler_1() {
		selectedLvs = get_binding_group_value($$binding_groups[0]);
		$$invalidate(3, selectedLvs);
	}

	$$self.$set = $$props => {
		if ("hidden" in $$props) $$invalidate(0, hidden = $$props.hidden);
		if ("ads" in $$props) $$invalidate(7, ads = $$props.ads);
		if ("lv" in $$props) $$invalidate(1, lv = $$props.lv);
	};

	$$self.$capture_state = () => {
		return {
			hidden,
			ads,
			lv,
			showAllList,
			selectedLvs,
			selectableLvs,
			ivRange,
			ivList,
			cpList
		};
	};

	$$self.$inject_state = $$props => {
		if ("hidden" in $$props) $$invalidate(0, hidden = $$props.hidden);
		if ("ads" in $$props) $$invalidate(7, ads = $$props.ads);
		if ("lv" in $$props) $$invalidate(1, lv = $$props.lv);
		if ("showAllList" in $$props) $$invalidate(2, showAllList = $$props.showAllList);
		if ("selectedLvs" in $$props) $$invalidate(3, selectedLvs = $$props.selectedLvs);
		if ("selectableLvs" in $$props) $$invalidate(4, selectableLvs = $$props.selectableLvs);
		if ("ivRange" in $$props) ivRange = $$props.ivRange;
		if ("ivList" in $$props) ivList = $$props.ivList;
		if ("cpList" in $$props) $$invalidate(5, cpList = $$props.cpList);
	};

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*selectedLvs, selectableLvs*/ 24) {
			 {

				$$invalidate(4, selectableLvs = selectableLvs.map(lv => {
					lv.disabled = checkDisabledLv(lv.value);
					return lv;
				}));

				$$invalidate(5, cpList = genCPList());
				
			}
		}
	};

	return [
		hidden,
		lv,
		showAllList,
		selectedLvs,
		selectableLvs,
		cpList,
		close,
		ads,
		dispatch,
		ivRange,
		ivList,
		checkDisabledLv,
		genCPList,
		input_change_handler,
		input_change_handler_1,
		$$binding_groups
	];
}

class IV_Dialog extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance$e, create_fragment$f, safe_not_equal, { hidden: 0, ads: 7, lv: 1 });

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "IV_Dialog",
			options,
			id: create_fragment$f.name
		});

		const { ctx } = this.$$;
		const props = options.props || {};

		if (/*ads*/ ctx[7] === undefined && !("ads" in props)) {
			console.warn("<IV_Dialog> was created without expected prop 'ads'");
		}
	}

	get hidden() {
		throw new Error("<IV_Dialog>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set hidden(value) {
		throw new Error("<IV_Dialog>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get ads() {
		throw new Error("<IV_Dialog>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set ads(value) {
		throw new Error("<IV_Dialog>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get lv() {
		throw new Error("<IV_Dialog>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set lv(value) {
		throw new Error("<IV_Dialog>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* ./src/components/CP.html generated by Svelte v3.18.1 */
const file$g = "./src/components/CP.html";

function get_each_context$8(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[9] = list[i];
	return child_ctx;
}

// (49:8) {#each cps as cp}
function create_each_block$8(ctx) {
	let tr;
	let td0;
	let t0_value = /*cp*/ ctx[9].lv + "";
	let t0;
	let t1;
	let td1;
	let t2_value = /*cp*/ ctx[9].maxcp + "";
	let t2;
	let t3;
	let td2;
	let t4_value = /*cp*/ ctx[9].mincp + "";
	let t4;
	let t5;
	let dispose;

	function click_handler(...args) {
		return /*click_handler*/ ctx[8](/*cp*/ ctx[9], ...args);
	}

	const block = {
		c: function create() {
			tr = element("tr");
			td0 = element("td");
			t0 = text(t0_value);
			t1 = space();
			td1 = element("td");
			t2 = text(t2_value);
			t3 = space();
			td2 = element("td");
			t4 = text(t4_value);
			t5 = space();
			attr_dev(td0, "class", "pointer");
			add_location(td0, file$g, 50, 12, 1019);
			add_location(td1, file$g, 51, 12, 1096);
			add_location(td2, file$g, 52, 12, 1128);
			add_location(tr, file$g, 49, 10, 1002);
		},
		m: function mount(target, anchor) {
			insert_dev(target, tr, anchor);
			append_dev(tr, td0);
			append_dev(td0, t0);
			append_dev(tr, t1);
			append_dev(tr, td1);
			append_dev(td1, t2);
			append_dev(tr, t3);
			append_dev(tr, td2);
			append_dev(td2, t4);
			append_dev(tr, t5);
			dispose = listen_dev(td0, "click", click_handler, false, false, false);
		},
		p: function update(new_ctx, dirty) {
			ctx = new_ctx;
			if (dirty & /*cps*/ 8 && t0_value !== (t0_value = /*cp*/ ctx[9].lv + "")) set_data_dev(t0, t0_value);
			if (dirty & /*cps*/ 8 && t2_value !== (t2_value = /*cp*/ ctx[9].maxcp + "")) set_data_dev(t2, t2_value);
			if (dirty & /*cps*/ 8 && t4_value !== (t4_value = /*cp*/ ctx[9].mincp + "")) set_data_dev(t4, t4_value);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(tr);
			dispose();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block$8.name,
		type: "each",
		source: "(49:8) {#each cps as cp}",
		ctx
	});

	return block;
}

// (59:4) <CustomCP ads={ads} lv={lv}>
function create_default_slot_1$3(ctx) {
	let button;
	let dispose;

	const block = {
		c: function create() {
			button = element("button");
			button.textContent = "Show iv table";
			add_location(button, file$g, 59, 6, 1248);
		},
		m: function mount(target, anchor) {
			insert_dev(target, button, anchor);
			dispose = listen_dev(button, "click", /*toggleDialog*/ ctx[5], false, false, false);
		},
		p: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(button);
			dispose();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot_1$3.name,
		type: "slot",
		source: "(59:4) <CustomCP ads={ads} lv={lv}>",
		ctx
	});

	return block;
}

// (37:0) <Details type="cptable" class="card">
function create_default_slot$7(ctx) {
	let summary;
	let h3;
	let t1;
	let div;
	let table;
	let thead;
	let tr;
	let th0;
	let sup;
	let t3;
	let sub;
	let t5;
	let th1;
	let t7;
	let th2;
	let t9;
	let tbody;
	let t10;
	let current;
	let each_value = /*cps*/ ctx[3];
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block$8(get_each_context$8(ctx, each_value, i));
	}

	const customcp = new Custom_CP({
			props: {
				ads: /*ads*/ ctx[0],
				lv: /*lv*/ ctx[1],
				$$slots: { default: [create_default_slot_1$3] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	const block = {
		c: function create() {
			summary = element("summary");
			h3 = element("h3");
			h3.textContent = "CP table";
			t1 = space();
			div = element("div");
			table = element("table");
			thead = element("thead");
			tr = element("tr");
			th0 = element("th");
			sup = element("sup");
			sup.textContent = "Lv";
			t3 = text("/");
			sub = element("sub");
			sub.textContent = "CP";
			t5 = space();
			th1 = element("th");
			th1.textContent = "MAX";
			t7 = space();
			th2 = element("th");
			th2.textContent = "MIN";
			t9 = space();
			tbody = element("tbody");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			t10 = space();
			create_component(customcp.$$.fragment);
			add_location(h3, file$g, 37, 11, 667);
			add_location(summary, file$g, 37, 2, 658);
			add_location(sup, file$g, 42, 14, 813);
			add_location(sub, file$g, 42, 28, 827);
			add_location(th0, file$g, 42, 10, 809);
			attr_dev(th1, "title", "15-15-15");
			add_location(th1, file$g, 43, 10, 856);
			attr_dev(th2, "title", "0-0-0");
			add_location(th2, file$g, 44, 10, 896);
			add_location(tr, file$g, 41, 8, 794);
			add_location(thead, file$g, 40, 6, 778);
			add_location(tbody, file$g, 47, 6, 958);
			attr_dev(table, "class", "mr-6 ml-6 mb-4 text-right");
			add_location(table, file$g, 39, 4, 730);
			attr_dev(div, "class", "df jc-se fxw-w");
			add_location(div, file$g, 38, 2, 697);
		},
		m: function mount(target, anchor) {
			insert_dev(target, summary, anchor);
			append_dev(summary, h3);
			insert_dev(target, t1, anchor);
			insert_dev(target, div, anchor);
			append_dev(div, table);
			append_dev(table, thead);
			append_dev(thead, tr);
			append_dev(tr, th0);
			append_dev(th0, sup);
			append_dev(th0, t3);
			append_dev(th0, sub);
			append_dev(tr, t5);
			append_dev(tr, th1);
			append_dev(tr, t7);
			append_dev(tr, th2);
			append_dev(table, t9);
			append_dev(table, tbody);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(tbody, null);
			}

			append_dev(div, t10);
			mount_component(customcp, div, null);
			current = true;
		},
		p: function update(ctx, dirty) {
			if (dirty & /*cps, clickLv*/ 24) {
				each_value = /*cps*/ ctx[3];
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context$8(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block$8(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(tbody, null);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value.length;
			}

			const customcp_changes = {};
			if (dirty & /*ads*/ 1) customcp_changes.ads = /*ads*/ ctx[0];
			if (dirty & /*lv*/ 2) customcp_changes.lv = /*lv*/ ctx[1];

			if (dirty & /*$$scope*/ 4096) {
				customcp_changes.$$scope = { dirty, ctx };
			}

			customcp.$set(customcp_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(customcp.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(customcp.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(summary);
			if (detaching) detach_dev(t1);
			if (detaching) detach_dev(div);
			destroy_each(each_blocks, detaching);
			destroy_component(customcp);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot$7.name,
		type: "slot",
		source: "(37:0) <Details type=\\\"cptable\\\" class=\\\"card\\\">",
		ctx
	});

	return block;
}

// (65:0) {#if isIvTableShown}
function create_if_block$3(ctx) {
	let current;

	const ivdialog = new IV_Dialog({
			props: {
				hidden: !/*isIvTableShown*/ ctx[2],
				ads: /*ads*/ ctx[0],
				lv: /*lv*/ ctx[1]
			},
			$$inline: true
		});

	ivdialog.$on("close", /*toggleDialog*/ ctx[5]);

	const block = {
		c: function create() {
			create_component(ivdialog.$$.fragment);
		},
		m: function mount(target, anchor) {
			mount_component(ivdialog, target, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
			const ivdialog_changes = {};
			if (dirty & /*isIvTableShown*/ 4) ivdialog_changes.hidden = !/*isIvTableShown*/ ctx[2];
			if (dirty & /*ads*/ 1) ivdialog_changes.ads = /*ads*/ ctx[0];
			if (dirty & /*lv*/ 2) ivdialog_changes.lv = /*lv*/ ctx[1];
			ivdialog.$set(ivdialog_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(ivdialog.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(ivdialog.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(ivdialog, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$3.name,
		type: "if",
		source: "(65:0) {#if isIvTableShown}",
		ctx
	});

	return block;
}

function create_fragment$g(ctx) {
	let t;
	let if_block_anchor;
	let current;

	const details = new Details({
			props: {
				type: "cptable",
				class: "card",
				$$slots: { default: [create_default_slot$7] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	let if_block = /*isIvTableShown*/ ctx[2] && create_if_block$3(ctx);

	const block = {
		c: function create() {
			create_component(details.$$.fragment);
			t = space();
			if (if_block) if_block.c();
			if_block_anchor = empty();
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			mount_component(details, target, anchor);
			insert_dev(target, t, anchor);
			if (if_block) if_block.m(target, anchor);
			insert_dev(target, if_block_anchor, anchor);
			current = true;
		},
		p: function update(ctx, [dirty]) {
			const details_changes = {};

			if (dirty & /*$$scope, ads, lv, cps*/ 4107) {
				details_changes.$$scope = { dirty, ctx };
			}

			details.$set(details_changes);

			if (/*isIvTableShown*/ ctx[2]) {
				if (if_block) {
					if_block.p(ctx, dirty);
					transition_in(if_block, 1);
				} else {
					if_block = create_if_block$3(ctx);
					if_block.c();
					transition_in(if_block, 1);
					if_block.m(if_block_anchor.parentNode, if_block_anchor);
				}
			} else if (if_block) {
				group_outros();

				transition_out(if_block, 1, 1, () => {
					if_block = null;
				});

				check_outros();
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(details.$$.fragment, local);
			transition_in(if_block);
			current = true;
		},
		o: function outro(local) {
			transition_out(details.$$.fragment, local);
			transition_out(if_block);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(details, detaching);
			if (detaching) detach_dev(t);
			if (if_block) if_block.d(detaching);
			if (detaching) detach_dev(if_block_anchor);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$g.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$f($$self, $$props, $$invalidate) {
	let { ads } = $$props;
	const lvs = [8, 13, 15, 20, 25, 30, 35, 40, 41];
	let lv = 20;
	let isIvTableShown = false;

	function getCPs(ads) {
		let cps = lvs.map(lv => {
			return {
				lv,
				maxcp: calPmCPHP(ads, [15, 15, 15, lv]).cp,
				mincp: calPmCPHP(ads, [0, 0, 0, lv]).cp
			};
		});

		return cps;
	}

	function clickLv(_lv) {
		$$invalidate(1, lv = +_lv);
	}

	function toggleDialog() {
		$$invalidate(2, isIvTableShown = !isIvTableShown);
	}

	const writable_props = ["ads"];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<CP> was created with unknown prop '${key}'`);
	});

	const click_handler = cp => clickLv(cp.lv);

	$$self.$set = $$props => {
		if ("ads" in $$props) $$invalidate(0, ads = $$props.ads);
	};

	$$self.$capture_state = () => {
		return { ads, lv, isIvTableShown, cps };
	};

	$$self.$inject_state = $$props => {
		if ("ads" in $$props) $$invalidate(0, ads = $$props.ads);
		if ("lv" in $$props) $$invalidate(1, lv = $$props.lv);
		if ("isIvTableShown" in $$props) $$invalidate(2, isIvTableShown = $$props.isIvTableShown);
		if ("cps" in $$props) $$invalidate(3, cps = $$props.cps);
	};

	let cps;

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*ads*/ 1) {
			 $$invalidate(3, cps = getCPs(ads));
		}
	};

	return [
		ads,
		lv,
		isIvTableShown,
		cps,
		clickLv,
		toggleDialog,
		lvs,
		getCPs,
		click_handler
	];
}

class CP extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance$f, create_fragment$g, safe_not_equal, { ads: 0 });

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "CP",
			options,
			id: create_fragment$g.name
		});

		const { ctx } = this.$$;
		const props = options.props || {};

		if (/*ads*/ ctx[0] === undefined && !("ads" in props)) {
			console.warn("<CP> was created without expected prop 'ads'");
		}
	}

	get ads() {
		throw new Error("<CP>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set ads(value) {
		throw new Error("<CP>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* ./src/components/EvolveBranch.html generated by Svelte v3.18.1 */
const file$h = "./src/components/EvolveBranch.html";

function get_each_context_1$5(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[8] = list[i];
	return child_ctx;
}

function get_each_context$9(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[5] = list[i];
	return child_ctx;
}

// (46:2) {#if data.next}
function create_if_block$4(ctx) {
	let div;
	let current;
	let each_value = /*data*/ ctx[0].next;
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block$9(get_each_context$9(ctx, each_value, i));
	}

	const out = i => transition_out(each_blocks[i], 1, 1, () => {
		each_blocks[i] = null;
	});

	const block = {
		c: function create() {
			div = element("div");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			attr_dev(div, "class", "family-next df fd-c svelte-1j96odi");
			add_location(div, file$h, 46, 4, 1214);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(div, null);
			}

			current = true;
		},
		p: function update(ctx, dirty) {
			if (dirty & /*data, candySrc*/ 3) {
				each_value = /*data*/ ctx[0].next;
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context$9(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
						transition_in(each_blocks[i], 1);
					} else {
						each_blocks[i] = create_each_block$9(child_ctx);
						each_blocks[i].c();
						transition_in(each_blocks[i], 1);
						each_blocks[i].m(div, null);
					}
				}

				group_outros();

				for (i = each_value.length; i < each_blocks.length; i += 1) {
					out(i);
				}

				check_outros();
			}
		},
		i: function intro(local) {
			if (current) return;

			for (let i = 0; i < each_value.length; i += 1) {
				transition_in(each_blocks[i]);
			}

			current = true;
		},
		o: function outro(local) {
			each_blocks = each_blocks.filter(Boolean);

			for (let i = 0; i < each_blocks.length; i += 1) {
				transition_out(each_blocks[i]);
			}

			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			destroy_each(each_blocks, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$4.name,
		type: "if",
		source: "(46:2) {#if data.next}",
		ctx
	});

	return block;
}

// (61:12) {#if item.requirement}
function create_if_block_1$2(ctx) {
	let div;
	let details;
	let summary;
	let t1;
	let ul;
	let each_value_1 = /*item*/ ctx[5].requirement;
	let each_blocks = [];

	for (let i = 0; i < each_value_1.length; i += 1) {
		each_blocks[i] = create_each_block_1$5(get_each_context_1$5(ctx, each_value_1, i));
	}

	const block = {
		c: function create() {
			div = element("div");
			details = element("details");
			summary = element("summary");
			summary.textContent = "條件";
			t1 = space();
			ul = element("ul");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			attr_dev(summary, "dir", "ltr");
			attr_dev(summary, "class", "r-summary svelte-1j96odi");
			add_location(summary, file$h, 63, 18, 1685);
			attr_dev(ul, "class", "rs-list pos-a m-0 text-left svelte-1j96odi");
			add_location(ul, file$h, 64, 18, 1753);
			add_location(details, file$h, 62, 16, 1657);
			attr_dev(div, "class", "rs");
			add_location(div, file$h, 61, 14, 1624);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			append_dev(div, details);
			append_dev(details, summary);
			append_dev(details, t1);
			append_dev(details, ul);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(ul, null);
			}
		},
		p: function update(ctx, dirty) {
			if (dirty & /*data*/ 1) {
				each_value_1 = /*item*/ ctx[5].requirement;
				let i;

				for (i = 0; i < each_value_1.length; i += 1) {
					const child_ctx = get_each_context_1$5(ctx, each_value_1, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block_1$5(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(ul, null);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value_1.length;
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			destroy_each(each_blocks, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_1$2.name,
		type: "if",
		source: "(61:12) {#if item.requirement}",
		ctx
	});

	return block;
}

// (66:20) {#each item.requirement as ri}
function create_each_block_1$5(ctx) {
	let li;
	let t_value = /*ri*/ ctx[8] + "";
	let t;

	const block = {
		c: function create() {
			li = element("li");
			t = text(t_value);
			add_location(li, file$h, 66, 22, 1867);
		},
		m: function mount(target, anchor) {
			insert_dev(target, li, anchor);
			append_dev(li, t);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*data*/ 1 && t_value !== (t_value = /*ri*/ ctx[8] + "")) set_data_dev(t, t_value);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(li);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block_1$5.name,
		type: "each",
		source: "(66:20) {#each item.requirement as ri}",
		ctx
	});

	return block;
}

// (49:6) {#each data.next as item}
function create_each_block$9(ctx) {
	let div3;
	let div2;
	let div0;
	let t0_value = /*item*/ ctx[5].candyCost + "";
	let t0;
	let t1;
	let img;
	let img_src_value;
	let t2;
	let div1;
	let t4;
	let t5;
	let t6;
	let current;
	let if_block = /*item*/ ctx[5].requirement && create_if_block_1$2(ctx);

	const evolvebranch = new EvolveBranch({
			props: { data: /*item*/ ctx[5] },
			$$inline: true
		});

	const block = {
		c: function create() {
			div3 = element("div");
			div2 = element("div");
			div0 = element("div");
			t0 = text(t0_value);
			t1 = space();
			img = element("img");
			t2 = space();
			div1 = element("div");
			div1.textContent = "➡";
			t4 = space();
			if (if_block) if_block.c();
			t5 = space();
			create_component(evolvebranch.$$.fragment);
			t6 = space();
			attr_dev(img, "class", "candy svelte-1j96odi");
			if (img.src !== (img_src_value = /*candySrc*/ ctx[1])) attr_dev(img, "src", img_src_value);
			attr_dev(img, "alt", "candy");
			add_location(img, file$h, 55, 14, 1482);
			attr_dev(div0, "class", "d-if flex-center");
			add_location(div0, file$h, 53, 12, 1406);
			add_location(div1, file$h, 58, 12, 1561);
			attr_dev(div2, "class", "df fd-c jc-c text-nowrap");
			add_location(div2, file$h, 52, 10, 1355);
			attr_dev(div3, "class", "df");
			add_location(div3, file$h, 49, 8, 1289);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div3, anchor);
			append_dev(div3, div2);
			append_dev(div2, div0);
			append_dev(div0, t0);
			append_dev(div0, t1);
			append_dev(div0, img);
			append_dev(div2, t2);
			append_dev(div2, div1);
			append_dev(div2, t4);
			if (if_block) if_block.m(div2, null);
			append_dev(div3, t5);
			mount_component(evolvebranch, div3, null);
			append_dev(div3, t6);
			current = true;
		},
		p: function update(ctx, dirty) {
			if ((!current || dirty & /*data*/ 1) && t0_value !== (t0_value = /*item*/ ctx[5].candyCost + "")) set_data_dev(t0, t0_value);

			if (/*item*/ ctx[5].requirement) {
				if (if_block) {
					if_block.p(ctx, dirty);
				} else {
					if_block = create_if_block_1$2(ctx);
					if_block.c();
					if_block.m(div2, null);
				}
			} else if (if_block) {
				if_block.d(1);
				if_block = null;
			}

			const evolvebranch_changes = {};
			if (dirty & /*data*/ 1) evolvebranch_changes.data = /*item*/ ctx[5];
			evolvebranch.$set(evolvebranch_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(evolvebranch.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(evolvebranch.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div3);
			if (if_block) if_block.d();
			destroy_component(evolvebranch);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block$9.name,
		type: "each",
		source: "(49:6) {#each data.next as item}",
		ctx
	});

	return block;
}

function create_fragment$h(ctx) {
	let div1;
	let a;
	let div0;
	let div0_data_id_value;
	let div0_data_dex_value;
	let t0;
	let html_tag;
	let raw_value = /*data*/ ctx[0].pm.name.replace(" ", "<br>") + "";
	let a_title_value;
	let a_href_value;
	let t1;
	let current;
	let if_block = /*data*/ ctx[0].next && create_if_block$4(ctx);

	const block = {
		c: function create() {
			div1 = element("div");
			a = element("a");
			div0 = element("div");
			t0 = space();
			t1 = space();
			if (if_block) if_block.c();
			attr_dev(div0, "class", "pm-img mb-1 svelte-1j96odi");
			attr_dev(div0, "data-id", div0_data_id_value = /*data*/ ctx[0].pm.uid);
			attr_dev(div0, "data-dex", div0_data_dex_value = "#" + /*data*/ ctx[0].pm.dex);
			set_style(div0, "background-image", "url(" + /*data*/ ctx[0].src + ")");
			set_style(div0, "--bdw", "var(--uid-bdw-" + /*data*/ ctx[0].pm.uid + ", 0px)");
			add_location(div0, file$h, 36, 4, 952);
			html_tag = new HtmlTag(raw_value, null);
			attr_dev(a, "class", "pm df fd-c text-no-decoration svelte-1j96odi");
			attr_dev(a, "title", a_title_value = "#" + /*data*/ ctx[0].pm.dex + " " + /*data*/ ctx[0].pm.name);
			attr_dev(a, "href", a_href_value = "./pokemon/" + /*data*/ ctx[0].pm.uid);
			add_location(a, file$h, 32, 2, 826);
			attr_dev(div1, "class", "family-tree df ai-c text-center fz-s mb-2 svelte-1j96odi");
			add_location(div1, file$h, 31, 0, 768);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, div1, anchor);
			append_dev(div1, a);
			append_dev(a, div0);
			append_dev(a, t0);
			html_tag.m(a);
			append_dev(div1, t1);
			if (if_block) if_block.m(div1, null);
			current = true;
		},
		p: function update(ctx, [dirty]) {
			if (!current || dirty & /*data*/ 1 && div0_data_id_value !== (div0_data_id_value = /*data*/ ctx[0].pm.uid)) {
				attr_dev(div0, "data-id", div0_data_id_value);
			}

			if (!current || dirty & /*data*/ 1 && div0_data_dex_value !== (div0_data_dex_value = "#" + /*data*/ ctx[0].pm.dex)) {
				attr_dev(div0, "data-dex", div0_data_dex_value);
			}

			if (!current || dirty & /*data*/ 1) {
				set_style(div0, "background-image", "url(" + /*data*/ ctx[0].src + ")");
			}

			if (!current || dirty & /*data*/ 1) {
				set_style(div0, "--bdw", "var(--uid-bdw-" + /*data*/ ctx[0].pm.uid + ", 0px)");
			}

			if ((!current || dirty & /*data*/ 1) && raw_value !== (raw_value = /*data*/ ctx[0].pm.name.replace(" ", "<br>") + "")) html_tag.p(raw_value);

			if (!current || dirty & /*data*/ 1 && a_title_value !== (a_title_value = "#" + /*data*/ ctx[0].pm.dex + " " + /*data*/ ctx[0].pm.name)) {
				attr_dev(a, "title", a_title_value);
			}

			if (!current || dirty & /*data*/ 1 && a_href_value !== (a_href_value = "./pokemon/" + /*data*/ ctx[0].pm.uid)) {
				attr_dev(a, "href", a_href_value);
			}

			if (/*data*/ ctx[0].next) {
				if (if_block) {
					if_block.p(ctx, dirty);
					transition_in(if_block, 1);
				} else {
					if_block = create_if_block$4(ctx);
					if_block.c();
					transition_in(if_block, 1);
					if_block.m(div1, null);
				}
			} else if (if_block) {
				group_outros();

				transition_out(if_block, 1, 1, () => {
					if_block = null;
				});

				check_outros();
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(if_block);
			current = true;
		},
		o: function outro(local) {
			transition_out(if_block);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div1);
			if (if_block) if_block.d();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$h.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function pmImgFN(fn) {
	return `${ASSET_FOLDER}/pokemon_icons/pokemon_icon_${fn}.png`;
}

function instance$g($$self, $$props, $$invalidate) {
	let $settings;
	let $pokemons;
	validate_store(settings, "settings");
	component_subscribe($$self, settings, $$value => $$invalidate(2, $settings = $$value));
	validate_store(pokemons, "pokemons");
	component_subscribe($$self, pokemons, $$value => $$invalidate(3, $pokemons = $$value));
	let { data } = $$props;
	let candySrc = cdnImgSrc(`${ASSET_FOLDER}static_assets/png/pokemon_details_candy.png`, 32);

	function getPm(pid) {
		if (!$pokemons.length) {
			return false;
		}

		return $pokemons.find(pm => pm.id === pid);
	}

	const writable_props = ["data"];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<EvolveBranch> was created with unknown prop '${key}'`);
	});

	$$self.$set = $$props => {
		if ("data" in $$props) $$invalidate(0, data = $$props.data);
	};

	$$self.$capture_state = () => {
		return { data, candySrc, $settings, $pokemons };
	};

	$$self.$inject_state = $$props => {
		if ("data" in $$props) $$invalidate(0, data = $$props.data);
		if ("candySrc" in $$props) $$invalidate(1, candySrc = $$props.candySrc);
		if ("$settings" in $$props) settings.set($settings = $$props.$settings);
		if ("$pokemons" in $$props) pokemons.set($pokemons = $$props.$pokemons);
	};

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*data, $settings*/ 5) {
			 {
				$$invalidate(0, data.pm = getPm(data.form || data.name) || getPm(data.name), data);

				let fn = data.suffix
				? data.suffix
				: `000${data.pm.dex}`.slice(-3) + (data.iso ? `_${data.iso}` : "_00") + ($settings.io.shinyAvatar ? "_shiny" : "");

				$$invalidate(0, data.src = cdnImgSrc(pmImgFN(fn)), data);
			}
		}
	};

	return [data, candySrc];
}

class EvolveBranch extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance$g, create_fragment$h, safe_not_equal, { data: 0 });

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "EvolveBranch",
			options,
			id: create_fragment$h.name
		});

		const { ctx } = this.$$;
		const props = options.props || {};

		if (/*data*/ ctx[0] === undefined && !("data" in props)) {
			console.warn("<EvolveBranch> was created without expected prop 'data'");
		}
	}

	get data() {
		throw new Error("<EvolveBranch>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set data(value) {
		throw new Error("<EvolveBranch>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* ./src/components/Family.html generated by Svelte v3.18.1 */

function get_each_context$a(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[3] = list[i];
	return child_ctx;
}

// (16:0) {#if f}
function create_if_block$5(ctx) {
	let each_1_anchor;
	let current;
	let each_value = /*f*/ ctx[0];
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block$a(get_each_context$a(ctx, each_value, i));
	}

	const out = i => transition_out(each_blocks[i], 1, 1, () => {
		each_blocks[i] = null;
	});

	const block = {
		c: function create() {
			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			each_1_anchor = empty();
		},
		m: function mount(target, anchor) {
			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(target, anchor);
			}

			insert_dev(target, each_1_anchor, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
			if (dirty & /*f*/ 1) {
				each_value = /*f*/ ctx[0];
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context$a(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
						transition_in(each_blocks[i], 1);
					} else {
						each_blocks[i] = create_each_block$a(child_ctx);
						each_blocks[i].c();
						transition_in(each_blocks[i], 1);
						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
					}
				}

				group_outros();

				for (i = each_value.length; i < each_blocks.length; i += 1) {
					out(i);
				}

				check_outros();
			}
		},
		i: function intro(local) {
			if (current) return;

			for (let i = 0; i < each_value.length; i += 1) {
				transition_in(each_blocks[i]);
			}

			current = true;
		},
		o: function outro(local) {
			each_blocks = each_blocks.filter(Boolean);

			for (let i = 0; i < each_blocks.length; i += 1) {
				transition_out(each_blocks[i]);
			}

			current = false;
		},
		d: function destroy(detaching) {
			destroy_each(each_blocks, detaching);
			if (detaching) detach_dev(each_1_anchor);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$5.name,
		type: "if",
		source: "(16:0) {#if f}",
		ctx
	});

	return block;
}

// (18:4) {#if !p0.parentPid || f.length === 1}
function create_if_block_1$3(ctx) {
	let current;

	const evolvebranch = new EvolveBranch({
			props: { data: /*p0*/ ctx[3] },
			$$inline: true
		});

	const block = {
		c: function create() {
			create_component(evolvebranch.$$.fragment);
		},
		m: function mount(target, anchor) {
			mount_component(evolvebranch, target, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
			const evolvebranch_changes = {};
			if (dirty & /*f*/ 1) evolvebranch_changes.data = /*p0*/ ctx[3];
			evolvebranch.$set(evolvebranch_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(evolvebranch.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(evolvebranch.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(evolvebranch, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_1$3.name,
		type: "if",
		source: "(18:4) {#if !p0.parentPid || f.length === 1}",
		ctx
	});

	return block;
}

// (17:2) {#each f as p0}
function create_each_block$a(ctx) {
	let if_block_anchor;
	let current;
	let if_block = (!/*p0*/ ctx[3].parentPid || /*f*/ ctx[0].length === 1) && create_if_block_1$3(ctx);

	const block = {
		c: function create() {
			if (if_block) if_block.c();
			if_block_anchor = empty();
		},
		m: function mount(target, anchor) {
			if (if_block) if_block.m(target, anchor);
			insert_dev(target, if_block_anchor, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
			if (!/*p0*/ ctx[3].parentPid || /*f*/ ctx[0].length === 1) {
				if (if_block) {
					if_block.p(ctx, dirty);
					transition_in(if_block, 1);
				} else {
					if_block = create_if_block_1$3(ctx);
					if_block.c();
					transition_in(if_block, 1);
					if_block.m(if_block_anchor.parentNode, if_block_anchor);
				}
			} else if (if_block) {
				group_outros();

				transition_out(if_block, 1, 1, () => {
					if_block = null;
				});

				check_outros();
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(if_block);
			current = true;
		},
		o: function outro(local) {
			transition_out(if_block);
			current = false;
		},
		d: function destroy(detaching) {
			if (if_block) if_block.d(detaching);
			if (detaching) detach_dev(if_block_anchor);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block$a.name,
		type: "each",
		source: "(17:2) {#each f as p0}",
		ctx
	});

	return block;
}

function create_fragment$i(ctx) {
	let if_block_anchor;
	let current;
	let if_block = /*f*/ ctx[0] && create_if_block$5(ctx);

	const block = {
		c: function create() {
			if (if_block) if_block.c();
			if_block_anchor = empty();
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			if (if_block) if_block.m(target, anchor);
			insert_dev(target, if_block_anchor, anchor);
			current = true;
		},
		p: function update(ctx, [dirty]) {
			if (/*f*/ ctx[0]) {
				if (if_block) {
					if_block.p(ctx, dirty);
					transition_in(if_block, 1);
				} else {
					if_block = create_if_block$5(ctx);
					if_block.c();
					transition_in(if_block, 1);
					if_block.m(if_block_anchor.parentNode, if_block_anchor);
				}
			} else if (if_block) {
				group_outros();

				transition_out(if_block, 1, 1, () => {
					if_block = null;
				});

				check_outros();
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(if_block);
			current = true;
		},
		o: function outro(local) {
			transition_out(if_block);
			current = false;
		},
		d: function destroy(detaching) {
			if (if_block) if_block.d(detaching);
			if (detaching) detach_dev(if_block_anchor);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$i.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$h($$self, $$props, $$invalidate) {
	let $family;
	validate_store(family, "family");
	component_subscribe($$self, family, $$value => $$invalidate(2, $family = $$value));
	let { pm } = $$props;
	let f;
	const writable_props = ["pm"];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Family> was created with unknown prop '${key}'`);
	});

	$$self.$set = $$props => {
		if ("pm" in $$props) $$invalidate(1, pm = $$props.pm);
	};

	$$self.$capture_state = () => {
		return { pm, f, $family };
	};

	$$self.$inject_state = $$props => {
		if ("pm" in $$props) $$invalidate(1, pm = $$props.pm);
		if ("f" in $$props) $$invalidate(0, f = $$props.f);
		if ("$family" in $$props) family.set($family = $$props.$family);
	};

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*$family, pm*/ 6) {
			 {
				if (!$family.waiting) {
					$$invalidate(0, f = $family[pm.familyId]);
				}
			}
		}
	};

	return [f, pm];
}

class Family extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance$h, create_fragment$i, safe_not_equal, { pm: 1 });

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Family",
			options,
			id: create_fragment$i.name
		});

		const { ctx } = this.$$;
		const props = options.props || {};

		if (/*pm*/ ctx[1] === undefined && !("pm" in props)) {
			console.warn("<Family> was created without expected prop 'pm'");
		}
	}

	get pm() {
		throw new Error("<Family>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set pm(value) {
		throw new Error("<Family>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* ./src/components/ADS-Bar.html generated by Svelte v3.18.1 */

const file$i = "./src/components/ADS-Bar.html";

function create_fragment$j(ctx) {
	let div3;
	let div0;
	let t0;
	let t1_value = /*pm*/ ctx[0]._atk + "";
	let t1;
	let t2;
	let div1;
	let t3;
	let t4_value = /*pm*/ ctx[0]._def + "";
	let t4;
	let t5;
	let div2;
	let t6;
	let t7_value = /*pm*/ ctx[0]._sta + "";
	let t7;
	let div3_class_value;

	const block = {
		c: function create() {
			div3 = element("div");
			div0 = element("div");
			t0 = text("Atk: ");
			t1 = text(t1_value);
			t2 = space();
			div1 = element("div");
			t3 = text("Def: ");
			t4 = text(t4_value);
			t5 = space();
			div2 = element("div");
			t6 = text("Sta: ");
			t7 = text(t7_value);
			attr_dev(div0, "class", "ads-bar atk mb-1 svelte-1ex4fh5");
			set_style(div0, "--ratio", /*pm*/ ctx[0]._atk / 500);
			add_location(div0, file$i, 8, 2, 124);
			attr_dev(div1, "class", "ads-bar def mb-1 svelte-1ex4fh5");
			set_style(div1, "--ratio", /*pm*/ ctx[0]._def / 500);
			add_location(div1, file$i, 9, 2, 210);
			attr_dev(div2, "class", "ads-bar sta mb-1 svelte-1ex4fh5");
			set_style(div2, "--ratio", /*pm*/ ctx[0]._sta / 500);
			add_location(div2, file$i, 10, 2, 296);
			attr_dev(div3, "class", div3_class_value = "" + (null_to_empty(/*className*/ ctx[1]) + " svelte-1ex4fh5"));
			add_location(div3, file$i, 7, 0, 98);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, div3, anchor);
			append_dev(div3, div0);
			append_dev(div0, t0);
			append_dev(div0, t1);
			append_dev(div3, t2);
			append_dev(div3, div1);
			append_dev(div1, t3);
			append_dev(div1, t4);
			append_dev(div3, t5);
			append_dev(div3, div2);
			append_dev(div2, t6);
			append_dev(div2, t7);
		},
		p: function update(ctx, [dirty]) {
			if (dirty & /*pm*/ 1 && t1_value !== (t1_value = /*pm*/ ctx[0]._atk + "")) set_data_dev(t1, t1_value);

			if (dirty & /*pm*/ 1) {
				set_style(div0, "--ratio", /*pm*/ ctx[0]._atk / 500);
			}

			if (dirty & /*pm*/ 1 && t4_value !== (t4_value = /*pm*/ ctx[0]._def + "")) set_data_dev(t4, t4_value);

			if (dirty & /*pm*/ 1) {
				set_style(div1, "--ratio", /*pm*/ ctx[0]._def / 500);
			}

			if (dirty & /*pm*/ 1 && t7_value !== (t7_value = /*pm*/ ctx[0]._sta + "")) set_data_dev(t7, t7_value);

			if (dirty & /*pm*/ 1) {
				set_style(div2, "--ratio", /*pm*/ ctx[0]._sta / 500);
			}

			if (dirty & /*className*/ 2 && div3_class_value !== (div3_class_value = "" + (null_to_empty(/*className*/ ctx[1]) + " svelte-1ex4fh5"))) {
				attr_dev(div3, "class", div3_class_value);
			}
		},
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(div3);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$j.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$i($$self, $$props, $$invalidate) {
	let { pm = {} } = $$props;
	let { class: className = "" } = $$props;
	const writable_props = ["pm", "class"];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<ADS_Bar> was created with unknown prop '${key}'`);
	});

	$$self.$set = $$props => {
		if ("pm" in $$props) $$invalidate(0, pm = $$props.pm);
		if ("class" in $$props) $$invalidate(1, className = $$props.class);
	};

	$$self.$capture_state = () => {
		return { pm, className };
	};

	$$self.$inject_state = $$props => {
		if ("pm" in $$props) $$invalidate(0, pm = $$props.pm);
		if ("className" in $$props) $$invalidate(1, className = $$props.className);
	};

	return [pm, className];
}

class ADS_Bar extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance$i, create_fragment$j, safe_not_equal, { pm: 0, class: 1 });

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "ADS_Bar",
			options,
			id: create_fragment$j.name
		});
	}

	get pm() {
		throw new Error("<ADS_Bar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set pm(value) {
		throw new Error("<ADS_Bar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get class() {
		throw new Error("<ADS_Bar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set class(value) {
		throw new Error("<ADS_Bar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* ./src/components/TTFA.html generated by Svelte v3.18.1 */
const file$j = "./src/components/TTFA.html";

// (83:6) <tr slot="thead">
function create_thead_slot$3(ctx) {
	let tr;
	let th0;
	let t1;
	let th1;
	let t3;
	let th2;
	let t5;
	let th3;
	let t7;
	let th4;
	let t9;
	let th5;

	const block = {
		c: function create() {
			tr = element("tr");
			th0 = element("th");
			th0.textContent = "T";
			t1 = space();
			th1 = element("th");
			th1.textContent = "H";
			t3 = space();
			th2 = element("th");
			th2.textContent = "ΣD";
			t5 = space();
			th3 = element("th");
			th3.textContent = "DPT";
			t7 = space();
			th4 = element("th");
			th4.textContent = "小招";
			t9 = space();
			th5 = element("th");
			th5.textContent = "大招";
			attr_dev(th0, "data-sort", "turns");
			attr_dev(th0, "title", "回合");
			attr_dev(th0, "data-sort-initial", "");
			add_location(th0, file$j, 83, 8, 1350);
			attr_dev(th1, "data-sort", "hits");
			attr_dev(th1, "title", "小招攻擊次數");
			add_location(th1, file$j, 84, 8, 1416);
			attr_dev(th2, "data-sort", "dmg_t");
			attr_dev(th2, "title", "循環傷害 (+STAB)");
			add_location(th2, file$j, 85, 8, 1467);
			attr_dev(th3, "data-sort", "dpt");
			attr_dev(th3, "title", "回合均傷 (+STAB)");
			add_location(th3, file$j, 86, 8, 1526);
			add_location(th4, file$j, 87, 8, 1584);
			add_location(th5, file$j, 88, 8, 1604);
			attr_dev(tr, "slot", "thead");
			add_location(tr, file$j, 82, 6, 1324);
		},
		m: function mount(target, anchor) {
			insert_dev(target, tr, anchor);
			append_dev(tr, th0);
			append_dev(tr, t1);
			append_dev(tr, th1);
			append_dev(tr, t3);
			append_dev(tr, th2);
			append_dev(tr, t5);
			append_dev(tr, th3);
			append_dev(tr, t7);
			append_dev(tr, th4);
			append_dev(tr, t9);
			append_dev(tr, th5);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(tr);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_thead_slot$3.name,
		type: "slot",
		source: "(83:6) <tr slot=\\\"thead\\\">",
		ctx
	});

	return block;
}

// (92:6) <tr slot="tbody" let:item={item}>
function create_tbody_slot$3(ctx) {
	let tr;
	let td0;
	let t0_value = /*item*/ ctx[5].turns + "";
	let t0;
	let t1;
	let td1;
	let t2_value = /*item*/ ctx[5].hits + "";
	let t2;
	let t3;
	let td2;
	let t4_value = /*item*/ ctx[5].dmg_t + "";
	let t4;
	let t5;
	let td3;
	let t6_value = /*item*/ ctx[5].dpt + "";
	let t6;
	let t7;
	let td4;
	let t8_value = /*item*/ ctx[5].f.name + "";
	let t8;
	let td4_class_value;
	let td4_data_efficon_value;
	let t9;
	let td5;
	let t10_value = /*item*/ ctx[5].c.name + "";
	let t10;
	let td5_class_value;
	let td5_data_efficon_value;

	const block = {
		c: function create() {
			tr = element("tr");
			td0 = element("td");
			t0 = text(t0_value);
			t1 = space();
			td1 = element("td");
			t2 = text(t2_value);
			t3 = space();
			td2 = element("td");
			t4 = text(t4_value);
			t5 = space();
			td3 = element("td");
			t6 = text(t6_value);
			t7 = space();
			td4 = element("td");
			t8 = text(t8_value);
			t9 = space();
			td5 = element("td");
			t10 = text(t10_value);
			add_location(td0, file$j, 92, 8, 1677);
			add_location(td1, file$j, 93, 8, 1707);
			add_location(td2, file$j, 94, 8, 1736);
			add_location(td3, file$j, 95, 8, 1766);
			attr_dev(td4, "class", td4_class_value = /*item*/ ctx[5].f.stab ? "is-stab" : "");
			attr_dev(td4, "data-efficon", td4_data_efficon_value = /*item*/ ctx[5].f.efficon);
			add_location(td4, file$j, 96, 8, 1794);
			attr_dev(td5, "class", td5_class_value = /*item*/ ctx[5].c.stab ? "is-stab" : "");
			attr_dev(td5, "data-efficon", td5_data_efficon_value = /*item*/ ctx[5].c.efficon);
			add_location(td5, file$j, 97, 8, 1892);
			attr_dev(tr, "slot", "tbody");
			add_location(tr, file$j, 91, 6, 1635);
		},
		m: function mount(target, anchor) {
			insert_dev(target, tr, anchor);
			append_dev(tr, td0);
			append_dev(td0, t0);
			append_dev(tr, t1);
			append_dev(tr, td1);
			append_dev(td1, t2);
			append_dev(tr, t3);
			append_dev(tr, td2);
			append_dev(td2, t4);
			append_dev(tr, t5);
			append_dev(tr, td3);
			append_dev(td3, t6);
			append_dev(tr, t7);
			append_dev(tr, td4);
			append_dev(td4, t8);
			append_dev(tr, t9);
			append_dev(tr, td5);
			append_dev(td5, t10);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*item*/ 32 && t0_value !== (t0_value = /*item*/ ctx[5].turns + "")) set_data_dev(t0, t0_value);
			if (dirty & /*item*/ 32 && t2_value !== (t2_value = /*item*/ ctx[5].hits + "")) set_data_dev(t2, t2_value);
			if (dirty & /*item*/ 32 && t4_value !== (t4_value = /*item*/ ctx[5].dmg_t + "")) set_data_dev(t4, t4_value);
			if (dirty & /*item*/ 32 && t6_value !== (t6_value = /*item*/ ctx[5].dpt + "")) set_data_dev(t6, t6_value);
			if (dirty & /*item*/ 32 && t8_value !== (t8_value = /*item*/ ctx[5].f.name + "")) set_data_dev(t8, t8_value);

			if (dirty & /*item*/ 32 && td4_class_value !== (td4_class_value = /*item*/ ctx[5].f.stab ? "is-stab" : "")) {
				attr_dev(td4, "class", td4_class_value);
			}

			if (dirty & /*item*/ 32 && td4_data_efficon_value !== (td4_data_efficon_value = /*item*/ ctx[5].f.efficon)) {
				attr_dev(td4, "data-efficon", td4_data_efficon_value);
			}

			if (dirty & /*item*/ 32 && t10_value !== (t10_value = /*item*/ ctx[5].c.name + "")) set_data_dev(t10, t10_value);

			if (dirty & /*item*/ 32 && td5_class_value !== (td5_class_value = /*item*/ ctx[5].c.stab ? "is-stab" : "")) {
				attr_dev(td5, "class", td5_class_value);
			}

			if (dirty & /*item*/ 32 && td5_data_efficon_value !== (td5_data_efficon_value = /*item*/ ctx[5].c.efficon)) {
				attr_dev(td5, "data-efficon", td5_data_efficon_value);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(tr);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_tbody_slot$3.name,
		type: "slot",
		source: "(92:6) <tr slot=\\\"tbody\\\" let:item={item}>",
		ctx
	});

	return block;
}

// (101:6) <tr slot="tfoot" class="fz-s" style="color: #999">
function create_tfoot_slot$1(ctx) {
	let tr;
	let td0;
	let t1;
	let td1;
	let t2;
	let br0;
	let t3;
	let br1;
	let t4;
	let t5;
	let td2;
	let t6;
	let br2;
	let t7;
	let br3;
	let sub;
	let t9;
	let td3;
	let t10;
	let br4;
	let t11;
	let br5;
	let t12;
	let t13;
	let td4;
	let t15;
	let td5;

	const block = {
		c: function create() {
			tr = element("tr");
			td0 = element("td");
			td0.textContent = "回合";
			t1 = space();
			td1 = element("td");
			t2 = text("小招");
			br0 = element("br");
			t3 = text("攻擊");
			br1 = element("br");
			t4 = text("次數");
			t5 = space();
			td2 = element("td");
			t6 = text("循環");
			br2 = element("br");
			t7 = text("傷害");
			br3 = element("br");
			sub = element("sub");
			sub.textContent = "(+STAB)";
			t9 = space();
			td3 = element("td");
			t10 = text("回合");
			br4 = element("br");
			t11 = text("均傷");
			br5 = element("br");
			t12 = text("(+STAB)");
			t13 = space();
			td4 = element("td");
			td4.textContent = "小招";
			t15 = space();
			td5 = element("td");
			td5.textContent = "大招";
			attr_dev(td0, "class", "pt-4 pb-4");
			add_location(td0, file$j, 101, 8, 2060);
			add_location(br0, file$j, 102, 32, 2122);
			add_location(br1, file$j, 102, 38, 2128);
			attr_dev(td1, "class", "pt-4 pb-4");
			add_location(td1, file$j, 102, 8, 2098);
			add_location(br2, file$j, 103, 32, 2172);
			add_location(br3, file$j, 103, 38, 2178);
			add_location(sub, file$j, 103, 42, 2182);
			attr_dev(td2, "class", "pt-4 pb-4");
			add_location(td2, file$j, 103, 8, 2148);
			add_location(br4, file$j, 104, 32, 2238);
			add_location(br5, file$j, 104, 38, 2244);
			attr_dev(td3, "class", "pt-4 pb-4");
			add_location(td3, file$j, 104, 8, 2214);
			attr_dev(td4, "class", "pt-4 pb-4");
			add_location(td4, file$j, 105, 8, 2269);
			attr_dev(td5, "class", "pt-4 pb-4");
			add_location(td5, file$j, 106, 8, 2307);
			attr_dev(tr, "slot", "tfoot");
			attr_dev(tr, "class", "fz-s");
			set_style(tr, "color", "#999");
			add_location(tr, file$j, 100, 6, 2001);
		},
		m: function mount(target, anchor) {
			insert_dev(target, tr, anchor);
			append_dev(tr, td0);
			append_dev(tr, t1);
			append_dev(tr, td1);
			append_dev(td1, t2);
			append_dev(td1, br0);
			append_dev(td1, t3);
			append_dev(td1, br1);
			append_dev(td1, t4);
			append_dev(tr, t5);
			append_dev(tr, td2);
			append_dev(td2, t6);
			append_dev(td2, br2);
			append_dev(td2, t7);
			append_dev(td2, br3);
			append_dev(td2, sub);
			append_dev(tr, t9);
			append_dev(tr, td3);
			append_dev(td3, t10);
			append_dev(td3, br4);
			append_dev(td3, t11);
			append_dev(td3, br5);
			append_dev(td3, t12);
			append_dev(tr, t13);
			append_dev(tr, td4);
			append_dev(tr, t15);
			append_dev(tr, td5);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(tr);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_tfoot_slot$1.name,
		type: "slot",
		source: "(101:6) <tr slot=\\\"tfoot\\\" class=\\\"fz-s\\\" style=\\\"color: #999\\\">",
		ctx
	});

	return block;
}

// (82:4) <TableSort items={pairs} class="ml-a mr-a narrow">
function create_default_slot_1$4(ctx) {
	let t0;
	let t1;

	const block = {
		c: function create() {
			t0 = space();
			t1 = space();
		},
		m: function mount(target, anchor) {
			insert_dev(target, t0, anchor);
			insert_dev(target, t1, anchor);
		},
		p: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(t0);
			if (detaching) detach_dev(t1);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot_1$4.name,
		type: "slot",
		source: "(82:4) <TableSort items={pairs} class=\\\"ml-a mr-a narrow\\\">",
		ctx
	});

	return block;
}

// (78:0) <Details type="move-pair" class="card">
function create_default_slot$8(ctx) {
	let summary;
	let h3;
	let t1;
	let div;
	let current;

	const tablesort = new TableSort({
			props: {
				items: /*pairs*/ ctx[0],
				class: "ml-a mr-a narrow",
				$$slots: {
					default: [create_default_slot_1$4],
					tfoot: [create_tfoot_slot$1],
					tbody: [
						create_tbody_slot$3,
						({ item }) => ({ 5: item }),
						({ item }) => item ? 32 : 0
					],
					thead: [create_thead_slot$3]
				},
				$$scope: { ctx }
			},
			$$inline: true
		});

	const block = {
		c: function create() {
			summary = element("summary");
			h3 = element("h3");
			h3.textContent = "Move Pair";
			t1 = space();
			div = element("div");
			create_component(tablesort.$$.fragment);
			add_location(h3, file$j, 78, 11, 1225);
			add_location(summary, file$j, 78, 2, 1216);
			add_location(div, file$j, 80, 2, 1257);
		},
		m: function mount(target, anchor) {
			insert_dev(target, summary, anchor);
			append_dev(summary, h3);
			insert_dev(target, t1, anchor);
			insert_dev(target, div, anchor);
			mount_component(tablesort, div, null);
			current = true;
		},
		p: function update(ctx, dirty) {
			const tablesort_changes = {};
			if (dirty & /*pairs*/ 1) tablesort_changes.items = /*pairs*/ ctx[0];

			if (dirty & /*$$scope, item*/ 96) {
				tablesort_changes.$$scope = { dirty, ctx };
			}

			tablesort.$set(tablesort_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(tablesort.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(tablesort.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(summary);
			if (detaching) detach_dev(t1);
			if (detaching) detach_dev(div);
			destroy_component(tablesort);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot$8.name,
		type: "slot",
		source: "(78:0) <Details type=\\\"move-pair\\\" class=\\\"card\\\">",
		ctx
	});

	return block;
}

function create_fragment$k(ctx) {
	let current;

	const details = new Details({
			props: {
				type: "move-pair",
				class: "card",
				$$slots: { default: [create_default_slot$8] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	const block = {
		c: function create() {
			create_component(details.$$.fragment);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			mount_component(details, target, anchor);
			current = true;
		},
		p: function update(ctx, [dirty]) {
			const details_changes = {};

			if (dirty & /*$$scope, pairs*/ 65) {
				details_changes.$$scope = { dirty, ctx };
			}

			details.$set(details_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(details.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(details.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(details, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$k.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$j($$self, $$props, $$invalidate) {
	let { mdata } = $$props;
	let pairs;

	let o_ths = [
		{ title: "t", value: "turns", intro: "回合" },
		{
			title: "H",
			value: "hits",
			intro: "小招攻擊次數"
		},
		// {
		//   title: 'ΣDf',
		//   value: 'dmg_f',
		//   intro: '小招累積傷害',
		// },
		{
			title: "ΣD",
			value: "dmg_t",
			intro: "循環傷害 (+STAB)"
		},
		{
			title: "DPT",
			value: "dpt",
			intro: "回合均傷 (+STAB)"
		},
		{
			// title: 'f.name',
			title: "小招"
		},
		{
			// title: 'c.name',
			title: "大招"
		}
	];

	let ths;

	function genPairs() {
		$$invalidate(0, pairs = []);

		for (let f of mdata[0].data) {
			for (let c of mdata[1].data) {
				let hits = Math.ceil(c.energy / f.energyGain);
				let turns = hits * f.turn;
				let dmg_f = f.power * hits * f.stabFactor;
				let dmg_t = fixNum(dmg_f + c.power * c.stabFactor);
				let dpt = fixNum(dmg_t / turns);
				$$invalidate(0, pairs = pairs.concat({ f, c, turns, hits, dmg_f, dmg_t, dpt }));
			}
		}
	}

	
	const writable_props = ["mdata"];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<TTFA> was created with unknown prop '${key}'`);
	});

	$$self.$set = $$props => {
		if ("mdata" in $$props) $$invalidate(1, mdata = $$props.mdata);
	};

	$$self.$capture_state = () => {
		return { mdata, pairs, o_ths, ths };
	};

	$$self.$inject_state = $$props => {
		if ("mdata" in $$props) $$invalidate(1, mdata = $$props.mdata);
		if ("pairs" in $$props) $$invalidate(0, pairs = $$props.pairs);
		if ("o_ths" in $$props) o_ths = $$props.o_ths;
		if ("ths" in $$props) ths = $$props.ths;
	};

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*mdata*/ 2) {
			 {
				genPairs();
			}
		}
	};

	return [pairs, mdata];
}

class TTFA extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance$j, create_fragment$k, safe_not_equal, { mdata: 1 });

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "TTFA",
			options,
			id: create_fragment$k.name
		});

		const { ctx } = this.$$;
		const props = options.props || {};

		if (/*mdata*/ ctx[1] === undefined && !("mdata" in props)) {
			console.warn("<TTFA> was created without expected prop 'mdata'");
		}
	}

	get mdata() {
		throw new Error("<TTFA>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set mdata(value) {
		throw new Error("<TTFA>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* ./src/components/Moveset.html generated by Svelte v3.18.1 */
const file$k = "./src/components/Moveset.html";

function get_each_context$b(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[16] = list[i];
	return child_ctx;
}

function get_each_context_1$6(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[19] = list[i];
	return child_ctx;
}

function get_each_context_2$2(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[19] = list[i];
	return child_ctx;
}

function get_each_context_3$1(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[24] = list[i];
	return child_ctx;
}

// (110:12) {:else}
function create_else_block_1$1(ctx) {
	let th0;
	let t0;
	let th0_hidden_value;
	let t1;
	let th1;
	let t2;
	let th1_hidden_value;
	let t3;
	let th2;
	let t4;
	let th2_hidden_value;
	let t5;
	let th3;
	let t6;
	let th3_hidden_value;
	let t7;
	let th4;
	let t8;
	let th4_hidden_value;
	let t9;
	let th5;
	let t10;
	let th5_hidden_value;
	let t11;
	let th6;
	let t12;
	let t13;
	let th7;
	let t14;
	let t15;
	let th8;
	let t16;

	const block = {
		c: function create() {
			th0 = element("th");
			t0 = text("E");
			t1 = space();
			th1 = element("th");
			t2 = text("T");
			t3 = space();
			th2 = element("th");
			t4 = text("⚡");
			t5 = space();
			th3 = element("th");
			t6 = text("DPS");
			t7 = space();
			th4 = element("th");
			t8 = text("DPE");
			t9 = space();
			th5 = element("th");
			t10 = text("Π");
			t11 = space();
			th6 = element("th");
			t12 = text("E");
			t13 = space();
			th7 = element("th");
			t14 = text("DPE");
			t15 = space();
			th8 = element("th");
			t16 = text("Effect");
			th0.hidden = th0_hidden_value = !/*ispve*/ ctx[5];
			attr_dev(th0, "data-sort", "pve_energyDelta");
			attr_dev(th0, "title", "Energy");
			add_location(th0, file$k, 111, 14, 3352);
			th1.hidden = th1_hidden_value = !/*ispve*/ ctx[5];
			attr_dev(th1, "data-sort", "pve_duration");
			attr_dev(th1, "title", "Time(s)");
			add_location(th1, file$k, 112, 14, 3436);
			th2.hidden = th2_hidden_value = !/*ispve*/ ctx[5];
			attr_dev(th2, "data-sort", "pve_damageWindowStart");
			attr_dev(th2, "title", "Active(s)");
			add_location(th2, file$k, 113, 14, 3518);
			th3.hidden = th3_hidden_value = !/*ispve*/ ctx[5];
			attr_dev(th3, "data-sort", "pve_dps");
			attr_dev(th3, "title", "Damage per Second");
			add_location(th3, file$k, 114, 14, 3611);
			th4.hidden = th4_hidden_value = !/*ispve*/ ctx[5];
			attr_dev(th4, "data-sort", "pve_dpe");
			attr_dev(th4, "title", "Damage per Energy");
			add_location(th4, file$k, 115, 14, 3700);
			th5.hidden = th5_hidden_value = !/*ispve*/ ctx[5];
			attr_dev(th5, "data-sort", "pve_dpsxdpe");
			attr_dev(th5, "title", "DPS x DPE");
			add_location(th5, file$k, 116, 14, 3789);
			th6.hidden = /*ispve*/ ctx[5];
			attr_dev(th6, "data-sort", "energy");
			attr_dev(th6, "title", "Energy");
			add_location(th6, file$k, 119, 14, 3900);
			th7.hidden = /*ispve*/ ctx[5];
			attr_dev(th7, "data-sort", "dpe");
			attr_dev(th7, "title", "Damage per Energy");
			add_location(th7, file$k, 120, 14, 3974);
			th8.hidden = /*ispve*/ ctx[5];
			attr_dev(th8, "data-sort", "effect");
			add_location(th8, file$k, 121, 14, 4058);
		},
		m: function mount(target, anchor) {
			insert_dev(target, th0, anchor);
			append_dev(th0, t0);
			insert_dev(target, t1, anchor);
			insert_dev(target, th1, anchor);
			append_dev(th1, t2);
			insert_dev(target, t3, anchor);
			insert_dev(target, th2, anchor);
			append_dev(th2, t4);
			insert_dev(target, t5, anchor);
			insert_dev(target, th3, anchor);
			append_dev(th3, t6);
			insert_dev(target, t7, anchor);
			insert_dev(target, th4, anchor);
			append_dev(th4, t8);
			insert_dev(target, t9, anchor);
			insert_dev(target, th5, anchor);
			append_dev(th5, t10);
			insert_dev(target, t11, anchor);
			insert_dev(target, th6, anchor);
			append_dev(th6, t12);
			insert_dev(target, t13, anchor);
			insert_dev(target, th7, anchor);
			append_dev(th7, t14);
			insert_dev(target, t15, anchor);
			insert_dev(target, th8, anchor);
			append_dev(th8, t16);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*ispve*/ 32 && th0_hidden_value !== (th0_hidden_value = !/*ispve*/ ctx[5])) {
				prop_dev(th0, "hidden", th0_hidden_value);
			}

			if (dirty & /*ispve*/ 32 && th1_hidden_value !== (th1_hidden_value = !/*ispve*/ ctx[5])) {
				prop_dev(th1, "hidden", th1_hidden_value);
			}

			if (dirty & /*ispve*/ 32 && th2_hidden_value !== (th2_hidden_value = !/*ispve*/ ctx[5])) {
				prop_dev(th2, "hidden", th2_hidden_value);
			}

			if (dirty & /*ispve*/ 32 && th3_hidden_value !== (th3_hidden_value = !/*ispve*/ ctx[5])) {
				prop_dev(th3, "hidden", th3_hidden_value);
			}

			if (dirty & /*ispve*/ 32 && th4_hidden_value !== (th4_hidden_value = !/*ispve*/ ctx[5])) {
				prop_dev(th4, "hidden", th4_hidden_value);
			}

			if (dirty & /*ispve*/ 32 && th5_hidden_value !== (th5_hidden_value = !/*ispve*/ ctx[5])) {
				prop_dev(th5, "hidden", th5_hidden_value);
			}

			if (dirty & /*ispve*/ 32) {
				prop_dev(th6, "hidden", /*ispve*/ ctx[5]);
			}

			if (dirty & /*ispve*/ 32) {
				prop_dev(th7, "hidden", /*ispve*/ ctx[5]);
			}

			if (dirty & /*ispve*/ 32) {
				prop_dev(th8, "hidden", /*ispve*/ ctx[5]);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(th0);
			if (detaching) detach_dev(t1);
			if (detaching) detach_dev(th1);
			if (detaching) detach_dev(t3);
			if (detaching) detach_dev(th2);
			if (detaching) detach_dev(t5);
			if (detaching) detach_dev(th3);
			if (detaching) detach_dev(t7);
			if (detaching) detach_dev(th4);
			if (detaching) detach_dev(t9);
			if (detaching) detach_dev(th5);
			if (detaching) detach_dev(t11);
			if (detaching) detach_dev(th6);
			if (detaching) detach_dev(t13);
			if (detaching) detach_dev(th7);
			if (detaching) detach_dev(t15);
			if (detaching) detach_dev(th8);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_else_block_1$1.name,
		type: "else",
		source: "(110:12) {:else}",
		ctx
	});

	return block;
}

// (97:12) {#if mmm.setting === 'fmove'}
function create_if_block_2$1(ctx) {
	let th0;
	let t0;
	let th0_hidden_value;
	let t1;
	let th1;
	let t2;
	let th1_hidden_value;
	let t3;
	let th2;
	let t4;
	let th2_hidden_value;
	let t5;
	let th3;
	let t6;
	let th3_hidden_value;
	let t7;
	let th4;
	let t8;
	let t9;
	let th5;
	let t10;
	let t11;
	let th6;
	let t12;
	let t13;
	let th7;
	let t14;
	let t15;
	let th8;
	let t16;

	const block = {
		c: function create() {
			th0 = element("th");
			t0 = text("E");
			t1 = space();
			th1 = element("th");
			t2 = text("T");
			t3 = space();
			th2 = element("th");
			t4 = text("DPS");
			t5 = space();
			th3 = element("th");
			t6 = text("EPS");
			t7 = space();
			th4 = element("th");
			t8 = text("E");
			t9 = space();
			th5 = element("th");
			t10 = text("T");
			t11 = space();
			th6 = element("th");
			t12 = text("DPT");
			t13 = space();
			th7 = element("th");
			t14 = text("EPT");
			t15 = space();
			th8 = element("th");
			t16 = text("Π");
			th0.hidden = th0_hidden_value = !/*ispve*/ ctx[5];
			attr_dev(th0, "data-sort", "pve_energyDelta");
			attr_dev(th0, "title", "Energy");
			add_location(th0, file$k, 98, 14, 2570);
			th1.hidden = th1_hidden_value = !/*ispve*/ ctx[5];
			attr_dev(th1, "data-sort", "pve_duration");
			attr_dev(th1, "title", "Time(s)");
			add_location(th1, file$k, 99, 14, 2654);
			th2.hidden = th2_hidden_value = !/*ispve*/ ctx[5];
			attr_dev(th2, "data-sort", "pve_dps");
			attr_dev(th2, "title", "DPS");
			add_location(th2, file$k, 100, 14, 2736);
			th3.hidden = th3_hidden_value = !/*ispve*/ ctx[5];
			attr_dev(th3, "data-sort", "pve_eps");
			attr_dev(th3, "title", "EPS");
			add_location(th3, file$k, 101, 14, 2811);
			th4.hidden = /*ispve*/ ctx[5];
			attr_dev(th4, "data-sort", "energyGain");
			attr_dev(th4, "title", "Energy");
			add_location(th4, file$k, 104, 14, 2914);
			th5.hidden = /*ispve*/ ctx[5];
			attr_dev(th5, "data-sort", "turn");
			attr_dev(th5, "title", "Turns");
			add_location(th5, file$k, 105, 14, 2992);
			th6.hidden = /*ispve*/ ctx[5];
			attr_dev(th6, "data-sort", "dpt");
			attr_dev(th6, "title", "Damage per Turn");
			add_location(th6, file$k, 106, 14, 3063);
			th7.hidden = /*ispve*/ ctx[5];
			attr_dev(th7, "data-sort", "ept");
			attr_dev(th7, "title", "Energy per Turn");
			add_location(th7, file$k, 107, 14, 3145);
			th8.hidden = /*ispve*/ ctx[5];
			attr_dev(th8, "data-sort", "eptxdpt");
			attr_dev(th8, "title", "EPT x DPT");
			add_location(th8, file$k, 108, 14, 3227);
		},
		m: function mount(target, anchor) {
			insert_dev(target, th0, anchor);
			append_dev(th0, t0);
			insert_dev(target, t1, anchor);
			insert_dev(target, th1, anchor);
			append_dev(th1, t2);
			insert_dev(target, t3, anchor);
			insert_dev(target, th2, anchor);
			append_dev(th2, t4);
			insert_dev(target, t5, anchor);
			insert_dev(target, th3, anchor);
			append_dev(th3, t6);
			insert_dev(target, t7, anchor);
			insert_dev(target, th4, anchor);
			append_dev(th4, t8);
			insert_dev(target, t9, anchor);
			insert_dev(target, th5, anchor);
			append_dev(th5, t10);
			insert_dev(target, t11, anchor);
			insert_dev(target, th6, anchor);
			append_dev(th6, t12);
			insert_dev(target, t13, anchor);
			insert_dev(target, th7, anchor);
			append_dev(th7, t14);
			insert_dev(target, t15, anchor);
			insert_dev(target, th8, anchor);
			append_dev(th8, t16);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*ispve*/ 32 && th0_hidden_value !== (th0_hidden_value = !/*ispve*/ ctx[5])) {
				prop_dev(th0, "hidden", th0_hidden_value);
			}

			if (dirty & /*ispve*/ 32 && th1_hidden_value !== (th1_hidden_value = !/*ispve*/ ctx[5])) {
				prop_dev(th1, "hidden", th1_hidden_value);
			}

			if (dirty & /*ispve*/ 32 && th2_hidden_value !== (th2_hidden_value = !/*ispve*/ ctx[5])) {
				prop_dev(th2, "hidden", th2_hidden_value);
			}

			if (dirty & /*ispve*/ 32 && th3_hidden_value !== (th3_hidden_value = !/*ispve*/ ctx[5])) {
				prop_dev(th3, "hidden", th3_hidden_value);
			}

			if (dirty & /*ispve*/ 32) {
				prop_dev(th4, "hidden", /*ispve*/ ctx[5]);
			}

			if (dirty & /*ispve*/ 32) {
				prop_dev(th5, "hidden", /*ispve*/ ctx[5]);
			}

			if (dirty & /*ispve*/ 32) {
				prop_dev(th6, "hidden", /*ispve*/ ctx[5]);
			}

			if (dirty & /*ispve*/ 32) {
				prop_dev(th7, "hidden", /*ispve*/ ctx[5]);
			}

			if (dirty & /*ispve*/ 32) {
				prop_dev(th8, "hidden", /*ispve*/ ctx[5]);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(th0);
			if (detaching) detach_dev(t1);
			if (detaching) detach_dev(th1);
			if (detaching) detach_dev(t3);
			if (detaching) detach_dev(th2);
			if (detaching) detach_dev(t5);
			if (detaching) detach_dev(th3);
			if (detaching) detach_dev(t7);
			if (detaching) detach_dev(th4);
			if (detaching) detach_dev(t9);
			if (detaching) detach_dev(th5);
			if (detaching) detach_dev(t11);
			if (detaching) detach_dev(th6);
			if (detaching) detach_dev(t13);
			if (detaching) detach_dev(th7);
			if (detaching) detach_dev(t15);
			if (detaching) detach_dev(th8);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_2$1.name,
		type: "if",
		source: "(97:12) {#if mmm.setting === 'fmove'}",
		ctx
	});

	return block;
}

// (88:10) <tr slot="thead">
function create_thead_slot$4(ctx) {
	let tr;
	let th0;
	let t1;
	let th1;
	let t2;
	let th1_hidden_value;
	let t3;
	let th2;
	let t4;
	let t5;

	function select_block_type(ctx, dirty) {
		if (/*mmm*/ ctx[24].setting === "fmove") return create_if_block_2$1;
		return create_else_block_1$1;
	}

	let current_block_type = select_block_type(ctx);
	let if_block = current_block_type(ctx);

	const block = {
		c: function create() {
			tr = element("tr");
			th0 = element("th");
			th0.textContent = "Name";
			t1 = space();
			th1 = element("th");
			t2 = text("D");
			t3 = space();
			th2 = element("th");
			t4 = text("D");
			t5 = space();
			if_block.c();
			attr_dev(th0, "data-sort", "name");
			add_location(th0, file$k, 88, 12, 2256);
			th1.hidden = th1_hidden_value = !/*ispve*/ ctx[5];
			attr_dev(th1, "data-sort", "pve_power");
			attr_dev(th1, "title", "Damage");
			add_location(th1, file$k, 91, 12, 2325);
			th2.hidden = /*ispve*/ ctx[5];
			attr_dev(th2, "data-sort", "power");
			attr_dev(th2, "title", "Damage");
			add_location(th2, file$k, 94, 12, 2427);
			attr_dev(tr, "slot", "thead");
			add_location(tr, file$k, 87, 10, 2226);
		},
		m: function mount(target, anchor) {
			insert_dev(target, tr, anchor);
			append_dev(tr, th0);
			append_dev(tr, t1);
			append_dev(tr, th1);
			append_dev(th1, t2);
			append_dev(tr, t3);
			append_dev(tr, th2);
			append_dev(th2, t4);
			append_dev(tr, t5);
			if_block.m(tr, null);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*ispve*/ 32 && th1_hidden_value !== (th1_hidden_value = !/*ispve*/ ctx[5])) {
				prop_dev(th1, "hidden", th1_hidden_value);
			}

			if (dirty & /*ispve*/ 32) {
				prop_dev(th2, "hidden", /*ispve*/ ctx[5]);
			}

			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
				if_block.p(ctx, dirty);
			} else {
				if_block.d(1);
				if_block = current_block_type(ctx);

				if (if_block) {
					if_block.c();
					if_block.m(tr, null);
				}
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(tr);
			if_block.d();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_thead_slot$4.name,
		type: "slot",
		source: "(88:10) <tr slot=\\\"thead\\\">",
		ctx
	});

	return block;
}

// (129:16) <div class="pos-r" slot="rb">
function create_rb_slot$3(ctx) {
	let div;
	let t0;
	let a;
	let t1_value = /*item*/ ctx[27].name + "";
	let t1;
	let a_href_value;
	let current;

	const typeicon = new TypeIcon({
			props: {
				type: /*item*/ ctx[27].type,
				class: "typeicon__move"
			},
			$$inline: true
		});

	const block = {
		c: function create() {
			div = element("div");
			create_component(typeicon.$$.fragment);
			t0 = space();
			a = element("a");
			t1 = text(t1_value);
			attr_dev(a, "href", a_href_value = "./move/" + /*item*/ ctx[27].moveId);
			toggle_class(a, "is-stab", /*item*/ ctx[27].stab);
			toggle_class(a, "is-legacy", /*item*/ ctx[27].isLegacy);
			add_location(a, file$k, 130, 18, 4378);
			attr_dev(div, "class", "pos-r");
			attr_dev(div, "slot", "rb");
			add_location(div, file$k, 128, 16, 4259);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			mount_component(typeicon, div, null);
			append_dev(div, t0);
			append_dev(div, a);
			append_dev(a, t1);
			current = true;
		},
		p: function update(ctx, dirty) {
			const typeicon_changes = {};
			if (dirty & /*item*/ 134217728) typeicon_changes.type = /*item*/ ctx[27].type;
			typeicon.$set(typeicon_changes);
			if ((!current || dirty & /*item*/ 134217728) && t1_value !== (t1_value = /*item*/ ctx[27].name + "")) set_data_dev(t1, t1_value);

			if (!current || dirty & /*item*/ 134217728 && a_href_value !== (a_href_value = "./move/" + /*item*/ ctx[27].moveId)) {
				attr_dev(a, "href", a_href_value);
			}

			if (dirty & /*item*/ 134217728) {
				toggle_class(a, "is-stab", /*item*/ ctx[27].stab);
			}

			if (dirty & /*item*/ 134217728) {
				toggle_class(a, "is-legacy", /*item*/ ctx[27].isLegacy);
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(typeicon.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(typeicon.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			destroy_component(typeicon);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_rb_slot$3.name,
		type: "slot",
		source: "(129:16) <div class=\\\"pos-r\\\" slot=\\\"rb\\\">",
		ctx
	});

	return block;
}

// (138:16) <a class="rt" href="./move/{item.moveId}" slot="rt">
function create_rt_slot$3(ctx) {
	let a;
	let t_value = /*item*/ ctx[27].moveId + "";
	let t;
	let a_href_value;

	const block = {
		c: function create() {
			a = element("a");
			t = text(t_value);
			attr_dev(a, "class", "rt");
			attr_dev(a, "href", a_href_value = "./move/" + /*item*/ ctx[27].moveId);
			attr_dev(a, "slot", "rt");
			add_location(a, file$k, 137, 16, 4621);
		},
		m: function mount(target, anchor) {
			insert_dev(target, a, anchor);
			append_dev(a, t);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*item*/ 134217728 && t_value !== (t_value = /*item*/ ctx[27].moveId + "")) set_data_dev(t, t_value);

			if (dirty & /*item*/ 134217728 && a_href_value !== (a_href_value = "./move/" + /*item*/ ctx[27].moveId)) {
				attr_dev(a, "href", a_href_value);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(a);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_rt_slot$3.name,
		type: "slot",
		source: "(138:16) <a class=\\\"rt\\\" href=\\\"./move/{item.moveId}\\\" slot=\\\"rt\\\">",
		ctx
	});

	return block;
}

// (128:14) <Ruby>
function create_default_slot_3$2(ctx) {
	let t;

	const block = {
		c: function create() {
			t = space();
		},
		m: function mount(target, anchor) {
			insert_dev(target, t, anchor);
		},
		p: noop,
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(t);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot_3$2.name,
		type: "slot",
		source: "(128:14) <Ruby>",
		ctx
	});

	return block;
}

// (162:12) {:else}
function create_else_block$2(ctx) {
	let td0;
	let t0_value = /*item*/ ctx[27].pve_energyDelta + "";
	let t0;
	let td0_hidden_value;
	let t1;
	let td1;
	let t2_value = /*item*/ ctx[27].pve_duration + "";
	let t2;
	let td1_hidden_value;
	let t3;
	let td2;
	let t4_value = /*item*/ ctx[27].pve_damageWindowStart + "";
	let t4;
	let td2_hidden_value;
	let t5;
	let td3;
	let t6_value = /*item*/ ctx[27].pve_dps + "";
	let t6;
	let td3_hidden_value;
	let t7;
	let td4;
	let t8_value = /*item*/ ctx[27].pve_dpe + "";
	let t8;
	let td4_hidden_value;
	let t9;
	let td5;
	let t10_value = /*item*/ ctx[27].pve_dpsxdpe + "";
	let t10;
	let td5_hidden_value;
	let t11;
	let td6;
	let t12_value = /*item*/ ctx[27].energy + "";
	let t12;
	let t13;
	let td7;
	let t14_value = /*item*/ ctx[27].dpe + "";
	let t14;
	let t15;
	let td8;
	let t16_value = /*item*/ ctx[27].effect + "";
	let t16;

	const block = {
		c: function create() {
			td0 = element("td");
			t0 = text(t0_value);
			t1 = space();
			td1 = element("td");
			t2 = text(t2_value);
			t3 = space();
			td2 = element("td");
			t4 = text(t4_value);
			t5 = space();
			td3 = element("td");
			t6 = text(t6_value);
			t7 = space();
			td4 = element("td");
			t8 = text(t8_value);
			t9 = space();
			td5 = element("td");
			t10 = text(t10_value);
			t11 = space();
			td6 = element("td");
			t12 = text(t12_value);
			t13 = space();
			td7 = element("td");
			t14 = text(t14_value);
			t15 = space();
			td8 = element("td");
			t16 = text(t16_value);
			td0.hidden = td0_hidden_value = !/*ispve*/ ctx[5];
			attr_dev(td0, "class", "energy-bar");
			set_style(td0, "--bgzx", -/*item*/ ctx[27].pve_energyDelta + "%");
			add_location(td0, file$k, 163, 14, 5837);
			td1.hidden = td1_hidden_value = !/*ispve*/ ctx[5];
			add_location(td1, file$k, 164, 14, 5959);
			td2.hidden = td2_hidden_value = !/*ispve*/ ctx[5];
			add_location(td2, file$k, 165, 14, 6018);
			td3.hidden = td3_hidden_value = !/*ispve*/ ctx[5];
			add_location(td3, file$k, 166, 14, 6086);
			td4.hidden = td4_hidden_value = !/*ispve*/ ctx[5];
			add_location(td4, file$k, 167, 14, 6140);
			td5.hidden = td5_hidden_value = !/*ispve*/ ctx[5];
			add_location(td5, file$k, 168, 14, 6194);
			td6.hidden = /*ispve*/ ctx[5];
			attr_dev(td6, "class", "energy-bar");
			set_style(td6, "--bgzx", /*item*/ ctx[27].energy + "%");
			add_location(td6, file$k, 171, 14, 6287);
			td7.hidden = /*ispve*/ ctx[5];
			add_location(td7, file$k, 172, 14, 6389);
			td8.hidden = /*ispve*/ ctx[5];
			attr_dev(td8, "class", "fz-s");
			add_location(td8, file$k, 173, 14, 6438);
		},
		m: function mount(target, anchor) {
			insert_dev(target, td0, anchor);
			append_dev(td0, t0);
			insert_dev(target, t1, anchor);
			insert_dev(target, td1, anchor);
			append_dev(td1, t2);
			insert_dev(target, t3, anchor);
			insert_dev(target, td2, anchor);
			append_dev(td2, t4);
			insert_dev(target, t5, anchor);
			insert_dev(target, td3, anchor);
			append_dev(td3, t6);
			insert_dev(target, t7, anchor);
			insert_dev(target, td4, anchor);
			append_dev(td4, t8);
			insert_dev(target, t9, anchor);
			insert_dev(target, td5, anchor);
			append_dev(td5, t10);
			insert_dev(target, t11, anchor);
			insert_dev(target, td6, anchor);
			append_dev(td6, t12);
			insert_dev(target, t13, anchor);
			insert_dev(target, td7, anchor);
			append_dev(td7, t14);
			insert_dev(target, t15, anchor);
			insert_dev(target, td8, anchor);
			append_dev(td8, t16);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*item*/ 134217728 && t0_value !== (t0_value = /*item*/ ctx[27].pve_energyDelta + "")) set_data_dev(t0, t0_value);

			if (dirty & /*ispve*/ 32 && td0_hidden_value !== (td0_hidden_value = !/*ispve*/ ctx[5])) {
				prop_dev(td0, "hidden", td0_hidden_value);
			}

			if (dirty & /*item*/ 134217728) {
				set_style(td0, "--bgzx", -/*item*/ ctx[27].pve_energyDelta + "%");
			}

			if (dirty & /*item*/ 134217728 && t2_value !== (t2_value = /*item*/ ctx[27].pve_duration + "")) set_data_dev(t2, t2_value);

			if (dirty & /*ispve*/ 32 && td1_hidden_value !== (td1_hidden_value = !/*ispve*/ ctx[5])) {
				prop_dev(td1, "hidden", td1_hidden_value);
			}

			if (dirty & /*item*/ 134217728 && t4_value !== (t4_value = /*item*/ ctx[27].pve_damageWindowStart + "")) set_data_dev(t4, t4_value);

			if (dirty & /*ispve*/ 32 && td2_hidden_value !== (td2_hidden_value = !/*ispve*/ ctx[5])) {
				prop_dev(td2, "hidden", td2_hidden_value);
			}

			if (dirty & /*item*/ 134217728 && t6_value !== (t6_value = /*item*/ ctx[27].pve_dps + "")) set_data_dev(t6, t6_value);

			if (dirty & /*ispve*/ 32 && td3_hidden_value !== (td3_hidden_value = !/*ispve*/ ctx[5])) {
				prop_dev(td3, "hidden", td3_hidden_value);
			}

			if (dirty & /*item*/ 134217728 && t8_value !== (t8_value = /*item*/ ctx[27].pve_dpe + "")) set_data_dev(t8, t8_value);

			if (dirty & /*ispve*/ 32 && td4_hidden_value !== (td4_hidden_value = !/*ispve*/ ctx[5])) {
				prop_dev(td4, "hidden", td4_hidden_value);
			}

			if (dirty & /*item*/ 134217728 && t10_value !== (t10_value = /*item*/ ctx[27].pve_dpsxdpe + "")) set_data_dev(t10, t10_value);

			if (dirty & /*ispve*/ 32 && td5_hidden_value !== (td5_hidden_value = !/*ispve*/ ctx[5])) {
				prop_dev(td5, "hidden", td5_hidden_value);
			}

			if (dirty & /*item*/ 134217728 && t12_value !== (t12_value = /*item*/ ctx[27].energy + "")) set_data_dev(t12, t12_value);

			if (dirty & /*ispve*/ 32) {
				prop_dev(td6, "hidden", /*ispve*/ ctx[5]);
			}

			if (dirty & /*item*/ 134217728) {
				set_style(td6, "--bgzx", /*item*/ ctx[27].energy + "%");
			}

			if (dirty & /*item*/ 134217728 && t14_value !== (t14_value = /*item*/ ctx[27].dpe + "")) set_data_dev(t14, t14_value);

			if (dirty & /*ispve*/ 32) {
				prop_dev(td7, "hidden", /*ispve*/ ctx[5]);
			}

			if (dirty & /*item*/ 134217728 && t16_value !== (t16_value = /*item*/ ctx[27].effect + "")) set_data_dev(t16, t16_value);

			if (dirty & /*ispve*/ 32) {
				prop_dev(td8, "hidden", /*ispve*/ ctx[5]);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(td0);
			if (detaching) detach_dev(t1);
			if (detaching) detach_dev(td1);
			if (detaching) detach_dev(t3);
			if (detaching) detach_dev(td2);
			if (detaching) detach_dev(t5);
			if (detaching) detach_dev(td3);
			if (detaching) detach_dev(t7);
			if (detaching) detach_dev(td4);
			if (detaching) detach_dev(t9);
			if (detaching) detach_dev(td5);
			if (detaching) detach_dev(t11);
			if (detaching) detach_dev(td6);
			if (detaching) detach_dev(t13);
			if (detaching) detach_dev(td7);
			if (detaching) detach_dev(t15);
			if (detaching) detach_dev(td8);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_else_block$2.name,
		type: "else",
		source: "(162:12) {:else}",
		ctx
	});

	return block;
}

// (145:12) {#if mmm.setting === 'fmove'}
function create_if_block_1$4(ctx) {
	let td0;

	let t0_value = (/*ispve*/ ctx[5]
	? /*item*/ ctx[27].pve_energyDelta
	: /*item*/ ctx[27].energyGain) + "";

	let t0;
	let t1;
	let td1;

	let t2_value = (/*ispve*/ ctx[5]
	? /*item*/ ctx[27].pve_duration
	: /*item*/ ctx[27].turn) + "";

	let t2;
	let t3;
	let td2;

	let t4_value = (/*ispve*/ ctx[5]
	? /*item*/ ctx[27].pve_dps
	: /*item*/ ctx[27].dpt) + "";

	let t4;
	let t5;
	let td3;

	let t6_value = (/*ispve*/ ctx[5]
	? /*item*/ ctx[27].pve_eps
	: /*item*/ ctx[27].ept) + "";

	let t6;
	let t7;
	let td4;
	let t8_value = /*item*/ ctx[27].eptxdpt + "";
	let t8;

	const block = {
		c: function create() {
			td0 = element("td");
			t0 = text(t0_value);
			t1 = space();
			td1 = element("td");
			t2 = text(t2_value);
			t3 = space();
			td2 = element("td");
			t4 = text(t4_value);
			t5 = space();
			td3 = element("td");
			t6 = text(t6_value);
			t7 = space();
			td4 = element("td");
			t8 = text(t8_value);
			add_location(td0, file$k, 145, 14, 4911);
			add_location(td1, file$k, 146, 14, 4983);
			add_location(td2, file$k, 147, 14, 5046);
			add_location(td3, file$k, 148, 14, 5103);
			td4.hidden = /*ispve*/ ctx[5];
			add_location(td4, file$k, 160, 14, 5730);
		},
		m: function mount(target, anchor) {
			insert_dev(target, td0, anchor);
			append_dev(td0, t0);
			insert_dev(target, t1, anchor);
			insert_dev(target, td1, anchor);
			append_dev(td1, t2);
			insert_dev(target, t3, anchor);
			insert_dev(target, td2, anchor);
			append_dev(td2, t4);
			insert_dev(target, t5, anchor);
			insert_dev(target, td3, anchor);
			append_dev(td3, t6);
			insert_dev(target, t7, anchor);
			insert_dev(target, td4, anchor);
			append_dev(td4, t8);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*ispve, item*/ 134217760 && t0_value !== (t0_value = (/*ispve*/ ctx[5]
			? /*item*/ ctx[27].pve_energyDelta
			: /*item*/ ctx[27].energyGain) + "")) set_data_dev(t0, t0_value);

			if (dirty & /*ispve, item*/ 134217760 && t2_value !== (t2_value = (/*ispve*/ ctx[5]
			? /*item*/ ctx[27].pve_duration
			: /*item*/ ctx[27].turn) + "")) set_data_dev(t2, t2_value);

			if (dirty & /*ispve, item*/ 134217760 && t4_value !== (t4_value = (/*ispve*/ ctx[5]
			? /*item*/ ctx[27].pve_dps
			: /*item*/ ctx[27].dpt) + "")) set_data_dev(t4, t4_value);

			if (dirty & /*ispve, item*/ 134217760 && t6_value !== (t6_value = (/*ispve*/ ctx[5]
			? /*item*/ ctx[27].pve_eps
			: /*item*/ ctx[27].ept) + "")) set_data_dev(t6, t6_value);

			if (dirty & /*item*/ 134217728 && t8_value !== (t8_value = /*item*/ ctx[27].eptxdpt + "")) set_data_dev(t8, t8_value);

			if (dirty & /*ispve*/ 32) {
				prop_dev(td4, "hidden", /*ispve*/ ctx[5]);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(td0);
			if (detaching) detach_dev(t1);
			if (detaching) detach_dev(td1);
			if (detaching) detach_dev(t3);
			if (detaching) detach_dev(td2);
			if (detaching) detach_dev(t5);
			if (detaching) detach_dev(td3);
			if (detaching) detach_dev(t7);
			if (detaching) detach_dev(td4);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_1$4.name,
		type: "if",
		source: "(145:12) {#if mmm.setting === 'fmove'}",
		ctx
	});

	return block;
}

// (126:10) <tr slot="tbody" let:item={item}>
function create_tbody_slot$4(ctx) {
	let tr;
	let td0;
	let t0;
	let td1;

	let t1_value = (/*ispve*/ ctx[5]
	? /*item*/ ctx[27].pve_power
	: /*item*/ ctx[27].power) + "";

	let t1;
	let td1_data_efficon_value;
	let t2;
	let current;

	const ruby = new Ruby({
			props: {
				$$slots: {
					default: [create_default_slot_3$2],
					rt: [create_rt_slot$3],
					rb: [create_rb_slot$3]
				},
				$$scope: { ctx }
			},
			$$inline: true
		});

	function select_block_type_1(ctx, dirty) {
		if (/*mmm*/ ctx[24].setting === "fmove") return create_if_block_1$4;
		return create_else_block$2;
	}

	let current_block_type = select_block_type_1(ctx);
	let if_block = current_block_type(ctx);

	const block = {
		c: function create() {
			tr = element("tr");
			td0 = element("td");
			create_component(ruby.$$.fragment);
			t0 = space();
			td1 = element("td");
			t1 = text(t1_value);
			t2 = space();
			if_block.c();
			attr_dev(td0, "class", "move-name");
			add_location(td0, file$k, 126, 12, 4199);
			attr_dev(td1, "data-efficon", td1_data_efficon_value = /*item*/ ctx[27].efficon);
			add_location(td1, file$k, 142, 12, 4779);
			attr_dev(tr, "slot", "tbody");
			add_location(tr, file$k, 125, 10, 4153);
		},
		m: function mount(target, anchor) {
			insert_dev(target, tr, anchor);
			append_dev(tr, td0);
			mount_component(ruby, td0, null);
			append_dev(tr, t0);
			append_dev(tr, td1);
			append_dev(td1, t1);
			append_dev(tr, t2);
			if_block.m(tr, null);
			current = true;
		},
		p: function update(ctx, dirty) {
			const ruby_changes = {};

			if (dirty & /*$$scope, item*/ 402653184) {
				ruby_changes.$$scope = { dirty, ctx };
			}

			ruby.$set(ruby_changes);

			if ((!current || dirty & /*ispve, item*/ 134217760) && t1_value !== (t1_value = (/*ispve*/ ctx[5]
			? /*item*/ ctx[27].pve_power
			: /*item*/ ctx[27].power) + "")) set_data_dev(t1, t1_value);

			if (!current || dirty & /*item*/ 134217728 && td1_data_efficon_value !== (td1_data_efficon_value = /*item*/ ctx[27].efficon)) {
				attr_dev(td1, "data-efficon", td1_data_efficon_value);
			}

			if (current_block_type === (current_block_type = select_block_type_1(ctx)) && if_block) {
				if_block.p(ctx, dirty);
			} else {
				if_block.d(1);
				if_block = current_block_type(ctx);

				if (if_block) {
					if_block.c();
					if_block.m(tr, null);
				}
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(ruby.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(ruby.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(tr);
			destroy_component(ruby);
			if_block.d();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_tbody_slot$4.name,
		type: "slot",
		source: "(126:10) <tr slot=\\\"tbody\\\" let:item={item}>",
		ctx
	});

	return block;
}

// (87:8) <TableSort items={mmm.data} class="ml-a mr-a text-center {ispve ? 'narrow' : ''}">
function create_default_slot_2$3(ctx) {
	let t;

	const block = {
		c: function create() {
			t = space();
		},
		m: function mount(target, anchor) {
			insert_dev(target, t, anchor);
		},
		p: noop,
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(t);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot_2$3.name,
		type: "slot",
		source: "(87:8) <TableSort items={mmm.data} class=\\\"ml-a mr-a text-center {ispve ? 'narrow' : ''}\\\">",
		ctx
	});

	return block;
}

// (83:4) <Details type={mmm.setting} class="card">
function create_default_slot_1$5(ctx) {
	let summary;
	let h3;
	let t0_value = /*mmm*/ ctx[24].title + "";
	let t0;
	let t1;
	let div;
	let t2;
	let current;

	const tablesort = new TableSort({
			props: {
				items: /*mmm*/ ctx[24].data,
				class: "ml-a mr-a text-center " + (/*ispve*/ ctx[5] ? "narrow" : ""),
				$$slots: {
					default: [create_default_slot_2$3],
					tbody: [
						create_tbody_slot$4,
						({ item }) => ({ 27: item }),
						({ item }) => item ? 134217728 : 0
					],
					thead: [create_thead_slot$4]
				},
				$$scope: { ctx }
			},
			$$inline: true
		});

	const block = {
		c: function create() {
			summary = element("summary");
			h3 = element("h3");
			t0 = text(t0_value);
			t1 = space();
			div = element("div");
			create_component(tablesort.$$.fragment);
			t2 = space();
			add_location(h3, file$k, 83, 15, 2081);
			add_location(summary, file$k, 83, 6, 2072);
			add_location(div, file$k, 85, 6, 2119);
		},
		m: function mount(target, anchor) {
			insert_dev(target, summary, anchor);
			append_dev(summary, h3);
			append_dev(h3, t0);
			insert_dev(target, t1, anchor);
			insert_dev(target, div, anchor);
			mount_component(tablesort, div, null);
			insert_dev(target, t2, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
			if ((!current || dirty & /*mdata*/ 2) && t0_value !== (t0_value = /*mmm*/ ctx[24].title + "")) set_data_dev(t0, t0_value);
			const tablesort_changes = {};
			if (dirty & /*mdata*/ 2) tablesort_changes.items = /*mmm*/ ctx[24].data;
			if (dirty & /*ispve*/ 32) tablesort_changes.class = "ml-a mr-a text-center " + (/*ispve*/ ctx[5] ? "narrow" : "");

			if (dirty & /*$$scope, ispve, mdata, item*/ 402653218) {
				tablesort_changes.$$scope = { dirty, ctx };
			}

			tablesort.$set(tablesort_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(tablesort.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(tablesort.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(summary);
			if (detaching) detach_dev(t1);
			if (detaching) detach_dev(div);
			destroy_component(tablesort);
			if (detaching) detach_dev(t2);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot_1$5.name,
		type: "slot",
		source: "(83:4) <Details type={mmm.setting} class=\\\"card\\\">",
		ctx
	});

	return block;
}

// (82:2) {#each mdata as mmm}
function create_each_block_3$1(ctx) {
	let current;

	const details = new Details({
			props: {
				type: /*mmm*/ ctx[24].setting,
				class: "card",
				$$slots: { default: [create_default_slot_1$5] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	const block = {
		c: function create() {
			create_component(details.$$.fragment);
		},
		m: function mount(target, anchor) {
			mount_component(details, target, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
			const details_changes = {};
			if (dirty & /*mdata*/ 2) details_changes.type = /*mmm*/ ctx[24].setting;

			if (dirty & /*$$scope, mdata, ispve*/ 268435490) {
				details_changes.$$scope = { dirty, ctx };
			}

			details.$set(details_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(details.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(details.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(details, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block_3$1.name,
		type: "each",
		source: "(82:2) {#each mdata as mmm}",
		ctx
	});

	return block;
}

// (184:0) {#if pm.dex !== 235 && !ispve}
function create_if_block$6(ctx) {
	let current;

	const ttfa = new TTFA({
			props: { mdata: /*mdata*/ ctx[1] },
			$$inline: true
		});

	const block = {
		c: function create() {
			create_component(ttfa.$$.fragment);
		},
		m: function mount(target, anchor) {
			mount_component(ttfa, target, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
			const ttfa_changes = {};
			if (dirty & /*mdata*/ 2) ttfa_changes.mdata = /*mdata*/ ctx[1];
			ttfa.$set(ttfa_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(ttfa.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(ttfa.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(ttfa, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$6.name,
		type: "if",
		source: "(184:0) {#if pm.dex !== 235 && !ispve}",
		ctx
	});

	return block;
}

// (194:8) {#each _types as type}
function create_each_block_2$2(ctx) {
	let option;
	let t0_value = /*type*/ ctx[19].l + "";
	let t0;
	let t1;
	let t2_value = /*type*/ ctx[19].v + "";
	let t2;
	let option_value_value;

	const block = {
		c: function create() {
			option = element("option");
			t0 = text(t0_value);
			t1 = space();
			t2 = text(t2_value);
			option.__value = option_value_value = /*type*/ ctx[19].v;
			option.value = option.__value;
			add_location(option, file$k, 194, 10, 6912);
		},
		m: function mount(target, anchor) {
			insert_dev(target, option, anchor);
			append_dev(option, t0);
			append_dev(option, t1);
			append_dev(option, t2);
		},
		p: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(option);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block_2$2.name,
		type: "each",
		source: "(194:8) {#each _types as type}",
		ctx
	});

	return block;
}

// (204:8) {#each _types as type}
function create_each_block_1$6(ctx) {
	let option;
	let t0_value = /*type*/ ctx[19].l + "";
	let t0;
	let t1;
	let t2_value = /*type*/ ctx[19].v + "";
	let t2;
	let option_value_value;

	const block = {
		c: function create() {
			option = element("option");
			t0 = text(t0_value);
			t1 = space();
			t2 = text(t2_value);
			option.__value = option_value_value = /*type*/ ctx[19].v;
			option.value = option.__value;
			add_location(option, file$k, 204, 10, 7174);
		},
		m: function mount(target, anchor) {
			insert_dev(target, option, anchor);
			append_dev(option, t0);
			append_dev(option, t1);
			append_dev(option, t2);
		},
		p: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(option);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block_1$6.name,
		type: "each",
		source: "(204:8) {#each _types as type}",
		ctx
	});

	return block;
}

// (213:6) {#each forceBuffOptions as i}
function create_each_block$b(ctx) {
	let option;
	let t_value = /*i*/ ctx[16] + "";
	let t;
	let option_value_value;

	const block = {
		c: function create() {
			option = element("option");
			t = text(t_value);
			option.__value = option_value_value = /*i*/ ctx[16];
			option.value = option.__value;
			add_location(option, file$k, 213, 8, 7404);
		},
		m: function mount(target, anchor) {
			insert_dev(target, option, anchor);
			append_dev(option, t);
		},
		p: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(option);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block$b.name,
		type: "each",
		source: "(213:6) {#each forceBuffOptions as i}",
		ctx
	});

	return block;
}

// (188:0) <Details type="opponent_type" class="card opponent_type_card">
function create_default_slot$9(ctx) {
	let summary;
	let h3;
	let t1;
	let div2;
	let div0;
	let t2;
	let select0;
	let t3;
	let div1;
	let t4;
	let select1;
	let t5;
	let div3;
	let t6;
	let select2;
	let dispose;
	let each_value_2 = /*_types*/ ctx[6];
	let each_blocks_2 = [];

	for (let i = 0; i < each_value_2.length; i += 1) {
		each_blocks_2[i] = create_each_block_2$2(get_each_context_2$2(ctx, each_value_2, i));
	}

	let each_value_1 = /*_types*/ ctx[6];
	let each_blocks_1 = [];

	for (let i = 0; i < each_value_1.length; i += 1) {
		each_blocks_1[i] = create_each_block_1$6(get_each_context_1$6(ctx, each_value_1, i));
	}

	let each_value = /*forceBuffOptions*/ ctx[7];
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block$b(get_each_context$b(ctx, each_value, i));
	}

	const block = {
		c: function create() {
			summary = element("summary");
			h3 = element("h3");
			h3.textContent = "模擬對方屬性";
			t1 = space();
			div2 = element("div");
			div0 = element("div");
			t2 = text("type 1:\n      ");
			select0 = element("select");

			for (let i = 0; i < each_blocks_2.length; i += 1) {
				each_blocks_2[i].c();
			}

			t3 = space();
			div1 = element("div");
			t4 = text("type 2:\n      ");
			select1 = element("select");

			for (let i = 0; i < each_blocks_1.length; i += 1) {
				each_blocks_1[i].c();
			}

			t5 = space();
			div3 = element("div");
			t6 = text("force Atk buff:\n    ");
			select2 = element("select");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			add_location(h3, file$k, 188, 11, 6730);
			add_location(summary, file$k, 188, 2, 6721);
			attr_dev(select0, "class", "text-capitalize");
			if (/*opponentType1*/ ctx[2] === void 0) add_render_callback(() => /*select0_change_handler*/ ctx[13].call(select0));
			add_location(select0, file$k, 192, 6, 6811);
			add_location(div0, file$k, 190, 4, 6785);
			attr_dev(select1, "class", "text-capitalize");
			if (/*opponentType2*/ ctx[3] === void 0) add_render_callback(() => /*select1_change_handler*/ ctx[14].call(select1));
			add_location(select1, file$k, 202, 6, 7073);
			add_location(div1, file$k, 200, 4, 7047);
			attr_dev(div2, "class", "df jc-se");
			add_location(div2, file$k, 189, 2, 6758);
			if (/*forceBuff*/ ctx[4] === void 0) add_render_callback(() => /*select2_change_handler*/ ctx[15].call(select2));
			add_location(select2, file$k, 211, 4, 7328);
			attr_dev(div3, "class", "text-center");
			add_location(div3, file$k, 209, 2, 7278);
		},
		m: function mount(target, anchor) {
			insert_dev(target, summary, anchor);
			append_dev(summary, h3);
			insert_dev(target, t1, anchor);
			insert_dev(target, div2, anchor);
			append_dev(div2, div0);
			append_dev(div0, t2);
			append_dev(div0, select0);

			for (let i = 0; i < each_blocks_2.length; i += 1) {
				each_blocks_2[i].m(select0, null);
			}

			select_option(select0, /*opponentType1*/ ctx[2]);
			append_dev(div2, t3);
			append_dev(div2, div1);
			append_dev(div1, t4);
			append_dev(div1, select1);

			for (let i = 0; i < each_blocks_1.length; i += 1) {
				each_blocks_1[i].m(select1, null);
			}

			select_option(select1, /*opponentType2*/ ctx[3]);
			insert_dev(target, t5, anchor);
			insert_dev(target, div3, anchor);
			append_dev(div3, t6);
			append_dev(div3, select2);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(select2, null);
			}

			select_option(select2, /*forceBuff*/ ctx[4]);

			dispose = [
				listen_dev(select0, "change", /*select0_change_handler*/ ctx[13]),
				listen_dev(select1, "change", /*select1_change_handler*/ ctx[14]),
				listen_dev(select2, "change", /*select2_change_handler*/ ctx[15])
			];
		},
		p: function update(ctx, dirty) {
			if (dirty & /*_types*/ 64) {
				each_value_2 = /*_types*/ ctx[6];
				let i;

				for (i = 0; i < each_value_2.length; i += 1) {
					const child_ctx = get_each_context_2$2(ctx, each_value_2, i);

					if (each_blocks_2[i]) {
						each_blocks_2[i].p(child_ctx, dirty);
					} else {
						each_blocks_2[i] = create_each_block_2$2(child_ctx);
						each_blocks_2[i].c();
						each_blocks_2[i].m(select0, null);
					}
				}

				for (; i < each_blocks_2.length; i += 1) {
					each_blocks_2[i].d(1);
				}

				each_blocks_2.length = each_value_2.length;
			}

			if (dirty & /*opponentType1*/ 4) {
				select_option(select0, /*opponentType1*/ ctx[2]);
			}

			if (dirty & /*_types*/ 64) {
				each_value_1 = /*_types*/ ctx[6];
				let i;

				for (i = 0; i < each_value_1.length; i += 1) {
					const child_ctx = get_each_context_1$6(ctx, each_value_1, i);

					if (each_blocks_1[i]) {
						each_blocks_1[i].p(child_ctx, dirty);
					} else {
						each_blocks_1[i] = create_each_block_1$6(child_ctx);
						each_blocks_1[i].c();
						each_blocks_1[i].m(select1, null);
					}
				}

				for (; i < each_blocks_1.length; i += 1) {
					each_blocks_1[i].d(1);
				}

				each_blocks_1.length = each_value_1.length;
			}

			if (dirty & /*opponentType2*/ 8) {
				select_option(select1, /*opponentType2*/ ctx[3]);
			}

			if (dirty & /*forceBuffOptions*/ 128) {
				each_value = /*forceBuffOptions*/ ctx[7];
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context$b(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block$b(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(select2, null);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value.length;
			}

			if (dirty & /*forceBuff*/ 16) {
				select_option(select2, /*forceBuff*/ ctx[4]);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(summary);
			if (detaching) detach_dev(t1);
			if (detaching) detach_dev(div2);
			destroy_each(each_blocks_2, detaching);
			destroy_each(each_blocks_1, detaching);
			if (detaching) detach_dev(t5);
			if (detaching) detach_dev(div3);
			destroy_each(each_blocks, detaching);
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot$9.name,
		type: "slot",
		source: "(188:0) <Details type=\\\"opponent_type\\\" class=\\\"card opponent_type_card\\\">",
		ctx
	});

	return block;
}

function create_fragment$l(ctx) {
	let section;
	let t0;
	let t1;
	let current;
	let each_value_3 = /*mdata*/ ctx[1];
	let each_blocks = [];

	for (let i = 0; i < each_value_3.length; i += 1) {
		each_blocks[i] = create_each_block_3$1(get_each_context_3$1(ctx, each_value_3, i));
	}

	const out = i => transition_out(each_blocks[i], 1, 1, () => {
		each_blocks[i] = null;
	});

	let if_block = /*pm*/ ctx[0].dex !== 235 && !/*ispve*/ ctx[5] && create_if_block$6(ctx);

	const details = new Details({
			props: {
				type: "opponent_type",
				class: "card opponent_type_card",
				$$slots: { default: [create_default_slot$9] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	const block = {
		c: function create() {
			section = element("section");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			t0 = space();
			if (if_block) if_block.c();
			t1 = space();
			create_component(details.$$.fragment);
			attr_dev(section, "class", "moves");
			add_location(section, file$k, 80, 0, 1973);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, section, anchor);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(section, null);
			}

			insert_dev(target, t0, anchor);
			if (if_block) if_block.m(target, anchor);
			insert_dev(target, t1, anchor);
			mount_component(details, target, anchor);
			current = true;
		},
		p: function update(ctx, [dirty]) {
			if (dirty & /*mdata, ispve, item*/ 134217762) {
				each_value_3 = /*mdata*/ ctx[1];
				let i;

				for (i = 0; i < each_value_3.length; i += 1) {
					const child_ctx = get_each_context_3$1(ctx, each_value_3, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
						transition_in(each_blocks[i], 1);
					} else {
						each_blocks[i] = create_each_block_3$1(child_ctx);
						each_blocks[i].c();
						transition_in(each_blocks[i], 1);
						each_blocks[i].m(section, null);
					}
				}

				group_outros();

				for (i = each_value_3.length; i < each_blocks.length; i += 1) {
					out(i);
				}

				check_outros();
			}

			if (/*pm*/ ctx[0].dex !== 235 && !/*ispve*/ ctx[5]) {
				if (if_block) {
					if_block.p(ctx, dirty);
					transition_in(if_block, 1);
				} else {
					if_block = create_if_block$6(ctx);
					if_block.c();
					transition_in(if_block, 1);
					if_block.m(t1.parentNode, t1);
				}
			} else if (if_block) {
				group_outros();

				transition_out(if_block, 1, 1, () => {
					if_block = null;
				});

				check_outros();
			}

			const details_changes = {};

			if (dirty & /*$$scope, forceBuff, opponentType2, opponentType1*/ 268435484) {
				details_changes.$$scope = { dirty, ctx };
			}

			details.$set(details_changes);
		},
		i: function intro(local) {
			if (current) return;

			for (let i = 0; i < each_value_3.length; i += 1) {
				transition_in(each_blocks[i]);
			}

			transition_in(if_block);
			transition_in(details.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			each_blocks = each_blocks.filter(Boolean);

			for (let i = 0; i < each_blocks.length; i += 1) {
				transition_out(each_blocks[i]);
			}

			transition_out(if_block);
			transition_out(details.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(section);
			destroy_each(each_blocks, detaching);
			if (detaching) detach_dev(t0);
			if (if_block) if_block.d(detaching);
			if (detaching) detach_dev(t1);
			destroy_component(details, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$l.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$k($$self, $$props, $$invalidate) {
	let $settings;
	let $moves;
	validate_store(settings, "settings");
	component_subscribe($$self, settings, $$value => $$invalidate(9, $settings = $$value));
	validate_store(moves, "moves");
	component_subscribe($$self, moves, $$value => $$invalidate(10, $moves = $$value));
	let { pm } = $$props;
	let lmoves;
	let mdata;
	let opponentType1 = "";
	let opponentType2 = "";
	let _types = [{ v: "", l: "--" }, ...types.map((t, idx) => ({ v: t, l: types_zh[idx] }))];
	let forceBuff = 1;
	let forceBuffOptions = pvp_eff.map(i => i.value).flat().concat(forceBuff).sort();

	function queryMove(mname) {
		return copy($moves.find(m => m.moveId === mname));
	}

	function genMove(mname, isFast) {
		let mmm = queryMove(mname);
		mmm.typeEff = queryTypeEffect(mmm.type, opponentType1, opponentType2) * forceBuff;
		mmm.efficon = mmm.typeEff === 1 ? "" : mmm.typeEff > 1 ? "▲" : "▼";
		mmm.power = fixNum(mmm.typeEff * mmm.power);
		mmm.isLegacy = lmoves && lmoves.includes(mname);
		mmm.isFast = isFast;
		mmm.stab = pm.types.includes(mmm.type);
		mmm.stabFactor = mmm.stab ? 1.2 : 1;

		if (isFast) {
			mmm.ept = fixNum(mmm.energyGain / mmm.turn);
			mmm.dpt = fixNum(mmm.power / mmm.turn);
			mmm.eptxdpt = fixNum(mmm.energyGain * mmm.power / (mmm.turn * mmm.turn));
		} else {
			mmm.dpe = fixNum(mmm.power / mmm.energy);
		}

		return mmm;
	}

	const writable_props = ["pm"];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Moveset> was created with unknown prop '${key}'`);
	});

	function select0_change_handler() {
		opponentType1 = select_value(this);
		$$invalidate(2, opponentType1);
		$$invalidate(6, _types);
	}

	function select1_change_handler() {
		opponentType2 = select_value(this);
		$$invalidate(3, opponentType2);
		$$invalidate(6, _types);
	}

	function select2_change_handler() {
		forceBuff = select_value(this);
		$$invalidate(4, forceBuff);
		$$invalidate(7, forceBuffOptions);
	}

	$$self.$set = $$props => {
		if ("pm" in $$props) $$invalidate(0, pm = $$props.pm);
	};

	$$self.$capture_state = () => {
		return {
			pm,
			lmoves,
			mdata,
			opponentType1,
			opponentType2,
			_types,
			forceBuff,
			forceBuffOptions,
			ispve,
			$settings,
			$moves
		};
	};

	$$self.$inject_state = $$props => {
		if ("pm" in $$props) $$invalidate(0, pm = $$props.pm);
		if ("lmoves" in $$props) lmoves = $$props.lmoves;
		if ("mdata" in $$props) $$invalidate(1, mdata = $$props.mdata);
		if ("opponentType1" in $$props) $$invalidate(2, opponentType1 = $$props.opponentType1);
		if ("opponentType2" in $$props) $$invalidate(3, opponentType2 = $$props.opponentType2);
		if ("_types" in $$props) $$invalidate(6, _types = $$props._types);
		if ("forceBuff" in $$props) $$invalidate(4, forceBuff = $$props.forceBuff);
		if ("forceBuffOptions" in $$props) $$invalidate(7, forceBuffOptions = $$props.forceBuffOptions);
		if ("ispve" in $$props) $$invalidate(5, ispve = $$props.ispve);
		if ("$settings" in $$props) settings.set($settings = $$props.$settings);
		if ("$moves" in $$props) moves.set($moves = $$props.$moves);
	};

	let ispve;

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*$settings*/ 512) {
			 $$invalidate(5, ispve = $settings.io.ispve);
		}

		if ($$self.$$.dirty & /*opponentType1, opponentType2, forceBuff, pm*/ 29) {
			 {
				lmoves = pm.legacyMoves;

				$$invalidate(1, mdata = [
					{
						title: "Fast Moves",
						data: pm.fastMoves.map(m => genMove(m, true)),
						setting: "fmove"
					},
					{
						title: "Charged Moves",
						data: pm.chargedMoves.map(m => genMove(m, false)),
						setting: "cmove"
					}
				]);
			} // console.log('mdata', mdata);
		}
	};

	return [
		pm,
		mdata,
		opponentType1,
		opponentType2,
		forceBuff,
		ispve,
		_types,
		forceBuffOptions,
		lmoves,
		$settings,
		$moves,
		queryMove,
		genMove,
		select0_change_handler,
		select1_change_handler,
		select2_change_handler
	];
}

class Moveset extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance$k, create_fragment$l, safe_not_equal, { pm: 0 });

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Moveset",
			options,
			id: create_fragment$l.name
		});

		const { ctx } = this.$$;
		const props = options.props || {};

		if (/*pm*/ ctx[0] === undefined && !("pm" in props)) {
			console.warn("<Moveset> was created without expected prop 'pm'");
		}
	}

	get pm() {
		throw new Error("<Moveset>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set pm(value) {
		throw new Error("<Moveset>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* ./src/components/FloatLink.html generated by Svelte v3.18.1 */
const file$l = "./src/components/FloatLink.html";

// (10:2) {#if pm1}
function create_if_block_2$2(ctx) {
	let div;
	let a;
	let t0;
	let t1_value = /*pm1*/ ctx[0].dex + "";
	let t1;
	let t2;
	let br;
	let t3;
	let current_block_type_index;
	let if_block;
	let a_href_value;
	let current;
	const if_block_creators = [create_if_block_3$1, create_else_block_1$2];
	const if_blocks = [];

	function select_block_type(ctx, dirty) {
		if (/*pm1*/ ctx[0].formName) return 0;
		return 1;
	}

	current_block_type_index = select_block_type(ctx);
	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

	const block = {
		c: function create() {
			div = element("div");
			a = element("a");
			t0 = text("#");
			t1 = text(t1_value);
			t2 = space();
			br = element("br");
			t3 = space();
			if_block.c();
			add_location(br, file$l, 13, 8, 239);
			attr_dev(a, "href", a_href_value = "./pokemon/" + /*pm1*/ ctx[0].uid);
			attr_dev(a, "class", "svelte-d33dje");
			add_location(a, file$l, 11, 6, 181);
			attr_dev(div, "class", "card float-card left svelte-d33dje");
			add_location(div, file$l, 10, 4, 140);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			append_dev(div, a);
			append_dev(a, t0);
			append_dev(a, t1);
			append_dev(a, t2);
			append_dev(a, br);
			append_dev(a, t3);
			if_blocks[current_block_type_index].m(a, null);
			current = true;
		},
		p: function update(ctx, dirty) {
			if ((!current || dirty & /*pm1*/ 1) && t1_value !== (t1_value = /*pm1*/ ctx[0].dex + "")) set_data_dev(t1, t1_value);
			let previous_block_index = current_block_type_index;
			current_block_type_index = select_block_type(ctx);

			if (current_block_type_index === previous_block_index) {
				if_blocks[current_block_type_index].p(ctx, dirty);
			} else {
				group_outros();

				transition_out(if_blocks[previous_block_index], 1, 1, () => {
					if_blocks[previous_block_index] = null;
				});

				check_outros();
				if_block = if_blocks[current_block_type_index];

				if (!if_block) {
					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
					if_block.c();
				}

				transition_in(if_block, 1);
				if_block.m(a, null);
			}

			if (!current || dirty & /*pm1*/ 1 && a_href_value !== (a_href_value = "./pokemon/" + /*pm1*/ ctx[0].uid)) {
				attr_dev(a, "href", a_href_value);
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(if_block);
			current = true;
		},
		o: function outro(local) {
			transition_out(if_block);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			if_blocks[current_block_type_index].d();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_2$2.name,
		type: "if",
		source: "(10:2) {#if pm1}",
		ctx
	});

	return block;
}

// (20:8) {:else}
function create_else_block_1$2(ctx) {
	let t_value = /*pm1*/ ctx[0].name + "";
	let t;

	const block = {
		c: function create() {
			t = text(t_value);
		},
		m: function mount(target, anchor) {
			insert_dev(target, t, anchor);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*pm1*/ 1 && t_value !== (t_value = /*pm1*/ ctx[0].name + "")) set_data_dev(t, t_value);
		},
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(t);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_else_block_1$2.name,
		type: "else",
		source: "(20:8) {:else}",
		ctx
	});

	return block;
}

// (15:8) {#if pm1.formName}
function create_if_block_3$1(ctx) {
	let current;

	const ruby = new Ruby({
			props: {
				class: "x",
				$$slots: {
					default: [create_default_slot_1$6],
					rt: [create_rt_slot_1$1],
					rb: [create_rb_slot_1$1]
				},
				$$scope: { ctx }
			},
			$$inline: true
		});

	const block = {
		c: function create() {
			create_component(ruby.$$.fragment);
		},
		m: function mount(target, anchor) {
			mount_component(ruby, target, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
			const ruby_changes = {};

			if (dirty & /*$$scope, pm1*/ 5) {
				ruby_changes.$$scope = { dirty, ctx };
			}

			ruby.$set(ruby_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(ruby.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(ruby.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(ruby, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_3$1.name,
		type: "if",
		source: "(15:8) {#if pm1.formName}",
		ctx
	});

	return block;
}

// (17:12) <div slot="rb">
function create_rb_slot_1$1(ctx) {
	let div;
	let t_value = /*pm1*/ ctx[0].formName[0] + "";
	let t;

	const block = {
		c: function create() {
			div = element("div");
			t = text(t_value);
			attr_dev(div, "slot", "rb");
			add_location(div, file$l, 16, 12, 310);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			append_dev(div, t);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*pm1*/ 1 && t_value !== (t_value = /*pm1*/ ctx[0].formName[0] + "")) set_data_dev(t, t_value);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_rb_slot_1$1.name,
		type: "slot",
		source: "(17:12) <div slot=\\\"rb\\\">",
		ctx
	});

	return block;
}

// (18:12) <div slot="rt">
function create_rt_slot_1$1(ctx) {
	let div;
	let t_value = /*pm1*/ ctx[0].formName[1] + "";
	let t;

	const block = {
		c: function create() {
			div = element("div");
			t = text(t_value);
			attr_dev(div, "slot", "rt");
			add_location(div, file$l, 17, 12, 361);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			append_dev(div, t);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*pm1*/ 1 && t_value !== (t_value = /*pm1*/ ctx[0].formName[1] + "")) set_data_dev(t, t_value);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_rt_slot_1$1.name,
		type: "slot",
		source: "(18:12) <div slot=\\\"rt\\\">",
		ctx
	});

	return block;
}

// (16:10) <Ruby class="x">
function create_default_slot_1$6(ctx) {
	let t;

	const block = {
		c: function create() {
			t = space();
		},
		m: function mount(target, anchor) {
			insert_dev(target, t, anchor);
		},
		p: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(t);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot_1$6.name,
		type: "slot",
		source: "(16:10) <Ruby class=\\\"x\\\">",
		ctx
	});

	return block;
}

// (27:2) {#if pm2}
function create_if_block$7(ctx) {
	let div;
	let a;
	let t0;
	let t1_value = /*pm2*/ ctx[1].dex + "";
	let t1;
	let t2;
	let br;
	let t3;
	let current_block_type_index;
	let if_block;
	let a_href_value;
	let current;
	const if_block_creators = [create_if_block_1$5, create_else_block$3];
	const if_blocks = [];

	function select_block_type_1(ctx, dirty) {
		if (/*pm2*/ ctx[1].formName) return 0;
		return 1;
	}

	current_block_type_index = select_block_type_1(ctx);
	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

	const block = {
		c: function create() {
			div = element("div");
			a = element("a");
			t0 = text("#");
			t1 = text(t1_value);
			t2 = space();
			br = element("br");
			t3 = space();
			if_block.c();
			add_location(br, file$l, 30, 8, 616);
			attr_dev(a, "href", a_href_value = "./pokemon/" + /*pm2*/ ctx[1].uid);
			attr_dev(a, "class", "svelte-d33dje");
			add_location(a, file$l, 28, 6, 558);
			attr_dev(div, "class", "card float-card right svelte-d33dje");
			add_location(div, file$l, 27, 4, 516);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			append_dev(div, a);
			append_dev(a, t0);
			append_dev(a, t1);
			append_dev(a, t2);
			append_dev(a, br);
			append_dev(a, t3);
			if_blocks[current_block_type_index].m(a, null);
			current = true;
		},
		p: function update(ctx, dirty) {
			if ((!current || dirty & /*pm2*/ 2) && t1_value !== (t1_value = /*pm2*/ ctx[1].dex + "")) set_data_dev(t1, t1_value);
			let previous_block_index = current_block_type_index;
			current_block_type_index = select_block_type_1(ctx);

			if (current_block_type_index === previous_block_index) {
				if_blocks[current_block_type_index].p(ctx, dirty);
			} else {
				group_outros();

				transition_out(if_blocks[previous_block_index], 1, 1, () => {
					if_blocks[previous_block_index] = null;
				});

				check_outros();
				if_block = if_blocks[current_block_type_index];

				if (!if_block) {
					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
					if_block.c();
				}

				transition_in(if_block, 1);
				if_block.m(a, null);
			}

			if (!current || dirty & /*pm2*/ 2 && a_href_value !== (a_href_value = "./pokemon/" + /*pm2*/ ctx[1].uid)) {
				attr_dev(a, "href", a_href_value);
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(if_block);
			current = true;
		},
		o: function outro(local) {
			transition_out(if_block);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			if_blocks[current_block_type_index].d();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$7.name,
		type: "if",
		source: "(27:2) {#if pm2}",
		ctx
	});

	return block;
}

// (37:8) {:else}
function create_else_block$3(ctx) {
	let t_value = /*pm2*/ ctx[1].name + "";
	let t;

	const block = {
		c: function create() {
			t = text(t_value);
		},
		m: function mount(target, anchor) {
			insert_dev(target, t, anchor);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*pm2*/ 2 && t_value !== (t_value = /*pm2*/ ctx[1].name + "")) set_data_dev(t, t_value);
		},
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(t);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_else_block$3.name,
		type: "else",
		source: "(37:8) {:else}",
		ctx
	});

	return block;
}

// (32:8) {#if pm2.formName}
function create_if_block_1$5(ctx) {
	let current;

	const ruby = new Ruby({
			props: {
				class: "x",
				$$slots: {
					default: [create_default_slot$a],
					rt: [create_rt_slot$4],
					rb: [create_rb_slot$4]
				},
				$$scope: { ctx }
			},
			$$inline: true
		});

	const block = {
		c: function create() {
			create_component(ruby.$$.fragment);
		},
		m: function mount(target, anchor) {
			mount_component(ruby, target, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
			const ruby_changes = {};

			if (dirty & /*$$scope, pm2*/ 6) {
				ruby_changes.$$scope = { dirty, ctx };
			}

			ruby.$set(ruby_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(ruby.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(ruby.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(ruby, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_1$5.name,
		type: "if",
		source: "(32:8) {#if pm2.formName}",
		ctx
	});

	return block;
}

// (34:12) <div slot="rb">
function create_rb_slot$4(ctx) {
	let div;
	let t_value = /*pm2*/ ctx[1].formName[0] + "";
	let t;

	const block = {
		c: function create() {
			div = element("div");
			t = text(t_value);
			attr_dev(div, "slot", "rb");
			add_location(div, file$l, 33, 12, 687);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			append_dev(div, t);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*pm2*/ 2 && t_value !== (t_value = /*pm2*/ ctx[1].formName[0] + "")) set_data_dev(t, t_value);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_rb_slot$4.name,
		type: "slot",
		source: "(34:12) <div slot=\\\"rb\\\">",
		ctx
	});

	return block;
}

// (35:12) <div slot="rt">
function create_rt_slot$4(ctx) {
	let div;
	let t_value = /*pm2*/ ctx[1].formName[1] + "";
	let t;

	const block = {
		c: function create() {
			div = element("div");
			t = text(t_value);
			attr_dev(div, "slot", "rt");
			add_location(div, file$l, 34, 12, 738);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			append_dev(div, t);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*pm2*/ 2 && t_value !== (t_value = /*pm2*/ ctx[1].formName[1] + "")) set_data_dev(t, t_value);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_rt_slot$4.name,
		type: "slot",
		source: "(35:12) <div slot=\\\"rt\\\">",
		ctx
	});

	return block;
}

// (33:10) <Ruby class="x">
function create_default_slot$a(ctx) {
	let t;

	const block = {
		c: function create() {
			t = space();
		},
		m: function mount(target, anchor) {
			insert_dev(target, t, anchor);
		},
		p: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(t);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot$a.name,
		type: "slot",
		source: "(33:10) <Ruby class=\\\"x\\\">",
		ctx
	});

	return block;
}

function create_fragment$m(ctx) {
	let div;
	let t;
	let current;
	let if_block0 = /*pm1*/ ctx[0] && create_if_block_2$2(ctx);
	let if_block1 = /*pm2*/ ctx[1] && create_if_block$7(ctx);

	const block = {
		c: function create() {
			div = element("div");
			if (if_block0) if_block0.c();
			t = space();
			if (if_block1) if_block1.c();
			attr_dev(div, "class", "float-links fz-s svelte-d33dje");
			add_location(div, file$l, 8, 0, 93);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			if (if_block0) if_block0.m(div, null);
			append_dev(div, t);
			if (if_block1) if_block1.m(div, null);
			current = true;
		},
		p: function update(ctx, [dirty]) {
			if (/*pm1*/ ctx[0]) {
				if (if_block0) {
					if_block0.p(ctx, dirty);
					transition_in(if_block0, 1);
				} else {
					if_block0 = create_if_block_2$2(ctx);
					if_block0.c();
					transition_in(if_block0, 1);
					if_block0.m(div, t);
				}
			} else if (if_block0) {
				group_outros();

				transition_out(if_block0, 1, 1, () => {
					if_block0 = null;
				});

				check_outros();
			}

			if (/*pm2*/ ctx[1]) {
				if (if_block1) {
					if_block1.p(ctx, dirty);
					transition_in(if_block1, 1);
				} else {
					if_block1 = create_if_block$7(ctx);
					if_block1.c();
					transition_in(if_block1, 1);
					if_block1.m(div, null);
				}
			} else if (if_block1) {
				group_outros();

				transition_out(if_block1, 1, 1, () => {
					if_block1 = null;
				});

				check_outros();
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(if_block0);
			transition_in(if_block1);
			current = true;
		},
		o: function outro(local) {
			transition_out(if_block0);
			transition_out(if_block1);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			if (if_block0) if_block0.d();
			if (if_block1) if_block1.d();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$m.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$l($$self, $$props, $$invalidate) {
	let { pm1 } = $$props;
	let { pm2 } = $$props;
	const writable_props = ["pm1", "pm2"];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<FloatLink> was created with unknown prop '${key}'`);
	});

	$$self.$set = $$props => {
		if ("pm1" in $$props) $$invalidate(0, pm1 = $$props.pm1);
		if ("pm2" in $$props) $$invalidate(1, pm2 = $$props.pm2);
	};

	$$self.$capture_state = () => {
		return { pm1, pm2 };
	};

	$$self.$inject_state = $$props => {
		if ("pm1" in $$props) $$invalidate(0, pm1 = $$props.pm1);
		if ("pm2" in $$props) $$invalidate(1, pm2 = $$props.pm2);
	};

	return [pm1, pm2];
}

class FloatLink extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance$l, create_fragment$m, safe_not_equal, { pm1: 0, pm2: 1 });

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "FloatLink",
			options,
			id: create_fragment$m.name
		});

		const { ctx } = this.$$;
		const props = options.props || {};

		if (/*pm1*/ ctx[0] === undefined && !("pm1" in props)) {
			console.warn("<FloatLink> was created without expected prop 'pm1'");
		}

		if (/*pm2*/ ctx[1] === undefined && !("pm2" in props)) {
			console.warn("<FloatLink> was created without expected prop 'pm2'");
		}
	}

	get pm1() {
		throw new Error("<FloatLink>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set pm1(value) {
		throw new Error("<FloatLink>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get pm2() {
		throw new Error("<FloatLink>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set pm2(value) {
		throw new Error("<FloatLink>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* ./src/components/QueryPM.html generated by Svelte v3.18.1 */

const { console: console_1$1 } = globals;
const file$m = "./src/components/QueryPM.html";

function create_fragment$n(ctx) {
	let div;
	let form;
	let input;
	let t0;
	let datalist_1;
	let t1;
	let button;
	let t2;
	let dispose;

	const block = {
		c: function create() {
			div = element("div");
			form = element("form");
			input = element("input");
			t0 = space();
			datalist_1 = element("datalist");
			t1 = space();
			button = element("button");
			t2 = text(/*pmName*/ ctx[1]);
			attr_dev(input, "list", "pms");
			attr_dev(input, "class", "uid-input mr-2 mb-0 svelte-2370qf");
			input.required = true;
			attr_dev(input, "pattern", "\\d+(_\\D+)?");
			attr_dev(input, "title", "GG");
			add_location(input, file$m, 43, 4, 792);
			attr_dev(datalist_1, "id", "pms");
			add_location(datalist_1, file$m, 54, 4, 1002);
			attr_dev(button, "class", "submit mb-0 text-nowrap svelte-2370qf");
			add_location(button, file$m, 58, 4, 1068);
			attr_dev(form, "class", "form df ai-c mb-0 svelte-2370qf");
			add_location(form, file$m, 42, 2, 719);
			attr_dev(div, "class", "card input-card pt-2 pb-2 svelte-2370qf");
			add_location(div, file$m, 41, 0, 677);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			append_dev(div, form);
			append_dev(form, input);
			set_input_value(input, /*inputUid*/ ctx[0]);
			/*input_binding*/ ctx[11](input);
			append_dev(form, t0);
			append_dev(form, datalist_1);
			datalist_1.innerHTML = /*$datalist*/ ctx[3];
			append_dev(form, t1);
			append_dev(form, button);
			append_dev(button, t2);

			dispose = [
				listen_dev(input, "input", /*input_input_handler*/ ctx[10]),
				listen_dev(input, "focus", /*onFocus*/ ctx[4], false, false, false),
				listen_dev(form, "submit", prevent_default(/*onSubmit*/ ctx[5]), false, true, false)
			];
		},
		p: function update(ctx, [dirty]) {
			if (dirty & /*inputUid*/ 1 && input.value !== /*inputUid*/ ctx[0]) {
				set_input_value(input, /*inputUid*/ ctx[0]);
			}

			if (dirty & /*$datalist*/ 8) datalist_1.innerHTML = /*$datalist*/ ctx[3];			if (dirty & /*pmName*/ 2) set_data_dev(t2, /*pmName*/ ctx[1]);
		},
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			/*input_binding*/ ctx[11](null);
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$n.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$m($$self, $$props, $$invalidate) {
	let $pokemons;
	let $router;
	let $datalist;
	validate_store(pokemons, "pokemons");
	component_subscribe($$self, pokemons, $$value => $$invalidate(7, $pokemons = $$value));
	validate_store(router, "router");
	component_subscribe($$self, router, $$value => $$invalidate(8, $router = $$value));
	validate_store(datalist, "datalist");
	component_subscribe($$self, datalist, $$value => $$invalidate(3, $datalist = $$value));
	let { uid = "1" } = $$props;
	let inputUid = uid;
	let pmName = "";
	let elm_input;

	function findPm(uid) {
		return $pokemons.length && $pokemons.find(pm => pm.uid === uid);
	}

	function onFocus() {
		elm_input.select();
	}

	function onSubmit() {
		let _uid = elm_input.value;
		let pm = findPm(_uid);

		if (!pm) {
			console.error(`Wrong Dex: ${_uid}`);
			return;
		}

		console.info("submit", _uid);

		if (_uid === uid) {
			return;
		}

		$router.route(`/pokemon/${_uid}`);
	}

	const writable_props = ["uid"];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1$1.warn(`<QueryPM> was created with unknown prop '${key}'`);
	});

	function input_input_handler() {
		inputUid = this.value;
		$$invalidate(0, inputUid);
	}

	function input_binding($$value) {
		binding_callbacks[$$value ? "unshift" : "push"](() => {
			$$invalidate(2, elm_input = $$value);
		});
	}

	$$self.$set = $$props => {
		if ("uid" in $$props) $$invalidate(6, uid = $$props.uid);
	};

	$$self.$capture_state = () => {
		return {
			uid,
			inputUid,
			pmName,
			elm_input,
			$pokemons,
			$router,
			$datalist
		};
	};

	$$self.$inject_state = $$props => {
		if ("uid" in $$props) $$invalidate(6, uid = $$props.uid);
		if ("inputUid" in $$props) $$invalidate(0, inputUid = $$props.inputUid);
		if ("pmName" in $$props) $$invalidate(1, pmName = $$props.pmName);
		if ("elm_input" in $$props) $$invalidate(2, elm_input = $$props.elm_input);
		if ("$pokemons" in $$props) pokemons.set($pokemons = $$props.$pokemons);
		if ("$router" in $$props) router.set($router = $$props.$router);
		if ("$datalist" in $$props) datalist.set($datalist = $$props.$datalist);
	};

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*inputUid*/ 1) {
			 {
				let pm = findPm(inputUid);
				$$invalidate(1, pmName = pm ? pm.name : "");
			}
		}
	};

	return [
		inputUid,
		pmName,
		elm_input,
		$datalist,
		onFocus,
		onSubmit,
		uid,
		$pokemons,
		$router,
		findPm,
		input_input_handler,
		input_binding
	];
}

class QueryPM extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance$m, create_fragment$n, safe_not_equal, { uid: 6 });

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "QueryPM",
			options,
			id: create_fragment$n.name
		});
	}

	get uid() {
		throw new Error("<QueryPM>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set uid(value) {
		throw new Error("<QueryPM>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* ./src/routes/PokemonPage.html generated by Svelte v3.18.1 */
const file$n = "./src/routes/PokemonPage.html";

function get_each_context$c(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[11] = list[i];
	return child_ctx;
}

function get_each_context_1$7(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[14] = list[i];
	return child_ctx;
}

// (71:0) {#if pm}
function create_if_block$8(ctx) {
	let section;
	let t0;
	let t1;
	let div2;
	let h2;
	let div0;
	let t2;
	let sup;
	let t3;
	let t4_value = /*pm*/ ctx[0].dex + "";
	let t4;
	let t5;
	let span;
	let t6;
	let t7;
	let div1;
	let t8;
	let t9;
	let t10;
	let t11;
	let t12;
	let t13;
	let t14;
	let current;

	const querypm = new QueryPM({
			props: { uid: /*pm*/ ctx[0].uid },
			$$inline: true
		});

	const floatlink = new FloatLink({
			props: {
				pm1: /*prevPm*/ ctx[3],
				pm2: /*nextPm*/ ctx[2]
			},
			$$inline: true
		});

	const ruby = new Ruby({
			props: {
				$$slots: {
					default: [create_default_slot_2$4],
					rt: [create_rt_slot$5],
					rb: [create_rb_slot$5]
				},
				$$scope: { ctx }
			},
			$$inline: true
		});

	let each_value_1 = /*pm*/ ctx[0].types;
	let each_blocks_1 = [];

	for (let i = 0; i < each_value_1.length; i += 1) {
		each_blocks_1[i] = create_each_block_1$7(get_each_context_1$7(ctx, each_value_1, i));
	}

	const out = i => transition_out(each_blocks_1[i], 1, 1, () => {
		each_blocks_1[i] = null;
	});

	const adsbar = new ADS_Bar({
			props: { pm: /*pm*/ ctx[0], class: "ml-a fw-n" },
			$$inline: true
		});

	let each_value = /*pvpokeLinks*/ ctx[6];
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block$c(get_each_context$c(ctx, each_value, i));
	}

	const details0 = new Details({
			props: {
				type: "pm_family",
				$$slots: { default: [create_default_slot_1$7] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	const details1 = new Details({
			props: {
				type: "meta_info",
				$$slots: { default: [create_default_slot$b] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	const cp = new CP({
			props: { ads: /*ads*/ ctx[1] },
			$$inline: true
		});

	const typefactor = new TypeFactor({
			props: { types: /*pm*/ ctx[0].types },
			$$inline: true
		});

	const switcher = new Switcher({ $$inline: true });

	const moveset = new Moveset({
			props: { pm: /*pm*/ ctx[0] },
			$$inline: true
		});

	const block = {
		c: function create() {
			section = element("section");
			create_component(querypm.$$.fragment);
			t0 = space();
			create_component(floatlink.$$.fragment);
			t1 = space();
			div2 = element("div");
			h2 = element("h2");
			div0 = element("div");
			create_component(ruby.$$.fragment);
			t2 = space();
			sup = element("sup");
			t3 = text("#");
			t4 = text(t4_value);
			t5 = space();
			span = element("span");

			for (let i = 0; i < each_blocks_1.length; i += 1) {
				each_blocks_1[i].c();
			}

			t6 = space();
			create_component(adsbar.$$.fragment);
			t7 = space();
			div1 = element("div");
			t8 = text("check in PvPoke[tw]:\n        ");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			t9 = space();
			create_component(details0.$$.fragment);
			t10 = space();
			create_component(details1.$$.fragment);
			t11 = space();
			create_component(cp.$$.fragment);
			t12 = space();
			create_component(typefactor.$$.fragment);
			t13 = space();
			create_component(switcher.$$.fragment);
			t14 = space();
			create_component(moveset.$$.fragment);
			attr_dev(sup, "class", "fw-n ml-1 mr-1");
			add_location(sup, file$n, 87, 10, 1823);
			attr_dev(span, "class", "d-if");
			add_location(span, file$n, 88, 10, 1877);
			attr_dev(div0, "class", "df fxw-w");
			add_location(div0, file$n, 79, 8, 1614);
			attr_dev(h2, "class", "df fxw-w");
			add_location(h2, file$n, 78, 6, 1584);
			attr_dev(div1, "class", "pvpoke-links fz-s text-right svelte-ljcpng");
			add_location(div1, file$n, 98, 6, 2104);
			attr_dev(div2, "class", "card pos-r");
			add_location(div2, file$n, 77, 4, 1553);
			attr_dev(section, "class", "pos-r df fd-c");
			add_location(section, file$n, 71, 2, 1441);
		},
		m: function mount(target, anchor) {
			insert_dev(target, section, anchor);
			mount_component(querypm, section, null);
			append_dev(section, t0);
			mount_component(floatlink, section, null);
			append_dev(section, t1);
			append_dev(section, div2);
			append_dev(div2, h2);
			append_dev(h2, div0);
			mount_component(ruby, div0, null);
			append_dev(div0, t2);
			append_dev(div0, sup);
			append_dev(sup, t3);
			append_dev(sup, t4);
			append_dev(div0, t5);
			append_dev(div0, span);

			for (let i = 0; i < each_blocks_1.length; i += 1) {
				each_blocks_1[i].m(span, null);
			}

			append_dev(h2, t6);
			mount_component(adsbar, h2, null);
			append_dev(div2, t7);
			append_dev(div2, div1);
			append_dev(div1, t8);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(div1, null);
			}

			append_dev(div2, t9);
			mount_component(details0, div2, null);
			append_dev(div2, t10);
			mount_component(details1, div2, null);
			append_dev(section, t11);
			mount_component(cp, section, null);
			append_dev(section, t12);
			mount_component(typefactor, section, null);
			append_dev(section, t13);
			mount_component(switcher, section, null);
			append_dev(section, t14);
			mount_component(moveset, section, null);
			current = true;
		},
		p: function update(ctx, dirty) {
			const querypm_changes = {};
			if (dirty & /*pm*/ 1) querypm_changes.uid = /*pm*/ ctx[0].uid;
			querypm.$set(querypm_changes);
			const floatlink_changes = {};
			if (dirty & /*prevPm*/ 8) floatlink_changes.pm1 = /*prevPm*/ ctx[3];
			if (dirty & /*nextPm*/ 4) floatlink_changes.pm2 = /*nextPm*/ ctx[2];
			floatlink.$set(floatlink_changes);
			const ruby_changes = {};

			if (dirty & /*$$scope, pm*/ 131073) {
				ruby_changes.$$scope = { dirty, ctx };
			}

			ruby.$set(ruby_changes);
			if ((!current || dirty & /*pm*/ 1) && t4_value !== (t4_value = /*pm*/ ctx[0].dex + "")) set_data_dev(t4, t4_value);

			if (dirty & /*pm*/ 1) {
				each_value_1 = /*pm*/ ctx[0].types;
				let i;

				for (i = 0; i < each_value_1.length; i += 1) {
					const child_ctx = get_each_context_1$7(ctx, each_value_1, i);

					if (each_blocks_1[i]) {
						each_blocks_1[i].p(child_ctx, dirty);
						transition_in(each_blocks_1[i], 1);
					} else {
						each_blocks_1[i] = create_each_block_1$7(child_ctx);
						each_blocks_1[i].c();
						transition_in(each_blocks_1[i], 1);
						each_blocks_1[i].m(span, null);
					}
				}

				group_outros();

				for (i = each_value_1.length; i < each_blocks_1.length; i += 1) {
					out(i);
				}

				check_outros();
			}

			const adsbar_changes = {};
			if (dirty & /*pm*/ 1) adsbar_changes.pm = /*pm*/ ctx[0];
			adsbar.$set(adsbar_changes);

			if (dirty & /*pvpokeLinks, pm*/ 65) {
				each_value = /*pvpokeLinks*/ ctx[6];
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context$c(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block$c(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(div1, null);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value.length;
			}

			const details0_changes = {};

			if (dirty & /*$$scope, pm, $settings*/ 131105) {
				details0_changes.$$scope = { dirty, ctx };
			}

			details0.$set(details0_changes);
			const details1_changes = {};

			if (dirty & /*$$scope, genderText, pm*/ 131089) {
				details1_changes.$$scope = { dirty, ctx };
			}

			details1.$set(details1_changes);
			const cp_changes = {};
			if (dirty & /*ads*/ 2) cp_changes.ads = /*ads*/ ctx[1];
			cp.$set(cp_changes);
			const typefactor_changes = {};
			if (dirty & /*pm*/ 1) typefactor_changes.types = /*pm*/ ctx[0].types;
			typefactor.$set(typefactor_changes);
			const moveset_changes = {};
			if (dirty & /*pm*/ 1) moveset_changes.pm = /*pm*/ ctx[0];
			moveset.$set(moveset_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(querypm.$$.fragment, local);
			transition_in(floatlink.$$.fragment, local);
			transition_in(ruby.$$.fragment, local);

			for (let i = 0; i < each_value_1.length; i += 1) {
				transition_in(each_blocks_1[i]);
			}

			transition_in(adsbar.$$.fragment, local);
			transition_in(details0.$$.fragment, local);
			transition_in(details1.$$.fragment, local);
			transition_in(cp.$$.fragment, local);
			transition_in(typefactor.$$.fragment, local);
			transition_in(switcher.$$.fragment, local);
			transition_in(moveset.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(querypm.$$.fragment, local);
			transition_out(floatlink.$$.fragment, local);
			transition_out(ruby.$$.fragment, local);
			each_blocks_1 = each_blocks_1.filter(Boolean);

			for (let i = 0; i < each_blocks_1.length; i += 1) {
				transition_out(each_blocks_1[i]);
			}

			transition_out(adsbar.$$.fragment, local);
			transition_out(details0.$$.fragment, local);
			transition_out(details1.$$.fragment, local);
			transition_out(cp.$$.fragment, local);
			transition_out(typefactor.$$.fragment, local);
			transition_out(switcher.$$.fragment, local);
			transition_out(moveset.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(section);
			destroy_component(querypm);
			destroy_component(floatlink);
			destroy_component(ruby);
			destroy_each(each_blocks_1, detaching);
			destroy_component(adsbar);
			destroy_each(each_blocks, detaching);
			destroy_component(details0);
			destroy_component(details1);
			destroy_component(cp);
			destroy_component(typefactor);
			destroy_component(switcher);
			destroy_component(moveset);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$8.name,
		type: "if",
		source: "(71:0) {#if pm}",
		ctx
	});

	return block;
}

// (82:12) <div slot="rb">
function create_rb_slot$5(ctx) {
	let div;
	let t_value = /*pm*/ ctx[0].name + "";
	let t;

	const block = {
		c: function create() {
			div = element("div");
			t = text(t_value);
			attr_dev(div, "slot", "rb");
			add_location(div, file$n, 81, 12, 1666);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			append_dev(div, t);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*pm*/ 1 && t_value !== (t_value = /*pm*/ ctx[0].name + "")) set_data_dev(t, t_value);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_rb_slot$5.name,
		type: "slot",
		source: "(82:12) <div slot=\\\"rb\\\">",
		ctx
	});

	return block;
}

// (85:12) <div slot="rt" class="fw-n text-uppercase">
function create_rt_slot$5(ctx) {
	let div;
	let t_value = /*pm*/ ctx[0].id + "";
	let t;

	const block = {
		c: function create() {
			div = element("div");
			t = text(t_value);
			attr_dev(div, "slot", "rt");
			attr_dev(div, "class", "fw-n text-uppercase");
			add_location(div, file$n, 84, 12, 1737);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			append_dev(div, t);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*pm*/ 1 && t_value !== (t_value = /*pm*/ ctx[0].id + "")) set_data_dev(t, t_value);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_rt_slot$5.name,
		type: "slot",
		source: "(85:12) <div slot=\\\"rt\\\" class=\\\"fw-n text-uppercase\\\">",
		ctx
	});

	return block;
}

// (81:10) <Ruby>
function create_default_slot_2$4(ctx) {
	let t;

	const block = {
		c: function create() {
			t = space();
		},
		m: function mount(target, anchor) {
			insert_dev(target, t, anchor);
		},
		p: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(t);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot_2$4.name,
		type: "slot",
		source: "(81:10) <Ruby>",
		ctx
	});

	return block;
}

// (90:12) {#each pm.types as type}
function create_each_block_1$7(ctx) {
	let current;

	const typeicon = new TypeIcon({
			props: { type: /*type*/ ctx[14], class: "mr-1" },
			$$inline: true
		});

	const block = {
		c: function create() {
			create_component(typeicon.$$.fragment);
		},
		m: function mount(target, anchor) {
			mount_component(typeicon, target, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
			const typeicon_changes = {};
			if (dirty & /*pm*/ 1) typeicon_changes.type = /*type*/ ctx[14];
			typeicon.$set(typeicon_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(typeicon.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(typeicon.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(typeicon, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block_1$7.name,
		type: "each",
		source: "(90:12) {#each pm.types as type}",
		ctx
	});

	return block;
}

// (101:8) {#each pvpokeLinks as link}
function create_each_block$c(ctx) {
	let a;
	let t0_value = /*link*/ ctx[11].title + "";
	let t0;
	let t1;
	let a_target_value;
	let a_href_value;

	const block = {
		c: function create() {
			a = element("a");
			t0 = text(t0_value);
			t1 = space();
			attr_dev(a, "class", "text-no-decoration");
			attr_dev(a, "target", a_target_value = "pvp" + /*link*/ ctx[11].cp);
			attr_dev(a, "href", a_href_value = "https://pvpoketw.com/rankings/all/" + /*link*/ ctx[11].cp + "/overall/" + /*pm*/ ctx[0].id.toLowerCase() + "/");
			add_location(a, file$n, 101, 10, 2222);
		},
		m: function mount(target, anchor) {
			insert_dev(target, a, anchor);
			append_dev(a, t0);
			append_dev(a, t1);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*pm*/ 1 && a_href_value !== (a_href_value = "https://pvpoketw.com/rankings/all/" + /*link*/ ctx[11].cp + "/overall/" + /*pm*/ ctx[0].id.toLowerCase() + "/")) {
				attr_dev(a, "href", a_href_value);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(a);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block$c.name,
		type: "each",
		source: "(101:8) {#each pvpokeLinks as link}",
		ctx
	});

	return block;
}

// (110:6) <Details type="pm_family">
function create_default_slot_1$7(ctx) {
	let summary;
	let t1;
	let div1;
	let t2;
	let div0;
	let label0;
	let input0;
	let t3;
	let t4;
	let br;
	let t5;
	let label1;
	let input1;
	let t6;
	let div1_style_value;
	let current;
	let dispose;

	const family = new Family({
			props: { pm: /*pm*/ ctx[0] },
			$$inline: true
		});

	const block = {
		c: function create() {
			summary = element("summary");
			summary.textContent = "演化分支";
			t1 = space();
			div1 = element("div");
			create_component(family.$$.fragment);
			t2 = space();
			div0 = element("div");
			label0 = element("label");
			input0 = element("input");
			t3 = text("\n              大圖");
			t4 = space();
			br = element("br");
			t5 = space();
			label1 = element("label");
			input1 = element("input");
			t6 = text("\n              異色");
			add_location(summary, file$n, 110, 8, 2491);
			attr_dev(input0, "type", "checkbox");
			add_location(input0, file$n, 115, 14, 2748);
			attr_dev(label0, "class", "label");
			add_location(label0, file$n, 114, 12, 2712);
			add_location(br, file$n, 118, 12, 2862);
			attr_dev(input1, "type", "checkbox");
			add_location(input1, file$n, 120, 14, 2915);
			attr_dev(label1, "class", "label");
			add_location(label1, file$n, 119, 12, 2879);
			attr_dev(div0, "class", "avatar-ctrl fz-s svelte-ljcpng");
			add_location(div0, file$n, 113, 10, 2669);
			attr_dev(div1, "class", "mb-4 pos-r");
			attr_dev(div1, "style", div1_style_value = "--uid-bdw-" + /*pm*/ ctx[0].uid + ": 1px; --zoom-ratio: " + (/*$settings*/ ctx[5].io.largeAvatar ? 2 : 1));
			add_location(div1, file$n, 111, 8, 2523);
		},
		m: function mount(target, anchor) {
			insert_dev(target, summary, anchor);
			insert_dev(target, t1, anchor);
			insert_dev(target, div1, anchor);
			mount_component(family, div1, null);
			append_dev(div1, t2);
			append_dev(div1, div0);
			append_dev(div0, label0);
			append_dev(label0, input0);
			input0.checked = /*$settings*/ ctx[5].io.largeAvatar;
			append_dev(label0, t3);
			append_dev(div0, t4);
			append_dev(div0, br);
			append_dev(div0, t5);
			append_dev(div0, label1);
			append_dev(label1, input1);
			input1.checked = /*$settings*/ ctx[5].io.shinyAvatar;
			append_dev(label1, t6);
			current = true;

			dispose = [
				listen_dev(input0, "change", /*input0_change_handler*/ ctx[9]),
				listen_dev(input1, "change", /*input1_change_handler*/ ctx[10])
			];
		},
		p: function update(ctx, dirty) {
			const family_changes = {};
			if (dirty & /*pm*/ 1) family_changes.pm = /*pm*/ ctx[0];
			family.$set(family_changes);

			if (dirty & /*$settings*/ 32) {
				input0.checked = /*$settings*/ ctx[5].io.largeAvatar;
			}

			if (dirty & /*$settings*/ 32) {
				input1.checked = /*$settings*/ ctx[5].io.shinyAvatar;
			}

			if (!current || dirty & /*pm, $settings*/ 33 && div1_style_value !== (div1_style_value = "--uid-bdw-" + /*pm*/ ctx[0].uid + ": 1px; --zoom-ratio: " + (/*$settings*/ ctx[5].io.largeAvatar ? 2 : 1))) {
				attr_dev(div1, "style", div1_style_value);
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(family.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(family.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(summary);
			if (detaching) detach_dev(t1);
			if (detaching) detach_dev(div1);
			destroy_component(family);
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot_1$7.name,
		type: "slot",
		source: "(110:6) <Details type=\\\"pm_family\\\">",
		ctx
	});

	return block;
}

// (128:6) <Details type="meta_info">
function create_default_slot$b(ctx) {
	let summary;
	let t1;
	let table;
	let tr0;
	let td0;
	let t3;
	let td1;
	let t4_value = fixNum(/*pm*/ ctx[0].captureRate * 100) + "";
	let t4;
	let t5;
	let t6;
	let tr1;
	let td2;
	let t8;
	let td3;
	let t9_value = fixNum(/*pm*/ ctx[0].fleeRate * 100) + "";
	let t9;
	let t10;
	let t11;
	let tr2;
	let td4;
	let t13;
	let td5;
	let t14_value = /*pm*/ ctx[0].buddyKm + "";
	let t14;
	let t15;
	let t16;
	let tr3;
	let td6;
	let t18;
	let td7;
	let t19_value = fixNum(/*pm*/ ctx[0].captureRate * 100) + "";
	let t19;
	let t20;
	let t21;
	let tr4;
	let td8;
	let t22;
	let t23;
	let t24;

	const block = {
		c: function create() {
			summary = element("summary");
			summary.textContent = "基礎資訊";
			t1 = space();
			table = element("table");
			tr0 = element("tr");
			td0 = element("td");
			td0.textContent = "基礎捕捉率";
			t3 = space();
			td1 = element("td");
			t4 = text(t4_value);
			t5 = text("%");
			t6 = space();
			tr1 = element("tr");
			td2 = element("td");
			td2.textContent = "基礎逃跑率";
			t8 = space();
			td3 = element("td");
			t9 = text(t9_value);
			t10 = text("%");
			t11 = space();
			tr2 = element("tr");
			td4 = element("td");
			td4.textContent = "夥伴遛糖距離";
			t13 = space();
			td5 = element("td");
			t14 = text(t14_value);
			t15 = text("km");
			t16 = space();
			tr3 = element("tr");
			td6 = element("td");
			td6.textContent = "基礎捕捉率";
			t18 = space();
			td7 = element("td");
			t19 = text(t19_value);
			t20 = text("%");
			t21 = space();
			tr4 = element("tr");
			td8 = element("td");
			t22 = text("性別比 ♂ ");
			t23 = text(/*genderText*/ ctx[4]);
			t24 = text(" ♀");
			add_location(summary, file$n, 128, 8, 3108);
			add_location(td0, file$n, 131, 12, 3193);
			add_location(td1, file$n, 132, 12, 3220);
			add_location(tr0, file$n, 130, 10, 3176);
			add_location(td2, file$n, 135, 12, 3304);
			add_location(td3, file$n, 136, 12, 3331);
			add_location(tr1, file$n, 134, 10, 3287);
			add_location(td4, file$n, 139, 12, 3412);
			add_location(td5, file$n, 140, 12, 3440);
			add_location(tr2, file$n, 138, 10, 3395);
			add_location(td6, file$n, 143, 12, 3507);
			add_location(td7, file$n, 144, 12, 3534);
			add_location(tr3, file$n, 142, 10, 3490);
			attr_dev(td8, "colspan", "2");
			add_location(td8, file$n, 147, 12, 3618);
			add_location(tr4, file$n, 146, 10, 3601);
			attr_dev(table, "class", "ml-a mr-a");
			add_location(table, file$n, 129, 8, 3140);
		},
		m: function mount(target, anchor) {
			insert_dev(target, summary, anchor);
			insert_dev(target, t1, anchor);
			insert_dev(target, table, anchor);
			append_dev(table, tr0);
			append_dev(tr0, td0);
			append_dev(tr0, t3);
			append_dev(tr0, td1);
			append_dev(td1, t4);
			append_dev(td1, t5);
			append_dev(table, t6);
			append_dev(table, tr1);
			append_dev(tr1, td2);
			append_dev(tr1, t8);
			append_dev(tr1, td3);
			append_dev(td3, t9);
			append_dev(td3, t10);
			append_dev(table, t11);
			append_dev(table, tr2);
			append_dev(tr2, td4);
			append_dev(tr2, t13);
			append_dev(tr2, td5);
			append_dev(td5, t14);
			append_dev(td5, t15);
			append_dev(table, t16);
			append_dev(table, tr3);
			append_dev(tr3, td6);
			append_dev(tr3, t18);
			append_dev(tr3, td7);
			append_dev(td7, t19);
			append_dev(td7, t20);
			append_dev(table, t21);
			append_dev(table, tr4);
			append_dev(tr4, td8);
			append_dev(td8, t22);
			append_dev(td8, t23);
			append_dev(td8, t24);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*pm*/ 1 && t4_value !== (t4_value = fixNum(/*pm*/ ctx[0].captureRate * 100) + "")) set_data_dev(t4, t4_value);
			if (dirty & /*pm*/ 1 && t9_value !== (t9_value = fixNum(/*pm*/ ctx[0].fleeRate * 100) + "")) set_data_dev(t9, t9_value);
			if (dirty & /*pm*/ 1 && t14_value !== (t14_value = /*pm*/ ctx[0].buddyKm + "")) set_data_dev(t14, t14_value);
			if (dirty & /*pm*/ 1 && t19_value !== (t19_value = fixNum(/*pm*/ ctx[0].captureRate * 100) + "")) set_data_dev(t19, t19_value);
			if (dirty & /*genderText*/ 16) set_data_dev(t23, /*genderText*/ ctx[4]);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(summary);
			if (detaching) detach_dev(t1);
			if (detaching) detach_dev(table);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot$b.name,
		type: "slot",
		source: "(128:6) <Details type=\\\"meta_info\\\">",
		ctx
	});

	return block;
}

function create_fragment$o(ctx) {
	let title_value;
	let t;
	let if_block_anchor;
	let current;
	document.title = title_value = /*pm*/ ctx[0] && `#${/*pm*/ ctx[0].dex} ${/*pm*/ ctx[0].name}` || "";
	let if_block = /*pm*/ ctx[0] && create_if_block$8(ctx);

	const block = {
		c: function create() {
			t = space();
			if (if_block) if_block.c();
			if_block_anchor = empty();
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, t, anchor);
			if (if_block) if_block.m(target, anchor);
			insert_dev(target, if_block_anchor, anchor);
			current = true;
		},
		p: function update(ctx, [dirty]) {
			if ((!current || dirty & /*pm*/ 1) && title_value !== (title_value = /*pm*/ ctx[0] && `#${/*pm*/ ctx[0].dex} ${/*pm*/ ctx[0].name}` || "")) {
				document.title = title_value;
			}

			if (/*pm*/ ctx[0]) {
				if (if_block) {
					if_block.p(ctx, dirty);
					transition_in(if_block, 1);
				} else {
					if_block = create_if_block$8(ctx);
					if_block.c();
					transition_in(if_block, 1);
					if_block.m(if_block_anchor.parentNode, if_block_anchor);
				}
			} else if (if_block) {
				group_outros();

				transition_out(if_block, 1, 1, () => {
					if_block = null;
				});

				check_outros();
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(if_block);
			current = true;
		},
		o: function outro(local) {
			transition_out(if_block);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(t);
			if (if_block) if_block.d(detaching);
			if (detaching) detach_dev(if_block_anchor);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$o.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$n($$self, $$props, $$invalidate) {
	let $pokemons;
	let $settings;
	validate_store(pokemons, "pokemons");
	component_subscribe($$self, pokemons, $$value => $$invalidate(8, $pokemons = $$value));
	validate_store(settings, "settings");
	component_subscribe($$self, settings, $$value => $$invalidate(5, $settings = $$value));
	let { params = {} } = $$props;
	let pm;
	let ads;
	let nextPm;
	let prevPm;
	let genderText;

	let pvpokeLinks = [
		{ cp: 1500, title: "超級" },
		{ cp: 2500, title: "高級" },
		{ cp: 10000, title: "大師" }
	];

	const writable_props = ["params"];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<PokemonPage> was created with unknown prop '${key}'`);
	});

	function input0_change_handler() {
		$settings.io.largeAvatar = this.checked;
		settings.set($settings);
	}

	function input1_change_handler() {
		$settings.io.shinyAvatar = this.checked;
		settings.set($settings);
	}

	$$self.$set = $$props => {
		if ("params" in $$props) $$invalidate(7, params = $$props.params);
	};

	$$self.$capture_state = () => {
		return {
			params,
			pm,
			ads,
			nextPm,
			prevPm,
			genderText,
			pvpokeLinks,
			$pokemons,
			$settings
		};
	};

	$$self.$inject_state = $$props => {
		if ("params" in $$props) $$invalidate(7, params = $$props.params);
		if ("pm" in $$props) $$invalidate(0, pm = $$props.pm);
		if ("ads" in $$props) $$invalidate(1, ads = $$props.ads);
		if ("nextPm" in $$props) $$invalidate(2, nextPm = $$props.nextPm);
		if ("prevPm" in $$props) $$invalidate(3, prevPm = $$props.prevPm);
		if ("genderText" in $$props) $$invalidate(4, genderText = $$props.genderText);
		if ("pvpokeLinks" in $$props) $$invalidate(6, pvpokeLinks = $$props.pvpokeLinks);
		if ("$pokemons" in $$props) pokemons.set($pokemons = $$props.$pokemons);
		if ("$settings" in $$props) settings.set($settings = $$props.$settings);
	};

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*$pokemons, params, pm*/ 385) {
			 {
				if ($pokemons.length) {
					let idx = $pokemons.findIndex(pm => pm.uid === params.uid);

					if (idx === -1) {
						idx = 0;
					}

					$$invalidate(0, pm = $pokemons[idx]);
					$$invalidate(1, ads = { atk: pm._atk, def: pm._def, sta: pm._sta });
					let prevIdx = idx > 0 ? idx - 1 : $pokemons.length - 1;
					let nextIdx = idx < $pokemons.length - 2 ? idx + 1 : 0;
					$$invalidate(3, prevPm = $pokemons[prevIdx]);
					$$invalidate(2, nextPm = $pokemons[nextIdx]);
					$$invalidate(4, genderText = pm.genderMF.map(i => `${i}%`).join(" : "));

					if (pm.genderMF[0] === 0 && pm.genderMF[1] === 0) {
						$$invalidate(4, genderText = "--");
					}
				}
			}
		}
	};

	return [
		pm,
		ads,
		nextPm,
		prevPm,
		genderText,
		$settings,
		pvpokeLinks,
		params,
		$pokemons,
		input0_change_handler,
		input1_change_handler
	];
}

class PokemonPage extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance$n, create_fragment$o, safe_not_equal, { params: 7 });

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "PokemonPage",
			options,
			id: create_fragment$o.name
		});
	}

	get params() {
		throw new Error("<PokemonPage>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set params(value) {
		throw new Error("<PokemonPage>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* ./src/components/TypeTable.html generated by Svelte v3.18.1 */
const file$o = "./src/components/TypeTable.html";

function get_each_context_1$8(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[3] = list[i];
	return child_ctx;
}

function get_each_context$d(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[0] = list[i];
	child_ctx[2] = i;
	return child_ctx;
}

function get_each_context_2$3(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[6] = list[i];
	return child_ctx;
}

// (17:6) {#each types as def_type}
function create_each_block_2$3(ctx) {
	let td;
	let t;
	let current;

	const typeicon = new TypeIcon({
			props: { type: /*def_type*/ ctx[6] },
			$$inline: true
		});

	const block = {
		c: function create() {
			td = element("td");
			create_component(typeicon.$$.fragment);
			t = space();
			attr_dev(td, "class", "svelte-e1c3h8");
			add_location(td, file$o, 17, 8, 363);
		},
		m: function mount(target, anchor) {
			insert_dev(target, td, anchor);
			mount_component(typeicon, td, null);
			append_dev(td, t);
			current = true;
		},
		p: noop,
		i: function intro(local) {
			if (current) return;
			transition_in(typeicon.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(typeicon.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(td);
			destroy_component(typeicon);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block_2$3.name,
		type: "each",
		source: "(17:6) {#each types as def_type}",
		ctx
	});

	return block;
}

// (29:8) {#each atk_factors as atk_factor}
function create_each_block_1$8(ctx) {
	let td;
	let t_value = /*atk_factor*/ ctx[3] + "";
	let t;
	let td_data_factor_value;

	const block = {
		c: function create() {
			td = element("td");
			t = text(t_value);
			attr_dev(td, "class", "factor svelte-e1c3h8");
			attr_dev(td, "data-factor", td_data_factor_value = /*atk_factor*/ ctx[3]);
			add_location(td, file$o, 29, 10, 623);
		},
		m: function mount(target, anchor) {
			insert_dev(target, td, anchor);
			append_dev(td, t);
		},
		p: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(td);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block_1$8.name,
		type: "each",
		source: "(29:8) {#each atk_factors as atk_factor}",
		ctx
	});

	return block;
}

// (24:4) {#each effAttckTable as atk_factors, idx}
function create_each_block$d(ctx) {
	let tr;
	let td;
	let t0;
	let t1;
	let current;

	const typeicon = new TypeIcon({
			props: { type: types[/*idx*/ ctx[2]] },
			$$inline: true
		});

	let each_value_1 = /*atk_factors*/ ctx[0];
	let each_blocks = [];

	for (let i = 0; i < each_value_1.length; i += 1) {
		each_blocks[i] = create_each_block_1$8(get_each_context_1$8(ctx, each_value_1, i));
	}

	const block = {
		c: function create() {
			tr = element("tr");
			td = element("td");
			create_component(typeicon.$$.fragment);
			t0 = space();

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			t1 = space();
			attr_dev(td, "class", "svelte-e1c3h8");
			add_location(td, file$o, 25, 8, 511);
			attr_dev(tr, "class", "svelte-e1c3h8");
			add_location(tr, file$o, 24, 6, 498);
		},
		m: function mount(target, anchor) {
			insert_dev(target, tr, anchor);
			append_dev(tr, td);
			mount_component(typeicon, td, null);
			append_dev(tr, t0);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(tr, null);
			}

			append_dev(tr, t1);
			current = true;
		},
		p: function update(ctx, dirty) {
			if (dirty & /*effAttckTable*/ 0) {
				each_value_1 = /*atk_factors*/ ctx[0];
				let i;

				for (i = 0; i < each_value_1.length; i += 1) {
					const child_ctx = get_each_context_1$8(ctx, each_value_1, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block_1$8(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(tr, t1);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value_1.length;
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(typeicon.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(typeicon.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(tr);
			destroy_component(typeicon);
			destroy_each(each_blocks, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block$d.name,
		type: "each",
		source: "(24:4) {#each effAttckTable as atk_factors, idx}",
		ctx
	});

	return block;
}

// (9:0) <Details class="card" type="type_table">
function create_default_slot$c(ctx) {
	let summary;
	let h3;
	let t1;
	let table;
	let tr;
	let td;
	let t3;
	let t4;
	let t5;
	let div;
	let span0;
	let t6;
	let span1;
	let t7;
	let span2;
	let t8;
	let current;
	let each_value_2 = types;
	let each_blocks_1 = [];

	for (let i = 0; i < each_value_2.length; i += 1) {
		each_blocks_1[i] = create_each_block_2$3(get_each_context_2$3(ctx, each_value_2, i));
	}

	const out = i => transition_out(each_blocks_1[i], 1, 1, () => {
		each_blocks_1[i] = null;
	});

	let each_value = effAttckTable;
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block$d(get_each_context$d(ctx, each_value, i));
	}

	const out_1 = i => transition_out(each_blocks[i], 1, 1, () => {
		each_blocks[i] = null;
	});

	const block = {
		c: function create() {
			summary = element("summary");
			h3 = element("h3");
			h3.textContent = "Type Effect";
			t1 = space();
			table = element("table");
			tr = element("tr");
			td = element("td");
			td.textContent = "=>";
			t3 = space();

			for (let i = 0; i < each_blocks_1.length; i += 1) {
				each_blocks_1[i].c();
			}

			t4 = space();

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			t5 = space();
			div = element("div");
			span0 = element("span");
			t6 = text(" x1.6\n    ");
			span1 = element("span");
			t7 = text(" x0.625\n    ");
			span2 = element("span");
			t8 = text(" x0.39");
			add_location(h3, file$o, 10, 4, 215);
			add_location(summary, file$o, 9, 2, 201);
			attr_dev(td, "class", "svelte-e1c3h8");
			add_location(td, file$o, 15, 6, 311);
			attr_dev(tr, "class", "svelte-e1c3h8");
			add_location(tr, file$o, 14, 4, 300);
			attr_dev(table, "class", "factor-table ml-a mr-a mb-5 svelte-e1c3h8");
			add_location(table, file$o, 13, 2, 252);
			attr_dev(span0, "class", "factor factor-label      mr-1 svelte-e1c3h8");
			attr_dev(span0, "data-factor", "1");
			add_location(span0, file$o, 36, 4, 777);
			attr_dev(span1, "class", "factor factor-label ml-6 mr-1 svelte-e1c3h8");
			attr_dev(span1, "data-factor", "-1");
			add_location(span1, file$o, 37, 4, 854);
			attr_dev(span2, "class", "factor factor-label ml-6 mr-1 svelte-e1c3h8");
			attr_dev(span2, "data-factor", "-2");
			add_location(span2, file$o, 38, 4, 934);
			attr_dev(div, "class", "df flex-center fz-s");
			add_location(div, file$o, 35, 2, 739);
		},
		m: function mount(target, anchor) {
			insert_dev(target, summary, anchor);
			append_dev(summary, h3);
			insert_dev(target, t1, anchor);
			insert_dev(target, table, anchor);
			append_dev(table, tr);
			append_dev(tr, td);
			append_dev(tr, t3);

			for (let i = 0; i < each_blocks_1.length; i += 1) {
				each_blocks_1[i].m(tr, null);
			}

			append_dev(table, t4);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(table, null);
			}

			insert_dev(target, t5, anchor);
			insert_dev(target, div, anchor);
			append_dev(div, span0);
			append_dev(div, t6);
			append_dev(div, span1);
			append_dev(div, t7);
			append_dev(div, span2);
			append_dev(div, t8);
			current = true;
		},
		p: function update(ctx, dirty) {
			if (dirty & /*types*/ 0) {
				each_value_2 = types;
				let i;

				for (i = 0; i < each_value_2.length; i += 1) {
					const child_ctx = get_each_context_2$3(ctx, each_value_2, i);

					if (each_blocks_1[i]) {
						each_blocks_1[i].p(child_ctx, dirty);
						transition_in(each_blocks_1[i], 1);
					} else {
						each_blocks_1[i] = create_each_block_2$3(child_ctx);
						each_blocks_1[i].c();
						transition_in(each_blocks_1[i], 1);
						each_blocks_1[i].m(tr, null);
					}
				}

				group_outros();

				for (i = each_value_2.length; i < each_blocks_1.length; i += 1) {
					out(i);
				}

				check_outros();
			}

			if (dirty & /*effAttckTable, types*/ 0) {
				each_value = effAttckTable;
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context$d(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
						transition_in(each_blocks[i], 1);
					} else {
						each_blocks[i] = create_each_block$d(child_ctx);
						each_blocks[i].c();
						transition_in(each_blocks[i], 1);
						each_blocks[i].m(table, null);
					}
				}

				group_outros();

				for (i = each_value.length; i < each_blocks.length; i += 1) {
					out_1(i);
				}

				check_outros();
			}
		},
		i: function intro(local) {
			if (current) return;

			for (let i = 0; i < each_value_2.length; i += 1) {
				transition_in(each_blocks_1[i]);
			}

			for (let i = 0; i < each_value.length; i += 1) {
				transition_in(each_blocks[i]);
			}

			current = true;
		},
		o: function outro(local) {
			each_blocks_1 = each_blocks_1.filter(Boolean);

			for (let i = 0; i < each_blocks_1.length; i += 1) {
				transition_out(each_blocks_1[i]);
			}

			each_blocks = each_blocks.filter(Boolean);

			for (let i = 0; i < each_blocks.length; i += 1) {
				transition_out(each_blocks[i]);
			}

			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(summary);
			if (detaching) detach_dev(t1);
			if (detaching) detach_dev(table);
			destroy_each(each_blocks_1, detaching);
			destroy_each(each_blocks, detaching);
			if (detaching) detach_dev(t5);
			if (detaching) detach_dev(div);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot$c.name,
		type: "slot",
		source: "(9:0) <Details class=\\\"card\\\" type=\\\"type_table\\\">",
		ctx
	});

	return block;
}

function create_fragment$p(ctx) {
	let current;

	const details = new Details({
			props: {
				class: "card",
				type: "type_table",
				$$slots: { default: [create_default_slot$c] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	const block = {
		c: function create() {
			create_component(details.$$.fragment);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			mount_component(details, target, anchor);
			current = true;
		},
		p: function update(ctx, [dirty]) {
			const details_changes = {};

			if (dirty & /*$$scope*/ 512) {
				details_changes.$$scope = { dirty, ctx };
			}

			details.$set(details_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(details.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(details.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(details, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$p.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

class TypeTable extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, null, create_fragment$p, safe_not_equal, {});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "TypeTable",
			options,
			id: create_fragment$p.name
		});
	}
}

// data from https://gamepress.gg/pokemongo/power-up-costs
var costTable = [
  [1, 1, 200],
  [1.5, 1, 200],
  [2, 1, 200],
  [2.5, 1, 200],
  [3, 1, 400],
  [3.5, 1, 400],
  [4, 1, 400],
  [4.5, 1, 400],
  [5, 1, 600],
  [5.5, 1, 600],
  [6, 1, 600],
  [6.5, 1, 600],
  [7, 1, 800],
  [7.5, 1, 800],
  [8, 1, 800],
  [8.5, 1, 800],
  [9, 1, 1000],
  [9.5, 1, 1000],
  [10, 1, 1000],
  [10.5, 1, 1000],
  [11, 2, 1300],
  [11.5, 2, 1300],
  [12, 2, 1300],
  [12.5, 2, 1300],
  [13, 2, 1600],
  [13.5, 2, 1600],
  [14, 2, 1600],
  [14.5, 2, 1600],
  [15, 2, 1900],
  [15.5, 2, 1900],
  [16, 2, 1900],
  [16.5, 2, 1900],
  [17, 2, 2200],
  [17.5, 2, 2200],
  [18, 2, 2200],
  [18.5, 2, 2200],
  [19, 2, 2500],
  [19.5, 2, 2500],
  [20, 2, 2500],
  [20.5, 2, 2500],
  [21, 3, 3000],
  [21.5, 3, 3000],
  [22, 3, 3000],
  [22.5, 3, 3000],
  [23, 3, 3500],
  [23.5, 3, 3500],
  [24, 3, 3500],
  [24.5, 3, 3500],
  [25, 3, 4000],
  [25.5, 3, 4000],
  [26, 4, 4000],
  [26.5, 4, 4000],
  [27, 4, 4500],
  [27.5, 4, 4500],
  [28, 4, 4500],
  [28.5, 4, 4500],
  [29, 4, 5000],
  [29.5, 4, 5000],
  [30, 4, 5000],
  [30.5, 4, 5000],
  [31, 6, 6000],
  [31.5, 6, 6000],
  [32, 6, 6000],
  [32.5, 6, 6000],
  [33, 8, 7000],
  [33.5, 8, 7000],
  [34, 8, 7000],
  [34.5, 8, 7000],
  [35, 10, 8000],
  [35.5, 10, 8000],
  [36, 10, 8000],
  [36.5, 10, 8000],
  [37, 12, 9000],
  [37.5, 12, 9000],
  [38, 12, 9000],
  [38.5, 12, 9000],
  [39, 15, 10000],
  [39.5, 15, 10000],
];

/* ./src/components/CostCalc.html generated by Svelte v3.18.1 */
const file$p = "./src/components/CostCalc.html";

// (51:0) <Details class="card" type="cost_calc">
function create_default_slot$d(ctx) {
	let summary;
	let h3;
	let t1;
	let div2;
	let table;
	let tr0;
	let td0;
	let input0;
	let input0_updating = false;
	let t2;
	let td1;
	let input1;
	let t3;
	let tr1;
	let td2;
	let input2;
	let input2_updating = false;
	let t4;
	let td3;
	let input3;
	let t5;
	let tr2;
	let td4;
	let t6;
	let div0;
	let t7;
	let t8_value = /*ratio*/ ctx[6].candy + "";
	let t8;
	let t9;
	let td5;
	let t10_value = /*cost*/ ctx[2].candy + "";
	let t10;
	let t11;
	let tr3;
	let td6;
	let t12;
	let div1;
	let t13;
	let t14_value = /*ratio*/ ctx[6].dust + "";
	let t14;
	let t15;
	let td7;
	let t16_value = /*cost*/ ctx[2].dust + "";
	let t16;
	let t17;
	let tr4;
	let td8;
	let t18;
	let td9;
	let label0;
	let input4;
	let t19;
	let t20;
	let label1;
	let input5;
	let t21;
	let t22;
	let label2;
	let input6;
	let input6_disabled_value;
	let t23;
	let dispose;

	function input0_input_handler() {
		input0_updating = true;
		/*input0_input_handler*/ ctx[8].call(input0);
	}

	function input2_input_handler() {
		input2_updating = true;
		/*input2_input_handler*/ ctx[10].call(input2);
	}

	const block = {
		c: function create() {
			summary = element("summary");
			h3 = element("h3");
			h3.textContent = "Power-UP Level Cost";
			t1 = space();
			div2 = element("div");
			table = element("table");
			tr0 = element("tr");
			td0 = element("td");
			input0 = element("input");
			t2 = space();
			td1 = element("td");
			input1 = element("input");
			t3 = space();
			tr1 = element("tr");
			td2 = element("td");
			input2 = element("input");
			t4 = space();
			td3 = element("td");
			input3 = element("input");
			t5 = space();
			tr2 = element("tr");
			td4 = element("td");
			t6 = text("糖果\n          ");
			div0 = element("div");
			t7 = text("x");
			t8 = text(t8_value);
			t9 = space();
			td5 = element("td");
			t10 = text(t10_value);
			t11 = space();
			tr3 = element("tr");
			td6 = element("td");
			t12 = text("星塵\n          ");
			div1 = element("div");
			t13 = text("x");
			t14 = text(t14_value);
			t15 = space();
			td7 = element("td");
			t16 = text(t16_value);
			t17 = space();
			tr4 = element("tr");
			td8 = element("td");
			t18 = space();
			td9 = element("td");
			label0 = element("label");
			input4 = element("input");
			t19 = text("\n            is Lucky?");
			t20 = space();
			label1 = element("label");
			input5 = element("input");
			t21 = text("\n            is Purified?");
			t22 = space();
			label2 = element("label");
			input6 = element("input");
			t23 = text("\n            is Shadow?");
			add_location(h3, file$p, 52, 4, 1017);
			add_location(summary, file$p, 51, 2, 1003);
			attr_dev(input0, "type", "number");
			attr_dev(input0, "max", "40");
			attr_dev(input0, "min", "1");
			attr_dev(input0, "step", "0.5");
			add_location(input0, file$p, 59, 10, 1151);
			attr_dev(td0, "class", "text-right");
			add_location(td0, file$p, 58, 8, 1117);
			attr_dev(input1, "type", "range");
			attr_dev(input1, "max", "40");
			attr_dev(input1, "min", "1");
			attr_dev(input1, "step", "0.5");
			add_location(input1, file$p, 65, 10, 1295);
			add_location(td1, file$p, 64, 8, 1280);
			add_location(tr0, file$p, 57, 6, 1104);
			attr_dev(input2, "type", "number");
			attr_dev(input2, "max", "40");
			attr_dev(input2, "min", "1");
			attr_dev(input2, "step", "0.5");
			add_location(input2, file$p, 74, 10, 1481);
			attr_dev(td2, "class", "text-right");
			add_location(td2, file$p, 73, 8, 1447);
			attr_dev(input3, "type", "range");
			attr_dev(input3, "max", "40");
			attr_dev(input3, "min", "1");
			attr_dev(input3, "step", "0.5");
			add_location(input3, file$p, 80, 10, 1623);
			add_location(td3, file$p, 79, 8, 1608);
			add_location(tr1, file$p, 72, 6, 1434);
			attr_dev(div0, "class", "cost-ratio d-ib text-left fz-s svelte-tctgw0");
			add_location(div0, file$p, 90, 10, 1831);
			attr_dev(td4, "class", "cost-title text-right");
			add_location(td4, file$p, 88, 8, 1773);
			add_location(td5, file$p, 92, 8, 1918);
			add_location(tr2, file$p, 87, 6, 1760);
			attr_dev(div1, "class", "cost-ratio d-ib text-left fz-s svelte-tctgw0");
			add_location(div1, file$p, 99, 10, 2049);
			attr_dev(td6, "class", "cost-title text-right");
			add_location(td6, file$p, 97, 8, 1991);
			add_location(td7, file$p, 101, 8, 2135);
			add_location(tr3, file$p, 96, 6, 1978);
			add_location(td8, file$p, 107, 8, 2208);
			attr_dev(input4, "type", "checkbox");
			attr_dev(input4, "class", "mb-0");
			input4.disabled = /*isShadow*/ ctx[5];
			add_location(input4, file$p, 111, 12, 2291);
			attr_dev(label0, "class", "df ai-c pt-1");
			add_location(label0, file$p, 110, 10, 2250);
			attr_dev(input5, "type", "checkbox");
			attr_dev(input5, "class", "mb-0");
			input5.disabled = /*isShadow*/ ctx[5];
			add_location(input5, file$p, 119, 12, 2506);
			attr_dev(label1, "class", "df ai-c pt-1");
			add_location(label1, file$p, 118, 10, 2465);
			attr_dev(input6, "type", "checkbox");
			attr_dev(input6, "class", "mb-0");
			input6.disabled = input6_disabled_value = /*isPurified*/ ctx[4] || /*isLucky*/ ctx[3];
			add_location(input6, file$p, 127, 12, 2727);
			attr_dev(label2, "class", "df ai-c pt-1");
			add_location(label2, file$p, 126, 10, 2686);
			add_location(td9, file$p, 109, 8, 2235);
			add_location(tr4, file$p, 106, 6, 2195);
			attr_dev(table, "class", "ml-a mr-a");
			add_location(table, file$p, 56, 4, 1072);
			add_location(div2, file$p, 55, 2, 1062);
		},
		m: function mount(target, anchor) {
			insert_dev(target, summary, anchor);
			append_dev(summary, h3);
			insert_dev(target, t1, anchor);
			insert_dev(target, div2, anchor);
			append_dev(div2, table);
			append_dev(table, tr0);
			append_dev(tr0, td0);
			append_dev(td0, input0);
			set_input_value(input0, /*lvStart*/ ctx[0]);
			append_dev(tr0, t2);
			append_dev(tr0, td1);
			append_dev(td1, input1);
			set_input_value(input1, /*lvStart*/ ctx[0]);
			append_dev(table, t3);
			append_dev(table, tr1);
			append_dev(tr1, td2);
			append_dev(td2, input2);
			set_input_value(input2, /*lvEnd*/ ctx[1]);
			append_dev(tr1, t4);
			append_dev(tr1, td3);
			append_dev(td3, input3);
			set_input_value(input3, /*lvEnd*/ ctx[1]);
			append_dev(table, t5);
			append_dev(table, tr2);
			append_dev(tr2, td4);
			append_dev(td4, t6);
			append_dev(td4, div0);
			append_dev(div0, t7);
			append_dev(div0, t8);
			append_dev(tr2, t9);
			append_dev(tr2, td5);
			append_dev(td5, t10);
			append_dev(table, t11);
			append_dev(table, tr3);
			append_dev(tr3, td6);
			append_dev(td6, t12);
			append_dev(td6, div1);
			append_dev(div1, t13);
			append_dev(div1, t14);
			append_dev(tr3, t15);
			append_dev(tr3, td7);
			append_dev(td7, t16);
			append_dev(table, t17);
			append_dev(table, tr4);
			append_dev(tr4, td8);
			append_dev(tr4, t18);
			append_dev(tr4, td9);
			append_dev(td9, label0);
			append_dev(label0, input4);
			input4.checked = /*isLucky*/ ctx[3];
			append_dev(label0, t19);
			append_dev(td9, t20);
			append_dev(td9, label1);
			append_dev(label1, input5);
			input5.checked = /*isPurified*/ ctx[4];
			append_dev(label1, t21);
			append_dev(td9, t22);
			append_dev(td9, label2);
			append_dev(label2, input6);
			input6.checked = /*isShadow*/ ctx[5];
			append_dev(label2, t23);

			dispose = [
				listen_dev(input0, "input", input0_input_handler),
				listen_dev(input1, "change", /*input1_change_input_handler*/ ctx[9]),
				listen_dev(input1, "input", /*input1_change_input_handler*/ ctx[9]),
				listen_dev(input2, "input", input2_input_handler),
				listen_dev(input3, "change", /*input3_change_input_handler*/ ctx[11]),
				listen_dev(input3, "input", /*input3_change_input_handler*/ ctx[11]),
				listen_dev(input4, "change", /*input4_change_handler*/ ctx[12]),
				listen_dev(input5, "change", /*input5_change_handler*/ ctx[13]),
				listen_dev(input6, "change", /*input6_change_handler*/ ctx[14])
			];
		},
		p: function update(ctx, dirty) {
			if (!input0_updating && dirty & /*lvStart*/ 1) {
				set_input_value(input0, /*lvStart*/ ctx[0]);
			}

			input0_updating = false;

			if (dirty & /*lvStart*/ 1) {
				set_input_value(input1, /*lvStart*/ ctx[0]);
			}

			if (!input2_updating && dirty & /*lvEnd*/ 2) {
				set_input_value(input2, /*lvEnd*/ ctx[1]);
			}

			input2_updating = false;

			if (dirty & /*lvEnd*/ 2) {
				set_input_value(input3, /*lvEnd*/ ctx[1]);
			}

			if (dirty & /*ratio*/ 64 && t8_value !== (t8_value = /*ratio*/ ctx[6].candy + "")) set_data_dev(t8, t8_value);
			if (dirty & /*cost*/ 4 && t10_value !== (t10_value = /*cost*/ ctx[2].candy + "")) set_data_dev(t10, t10_value);
			if (dirty & /*ratio*/ 64 && t14_value !== (t14_value = /*ratio*/ ctx[6].dust + "")) set_data_dev(t14, t14_value);
			if (dirty & /*cost*/ 4 && t16_value !== (t16_value = /*cost*/ ctx[2].dust + "")) set_data_dev(t16, t16_value);

			if (dirty & /*isShadow*/ 32) {
				prop_dev(input4, "disabled", /*isShadow*/ ctx[5]);
			}

			if (dirty & /*isLucky*/ 8) {
				input4.checked = /*isLucky*/ ctx[3];
			}

			if (dirty & /*isShadow*/ 32) {
				prop_dev(input5, "disabled", /*isShadow*/ ctx[5]);
			}

			if (dirty & /*isPurified*/ 16) {
				input5.checked = /*isPurified*/ ctx[4];
			}

			if (dirty & /*isPurified, isLucky*/ 24 && input6_disabled_value !== (input6_disabled_value = /*isPurified*/ ctx[4] || /*isLucky*/ ctx[3])) {
				prop_dev(input6, "disabled", input6_disabled_value);
			}

			if (dirty & /*isShadow*/ 32) {
				input6.checked = /*isShadow*/ ctx[5];
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(summary);
			if (detaching) detach_dev(t1);
			if (detaching) detach_dev(div2);
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot$d.name,
		type: "slot",
		source: "(51:0) <Details class=\\\"card\\\" type=\\\"cost_calc\\\">",
		ctx
	});

	return block;
}

function create_fragment$q(ctx) {
	let current;

	const details = new Details({
			props: {
				class: "card",
				type: "cost_calc",
				$$slots: { default: [create_default_slot$d] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	const block = {
		c: function create() {
			create_component(details.$$.fragment);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			mount_component(details, target, anchor);
			current = true;
		},
		p: function update(ctx, [dirty]) {
			const details_changes = {};

			if (dirty & /*$$scope, isPurified, isLucky, isShadow, cost, ratio, lvEnd, lvStart*/ 32895) {
				details_changes.$$scope = { dirty, ctx };
			}

			details.$set(details_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(details.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(details.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(details, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$q.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$o($$self, $$props, $$invalidate) {
	let lvStart = 20;
	let lvEnd = 40;
	let cost = { dust: 0, candy: 0 };
	let isLucky = false;
	let isPurified = false;
	let isShadow = false;
	let ratio = { dust: 1, candy: 1 };

	function calcCost(lvS, lvE) {
		[lvS, lvE] = [lvS, lvE].sort((a, b) => a - b);

		return costTable.filter(i => i[0] >= lvS && i[0] < lvE).reduce(
			(all, i) => {
				all.candy += Math.round(i[1] * ratio.candy);
				all.dust += Math.round(i[2] * ratio.dust);
				return all;
			},
			{ candy: 0, dust: 0 }
		);
	}

	function input0_input_handler() {
		lvStart = to_number(this.value);
		$$invalidate(0, lvStart);
	}

	function input1_change_input_handler() {
		lvStart = to_number(this.value);
		$$invalidate(0, lvStart);
	}

	function input2_input_handler() {
		lvEnd = to_number(this.value);
		$$invalidate(1, lvEnd);
	}

	function input3_change_input_handler() {
		lvEnd = to_number(this.value);
		$$invalidate(1, lvEnd);
	}

	function input4_change_handler() {
		isLucky = this.checked;
		$$invalidate(3, isLucky);
	}

	function input5_change_handler() {
		isPurified = this.checked;
		$$invalidate(4, isPurified);
	}

	function input6_change_handler() {
		isShadow = this.checked;
		$$invalidate(5, isShadow);
	}

	$$self.$capture_state = () => {
		return {};
	};

	$$self.$inject_state = $$props => {
		if ("lvStart" in $$props) $$invalidate(0, lvStart = $$props.lvStart);
		if ("lvEnd" in $$props) $$invalidate(1, lvEnd = $$props.lvEnd);
		if ("cost" in $$props) $$invalidate(2, cost = $$props.cost);
		if ("isLucky" in $$props) $$invalidate(3, isLucky = $$props.isLucky);
		if ("isPurified" in $$props) $$invalidate(4, isPurified = $$props.isPurified);
		if ("isShadow" in $$props) $$invalidate(5, isShadow = $$props.isShadow);
		if ("ratio" in $$props) $$invalidate(6, ratio = $$props.ratio);
	};

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*isLucky, isPurified, isShadow*/ 56) {
			 {
				$$invalidate(6, ratio.dust = 1 * (isLucky ? 0.5 : 1) * (isPurified ? 0.9 : 1) * (isShadow ? 1.2 : 1), ratio);
				$$invalidate(6, ratio.candy = 1 * (isPurified ? 0.9 : 1) * (isShadow ? 1.2 : 1), ratio);
			}
		}

		if ($$self.$$.dirty & /*ratio, lvStart, lvEnd*/ 67) {
			 {
				let result = calcCost(lvStart, lvEnd);
				$$invalidate(2, cost.dust = `${result.dust / 1000}k`, cost);
				$$invalidate(2, cost.candy = result.candy, cost);
			}
		}
	};

	return [
		lvStart,
		lvEnd,
		cost,
		isLucky,
		isPurified,
		isShadow,
		ratio,
		calcCost,
		input0_input_handler,
		input1_change_input_handler,
		input2_input_handler,
		input3_change_input_handler,
		input4_change_handler,
		input5_change_handler,
		input6_change_handler
	];
}

class CostCalc extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance$o, create_fragment$q, safe_not_equal, {});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "CostCalc",
			options,
			id: create_fragment$q.name
		});
	}
}

/* ./src/routes/Info.html generated by Svelte v3.18.1 */
const file$q = "./src/routes/Info.html";

function get_each_context$e(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[1] = list[i];
	return child_ctx;
}

function get_each_context_1$9(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[1] = list[i];
	return child_ctx;
}

function get_each_context_3$2(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[9] = list[i];
	return child_ctx;
}

function get_each_context_2$4(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[6] = list[i];
	return child_ctx;
}

// (33:10) {#each e.value as v}
function create_each_block_3$2(ctx) {
	let td;
	let t0_value = /*v*/ ctx[9] + "";
	let t0;
	let t1;
	let div;

	const block = {
		c: function create() {
			td = element("td");
			t0 = text(t0_value);
			t1 = space();
			div = element("div");
			attr_dev(div, "class", "bar svelte-162qwh3");
			set_style(div, "--h", /*v*/ ctx[9] > 1 ? /*v*/ ctx[9] - 1 : /*v*/ ctx[9]);
			add_location(div, file$q, 35, 14, 753);
			attr_dev(td, "class", "pos-r");
			add_location(td, file$q, 33, 12, 702);
		},
		m: function mount(target, anchor) {
			insert_dev(target, td, anchor);
			append_dev(td, t0);
			append_dev(td, t1);
			append_dev(td, div);
		},
		p: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(td);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block_3$2.name,
		type: "each",
		source: "(33:10) {#each e.value as v}",
		ctx
	});

	return block;
}

// (29:6) {#each pvp_eff as e}
function create_each_block_2$4(ctx) {
	let tr;
	let th;
	let t0_value = /*e*/ ctx[6].type + "";
	let t0;
	let t1;
	let t2;
	let each_value_3 = /*e*/ ctx[6].value;
	let each_blocks = [];

	for (let i = 0; i < each_value_3.length; i += 1) {
		each_blocks[i] = create_each_block_3$2(get_each_context_3$2(ctx, each_value_3, i));
	}

	const block = {
		c: function create() {
			tr = element("tr");
			th = element("th");
			t0 = text(t0_value);
			t1 = space();

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			t2 = space();
			add_location(th, file$q, 30, 10, 640);
			add_location(tr, file$q, 29, 8, 625);
		},
		m: function mount(target, anchor) {
			insert_dev(target, tr, anchor);
			append_dev(tr, th);
			append_dev(th, t0);
			append_dev(tr, t1);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(tr, null);
			}

			append_dev(tr, t2);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*pvp_eff*/ 0) {
				each_value_3 = /*e*/ ctx[6].value;
				let i;

				for (i = 0; i < each_value_3.length; i += 1) {
					const child_ctx = get_each_context_3$2(ctx, each_value_3, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block_3$2(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(tr, t2);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value_3.length;
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(tr);
			destroy_each(each_blocks, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block_2$4.name,
		type: "each",
		source: "(29:6) {#each pvp_eff as e}",
		ctx
	});

	return block;
}

// (16:0) <Details class="card" type="pvp_buff">
function create_default_slot_1$8(ctx) {
	let summary;
	let h3;
	let t1;
	let div;
	let table;
	let tr;
	let th;
	let t3;
	let td0;
	let t5;
	let td1;
	let t7;
	let td2;
	let t9;
	let td3;
	let t11;
	let each_value_2 = pvp_eff;
	let each_blocks = [];

	for (let i = 0; i < each_value_2.length; i += 1) {
		each_blocks[i] = create_each_block_2$4(get_each_context_2$4(ctx, each_value_2, i));
	}

	const block = {
		c: function create() {
			summary = element("summary");
			h3 = element("h3");
			h3.textContent = "PVP Buff / Debuff factor";
			t1 = space();
			div = element("div");
			table = element("table");
			tr = element("tr");
			th = element("th");
			th.textContent = "times";
			t3 = space();
			td0 = element("td");
			td0.textContent = "1\"";
			t5 = space();
			td1 = element("td");
			td1.textContent = "2\"";
			t7 = space();
			td2 = element("td");
			td2.textContent = "3\"";
			t9 = space();
			td3 = element("td");
			td3.textContent = "4\"";
			t11 = space();

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			add_location(h3, file$q, 17, 4, 367);
			add_location(summary, file$q, 16, 2, 353);
			add_location(th, file$q, 22, 8, 483);
			add_location(td0, file$q, 23, 8, 506);
			add_location(td1, file$q, 24, 8, 526);
			add_location(td2, file$q, 25, 8, 546);
			add_location(td3, file$q, 26, 8, 566);
			add_location(tr, file$q, 21, 6, 470);
			attr_dev(table, "class", "ml-a mr-a buff-factor svelte-162qwh3");
			add_location(table, file$q, 20, 4, 426);
			add_location(div, file$q, 19, 2, 416);
		},
		m: function mount(target, anchor) {
			insert_dev(target, summary, anchor);
			append_dev(summary, h3);
			insert_dev(target, t1, anchor);
			insert_dev(target, div, anchor);
			append_dev(div, table);
			append_dev(table, tr);
			append_dev(tr, th);
			append_dev(tr, t3);
			append_dev(tr, td0);
			append_dev(tr, t5);
			append_dev(tr, td1);
			append_dev(tr, t7);
			append_dev(tr, td2);
			append_dev(tr, t9);
			append_dev(tr, td3);
			append_dev(table, t11);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(table, null);
			}
		},
		p: function update(ctx, dirty) {
			if (dirty & /*pvp_eff*/ 0) {
				each_value_2 = pvp_eff;
				let i;

				for (i = 0; i < each_value_2.length; i += 1) {
					const child_ctx = get_each_context_2$4(ctx, each_value_2, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block_2$4(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(table, null);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value_2.length;
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(summary);
			if (detaching) detach_dev(t1);
			if (detaching) detach_dev(div);
			destroy_each(each_blocks, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot_1$8.name,
		type: "slot",
		source: "(16:0) <Details class=\\\"card\\\" type=\\\"pvp_buff\\\">",
		ctx
	});

	return block;
}

// (56:6) {#each _cpm as item}
function create_each_block_1$9(ctx) {
	let tr;
	let td0;
	let t0_value = /*item*/ ctx[1].lv + "";
	let t0;
	let t1;
	let td1;
	let t2_value = /*item*/ ctx[1].m + "";
	let t2;
	let t3;

	const block = {
		c: function create() {
			tr = element("tr");
			td0 = element("td");
			t0 = text(t0_value);
			t1 = space();
			td1 = element("td");
			t2 = text(t2_value);
			t3 = space();
			add_location(td0, file$q, 57, 8, 1165);
			add_location(td1, file$q, 58, 8, 1192);
			add_location(tr, file$q, 56, 6, 1152);
		},
		m: function mount(target, anchor) {
			insert_dev(target, tr, anchor);
			append_dev(tr, td0);
			append_dev(td0, t0);
			append_dev(tr, t1);
			append_dev(tr, td1);
			append_dev(td1, t2);
			append_dev(tr, t3);
		},
		p: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(tr);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block_1$9.name,
		type: "each",
		source: "(56:6) {#each _cpm as item}",
		ctx
	});

	return block;
}

// (66:4) {#each _cpm as item}
function create_each_block$e(ctx) {
	let div;
	let div_title_value;

	const block = {
		c: function create() {
			div = element("div");
			attr_dev(div, "class", "dot svelte-162qwh3");
			set_style(div, "--x", /*item*/ ctx[1].lv);
			set_style(div, "--y", /*item*/ ctx[1].m);
			attr_dev(div, "title", div_title_value = "lv:" + /*item*/ ctx[1].lv + " m:" + /*item*/ ctx[1].m);
			add_location(div, file$q, 66, 6, 1311);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
		},
		p: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block$e.name,
		type: "each",
		source: "(66:4) {#each _cpm as item}",
		ctx
	});

	return block;
}

// (49:0) <Details class="card" type="cpm_table">
function create_default_slot$e(ctx) {
	let summary;
	let h3;
	let t1;
	let div0;
	let table;
	let t2;
	let div1;
	let each_value_1 = /*_cpm*/ ctx[0];
	let each_blocks_1 = [];

	for (let i = 0; i < each_value_1.length; i += 1) {
		each_blocks_1[i] = create_each_block_1$9(get_each_context_1$9(ctx, each_value_1, i));
	}

	let each_value = /*_cpm*/ ctx[0];
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block$e(get_each_context$e(ctx, each_value, i));
	}

	const block = {
		c: function create() {
			summary = element("summary");
			h3 = element("h3");
			h3.textContent = "Level Multiplier (CPm)";
			t1 = space();
			div0 = element("div");
			table = element("table");

			for (let i = 0; i < each_blocks_1.length; i += 1) {
				each_blocks_1[i].c();
			}

			t2 = space();
			div1 = element("div");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			add_location(h3, file$q, 50, 4, 993);
			add_location(summary, file$q, 49, 2, 979);
			attr_dev(table, "class", "striped-table ml-a mr-a fz-s");
			add_location(table, file$q, 54, 4, 1074);
			attr_dev(div0, "class", "cpm-table mb-4 svelte-162qwh3");
			add_location(div0, file$q, 53, 2, 1041);
			attr_dev(div1, "class", "dots svelte-162qwh3");
			add_location(div1, file$q, 64, 2, 1261);
		},
		m: function mount(target, anchor) {
			insert_dev(target, summary, anchor);
			append_dev(summary, h3);
			insert_dev(target, t1, anchor);
			insert_dev(target, div0, anchor);
			append_dev(div0, table);

			for (let i = 0; i < each_blocks_1.length; i += 1) {
				each_blocks_1[i].m(table, null);
			}

			insert_dev(target, t2, anchor);
			insert_dev(target, div1, anchor);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(div1, null);
			}
		},
		p: function update(ctx, dirty) {
			if (dirty & /*_cpm*/ 1) {
				each_value_1 = /*_cpm*/ ctx[0];
				let i;

				for (i = 0; i < each_value_1.length; i += 1) {
					const child_ctx = get_each_context_1$9(ctx, each_value_1, i);

					if (each_blocks_1[i]) {
						each_blocks_1[i].p(child_ctx, dirty);
					} else {
						each_blocks_1[i] = create_each_block_1$9(child_ctx);
						each_blocks_1[i].c();
						each_blocks_1[i].m(table, null);
					}
				}

				for (; i < each_blocks_1.length; i += 1) {
					each_blocks_1[i].d(1);
				}

				each_blocks_1.length = each_value_1.length;
			}

			if (dirty & /*_cpm*/ 1) {
				each_value = /*_cpm*/ ctx[0];
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context$e(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block$e(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(div1, null);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value.length;
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(summary);
			if (detaching) detach_dev(t1);
			if (detaching) detach_dev(div0);
			destroy_each(each_blocks_1, detaching);
			if (detaching) detach_dev(t2);
			if (detaching) detach_dev(div1);
			destroy_each(each_blocks, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot$e.name,
		type: "slot",
		source: "(49:0) <Details class=\\\"card\\\" type=\\\"cpm_table\\\">",
		ctx
	});

	return block;
}

function create_fragment$r(ctx) {
	let t0;
	let t1;
	let t2;
	let current;

	const details0 = new Details({
			props: {
				class: "card",
				type: "pvp_buff",
				$$slots: { default: [create_default_slot_1$8] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	const costcalc = new CostCalc({ $$inline: true });
	const typetable = new TypeTable({ $$inline: true });

	const details1 = new Details({
			props: {
				class: "card",
				type: "cpm_table",
				$$slots: { default: [create_default_slot$e] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	const block = {
		c: function create() {
			create_component(details0.$$.fragment);
			t0 = space();
			create_component(costcalc.$$.fragment);
			t1 = space();
			create_component(typetable.$$.fragment);
			t2 = space();
			create_component(details1.$$.fragment);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			mount_component(details0, target, anchor);
			insert_dev(target, t0, anchor);
			mount_component(costcalc, target, anchor);
			insert_dev(target, t1, anchor);
			mount_component(typetable, target, anchor);
			insert_dev(target, t2, anchor);
			mount_component(details1, target, anchor);
			current = true;
		},
		p: function update(ctx, [dirty]) {
			const details0_changes = {};

			if (dirty & /*$$scope*/ 4096) {
				details0_changes.$$scope = { dirty, ctx };
			}

			details0.$set(details0_changes);
			const details1_changes = {};

			if (dirty & /*$$scope*/ 4096) {
				details1_changes.$$scope = { dirty, ctx };
			}

			details1.$set(details1_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(details0.$$.fragment, local);
			transition_in(costcalc.$$.fragment, local);
			transition_in(typetable.$$.fragment, local);
			transition_in(details1.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(details0.$$.fragment, local);
			transition_out(costcalc.$$.fragment, local);
			transition_out(typetable.$$.fragment, local);
			transition_out(details1.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(details0, detaching);
			if (detaching) detach_dev(t0);
			destroy_component(costcalc, detaching);
			if (detaching) detach_dev(t1);
			destroy_component(typetable, detaching);
			if (detaching) detach_dev(t2);
			destroy_component(details1, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$r.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$p($$self) {
	let _cpm = Object.keys(CPM).map(lv => ({ lv, m: CPM[lv] })).sort((a, b) => a.lv - b.lv);

	$$self.$capture_state = () => {
		return {};
	};

	$$self.$inject_state = $$props => {
		if ("_cpm" in $$props) $$invalidate(0, _cpm = $$props._cpm);
	};

	return [_cpm];
}

class Info extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance$p, create_fragment$r, safe_not_equal, {});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Info",
			options,
			id: create_fragment$r.name
		});
	}
}

/* ./src/components/Footer.html generated by Svelte v3.18.1 */

const file$r = "./src/components/Footer.html";

function create_fragment$s(ctx) {
	let hr0;
	let t0;
	let hr1;
	let t1;
	let hr2;
	let t2;
	let hr3;
	let t3;
	let hr4;
	let t4;
	let footer;
	let ul;
	let li0;
	let t5;
	let a0;
	let t7;
	let li1;
	let t8;
	let a1;
	let t10;
	let a2;
	let t12;
	let li2;
	let t13;
	let a3;
	let t15;
	let li3;
	let t16;
	let time;
	let t17_value = /*date*/ ctx[0].slice(0, 10) + "";
	let t17;

	const block = {
		c: function create() {
			hr0 = element("hr");
			t0 = space();
			hr1 = element("hr");
			t1 = space();
			hr2 = element("hr");
			t2 = space();
			hr3 = element("hr");
			t3 = space();
			hr4 = element("hr");
			t4 = space();
			footer = element("footer");
			ul = element("ul");
			li0 = element("li");
			t5 = text("GitHub: ");
			a0 = element("a");
			a0.textContent = "Rplus / pokedex";
			t7 = space();
			li1 = element("li");
			t8 = text("Data: ");
			a1 = element("a");
			a1.textContent = "PvPoke";
			t10 = text(" , ");
			a2 = element("a");
			a2.textContent = "PokeMiners";
			t12 = space();
			li2 = element("li");
			t13 = text("Relesed with: ");
			a3 = element("a");
			a3.textContent = "MIT license";
			t15 = space();
			li3 = element("li");
			t16 = text("update on:\n      ");
			time = element("time");
			t17 = text(t17_value);
			add_location(hr0, file$r, 6, 0, 90);
			add_location(hr1, file$r, 7, 0, 95);
			add_location(hr2, file$r, 8, 0, 100);
			add_location(hr3, file$r, 9, 0, 105);
			add_location(hr4, file$r, 10, 0, 110);
			attr_dev(a0, "href", "https://github.com/rplus/pokedex");
			attr_dev(a0, "class", "svelte-1legen6");
			add_location(a0, file$r, 15, 14, 184);
			attr_dev(li0, "class", "svelte-1legen6");
			add_location(li0, file$r, 14, 4, 165);
			attr_dev(a1, "href", "https://github.com/pvpoke/pvpoke");
			attr_dev(a1, "class", "svelte-1legen6");
			add_location(a1, file$r, 18, 12, 278);
			attr_dev(a2, "href", "https://github.com/PokeMiners/game_masters");
			attr_dev(a2, "class", "svelte-1legen6");
			add_location(a2, file$r, 18, 68, 334);
			attr_dev(li1, "class", "svelte-1legen6");
			add_location(li1, file$r, 17, 4, 261);
			attr_dev(a3, "href", "https://opensource.org/licenses/MIT");
			attr_dev(a3, "class", "svelte-1legen6");
			add_location(a3, file$r, 21, 20, 441);
			attr_dev(li2, "class", "svelte-1legen6");
			add_location(li2, file$r, 20, 4, 416);
			attr_dev(time, "class", "ff-m");
			attr_dev(time, "datetime", /*date*/ ctx[0]);
			add_location(time, file$r, 25, 6, 545);
			attr_dev(li3, "class", "svelte-1legen6");
			add_location(li3, file$r, 23, 4, 517);
			attr_dev(ul, "class", "ml-a fz-s");
			add_location(ul, file$r, 13, 2, 138);
			attr_dev(footer, "class", "df svelte-1legen6");
			add_location(footer, file$r, 12, 0, 116);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, hr0, anchor);
			insert_dev(target, t0, anchor);
			insert_dev(target, hr1, anchor);
			insert_dev(target, t1, anchor);
			insert_dev(target, hr2, anchor);
			insert_dev(target, t2, anchor);
			insert_dev(target, hr3, anchor);
			insert_dev(target, t3, anchor);
			insert_dev(target, hr4, anchor);
			insert_dev(target, t4, anchor);
			insert_dev(target, footer, anchor);
			append_dev(footer, ul);
			append_dev(ul, li0);
			append_dev(li0, t5);
			append_dev(li0, a0);
			append_dev(ul, t7);
			append_dev(ul, li1);
			append_dev(li1, t8);
			append_dev(li1, a1);
			append_dev(li1, t10);
			append_dev(li1, a2);
			append_dev(ul, t12);
			append_dev(ul, li2);
			append_dev(li2, t13);
			append_dev(li2, a3);
			append_dev(ul, t15);
			append_dev(ul, li3);
			append_dev(li3, t16);
			append_dev(li3, time);
			append_dev(time, t17);
		},
		p: noop,
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(hr0);
			if (detaching) detach_dev(t0);
			if (detaching) detach_dev(hr1);
			if (detaching) detach_dev(t1);
			if (detaching) detach_dev(hr2);
			if (detaching) detach_dev(t2);
			if (detaching) detach_dev(hr3);
			if (detaching) detach_dev(t3);
			if (detaching) detach_dev(hr4);
			if (detaching) detach_dev(t4);
			if (detaching) detach_dev(footer);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$s.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$q($$self) {
	let date = document.querySelector("meta[name=\"update\"]").content;

	$$self.$capture_state = () => {
		return {};
	};

	$$self.$inject_state = $$props => {
		if ("date" in $$props) $$invalidate(0, date = $$props.date);
	};

	return [date];
}

class Footer extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance$q, create_fragment$s, safe_not_equal, {});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Footer",
			options,
			id: create_fragment$s.name
		});
	}
}

/* ./src/components/TypeDialog.html generated by Svelte v3.18.1 */
const file$s = "./src/components/TypeDialog.html";

function get_each_context_2$5(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[9] = list[i];
	return child_ctx;
}

function get_each_context_1$a(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[6] = list[i];
	return child_ctx;
}

function get_each_context$f(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[3] = list[i];
	return child_ctx;
}

// (30:12) {#each effType as i}
function create_each_block_2$5(ctx) {
	let div;
	let div_data_type_value;
	let div_data_factor_value;
	let div_title_value;
	let dispose;

	const block = {
		c: function create() {
			div = element("div");
			attr_dev(div, "class", "type-icon svelte-gzge2n");
			attr_dev(div, "data-type", div_data_type_value = /*i*/ ctx[9].type);
			attr_dev(div, "data-factor", div_data_factor_value = /*i*/ ctx[9].factor);
			attr_dev(div, "title", div_title_value = /*i*/ ctx[9].type);
			add_location(div, file$s, 30, 14, 642);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			dispose = listen_dev(div, "click", /*changeType*/ ctx[2], false, false, false);
		},
		p: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			dispose();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block_2$5.name,
		type: "each",
		source: "(30:12) {#each effType as i}",
		ctx
	});

	return block;
}

// (28:8) {#each dataRow.effs as effType}
function create_each_block_1$a(ctx) {
	let div;
	let each_value_2 = /*effType*/ ctx[6];
	let each_blocks = [];

	for (let i = 0; i < each_value_2.length; i += 1) {
		each_blocks[i] = create_each_block_2$5(get_each_context_2$5(ctx, each_value_2, i));
	}

	const block = {
		c: function create() {
			div = element("div");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			attr_dev(div, "class", "type-panel df svelte-gzge2n");
			add_location(div, file$s, 28, 10, 567);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(div, null);
			}
		},
		p: function update(ctx, dirty) {
			if (dirty & /*eff, changeType*/ 4) {
				each_value_2 = /*effType*/ ctx[6];
				let i;

				for (i = 0; i < each_value_2.length; i += 1) {
					const child_ctx = get_each_context_2$5(ctx, each_value_2, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block_2$5(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(div, null);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value_2.length;
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			destroy_each(each_blocks, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block_1$a.name,
		type: "each",
		source: "(28:8) {#each dataRow.effs as effType}",
		ctx
	});

	return block;
}

// (22:4) {#each eff as dataRow}
function create_each_block$f(ctx) {
	let div3;
	let t0;
	let div0;
	let t1;
	let t2_value = /*dataRow*/ ctx[3].type + "";
	let t2;
	let t3;
	let t4;
	let div2;
	let div1;
	let div1_data_type_value;
	let div3_data_type_value;
	let each_value_1 = /*dataRow*/ ctx[3].effs;
	let each_blocks = [];

	for (let i = 0; i < each_value_1.length; i += 1) {
		each_blocks[i] = create_each_block_1$a(get_each_context_1$a(ctx, each_value_1, i));
	}

	const block = {
		c: function create() {
			div3 = element("div");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			t0 = space();
			div0 = element("div");
			t1 = text("/ ");
			t2 = text(t2_value);
			t3 = text(" /");
			t4 = space();
			div2 = element("div");
			div1 = element("div");
			attr_dev(div0, "class", "type-title whs-nw svelte-gzge2n");
			add_location(div0, file$s, 40, 8, 902);
			attr_dev(div1, "class", "type-icon svelte-gzge2n");
			attr_dev(div1, "data-type", div1_data_type_value = /*dataRow*/ ctx[3].type);
			add_location(div1, file$s, 42, 10, 1002);
			attr_dev(div2, "class", "type-center svelte-gzge2n");
			add_location(div2, file$s, 41, 8, 966);
			attr_dev(div3, "class", "type-chart svelte-gzge2n");
			attr_dev(div3, "data-type", div3_data_type_value = /*dataRow*/ ctx[3].type);
			toggle_class(div3, "is-show", /*$typeTarget*/ ctx[0] === /*dataRow*/ ctx[3].type);
			add_location(div3, file$s, 22, 6, 391);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div3, anchor);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(div3, null);
			}

			append_dev(div3, t0);
			append_dev(div3, div0);
			append_dev(div0, t1);
			append_dev(div0, t2);
			append_dev(div0, t3);
			append_dev(div3, t4);
			append_dev(div3, div2);
			append_dev(div2, div1);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*eff, changeType*/ 4) {
				each_value_1 = /*dataRow*/ ctx[3].effs;
				let i;

				for (i = 0; i < each_value_1.length; i += 1) {
					const child_ctx = get_each_context_1$a(ctx, each_value_1, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block_1$a(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(div3, t0);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value_1.length;
			}

			if (dirty & /*$typeTarget, eff*/ 1) {
				toggle_class(div3, "is-show", /*$typeTarget*/ ctx[0] === /*dataRow*/ ctx[3].type);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div3);
			destroy_each(each_blocks, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block$f.name,
		type: "each",
		source: "(22:4) {#each eff as dataRow}",
		ctx
	});

	return block;
}

// (20:0) <Dialog closeFn={close} hidden={!$typeTarget}>
function create_default_slot$f(ctx) {
	let div1;
	let t;
	let div0;
	let each_value = op;
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block$f(get_each_context$f(ctx, each_value, i));
	}

	const block = {
		c: function create() {
			div1 = element("div");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			t = space();
			div0 = element("div");
			attr_dev(div0, "class", "mb-0");
			add_location(div0, file$s, 46, 4, 1101);
			attr_dev(div1, "class", "card svelte-gzge2n");
			add_location(div1, file$s, 20, 2, 339);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div1, anchor);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(div1, null);
			}

			append_dev(div1, t);
			append_dev(div1, div0);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*eff, $typeTarget, changeType*/ 5) {
				each_value = op;
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context$f(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block$f(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(div1, t);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value.length;
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div1);
			destroy_each(each_blocks, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot$f.name,
		type: "slot",
		source: "(20:0) <Dialog closeFn={close} hidden={!$typeTarget}>",
		ctx
	});

	return block;
}

function create_fragment$t(ctx) {
	let current;

	const dialog = new Dialog({
			props: {
				closeFn: /*close*/ ctx[1],
				hidden: !/*$typeTarget*/ ctx[0],
				$$slots: { default: [create_default_slot$f] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	const block = {
		c: function create() {
			create_component(dialog.$$.fragment);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			mount_component(dialog, target, anchor);
			current = true;
		},
		p: function update(ctx, [dirty]) {
			const dialog_changes = {};
			if (dirty & /*$typeTarget*/ 1) dialog_changes.hidden = !/*$typeTarget*/ ctx[0];

			if (dirty & /*$$scope, $typeTarget*/ 4097) {
				dialog_changes.$$scope = { dirty, ctx };
			}

			dialog.$set(dialog_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(dialog.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(dialog.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(dialog, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$t.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$r($$self, $$props, $$invalidate) {
	let $typeTarget;
	validate_store(typeTarget, "typeTarget");
	component_subscribe($$self, typeTarget, $$value => $$invalidate(0, $typeTarget = $$value));

	function close() {
		set_store_value(typeTarget, $typeTarget = null);
	}

	function changeType(e) {
		let et = e.target.dataset.type;

		if (et !== $typeTarget) {
			set_store_value(typeTarget, $typeTarget = et);
		}
	}

	$$self.$capture_state = () => {
		return {};
	};

	$$self.$inject_state = $$props => {
		if ("$typeTarget" in $$props) typeTarget.set($typeTarget = $$props.$typeTarget);
	};

	return [$typeTarget, close, changeType];
}

class TypeDialog extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance$r, create_fragment$t, safe_not_equal, {});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "TypeDialog",
			options,
			id: create_fragment$t.name
		});
	}
}

/* ./src/components/Comments.html generated by Svelte v3.18.1 */
const file$t = "./src/components/Comments.html";

// (42:0) <Details type="comment" class="card" on:toggle={onToggle}>
function create_default_slot$g(ctx) {
	let summary;
	let h3;
	let t1;
	let div1;
	let div0;

	const block = {
		c: function create() {
			summary = element("summary");
			h3 = element("h3");
			h3.textContent = "留言";
			t1 = space();
			div1 = element("div");
			div0 = element("div");
			add_location(h3, file$t, 42, 11, 911);
			add_location(summary, file$t, 42, 2, 902);
			attr_dev(div0, "id", "disqus_thread");
			add_location(div0, file$t, 44, 4, 945);
			add_location(div1, file$t, 43, 2, 935);
		},
		m: function mount(target, anchor) {
			insert_dev(target, summary, anchor);
			append_dev(summary, h3);
			insert_dev(target, t1, anchor);
			insert_dev(target, div1, anchor);
			append_dev(div1, div0);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(summary);
			if (detaching) detach_dev(t1);
			if (detaching) detach_dev(div1);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot$g.name,
		type: "slot",
		source: "(42:0) <Details type=\\\"comment\\\" class=\\\"card\\\" on:toggle={onToggle}>",
		ctx
	});

	return block;
}

function create_fragment$u(ctx) {
	let current;

	const details = new Details({
			props: {
				type: "comment",
				class: "card",
				$$slots: { default: [create_default_slot$g] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	details.$on("toggle", /*onToggle*/ ctx[0]);

	const block = {
		c: function create() {
			create_component(details.$$.fragment);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			mount_component(details, target, anchor);
			current = true;
		},
		p: function update(ctx, [dirty]) {
			const details_changes = {};

			if (dirty & /*$$scope*/ 8) {
				details_changes.$$scope = { dirty, ctx };
			}

			details.$set(details_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(details.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(details.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(details, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$u.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$s($$self) {
	let open;

	function initDisqus(e) {
		if (!open) {
			return;
		}

		if (window.DISQUS) {
			window.DISQUS.reset({ reload: true });
			return;
		}

		(function () {
			var d = document, s = d.createElement("script");
			s.src = "https://rplus-pokedex.disqus.com/embed.js";
			s.setAttribute("data-timestamp", +new Date());
			(d.head || d.body).appendChild(s);
		})();
	}

	function onToggle(e) {
		open = e.detail.open;
		initDisqus();
	}

	onMount(() => {
		addEventListener("pushstate", initDisqus);
		addEventListener("popstate", initDisqus);
	});

	onDestroy(() => {
		removeEventListener("pushstate", initDisqus);
		removeEventListener("popstate", initDisqus);
	});

	$$self.$capture_state = () => {
		return {};
	};

	$$self.$inject_state = $$props => {
		if ("open" in $$props) open = $$props.open;
	};

	return [onToggle];
}

class Comments extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance$s, create_fragment$u, safe_not_equal, {});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Comments",
			options,
			id: create_fragment$u.name
		});
	}
}

/* ./src/components/Nav.html generated by Svelte v3.18.1 */

const file$u = "./src/components/Nav.html";

function create_fragment$v(ctx) {
	let nav;
	let ul;
	let li0;
	let a0;
	let t0;
	let a0_class_value;
	let t1;
	let li1;
	let a1;
	let t2;
	let a1_class_value;
	let t3;
	let li2;
	let a2;
	let t4;
	let a2_class_value;
	let t5;
	let li3;
	let a3;
	let t6;
	let a3_class_value;
	let t7;
	let li4;
	let a4;
	let t8;
	let a4_class_value;

	const block = {
		c: function create() {
			nav = element("nav");
			ul = element("ul");
			li0 = element("li");
			a0 = element("a");
			t0 = text("home");
			t1 = space();
			li1 = element("li");
			a1 = element("a");
			t2 = text("move");
			t3 = space();
			li2 = element("li");
			a2 = element("a");
			t4 = text("pokemon");
			t5 = space();
			li3 = element("li");
			a3 = element("a");
			t6 = text("info");
			t7 = space();
			li4 = element("li");
			a4 = element("a");
			t8 = text("about");
			attr_dev(a0, "class", a0_class_value = "" + (null_to_empty(/*isActive*/ ctx[0]("home")) + " svelte-n77jgj"));
			attr_dev(a0, "href", "./");
			add_location(a0, file$u, 2, 8, 104);
			add_location(li0, file$u, 2, 4, 100);
			attr_dev(a1, "class", a1_class_value = "" + (null_to_empty(/*isActive*/ ctx[0]("move")) + " svelte-n77jgj"));
			attr_dev(a1, "href", "./move");
			add_location(a1, file$u, 3, 8, 168);
			add_location(li1, file$u, 3, 4, 164);
			attr_dev(a2, "class", a2_class_value = "" + (null_to_empty(/*isActive*/ ctx[0]("pokemon")) + " svelte-n77jgj"));
			attr_dev(a2, "href", "./pokemon");
			add_location(a2, file$u, 4, 8, 236);
			add_location(li2, file$u, 4, 4, 232);
			attr_dev(a3, "class", a3_class_value = "" + (null_to_empty(/*isActive*/ ctx[0]("info")) + " svelte-n77jgj"));
			attr_dev(a3, "href", "./info");
			add_location(a3, file$u, 5, 8, 313);
			add_location(li3, file$u, 5, 4, 309);
			attr_dev(a4, "class", a4_class_value = "" + (null_to_empty(/*isActive*/ ctx[0]("about")) + " svelte-n77jgj"));
			attr_dev(a4, "href", "./about");
			add_location(a4, file$u, 6, 8, 381);
			add_location(li4, file$u, 6, 4, 377);
			attr_dev(ul, "class", "m-0 p-0 df no-list-style jc-c");
			add_location(ul, file$u, 1, 2, 53);
			attr_dev(nav, "class", "nav text-capitalize text-center mb-4 svelte-n77jgj");
			add_location(nav, file$u, 0, 0, 0);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, nav, anchor);
			append_dev(nav, ul);
			append_dev(ul, li0);
			append_dev(li0, a0);
			append_dev(a0, t0);
			append_dev(ul, t1);
			append_dev(ul, li1);
			append_dev(li1, a1);
			append_dev(a1, t2);
			append_dev(ul, t3);
			append_dev(ul, li2);
			append_dev(li2, a2);
			append_dev(a2, t4);
			append_dev(ul, t5);
			append_dev(ul, li3);
			append_dev(li3, a3);
			append_dev(a3, t6);
			append_dev(ul, t7);
			append_dev(ul, li4);
			append_dev(li4, a4);
			append_dev(a4, t8);
		},
		p: function update(ctx, [dirty]) {
			if (dirty & /*isActive*/ 1 && a0_class_value !== (a0_class_value = "" + (null_to_empty(/*isActive*/ ctx[0]("home")) + " svelte-n77jgj"))) {
				attr_dev(a0, "class", a0_class_value);
			}

			if (dirty & /*isActive*/ 1 && a1_class_value !== (a1_class_value = "" + (null_to_empty(/*isActive*/ ctx[0]("move")) + " svelte-n77jgj"))) {
				attr_dev(a1, "class", a1_class_value);
			}

			if (dirty & /*isActive*/ 1 && a2_class_value !== (a2_class_value = "" + (null_to_empty(/*isActive*/ ctx[0]("pokemon")) + " svelte-n77jgj"))) {
				attr_dev(a2, "class", a2_class_value);
			}

			if (dirty & /*isActive*/ 1 && a3_class_value !== (a3_class_value = "" + (null_to_empty(/*isActive*/ ctx[0]("info")) + " svelte-n77jgj"))) {
				attr_dev(a3, "class", a3_class_value);
			}

			if (dirty & /*isActive*/ 1 && a4_class_value !== (a4_class_value = "" + (null_to_empty(/*isActive*/ ctx[0]("about")) + " svelte-n77jgj"))) {
				attr_dev(a4, "class", a4_class_value);
			}
		},
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(nav);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$v.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$t($$self, $$props, $$invalidate) {
	let { active } = $$props;
	const writable_props = ["active"];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Nav> was created with unknown prop '${key}'`);
	});

	$$self.$set = $$props => {
		if ("active" in $$props) $$invalidate(1, active = $$props.active);
	};

	$$self.$capture_state = () => {
		return { active, isActive };
	};

	$$self.$inject_state = $$props => {
		if ("active" in $$props) $$invalidate(1, active = $$props.active);
		if ("isActive" in $$props) $$invalidate(0, isActive = $$props.isActive);
	};

	let isActive;

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*active*/ 2) {
			 $$invalidate(0, isActive = str => active === str ? "selected" : "");
		}
	};

	return [isActive, active];
}

class Nav extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance$t, create_fragment$v, safe_not_equal, { active: 1 });

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Nav",
			options,
			id: create_fragment$v.name
		});

		const { ctx } = this.$$;
		const props = options.props || {};

		if (/*active*/ ctx[1] === undefined && !("active" in props)) {
			console.warn("<Nav> was created without expected prop 'active'");
		}
	}

	get active() {
		throw new Error("<Nav>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set active(value) {
		throw new Error("<Nav>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* ./src/components/App.html generated by Svelte v3.18.1 */
const file$v = "./src/components/App.html";

function create_fragment$w(ctx) {
	let div;
	let t0;
	let main;
	let t1;
	let t2;
	let t3;
	let t4;
	let base;
	let current;

	const nav = new Nav({
			props: { active: /*active*/ ctx[2] },
			$$inline: true
		});

	var switch_value = /*Route*/ ctx[0];

	function switch_props(ctx) {
		return {
			props: { params: /*params*/ ctx[1] },
			$$inline: true
		};
	}

	if (switch_value) {
		var switch_instance = new switch_value(switch_props(ctx));
	}

	const comments = new Comments({ $$inline: true });
	const footer = new Footer({ $$inline: true });
	const typedialog = new TypeDialog({ $$inline: true });

	const block = {
		c: function create() {
			div = element("div");
			create_component(nav.$$.fragment);
			t0 = space();
			main = element("main");
			if (switch_instance) create_component(switch_instance.$$.fragment);
			t1 = space();
			create_component(comments.$$.fragment);
			t2 = space();
			create_component(footer.$$.fragment);
			t3 = space();
			create_component(typedialog.$$.fragment);
			t4 = space();
			base = element("base");
			add_location(main, file$v, 3, 2, 46);
			attr_dev(div, "class", "workspace");
			add_location(div, file$v, 0, 0, 0);
			attr_dev(base, "href", /*baseURI*/ ctx[3]);
			add_location(base, file$v, 14, 2, 181);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			mount_component(nav, div, null);
			append_dev(div, t0);
			append_dev(div, main);

			if (switch_instance) {
				mount_component(switch_instance, main, null);
			}

			append_dev(div, t1);
			mount_component(comments, div, null);
			append_dev(div, t2);
			mount_component(footer, div, null);
			append_dev(div, t3);
			mount_component(typedialog, div, null);
			insert_dev(target, t4, anchor);
			append_dev(document.head, base);
			current = true;
		},
		p: function update(ctx, [dirty]) {
			const nav_changes = {};
			if (dirty & /*active*/ 4) nav_changes.active = /*active*/ ctx[2];
			nav.$set(nav_changes);
			const switch_instance_changes = {};
			if (dirty & /*params*/ 2) switch_instance_changes.params = /*params*/ ctx[1];

			if (switch_value !== (switch_value = /*Route*/ ctx[0])) {
				if (switch_instance) {
					group_outros();
					const old_component = switch_instance;

					transition_out(old_component.$$.fragment, 1, 0, () => {
						destroy_component(old_component, 1);
					});

					check_outros();
				}

				if (switch_value) {
					switch_instance = new switch_value(switch_props(ctx));
					create_component(switch_instance.$$.fragment);
					transition_in(switch_instance.$$.fragment, 1);
					mount_component(switch_instance, main, null);
				} else {
					switch_instance = null;
				}
			} else if (switch_value) {
				switch_instance.$set(switch_instance_changes);
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(nav.$$.fragment, local);
			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
			transition_in(comments.$$.fragment, local);
			transition_in(footer.$$.fragment, local);
			transition_in(typedialog.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(nav.$$.fragment, local);
			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
			transition_out(comments.$$.fragment, local);
			transition_out(footer.$$.fragment, local);
			transition_out(typedialog.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			destroy_component(nav);
			if (switch_instance) destroy_component(switch_instance);
			destroy_component(comments);
			destroy_component(footer);
			destroy_component(typedialog);
			if (detaching) detach_dev(t4);
			detach_dev(base);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$w.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$u($$self, $$props, $$invalidate) {
	let $router;
	validate_store(router, "router");
	component_subscribe($$self, router, $$value => $$invalidate(5, $router = $$value));
	let Route, params, active;
	let uri = location.pathname;

	let baseURI =  "/";

	function draw(m, obj) {
		$$invalidate(1, params = obj || {});
		$$invalidate(0, Route = m);
		window.scrollTo(0, 0);
	}

	function track(obj) {
		$$invalidate(4, uri = obj.state || obj.uri || location.pathname);
		if (window.ga) ga.send("pageview", { dp: uri });
	}

	addEventListener("replacestate", track);
	addEventListener("pushstate", track);
	addEventListener("popstate", track);
	set_store_value(router, $router = Navaid(baseURI, () => draw(Home)).on("/", () => draw(Home)).on("/about", () => draw(About)).on("/move", () => draw(MoveList)).on("/move/:moveId", obj => draw(MovePage, obj)).on("/pokemon", () => draw(PokemonList)).on("/pokemon/:uid", obj => draw(PokemonPage, obj)).on("/info", () => draw(Info)).listen());
	onDestroy($router.unlisten);

	$$self.$capture_state = () => {
		return {};
	};

	$$self.$inject_state = $$props => {
		if ("Route" in $$props) $$invalidate(0, Route = $$props.Route);
		if ("params" in $$props) $$invalidate(1, params = $$props.params);
		if ("active" in $$props) $$invalidate(2, active = $$props.active);
		if ("uri" in $$props) $$invalidate(4, uri = $$props.uri);
		if ("baseURI" in $$props) $$invalidate(3, baseURI = $$props.baseURI);
		if ("$router" in $$props) router.set($router = $$props.$router);
	};

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*uri*/ 16) {
			 $$invalidate(2, active = uri.split("/")[1] || "home");
		}
	};

	return [Route, params, active, baseURI];
}

class App extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance$u, create_fragment$w, safe_not_equal, {});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "App",
			options,
			id: create_fragment$w.name
		});
	}
}

new App({
  target: document.body
});
//# sourceMappingURL=index.js.map
