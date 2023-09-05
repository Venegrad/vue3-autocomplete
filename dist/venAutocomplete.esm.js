import { defineComponent, openBlock, createElementBlock, createElementVNode, Fragment, renderList, createTextVNode, toDisplayString, withDirectives, withKeys, withModifiers, vModelText, pushScopeId, popScopeId } from 'vue';

var script = /*#__PURE__*/defineComponent({
  name: 'autocomplete',
  emits: ['update:modelValue'],
  props: {
    disabledSymobols: {
      type: String
    },
    min: {
      type: Number,
      min: 1
    },
    max: {
      type: Number,
      default: 200
    },
    minWords: {
      type: Number,
      default: 0
    },
    placeholder: {
      type: [String, Number]
    },
    aviableSpace: {
      type: Boolean,
      default: true
    },
    list: {
      type: Array,
      default: () => []
    },
    modelValue: {
      type: [Array, String, Number],
      default: () => []
    }
  },
  mounted() {},
  data() {
    return {
      inputData: null
    };
  },
  methods: {
    blurNeed() {
      this.$refs.venAutocomplete.focus();
    },
    removeLast() {
      if (this.inputData || !this.modelValue || !this.modelValue.length) return;
      this.modelValue.pop();
    },
    removeIndex(i) {
      const fst = this.modelValue.filter((el, ind) => ind !== i);
      this.$emit('update:modelValue', fst);
    },
    goEnter() {
      this.hendeHoh();
    },
    hendeHoh() {
      if (!this.inputData || this.inputData.length < this.min || this.inputData.length > this.max) return;
      this.inputData = this.inputData.replaceAll(",", "");
      if (!this.modelValue) {
        this.$emit('update:modelValue', [this.inputData]);
      } else {
        const fst = [...this.modelValue, this.inputData];
        this.$emit('update:modelValue', fst);
      }
      this.inputData = null;
    },
    goType(e) {
      // Disable symbols
      if (this.disabledSymobols) [...this.disabledSymobols].forEach(el => this.inputData = this.inputData.replaceAll(el, ""));

      // Long live if, what do u do, haha
      if ((e.data === "," || this.inputData && this.inputData.includes(",")) && /[^,]/.test(this.inputData)) {
        this.hendeHoh();
      } else if (!/[^,]/.test(this.inputData)) {
        this.inputData = null;
      }
    }
  }
});

const _withScopeId = n => (pushScopeId("data-v-4b58ed6d"), n = n(), popScopeId(), n);
const _hoisted_1 = {
  class: "venAutocomplete"
};
const _hoisted_2 = ["onClick"];
const _hoisted_3 = /*#__PURE__*/_withScopeId(() => /*#__PURE__*/createElementVNode("span", null, null, -1));
const _hoisted_4 = [_hoisted_3];
const _hoisted_5 = ["placeholder", "maxlength"];
const _hoisted_6 = /*#__PURE__*/_withScopeId(() => /*#__PURE__*/createElementVNode("div", {
  class: "venAutocomplete__dropdown"
}, null, -1));
function render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", _hoisted_1, [createElementVNode("div", {
    class: "venAutocomplete__input",
    onClick: _cache[5] || (_cache[5] = function () {
      return _ctx.blurNeed && _ctx.blurNeed(...arguments);
    })
  }, [(openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.modelValue, (item, ind) => {
    return openBlock(), createElementBlock("div", {
      class: "venAutocomplete__selected",
      key: 'vv' + ind
    }, [createTextVNode(toDisplayString(item) + " ", 1), createElementVNode("div", {
      class: "venAutocomplete__close",
      onClick: $event => _ctx.removeIndex(ind)
    }, _hoisted_4, 8, _hoisted_2)]);
  }), 128)), withDirectives(createElementVNode("input", {
    ref: "venAutocomplete",
    "onUpdate:modelValue": _cache[0] || (_cache[0] = $event => _ctx.inputData = $event),
    autocomplete: "off",
    placeholder: _ctx.placeholder,
    type: "text",
    maxlength: _ctx.max,
    onInput: _cache[1] || (_cache[1] = function () {
      return _ctx.goType && _ctx.goType(...arguments);
    }),
    onKeydown: [_cache[2] || (_cache[2] = withKeys(withModifiers(function () {
      return _ctx.goEnter && _ctx.goEnter(...arguments);
    }, ["prevent"]), ["enter"])), _cache[3] || (_cache[3] = withKeys(withModifiers(function () {
      return _ctx.goEnter && _ctx.goEnter(...arguments);
    }, ["prevent"]), ["tab"]))],
    onKeyup: _cache[4] || (_cache[4] = withKeys(function () {
      return _ctx.removeLast && _ctx.removeLast(...arguments);
    }, ["backspace"])),
    class: "venAutocomplete__field"
  }, null, 40, _hoisted_5), [[vModelText, _ctx.inputData]])]), _hoisted_6]);
}

script.render = render;
script.__scopeId = "data-v-4b58ed6d";

// Import vue component

// Default export is installable instance of component.
// IIFE injects install function into component, allowing component
// to be registered via Vue.use() as well as Vue.component(),
var entry_esm = /*#__PURE__*/(() => {
  // Get component instance
  const installable = script;

  // Attach install function executed by Vue.use()
  installable.install = app => {
    app.component('venAutocomplete', installable);
  };
  return installable;
})();

// It's possible to expose named exports when writing components that can
// also be used as directives, etc. - eg. import { RollupDemoDirective } from 'rollup-demo';
// export const RollupDemoDirective = directive;

export { entry_esm as default };
