import { create } from 'zustand';
import { DeviceMode, TemplateSchema, BuilderNode } from '../interfaces';

interface BuilderState {
  currentTemplate: TemplateSchema | null;
  selectedNodeId: string | null;
  hoveredNodeId: string | null;
  deviceMode: DeviceMode;
  isEditing: boolean;

  // API-linked page ID (returned from POST /academy/pages)
  pageId: string | null;
  
  // History for Undo/Redo
  historyPast: BuilderNode[][];
  historyFuture: BuilderNode[][];
  
  // Actions
  loadTemplate: (template: TemplateSchema) => void;
  setSelectedNodeId: (id: string | null) => void;
  setHoveredNodeId: (id: string | null) => void;
  setDeviceMode: (mode: DeviceMode) => void;
  setIsEditing: (isEditing: boolean) => void;
  setPageId: (id: string | null) => void;
  
  // Node Mutators
  updateNodeProps: (id: string, props: Record<string, any>) => void;
  addNode: (node: BuilderNode, parentId?: string, index?: number) => void;
  deleteNode: (id: string) => void;
  duplicateNode: (id: string) => void;
  reorderSections: (activeId: string, overId: string) => void;
  moveWidget: (activeId: string, overId: string, sourceParentId: string, targetParentId: string) => void;
  moveNodeUp: (id: string) => void;
  moveNodeDown: (id: string) => void;
  
  // History Actions
  undo: () => void;
  redo: () => void;
  
  // Publication Toggles
  saveDraft: () => void;
  publishTemplate: () => void;
}

// Helper to deep clone builder nodes
const cloneNodes = (nodes: BuilderNode[]): BuilderNode[] => {
  return JSON.parse(JSON.stringify(nodes));
};

// Helper to find and update a node inside the recursive tree
const findAndUpdateNode = (
  nodes: BuilderNode[],
  id: string,
  updater: (node: BuilderNode) => Partial<BuilderNode>
): boolean => {
  for (let i = 0; i < nodes.length; i++) {
    if (nodes[i].id === id) {
      nodes[i] = { ...nodes[i], ...updater(nodes[i]) };
      return true;
    }
    if (nodes[i].children && nodes[i].children!.length > 0) {
      const found = findAndUpdateNode(nodes[i].children!, id, updater);
      if (found) return true;
    }
  }
  return false;
};

// Helper to find and remove a node from the tree, returning the removed node
const findAndRemoveNode = (nodes: BuilderNode[], id: string): BuilderNode | null => {
  for (let i = 0; i < nodes.length; i++) {
    if (nodes[i].id === id) {
      const [removed] = nodes.splice(i, 1);
      return removed;
    }
    if (nodes[i].children && nodes[i].children!.length > 0) {
      const removed = findAndRemoveNode(nodes[i].children!, id);
      if (removed) return removed;
    }
  }
  return null;
};

// Helper to find parent of a node
const findParentNode = (nodes: BuilderNode[], childId: string): BuilderNode | null => {
  for (let i = 0; i < nodes.length; i++) {
    if (nodes[i].children && nodes[i].children!.some(c => c.id === childId)) {
      return nodes[i];
    }
    if (nodes[i].children && nodes[i].children!.length > 0) {
      const parent = findParentNode(nodes[i].children!, childId);
      if (parent) return parent;
    }
  }
  return null;
};

