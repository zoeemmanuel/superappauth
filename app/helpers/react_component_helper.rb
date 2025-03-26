module ReactComponentHelper
  def react_component(name, props = {}, options = {})
    element_id = options[:id] || "react-component-#{SecureRandom.uuid}"
    tag.div(
      id: element_id,
      data: {
        react_component: name,
        react_props: props.to_json
      }
    )
  end
end
