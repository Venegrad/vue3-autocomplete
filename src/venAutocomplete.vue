<template>
	<div class="venAutocomplete" :class="{'venAutocomplete_active': open}" v-outside="closeList">
		<div class="venAutocomplete__input" @click="blurNeed">
			<div class="venAutocomplete__selected" v-for="(item, ind) in innerValue" :key="'vv'+ind">
				{{  item  }}
				<div class="venAutocomplete__close" @click="removeIndex(ind)"><span></span></div>
			</div>
			<input
				ref="venAutocomplete"
				v-model="inputData"
				autocomplete="off"
				:placeholder="placeholder"
				type="text"
				:maxlength="max"
				@input="goType"
				@keydown.enter.prevent="goEnter"
				@keydown.tab.prevent="goEnter" 
				@keydown.down.prevent="goBottom"
				@keydown.up.prevent="goUp"
				@keydown.esc.prevent="closeList"
				@keydown.backspace="removeLast" 
				class="venAutocomplete__field"
			/>
		</div>
		<div class="venAutocomplete__dropdown" v-if="open">
			<div class="venAutocomplete__item" ref="ohThisFuckingIndex" @mouseenter="highlight = ind" :class="{'highlight': highlight === ind}" v-for="(item, ind) in computedList" :key="'gvs'+ind" @click="selectTag(item)">{{  item  }}</div>
		</div>
	</div>
</template>

<script>
	import { defineComponent } from 'vue';

	export default /*#__PURE__*/ defineComponent({
		name: 'autocomplete',
		emits: ['update:modelValue', 'inputEvent', 'changed', 'opened'],
		props: {
			disabledSymobols: {
				type: String,
				default: "£™¢∞§¶•ª•ªº"
			},
			min: {
				type: Number,
				min: 1
			},
			max: {
				type: Number,
				default: 200
			},
			dublicates: {
				type: Boolean,
				default: false
			},
			placeholder: {
				type: [String, Number]
			},
			list: {
				type: Array,
				default: () => []
			},
			modelValue: {
				type: [Array, String, Number],
				default: () => []
			},
		},
		watch: {
			modelValue(val) {
				this.innerValue = this.filterModel(val);
				this.$emit("changed", this.filterModel(val))
			},
			open() {
				this.highlight = 0
				this.$emit('opened', this.open)
			},
			inputData() {
				this.highlight = 0;
				this.$emit("inputEvent", this.inputData)
			},
		},
		computed: {
			computedList() {
				let willList = this.list.filter(el => {
					return el && this.inputData && el.toLowerCase().includes(this.inputData.toLowerCase()) && !this.innerValue.find(vl => vl.toLowerCase() === el.toLowerCase())
				});
				return willList
			}
		},
		mounted(el, binding) {
			this.filterModel(this.modelValue);
			this.$emit("update:modelValue", this.filterModel(this.modelValue));
			document.addEventListener("click", this.closeHandler)
		},
		beforeUnmount() {
			document.removeEventListener("click", this.closeHandler)
		},
		data() {
			return {
				inputData: null,
				innerValue: this.filterModel(this.modelValue),
				open: false,
				highlight: 0
			};
		},
		directives: {
			outside: {
				mounted(el, binding) {
					const handler = (e) => {
						if (!el.contains(e.target) && el !== e.target) {
							binding.value(e);
						}
					};
					el.__ClickOutsideHandler__ = handler;
					document.addEventListener('click', handler);
				},
				beforeUnmount(el) {
					document.removeEventListener('click', el.__ClickOutsideHandler__);
				},
				getSSRProps (binding, vnode) {
					return {}
				}
			}
		},
		methods: {

			closeHandler($event) {
				// console.log($event.target.closest(this.$refs.hhhd))
			},
			closeList() {
				this.open = false;
			},
			scrolIntoList() {
				const ref = this.$refs.ohThisFuckingIndex;
				if(!ref || !ref.length) return;

				const element = ref[this.highlight];
				element.scrollIntoView({
					"block": "center"
				})
			},
			goBottom() {
				if(this.computedList.length > this.highlight + 1) this.highlight++;
				this.scrolIntoList();
			},
			goUp() {
				if(this.highlight !== 0) this.highlight--;
				this.scrolIntoList();
			},
			selectTag(item) {
				this.inputData = null;
				this.innerValue.push(item);
				this.open = false;
				this.$emit("update:modelValue", this.filterModel(this.innerValue));
				this.blurNeed();
			},
			uniqueArray(arr) {
				return  arr.filter((value, index, self) => {
					const toLower = self.map(el => el.toLowerCase())
					return toLower.indexOf(value.toLowerCase()) === index;
				});
			},
			filterModel(items) {
				if(!this.disabledSymobols || !items || !items.length) return ;
				let willArray = [];
				const tbt = items.map(vl => {
					let ks = vl;
					[...this.disabledSymobols].forEach(el => ks = ks.replaceAll(el, ""))
					return ks
				}) 
				this.innerValue = tbt
				willArray = tbt;
				if(!this.dublicates) willArray = this.uniqueArray(willArray)
				return willArray
			},
			blurNeed() {
				this.$refs.venAutocomplete.focus();
				this.closeList();
			},
			removeLast() {
				if(this.inputData || !this.innerValue || !this.innerValue.length) return
				this.modelValue.pop()
				this.innerValue.pop()
			},
			removeIndex(i) {
				const fst = this.modelValue.filter((el, ind) => ind !== i)
				this.$emit('update:modelValue', fst)
			},
			goEnter() {
				if(!this.open) {
					this.hendeHoh();
				} else {
					this.innerValue.push(this.computedList[this.highlight]);
					this.open = false;
					this.inputData = null;
					this.$emit("update:modelValue", this.filterModel(this.innerValue));
				}
			},
			hendeHoh() {
				let tw = [];
				if(this.disabledSymobols) tw = this.disabledSymobols
				const completeLength =  [...tw, ","].forEach(el => this.inputData = this.inputData.replaceAll(el, ""))

				if(!this.inputData || this.inputData.length < this.min || this.inputData.length > this.max) return
				this.inputData = this.inputData.replaceAll(",","")
				if(!this.modelValue) {
					this.$emit('update:modelValue', this.filterModel([this.inputData]))
				} else {
					const fst = [...this.modelValue, this.inputData]
					this.$emit('update:modelValue', this.filterModel(fst))
				}
				this.inputData = null
			},
			goType(e) {

				// Search items
				this.open = this.computedList.length > 0

				// Disable symbols
				if(this.disabledSymobols) [...this.disabledSymobols].forEach(el => this.inputData = this.inputData.replaceAll(el, ""))

				// Long live 'if', what do u do, haha
				if((e.data === "," || (this.inputData && this.inputData.includes(",")) ) && /[^,]/.test(this.inputData)) {
					this.hendeHoh();
				} else if (!/[^,]/.test(this.inputData)) {
					this.inputData = null
				}
				if(!this.inputData || !this.inputData.length) this.open = false
			} 
		}
	});
