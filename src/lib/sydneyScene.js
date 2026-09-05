import * as THREE from "three";

// Roughly geographic layout on the island slab: +x = east, +z = south.
export const SITES = {
  "manly": [6.2, -8.6],
  "harbour-bridge": [0.2, -4.8],
  "opera-house": [2.9, -3.4],
  "botanic-garden": [5.4, -1.0],
  "darling-harbour": [-3.4, -0.8],
  "newtown": [-4.6, 4.6],
  "bondi": [8.0, 3.6],
  "blue-mountains": [-8.6, -1.2],
};

const mat = (color, opts = {}) =>
  new THREE.MeshStandardMaterial({ color, roughness: 0.85, flatShading: true, ...opts });

const add = (group, mesh, [x, y, z], ry = 0) => {
  mesh.position.set(x, y, z);
  mesh.rotation.y = ry;
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  group.add(mesh);
  return mesh;
};

const tree = (group, x, z, s = 1) => {
  add(group, new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.09, 0.5 * s, 6), mat(0x9a7b52)), [x, 0.25 * s, z]);
  add(group, new THREE.Mesh(new THREE.SphereGeometry(0.42 * s, 10, 8), mat(0x6fae72)), [x, 0.85 * s, z]);
};

/** A simple low-poly figure that reads as the landmark. Returns { group, tagHeight }. */
export function buildFigure(id) {
  const g = new THREE.Group();
  let tagHeight = 2.2;

  if (id === "opera-house") {
    add(g, new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.35, 1.9), mat(0xe4cfa5)), [0, 0.17, 0]);
    [0, 0.85, 1.65, 2.3].forEach((dx, i) => {
      const h = 2.3 - i * 0.3;
      const s = add(g, new THREE.Mesh(new THREE.ConeGeometry(0.6 - i * 0.06, h, 4), mat(0xfdfdfb)), [dx - 1.2, 0.35 + h / 2, i % 2 ? 0.3 : -0.1]);
      s.rotation.y = Math.PI / 4;
    });
    tagHeight = 3.1;
  } else if (id === "harbour-bridge") {
    add(g, new THREE.Mesh(new THREE.BoxGeometry(7, 0.25, 1), mat(0xb9bcb6)), [0, 1.7, 0]);
    const arch = add(g, new THREE.Mesh(new THREE.TorusGeometry(3.2, 0.2, 8, 26, Math.PI), mat(0xa9aca6)), [0, 1.7, 0]);
    arch.rotation.x = 0;
    [-3.1, 3.1].forEach((x) => add(g, new THREE.Mesh(new THREE.BoxGeometry(0.7, 2.4, 1.1), mat(0xc7c3b2)), [x, 1.2, 0]));
    tagHeight = 4.5;
  } else if (id === "bondi") {
    add(g, new THREE.Mesh(new THREE.BoxGeometry(4.4, 0.16, 2.6), mat(0xf3e2b3)), [0, 0.08, 0.4]);
    add(g, new THREE.Mesh(new THREE.BoxGeometry(4.4, 0.14, 1.8), mat(0x6fc0c6)), [0, 0.1, -1.5]);
    add(g, new THREE.Mesh(new THREE.ConeGeometry(0.5, 0.4, 8), mat(0xe0705f)), [-1, 0.6, 0.6]);
    add(g, new THREE.Mesh(new THREE.ConeGeometry(0.5, 0.4, 8), mat(0xf0c34a)), [1.1, 0.6, 0.9]);
    tagHeight = 1.7;
  } else if (id === "botanic-garden") {
    add(g, new THREE.Mesh(new THREE.CylinderGeometry(2.4, 2.6, 0.3, 10), mat(0xbfe0bd)), [0, 0.15, 0]);
    tree(g, -1.1, 0.6, 1.1);
    tree(g, 0.5, -0.7, 0.9);
    tree(g, 1.4, 0.9, 1.2);
    tagHeight = 2.6;
  } else if (id === "darling-harbour") {
    add(g, new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.14, 2.4), mat(0x7fc2cc)), [0, 0.1, 0]);
    add(g, new THREE.Mesh(new THREE.BoxGeometry(3.8, 0.2, 0.5), mat(0xd9c9a4)), [0, 0.2, 1.4]);
    add(g, new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.3, 0.4), mat(0xfdfdfb)), [-0.8, 0.3, -0.4]);
    add(g, new THREE.Mesh(new THREE.ConeGeometry(0.3, 0.9, 4), mat(0xfdfdfb)), [0.9, 0.6, 0.3]);
    tagHeight = 2.0;
  } else if (id === "newtown") {
    [0xd07a5e, 0xe8b34a, 0x7ba7c9, 0xcf6f8f].forEach((c, i) => {
      add(g, new THREE.Mesh(new THREE.BoxGeometry(0.9, 1.5, 1.2), mat(c)), [i * 0.95 - 1.4, 0.75, 0]);
      add(g, new THREE.Mesh(new THREE.ConeGeometry(0.72, 0.45, 4), mat(0x8c8579)), [i * 0.95 - 1.4, 1.72, 0], Math.PI / 4);
    });
    tagHeight = 2.6;
  } else if (id === "manly") {
    add(g, new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.2, 0.8), mat(0xd9c9a4)), [0, 0.2, 0.6]);
    add(g, new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.45, 0.8), mat(0xfdfdfb)), [0.4, 0.42, -0.7]);
    add(g, new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.6, 8), mat(0x2f6f4f)), [0.9, 0.9, -0.7]);
    tree(g, -1.3, -0.2, 0.8);
    tagHeight = 2.0;
  } else if (id === "blue-mountains") {
    add(g, new THREE.Mesh(new THREE.ConeGeometry(1.5, 2.6, 5), mat(0x8fa7c4)), [0, 1.3, 0]);
    add(g, new THREE.Mesh(new THREE.ConeGeometry(1.1, 1.9, 5), mat(0xa2b6cd)), [1.6, 0.95, 0.6]);
    add(g, new THREE.Mesh(new THREE.ConeGeometry(0.9, 1.5, 5), mat(0x7d94b3)), [-1.5, 0.75, 0.5]);
    tagHeight = 3.2;
  }

  return { group: g, tagHeight };
}

// Background city fill, kept clear of the landmark sites.
export const FILL_BLOCKS = [
  [-1.4, 2.4, 1.3, 1.7], [0.6, 3.6, 1.2, 1.4], [-2.6, 5.4, 1.1, 1.2],
  [1.9, 5.6, 1.3, 1.1], [3.6, 3.2, 1.2, 1.6], [-6.2, 2.2, 1.1, 1.3],
  [-0.4, 6.6, 1.2, 1.2], [4.6, 6.2, 1.1, 1.4], [2.2, 1.4, 1.1, 1.9],
  [-5.4, -3.2, 1.2, 1.1], [-1.8, -1.6, 1.1, 1.5], [6.4, 1.6, 1.2, 1.2],
];