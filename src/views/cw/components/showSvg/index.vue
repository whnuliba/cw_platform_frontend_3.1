<script>
export default {
  name: 'PreviewSvg',
  functional: true,
  props: {
    icon: {
      type: String,
      default: ''
    },
    svgData: {
      type: Object,
      default: {}
    }
  },
  render(h, context) {
    const { svgData } = context.props
    let aa = svgData.modules.methods.comSvg ? svgData.modules.methods.comSvg(h) : ''
    return (aa)
  }
}
</script>

<style scoped>

</style>
