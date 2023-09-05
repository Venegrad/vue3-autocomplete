<template>
	<div class="venAutocomplete" >
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
				@keydown.backspace="removeLast" 
				class="venAutocomplete__field"
			/>
		</div>
		<div class="venAutocomplete__dropdown">

		</div>
	</div>
</template>

<script>
	import { defineComponent } from 'vue';

	export default /*#__PURE__*/ defineComponent({
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
		watch: {
			modelValue(val) {
				this.innerValue = this.filterModel(val)
			}
		},
		mounted() {
			this.filterModel(this.modelValue);
			this.$emit("update:modelValue", this.filterModel(this.modelValue))
		},
		data() {
			return {
				inputData: null,
				innerValue: this.filterModel(this.modelValue)
			};
		},
		methods: {
			filterModel(items) {
				if(!this.disabledSymobols || !items || !items.length) return 
				const tbt = items.map(vl => {
					let ks = vl;
					[...this.disabledSymobols].forEach(el => ks = ks.replaceAll(el, ""))
					return ks
				}) 
				this.innerValue = tbt
				return tbt
			},
			blurNeed() {
				this.$refs.venAutocomplete.focus()
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
				this.hendeHoh();
			},
			hendeHoh() {
				if(!this.inputData || this.inputData.length < this.min || this.inputData.length > this.max) return
				this.inputData = this.inputData.replaceAll(",","")
				if(!this.modelValue) {
					this.$emit('update:modelValue', [this.inputData])
				} else {
					const fst = [...this.modelValue, this.inputData]
					this.$emit('update:modelValue', fst)
				}
				this.inputData = null
			},
			goType(e) {

				// Disable symbols
				if(this.disabledSymobols) [...this.disabledSymobols].forEach(el => this.inputData = this.inputData.replaceAll(el, ""))

				// Long live if, what do u do, haha
				if((e.data === "," || (this.inputData && this.inputData.includes(",")) ) && /[^,]/.test(this.inputData)) {
					this.hendeHoh();
				} else if (!/[^,]/.test(this.inputData)) {
					this.inputData = null
				}
			} 
		}
	});
</script>

<style scoped>
.venAutocomplete {
	position: relative;
	width: 100%;
	box-sizing: border-box;
	font-family: 'Tahoma';
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
