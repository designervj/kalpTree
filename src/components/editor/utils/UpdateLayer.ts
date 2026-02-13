// import { GrapesJSEditor } from "@/hooks/use-editor";
// // import { useEditorContext } from "../EditorContext";
// // const { editForm, setState, state } = useEditorContext();
// export const updateLayers = (editor: GrapesJSEditor) => {
//     if (!editor || !editor.Components) {
//       return;
//     }

//     try {
//       // Get the wrapper component first, then get its children
//       const wrapper = editor.Components.getWrapper();


//       if (!wrapper) {

//         setState((state: ExtendedEditorState) => ({
//           ...prev,
//           layers: [],
//         }));
//         return;
//       }

//       // Get components from the wrapper
//       let components = [];


//       if (typeof wrapper.components === 'function') {
//         components = wrapper.components();
//       } else if (wrapper.get && typeof wrapper.get === 'function') {
//         const comps = wrapper.get('components');

//         if (comps && typeof comps.models !== 'undefined') {
//           components = comps.models;
//         } else if (Array.isArray(comps)) {
//           components = comps;
//         }
//       }


//       // Verify components is valid before mapping
//       if (!components || !Array.isArray(components) || components.length === 0) {
//         setState((prev) => ({
//           ...prev,
//           layers: [],
//         }));
//         return;
//       }

//       const layerItems = mapComponentsToLayers(components);

//       setState((prev) => ({
//         ...prev,
//         layers: layerItems,
//       }));
//     } catch (error) {
//       setState((prev) => ({
//         ...prev,
//         layers: [],
//       }));
//     }
//   };