import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { Compass } from "lucide-react";

const R = 11; // island radius
const toWorld = (l) => [(l.x / 100 - 0.5) * 18, (l.y / 100 - 0.5) * 14];

// scattered filler city blocks (deterministic)
const BLOCKS = [
  [-7, 2, 1.4, 1.6], [-5.5, 4.5, 1.2, 1.2], [-3, 1, 1.6, 2.2], [-3.5, 5, 1.3, 1.5],
  [-1, 3.5, 1.5, 1.8], [-1.5, 6.5, 1.2, 1.3], [1.5, 2, 1.4, 2], [1, 5.5, 1.3, 1.6],
  [3.5, 4, 1.5, 1.4], [4, 7, 1.2, 1.1], [-6, 6.8, 1.1, 1.2], [6, 2.5, 1.3, 1.5],
];

export default function Sydney3DMap({ landmarks, selectedId, hoveredId, setHoveredId, onSelect, counts = {} }) {
  const mountRef = useRef(null);
  const labelsRef = useRef(null);
  const propsRef = useRef({});
  propsRef.current = { selectedId, hoveredId, setHoveredId, onSelect, counts };

  useEffect(() => {
    const mount = mountRef.current;
    const labelLayer = labelsRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 300);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mount.appendChild(renderer.domElement);

    scene.add(new THREE.HemisphereLight(0xffffff, 0xbfd8d8, 1.15));
    const sun = new THREE.DirectionalLight(0xffffff, 1.25);
    sun.position.set(-14, 22, 12);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.camera.left = -22;
    sun.shadow.camera.right = 22;
    sun.shadow.camera.top = 22;
    sun.shadow.camera.bottom = -22;
    scene.add(sun);

    const board = new THREE.Group();
    scene.add(board);

    const mat = (color, opts = {}) =>
      new THREE.MeshStandardMaterial({ color, roughness: 0.85, flatShading: true, ...opts });

    // island slab (octagonal)
    const island = new THREE.Mesh(new THREE.CylinderGeometry(R, R * 0.95, 2.4, 8), mat(0xf6ecc0));
    island.position.y = -1.2;
    island.receiveShadow = true;
    board.add(island);

    // grid on the surface
    const grid = new THREE.GridHelper(R * 2, 22, 0xd9cd93, 0xe4dcae);
    grid.position.y = 0.02;
    grid.material.transparent = true;
    grid.material.opacity = 0.7;
    board.add(grid);

    // green headland
    const head = new THREE.Mesh(new THREE.CylinderGeometry(4.2, 4, 1.8, 7), mat(0xbfe0bd));
    head.position.set(8.5, -0.6, -6);
    head.receiveShadow = true;
    head.castShadow = true;
    board.add(head);

    // filler city blocks
    BLOCKS.forEach(([x, z, w, h]) => {
      const b = new THREE.Mesh(new THREE.BoxGeometry(w, h, w), mat(0xefe3c6));
      b.position.set(x, h / 2, z);
      b.castShadow = true;
      b.receiveShadow = true;
      board.add(b);
    });

    // a few signature shapes
    const tower = new THREE.Group();
    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.36, 7, 10), mat(0xc9c9c4));
    shaft.position.y = 3.5;
    const dome = new THREE.Mesh(new THREE.SphereGeometry(0.85, 16, 12), mat(0xe8bd45));
    dome.position.y = 6.9;
    [shaft, dome].forEach((m) => { m.castShadow = true; tower.add(m); });
    tower.position.set(-1.6, 0, -1.5);
    board.add(tower);

    const qvb = new THREE.Group();
    const hall = new THREE.Mesh(new THREE.BoxGeometry(3.2, 1.3, 2), mat(0xc9765c));
    hall.position.y = 0.65;
    const cupola = new THREE.Mesh(new THREE.SphereGeometry(0.7, 16, 12), mat(0x86b5a8));
    cupola.position.y = 1.5;
    [hall, cupola].forEach((m) => { m.castShadow = true; qvb.add(m); });
    qvb.position.set(-4.6, 0, -0.9);
    board.add(qvb);

    // opera-house style sails
    const sails = new THREE.Group();
    [0, 0.9, 1.8, 2.6].forEach((dx, i) => {
      const s = new THREE.Mesh(new THREE.ConeGeometry(0.55 - i * 0.05, 2.2 - i * 0.25, 4), mat(0xfdfdfb));
      s.position.set(dx, (2.2 - i * 0.25) / 2, i % 2 ? 0.35 : 0);
      s.rotation.y = Math.PI / 4;
      s.castShadow = true;
      sails.add(s);
    });
    const podium = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.4, 2), mat(0xe4cfa5));
    podium.position.set(1.3, 0.2, 0.15);
    podium.receiveShadow = true;
    sails.add(podium);
    sails.position.set(3.4, 0, -1.2);
    board.add(sails);

    // bridge
    const bridge = new THREE.Group();
    const deck = new THREE.Mesh(new THREE.BoxGeometry(6.5, 0.25, 0.9), mat(0xb9bcb6));
    deck.position.y = 1.6;
    const arch = new THREE.Mesh(new THREE.TorusGeometry(3.1, 0.18, 8, 24, Math.PI), mat(0xb9bcb6));
    arch.position.y = 1.6;
    [deck, arch].forEach((m) => { m.castShadow = true; bridge.add(m); });
    bridge.position.set(1.2, 0, -4.6);
    bridge.rotation.y = -0.5;
    board.add(bridge);

    const teal = new THREE.Mesh(new THREE.BoxGeometry(3, 0.8, 2.2), mat(0x7cb8b0));
    teal.position.set(5.5, 0.4, 5.6);
    teal.castShadow = true;
    board.add(teal);

    // ---- name tags (HTML) ----
    const tags = landmarks.map((l) => {
      const [x, z] = toWorld(l);
      const anchor = new THREE.Object3D();
      anchor.position.set(x, 2.6, z);
      board.add(anchor);

      const stick = new THREE.Mesh(
        new THREE.CylinderGeometry(0.03, 0.03, 2.4, 6),
        mat(0x9aa39a)
      );
      stick.position.set(x, 1.2, z);
      board.add(stick);

      const el = document.createElement("button");
      el.type = "button";
      el.className =
        "pointer-events-auto absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full px-3.5 py-1.5 text-[13px] font-semibold shadow-md transition-colors duration-200";
      el.addEventListener("click", (e) => { e.stopPropagation(); propsRef.current.onSelect(l.id); });
      el.addEventListener("mouseenter", () => propsRef.current.setHoveredId(l.id));
      el.addEventListener("mouseleave", () => propsRef.current.setHoveredId(null));
      labelLayer.appendChild(el);
      return { l, anchor, el };
    });

    const st = { rotY: 0.35, rotX: -0.72, dist: 30, dragging: false, lastX: 0, lastY: 0 };

    const resize = () => {
      const w = mount.clientWidth, h = mount.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(mount);

    const onDown = (e) => { st.dragging = true; st.lastX = e.clientX; st.lastY = e.clientY; };
    const onMove = (e) => {
      if (!st.dragging) return;
      st.rotY += (e.clientX - st.lastX) * 0.006;
      st.rotX = Math.max(-1.25, Math.min(-0.3, st.rotX - (e.clientY - st.lastY) * 0.004));
      st.lastX = e.clientX; st.lastY = e.clientY;
    };
    const onUp = () => { st.dragging = false; };
    const onWheel = (e) => { e.preventDefault(); st.dist = Math.max(18, Math.min(48, st.dist + e.deltaY * 0.02)); };

    const el = renderer.domElement;
    el.style.touchAction = "none";
    el.style.cursor = "grab";
    el.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    el.addEventListener("wheel", onWheel, { passive: false });

    const v = new THREE.Vector3();
    let raf;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      board.rotation.y += (st.rotY - board.rotation.y) * 0.12;
      camera.position.set(0, Math.sin(-st.rotX) * st.dist, Math.cos(-st.rotX) * st.dist);
      camera.lookAt(0, 1, 0);
      renderer.render(scene, camera);

      const { selectedId: sel, hoveredId: hov, counts: cts } = propsRef.current;
      const w = mount.clientWidth, h = mount.clientHeight;
      tags.forEach(({ l, anchor, el: tag }) => {
        anchor.getWorldPosition(v).project(camera);
        tag.style.left = `${((v.x + 1) / 2) * w}px`;
        tag.style.top = `${((1 - v.y) / 2) * h}px`;
        const active = l.id === sel;
        const hot = l.id === hov;
        tag.style.zIndex = active ? 30 : hot ? 20 : Math.round((1 - v.z) * 100);
        tag.className =
          "pointer-events-auto absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full px-3.5 py-1.5 text-[13px] font-semibold shadow-md transition-colors duration-200 " +
          (active
            ? "bg-primary text-primary-foreground"
            : hot
            ? "bg-background text-primary"
            : "bg-background/95 text-foreground");
        const n = cts[l.id];
        tag.textContent = n ? `${l.name} · ${n}` : l.name;
      });
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      el.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      el.removeEventListener("wheel", onWheel);
      tags.forEach((t) => t.el.remove());
      renderer.dispose();
      mount.removeChild(el);
    };
  }, [landmarks]);

  return (
    <div className="relative overflow-hidden rounded-[var(--radius)] border border-border bg-gradient-to-b from-[#cfe4ea] via-[#bcdfe0] to-[#9ecbcb]">
      <div ref={mountRef} className="h-[360px] w-full sm:h-[520px] md:h-[640px]" />
      <div ref={labelsRef} className="pointer-events-none absolute inset-0">
        <div className="pointer-events-auto absolute left-5 top-5 z-40 inline-flex items-center gap-2 rounded-full bg-background/95 px-4 py-2 text-[13px] text-foreground shadow-md">
          <Compass className="h-4 w-4 text-primary" />
          Drag to look around · Scroll to zoom · Click a name tag
        </div>
      </div>
    </div>
  );
}