export const useBuilderStore = create<BuilderState>((set, get) => ({
  currentTemplate: null,
  selectedNodeId: null,
  hoveredNodeId: null,
  deviceMode: 'desktop',
  isEditing: true,
  pageId: null,
  historyPast: [],
  historyFuture: [],

  loadTemplate: (template) => {
    // Clear history when loading a new template
    set({
      currentTemplate: template,
      selectedNodeId: null,
      hoveredNodeId: null,
      historyPast: [],
      historyFuture: []
    });
  },

  setSelectedNodeId: (id) => set({ selectedNodeId: id }),
  setHoveredNodeId: (id) => set({ hoveredNodeId: id }),
  setDeviceMode: (mode) => set({ deviceMode: mode }),
  setIsEditing: (isEditing) => set({ isEditing }),
  setPageId: (id) => set({ pageId: id }),

  updateNodeProps: (id, props) => {
    const { currentTemplate, historyPast } = get();
    if (!currentTemplate) return;

    // Save history
    const oldSections = cloneNodes(currentTemplate.sections);
    const newSections = cloneNodes(currentTemplate.sections);

    const updated = findAndUpdateNode(newSections, id, (node) => ({
      props: { ...node.props, ...props }
    }));

    if (updated) {
      set({
        currentTemplate: {
          ...currentTemplate,
          sections: newSections,
          updatedAt: new Date().toISOString()
        },
        historyPast: [...historyPast, oldSections],
        historyFuture: [] // Reset redo stack on action
      });
    }
  },

  addNode: (node, parentId, index) => {
    const { currentTemplate, historyPast } = get();
    if (!currentTemplate) return;

    const oldSections = cloneNodes(currentTemplate.sections);
    const newSections = cloneNodes(currentTemplate.sections);

    if (parentId) {
      // Find parent container and push to children
      findAndUpdateNode(newSections, parentId, (parent) => {
        const children = parent.children ? [...parent.children] : [];
        if (index !== undefined) {
          children.splice(index, 0, { ...node, parentId });
        } else {
          children.push({ ...node, parentId });
        }
        return { children };
      });
    } else {
      // Add as top-level section
      if (index !== undefined) {
        newSections.splice(index, 0, node);
      } else {
        newSections.push(node);
      }
    }

    set({
      currentTemplate: {
        ...currentTemplate,
        sections: newSections,
        updatedAt: new Date().toISOString()
      },
      selectedNodeId: node.id,
      historyPast: [...historyPast, oldSections],
      historyFuture: []
    });
  },

  deleteNode: (id) => {
    const { currentTemplate, historyPast, selectedNodeId, hoveredNodeId } = get();
    if (!currentTemplate) return;

    const oldSections = cloneNodes(currentTemplate.sections);
    const newSections = cloneNodes(currentTemplate.sections);

    const removed = findAndRemoveNode(newSections, id);

    if (removed) {
      set({
        currentTemplate: {
          ...currentTemplate,
          sections: newSections,
          updatedAt: new Date().toISOString()
        },
        selectedNodeId: selectedNodeId === id ? null : selectedNodeId,
        hoveredNodeId: hoveredNodeId === id ? null : hoveredNodeId,
        historyPast: [...historyPast, oldSections],
        historyFuture: []
      });
    }
  },

  duplicateNode: (id) => {
    const { currentTemplate, historyPast } = get();
    if (!currentTemplate) return;

    const oldSections = cloneNodes(currentTemplate.sections);
    const newSections = cloneNodes(currentTemplate.sections);

    // Helper to find and clone node
    let duplicatedNode: BuilderNode | null = null;
    let parentNodeId: string | undefined = undefined;
    let nodeIndex = -1;

    const locateNode = (nodes: BuilderNode[], parentId?: string): boolean => {
      for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].id === id) {
          duplicatedNode = JSON.parse(JSON.stringify(nodes[i]));
          parentNodeId = parentId;
          nodeIndex = i;
          return true;
        }
        if (nodes[i].children && nodes[i].children!.length > 0) {
          const found = locateNode(nodes[i].children!, nodes[i].id);
          if (found) return true;
        }
      }
      return false;
    };

    locateNode(newSections);

    if (duplicatedNode && nodeIndex !== -1) {
      const clone = (n: BuilderNode): BuilderNode => {
        const newId = `${n.type}-${Math.random().toString(36).substr(2, 9)}`;
        return {
          ...n,
          id: newId,
          children: n.children ? n.children.map(c => ({ ...clone(c), parentId: newId })) : undefined
        };
      };

      const duplicatedClone = clone(duplicatedNode);

      if (parentNodeId) {
        findAndUpdateNode(newSections, parentNodeId, (parent) => {
          const children = [...(parent.children || [])];
          children.splice(nodeIndex + 1, 0, duplicatedClone);
          return { children };
        });
      } else {
        newSections.splice(nodeIndex + 1, 0, duplicatedClone);
      }

      set({
        currentTemplate: {
          ...currentTemplate,
          sections: newSections,
          updatedAt: new Date().toISOString()
        },
        selectedNodeId: duplicatedClone.id,
        historyPast: [...historyPast, oldSections],
        historyFuture: []
      });
    }
  },

  reorderSections: (activeId, overId) => {
    const { currentTemplate, historyPast } = get();
    if (!currentTemplate) return;

    const oldSections = cloneNodes(currentTemplate.sections);
    const newSections = cloneNodes(currentTemplate.sections);

    const activeIndex = newSections.findIndex(s => s.id === activeId);
    const overIndex = newSections.findIndex(s => s.id === overId);

    if (activeIndex !== -1 && overIndex !== -1) {
      const [removed] = newSections.splice(activeIndex, 1);
      newSections.splice(overIndex, 0, removed);

      set({
        currentTemplate: {
          ...currentTemplate,
          sections: newSections,
          updatedAt: new Date().toISOString()
        },
        historyPast: [...historyPast, oldSections],
        historyFuture: []
      });
    }
  },

  moveNodeUp: (id) => {
    const { currentTemplate, historyPast } = get();
    if (!currentTemplate) return;

    const oldSections = cloneNodes(currentTemplate.sections);
    const newSections = cloneNodes(currentTemplate.sections);

    const idx = newSections.findIndex(s => s.id === id);
    if (idx > 0) {
      const temp = newSections[idx];
      newSections[idx] = newSections[idx - 1];
      newSections[idx - 1] = temp;

      set({
        currentTemplate: {
          ...currentTemplate,
          sections: newSections,
          updatedAt: new Date().toISOString()
        },
        historyPast: [...historyPast, oldSections],
        historyFuture: []
      });
    }
  },

  moveNodeDown: (id) => {
    const { currentTemplate, historyPast } = get();
    if (!currentTemplate) return;

    const oldSections = cloneNodes(currentTemplate.sections);
    const newSections = cloneNodes(currentTemplate.sections);

    const idx = newSections.findIndex(s => s.id === id);
    if (idx !== -1 && idx < newSections.length - 1) {
      const temp = newSections[idx];
      newSections[idx] = newSections[idx + 1];
      newSections[idx + 1] = temp;

      set({
        currentTemplate: {
          ...currentTemplate,
          sections: newSections,
          updatedAt: new Date().toISOString()
        },
        historyPast: [...historyPast, oldSections],
        historyFuture: []
      });
    }
  },

  moveWidget: (activeId, overId, sourceParentId, targetParentId) => {
    const { currentTemplate, historyPast } = get();
    if (!currentTemplate) return;

    const oldSections = cloneNodes(currentTemplate.sections);
    const newSections = cloneNodes(currentTemplate.sections);

    // 1. Remove from source parent
    let activeNode: BuilderNode | null = null;
    findAndUpdateNode(newSections, sourceParentId, (parent) => {
      const children = [...(parent.children || [])];
      const idx = children.findIndex(c => c.id === activeId);
      if (idx !== -1) {
        activeNode = children.splice(idx, 1)[0] || null;
      }
      return { children };
    });

    if (!activeNode) return;
    (activeNode as BuilderNode).parentId = targetParentId;

    // 2. Insert into target parent
    findAndUpdateNode(newSections, targetParentId, (parent) => {
      const children = [...(parent.children || [])];
      const overIdx = children.findIndex(c => c.id === overId);
      if (overIdx !== -1) {
        children.splice(overIdx, 0, activeNode!);
      } else {
        children.push(activeNode!);
      }
      return { children };
    });

    set({
      currentTemplate: {
        ...currentTemplate,
        sections: newSections,
        updatedAt: new Date().toISOString()
      },
      historyPast: [...historyPast, oldSections],
      historyFuture: []
    });
  },

  undo: () => {
    const { currentTemplate, historyPast, historyFuture } = get();
    if (!currentTemplate || historyPast.length === 0) return;

    const previousSections = historyPast[historyPast.length - 1];
    const newPast = historyPast.slice(0, -1);
    const currentSections = cloneNodes(currentTemplate.sections);

    set({
      currentTemplate: {
        ...currentTemplate,
        sections: previousSections,
        updatedAt: new Date().toISOString()
      },
      historyPast: newPast,
      historyFuture: [currentSections, ...historyFuture],
      selectedNodeId: null // Clear selection to prevent invalid inspectors
    });
  },

  redo: () => {
    const { currentTemplate, historyPast, historyFuture } = get();
    if (!currentTemplate || historyFuture.length === 0) return;

    const nextSections = historyFuture[0];
    const newFuture = historyFuture.slice(1);
    const currentSections = cloneNodes(currentTemplate.sections);

    set({
      currentTemplate: {
        ...currentTemplate,
        sections: nextSections,
        updatedAt: new Date().toISOString()
      },
      historyPast: [...historyPast, currentSections],
      historyFuture: newFuture,
      selectedNodeId: null
    });
  },

  saveDraft: () => {
    const { currentTemplate } = get();
    if (!currentTemplate) return;

    const updatedTemplate: TemplateSchema = {
      ...currentTemplate,
      status: 'draft',
      updatedAt: new Date().toISOString()
    };

    localStorage.setItem(`darab_builder_template_${currentTemplate.id}`, JSON.stringify(updatedTemplate));
    // Save to the active template selection too if applicable
    localStorage.setItem('darab_active_template', currentTemplate.id);
    
    set({ currentTemplate: updatedTemplate });
  },

  publishTemplate: () => {
    const { currentTemplate } = get();
    if (!currentTemplate) return;

    const updatedTemplate: TemplateSchema = {
      ...currentTemplate,
      status: 'published',
      version: (parseFloat(currentTemplate.version) + 0.1).toFixed(1),
      updatedAt: new Date().toISOString()
    };

    localStorage.setItem(`darab_builder_template_${currentTemplate.id}`, JSON.stringify(updatedTemplate));
    // Save to global list of templates in storage
    localStorage.setItem('darab_active_template', currentTemplate.id);
    
    set({ currentTemplate: updatedTemplate });
  }
}));