</script>

<style scoped>
.venAutocomplete {
	position: relative;
	width: 100%;
	box-sizing: border-box;
	
	z-index: 5
}

.venAutocomplete_active {
	z-index: 6;
}

.venAutocomplete__dropdown {
	position: absolute;
	left: 0;
	width: 100%;
	top: 100%;
	margin-top: 10px;
	background-color: #222;
	color: #fff;
	padding: 10px;
	max-height: 300px;
	overflow: auto;
	border-radius: 10px;
}

.venAutocomplete * {
	box-sizing: border-box;
}

.venAutocomplete__close {
	position: absolute;
	right: 4px;
	top: 50%;
	margin-top: -11px;
	height: 100%;
	display: flex;
	cursor: pointer;
	width: 22px;
	user-select: none;
	height: 22px;
	border-radius: 50%;
	transition: all 0.25s ease;
	&:hover {
		background-color: rgba(255,255,255,0.2);
	}
}

.venAutocomplete__item {
	padding: 7px 10px;
	cursor: pointer;
	border-radius: 8px;
	transition: all 0.25s ease;
	&.highlight {
		background-color: rgba(255,255,255,0.1);
	}
}

.venAutocomplete__close:before, .venAutocomplete__close:after {
	width: 16px;
	height: 2px;
	position: absolute;
	left: 50%;
	top: 50%;
	margin-top: -1px;
	background-color: #fff;
	display: block;
	margin-left: -8px;
	content: '';
}

.venAutocomplete__close:before {
	transform: rotate(-45deg);
}

.venAutocomplete__close:after {
	transform: rotate(45deg);
}

.venAutocomplete__input {
	display: flex;
	flex-wrap: wrap;
	border: 2px solid rgba(255,255,255,0.2);
	min-height: 44px; 
	padding: 3px;
	border-radius: 12px;
	align-items: center;
}

.venAutocomplete__selected {
	padding: 4px 34px 4px 10px;
	position: relative;
	background-color: rgba(255,255,255,0.3);
	color: #fff;
	border-radius: 10px;
	font-size: 14px;
	display: flex;
	align-items: center;
	min-height: 28px;
	margin: 3px;

}

.venAutocomplete__field {
	width: auto;
	flex-grow: 1;
	appearance: none;
	border: 0;
	font-size: 14px;
	min-height: 28px;
	background: transparent;
	outline: none;
	font-family: inherit;
	font-weight: 500;
	margin: 3px;
	color: #fff;
	min-width: 30%;
}
</style>
