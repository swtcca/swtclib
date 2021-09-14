import { h, ref, PropType, defineComponent, onMounted } from "vue"
import type { TypedOptions } from "typed.js"
import Typed from "typed.js"
import "./typed.css"
const typed_defaults = {
  loop: true,
  typeSpeed: 50
}

export default defineComponent({
  name: "VueTypedJs",
  props: {
    strings: {
      type: Array as PropType<string>,
      required: false
    },
    options: {
      type: Object as PropType<TypedOptions>,
      required: false
    }
  },

  setup(props, context) {
    const typedElement = ref<Element>()

    const initTypedJS = () => {
      return new Typed(
        typedElement.value!.querySelector(".typing")!,
        props.strings.length > 0
          ? Object.assign({}, typed_defaults, props.options, {
              strings: props.strings
            })
          : Object.assign({}, typed_defaults, props.options || {})
      )
    }

    onMounted(initTypedJS)

    return () => {
      return h(
        "div",
        {
          ref: typedElement,
          class: "typed-element"
        },
        context.slots.default!()
      )
    }
  }
})
