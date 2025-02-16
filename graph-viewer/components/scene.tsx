'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import {
  CSS2DRenderer,
  CSS2DObject,
} from 'three/examples/jsm/renderers/CSS2DRenderer.js';

interface TreeNode {
  val: number;
  children?: TreeNode[];
}

interface TreeLayout {
  node: TreeNode;
  position: THREE.Vector3;
  children: TreeLayout[];
}

export default function Scene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);

  const scene = useRef<THREE.Scene | null>(null);
  const camera = useRef<THREE.PerspectiveCamera | null>(null);
  const renderer = useRef<THREE.WebGLRenderer | null>(null);
  const controls = useRef<OrbitControls | null>(null);

  const [points, setPoints] = useState<THREE.Mesh[]>([]);
  const [lines, setLines] = useState<THREE.Line[]>([]);

  const [bfsValue, setBFSValue] = useState(6);
  const [dfsValue, setDFSValue] = useState(6);

  const labelRenderer = useRef<CSS2DRenderer | null>(null);

  const setupScene = () => {
    scene.current = new THREE.Scene();
    camera.current = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    renderer.current = new THREE.WebGLRenderer({ antialias: true });

    // Add CSS2D Renderer
    labelRenderer.current = new CSS2DRenderer();
    labelRenderer.current.setSize(window.innerWidth, window.innerHeight);
    labelRenderer.current.domElement.style.position = 'absolute';
    labelRenderer.current.domElement.style.top = '0';
    labelRenderer.current.domElement.style.pointerEvents = 'none';
    labelRenderer.current.domElement.style.zIndex = '2';
    containerRef.current!.appendChild(labelRenderer.current.domElement);

    controls.current = new OrbitControls(
      camera.current,
      renderer.current.domElement
    );

    camera.current.position.set(5, 10, 10);
    camera.current.lookAt(0, 0, 0);
    renderer.current.setSize(window.innerWidth, window.innerHeight);

    if (containerRef.current) {
      containerRef.current.appendChild(renderer.current.domElement);
    }

    controls.current.enableDamping = true;
    controls.current.dampingFactor = 0.05;
    scene.current.background = new THREE.Color(0x000000);
    renderer.current.domElement.style.zIndex = '1';

    setLoaded(true);
  };

  const createTextLabel = (text: string, position: THREE.Vector3) => {
    const div = document.createElement('div');
    div.className = 'node-label';
    div.textContent = text;

    const label = new CSS2DObject(div);
    label.position.copy(position.clone().add(new THREE.Vector3(0, 0.5, 0))); // Offset slightly above node
    return label;
  };

  const layoutTree = (
    tree: TreeNode,
    x = 0,
    y = 0,
    z = 0,
    levelSpacing = 2,
    siblingSpacing = 2.5
  ): TreeLayout => {
    const layout: TreeLayout = {
      node: tree,
      position: new THREE.Vector3(x, y, z),
      children: [],
    };

    if (tree.children && tree.children.length > 0) {
      const numChildren = tree.children.length;
      const startX = x - ((numChildren - 1) * siblingSpacing) / 2;

      for (let i = 0; i < numChildren; i++) {
        const childX = startX + i * siblingSpacing;
        const childY = y + levelSpacing;
        layout.children.push(
          layoutTree(
            tree.children[i],
            childX,
            childY,
            z,
            levelSpacing,
            siblingSpacing
          )
        );
      }
    }

    return layout;
  };

  const visualizeTree = (layout: TreeLayout) => {
    if (!scene.current) return;

    let i = 0; // Track existing points
    let j = 0; // Track existing lines

    const traverseTree = (
      layout: TreeLayout,
      callback: (layout: TreeLayout) => void
    ) => {
      callback(layout);
      layout.children.forEach((childLayout) => {
        traverseTree(childLayout, callback);
      });
    };

    traverseTree(layout, (nodeLayout) => {
      if (i < points.length) {
        points[i].material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        points[i].position.copy(nodeLayout.position);
      } else {
        const geometry = new THREE.SphereGeometry(0.2, 32, 32);
        const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        const sphere = new THREE.Mesh(geometry, material);
        sphere.position.copy(nodeLayout.position);
        scene.current!.add(sphere);
        points.push(sphere);

        // Add label
        const label = createTextLabel(
          i === 7 ? '7' : nodeLayout.node.val.toString(),
          nodeLayout.position
        );
        scene.current!.add(label);
      }
      i++;
    });

    traverseTree(layout, (nodeLayout) => {
      nodeLayout.children.forEach((childLayout) => {
        if (j < lines.length) {
          const positions = [
            nodeLayout.position.x,
            nodeLayout.position.y,
            nodeLayout.position.z,
            childLayout.position.x,
            childLayout.position.y,
            childLayout.position.z,
          ];
          lines[j].geometry.setAttribute(
            'position',
            new THREE.Float32BufferAttribute(positions, 3)
          );
        } else {
          const material = new THREE.LineBasicMaterial({ color: 0xefefef });
          const geometry = new THREE.BufferGeometry().setFromPoints([
            nodeLayout.position,
            childLayout.position,
          ]);
          const line = new THREE.Line(geometry, material);
          scene.current!.add(line);
          lines.push(line);
        }
        j++;
      });
    });

    // Remove excess points
    while (i < points.length) {
      scene.current!.remove(points[i]);
      points.splice(i, 1);
    }

    // Remove excess lines
    while (j < lines.length) {
      scene.current!.remove(lines[j]);
      lines.splice(j, 1);
    }
  };

  const bfsSearch = (tree: TreeNode, target: number): number[] | null => {
    const queue: { node: TreeNode; path: number[] }[] = [
      { node: tree, path: [tree.val] },
    ];
    console.log('BFS traversal starts');

    const visitedNodes: number[] = []; // Track visited nodes

    while (queue.length > 0) {
      const { node, path } = queue.shift()!;
      visitedNodes.push(node.val);
      console.log(
        `Visiting node: ${node.val}, Path so far: ${path.join(' → ')}`
      );

      if (node.val === target) {
        console.log(`Found target ${target} at path: ${path.join(' → ')}`);
        document.getElementById(
          'results'
        )!.innerHTML = `Visited nodes (BFS order): ${visitedNodes.join(' → ')}`;
        return path;
      }

      if (node.children) {
        for (const child of node.children) {
          console.log(`Enqueuing child: ${child.val}`);
          queue.push({ node: child, path: [...path, child.val] });
        }
      }
    }

    return null;
  };

  const dfsSearch = (tree: TreeNode, target: number): number[] | null => {
    const stack: { node: TreeNode; path: number[] }[] = [
      { node: tree, path: [tree.val] },
    ];
    console.log('DFS traversal starts');

    const visitedNodes: number[] = []; // Track visited nodes

    while (stack.length > 0) {
      const { node, path } = stack.pop()!;
      visitedNodes.push(node.val);
      console.log(
        `Visiting node: ${node.val}, Path so far: ${path.join(' → ')}`
      );

      if (node.val === target) {
        console.log(`Found target ${target} at path: ${path.join(' → ')}`);
        document.getElementById(
          'dfs-results'
        )!.innerHTML = `Visited nodes (BFS order): ${visitedNodes.join(' → ')}`;
        return path;
      }

      if (node.children) {
        for (let i = node.children.length - 1; i >= 0; i--) {
          const child = node.children[i];
          console.log(`Pushing child: ${child.val} to stack`);
          stack.push({ node: child, path: [...path, child.val] });
        }
      }
    }

    return null;
  };

  const resetTreeColors = () => {
    if (!scene.current) return;

    const updatedPoints = points.map((point) => {
      (point.material as THREE.MeshBasicMaterial).color.set(0xff0000);
      return point;
    });

    const updatedLines = lines.map((line) => {
      (line.material as THREE.LineBasicMaterial).color.set(0xefefef);
      return line;
    });

    setPoints(updatedPoints);
    setLines(updatedLines);
  };

  const highlightPath = (path: number[] | null, layout: TreeLayout) => {
    if (!path || !scene.current) return;

    const pathLayouts: TreeLayout[] = [];
    const findLayoutByValue = (layout: TreeLayout, value: number): boolean => {
      if (layout.node.val === value) {
        pathLayouts.push(layout);
        return true;
      }
      for (const child of layout.children) {
        if (findLayoutByValue(child, value)) {
          return true;
        }
      }
      return false;
    };

    for (const nodeValue of path) {
      findLayoutByValue(layout, nodeValue);
    }

    const updatedPoints = points.map((point, i) => {
      if (
        pathLayouts.some((layout) => layout.position.equals(point.position))
      ) {
        (point.material as THREE.MeshBasicMaterial).color.set(0x00ff00);
      }
      return point;
    });

    const terminalLayout = pathLayouts[pathLayouts.length - 1];
    if (terminalLayout) {
      const terminalNode = updatedPoints.find((point) =>
        point.position.equals(terminalLayout.position)
      );
      if (terminalNode) {
        (terminalNode.material as THREE.MeshBasicMaterial).color.set(0xffffff);
      }
    }

    const updatedLines = lines.map((line) => {
      const start = new THREE.Vector3().fromArray(
        line.geometry.attributes.position.array,
        0
      );
      const end = new THREE.Vector3().fromArray(
        line.geometry.attributes.position.array,
        3
      );
      if (
        pathLayouts.some(
          (layout) =>
            layout.position.equals(start) || layout.position.equals(end)
        )
      ) {
        (line.material as THREE.LineBasicMaterial).color.set(0x00ff00); // Red for path lines
      }
      return line;
    });

    setPoints(updatedPoints);
    setLines(updatedLines);
  };

  useEffect(() => {
    setupScene();

    runBFS(bfsValue);
    runDFS(dfsValue);

    const onWindowResize = () => {
      if (camera.current && renderer.current) {
        camera.current.aspect = window.innerWidth / window.innerHeight;
        camera.current.updateProjectionMatrix();
        renderer.current.setSize(window.innerWidth, window.innerHeight);
      }
    };

    window.addEventListener('resize', onWindowResize);
    return () => window.removeEventListener('resize', onWindowResize);
  }, []);

  useEffect(() => {
    if (
      loaded &&
      scene.current &&
      camera.current &&
      renderer.current &&
      controls.current
    ) {
      const animate = () => {
        requestAnimationFrame(animate);
        controls.current!.update();
        renderer.current!.render(scene.current!, camera.current!);
        labelRenderer.current!.render(scene.current!, camera.current!); // Render labels
      };
      animate();
    }
  }, [loaded]);

  const runBFS = (bfsValue: number) => {
    const tree: TreeNode = {
      val: 0,
      children: [
        {
          val: 1,
          children: [
            { val: 3, children: [{ val: 6 }] }, // Deep path to 6
          ],
        },
        {
          val: 2,
          children: [
            { val: 4 },
            { val: 5, children: [{ val: 6 }] }, // Shallow path to 6
          ],
        },
      ],
    };

    const layout = layoutTree(tree);
    visualizeTree(layout);

    const path = bfsSearch(tree, bfsValue);
    highlightPath(path, layout);
  };

  const runDFS = (dfsValue: number) => {
    const tree: TreeNode = {
      val: 0,
      children: [
        {
          val: 1,
          children: [
            { val: 3, children: [{ val: 6 }] }, // Deep path to 6
          ],
        },
        {
          val: 2,
          children: [
            { val: 4 },
            { val: 5, children: [{ val: 6 }] }, // Shallow path to 6
          ],
        },
      ],
    };

    const layout = layoutTree(tree);
    visualizeTree(layout);

    const path = dfsSearch(tree, dfsValue);
    highlightPath(path, layout);
  };

  return (
    <>
      <div className="absolute z-10 top-0 left-0 h-auto w-full p-4 bg-gray-800">
        <h1 className="font-bold mr-auto pb-4 text-2xl">Graph Visualizer</h1>
        <div className="flex gap-4">
          <div>
            <input
              defaultValue={bfsValue}
              className="bg-gray-700 w-12 mr-2 text-white p-2 rounded"
              onChange={(e) => {
                if (e.target.value === '') return;
                setBFSValue(parseInt(e.target.value));
              }}
            />
            <button
              className="bg-blue-500 text-white p-2 rounded"
              onClick={() => {
                resetTreeColors();
                runBFS(bfsValue);
              }}
            >
              Run BFS
            </button>
            <p className="pt-4" id="results"></p>
          </div>
          <div>
            <input
              defaultValue={dfsValue}
              className="bg-gray-700 w-12 mr-2 text-white p-2 rounded"
              onChange={(e) => {
                if (e.target.value === '') return;
                setDFSValue(parseInt(e.target.value));
              }}
            />
            <button
              className="bg-blue-500 text-white p-2 rounded"
              onClick={() => {
                resetTreeColors();
                runDFS(dfsValue);
              }}
            >
              Run DFS
            </button>
            <p className="pt-4" id="dfs-results"></p>
          </div>
        </div>
      </div>
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
    </>
  );
}
