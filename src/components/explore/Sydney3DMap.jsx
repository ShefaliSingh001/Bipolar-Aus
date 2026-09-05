import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { SYDNEY_MAP_URL } from "@/lib/landmarks";

const W = 20;
const H = 12;
const toWorld = (l) => [(l.x / 100 - 0.5) * W, (l.y / 100 - 0.5) * H];

export default function Sydney3DMap({ landmarks, selectedId, hoveredId, setHoveredId, onSelect }) {
  const mountRef = useRef(null);
  const stateRef = useRef({});
  // keep latest callbacks/props without re-creating the scene
  const propsRef = useRef({ selectedId, hoveredId, setHoveredId, onSelect });
  propsRef.current = { selectedId, hoveredId, setHoveredId, onSelect };

  useEffect(() => {
    const mount = mountRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 200);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    mount.appendChild(renderer.domElement);

    scene.add(new THREE.HemisphereLight(0xffffff, 0x8899aa, 1.1));
    const sun = new THREE.DirectionalLight(0xffffff, 1.1);
    sun.position.set(8, 16, 6);
    sun.castShadow = true;
    sun.shadow.mapSize.set(1024, 1024);
    scene.add(sun);

    const board = new THREE.Group();
    scene.add(board);

    // slab
    const texture = new THREE.TextureLoader().load(SYDNEY_MAP_URL, () => renderer.render(scene, camera));
    texture.colorSpace = THREE.SRGBColorSpace;
    const slab = new THREE.Mesh(
      new THREE.BoxGeometry(W, 0.9, H),
      [
        new THREE.MeshStandardMaterial({ color: 0xe6e2d3 }),
        new THREE.MeshStandardMaterial({ color: 0xe6e2d3 }),
        new THREE.MeshStandardMaterial({ map: texture, roughness: 0.85 }),
        new THREE.MeshStandardMaterial({ color: 0xd8d3c2 }),
        new THREE.MeshStandardMaterial({ color: 0xe6e2d3 }),
        new THREE.MeshStandardMaterial({ color: 0xe6e2d3 }),
      ]
    );
    slab.receiveShadow = true;
    board.add(slab);

    // pins
    const pins = landmarks.map((l) => {
      const [x, z] = toWorld(l);
      const g = new THREE.Group();
      g.position.set(x, 0.45, z);
      const head = new THREE.Mesh(
        new THREE.SphereGeometry(0.32, 24, 24),
        new THREE.MeshStandardMaterial({ color: 0xffd24a, roughness: 0.3 })
      );
      head.position.y = 1.15;
      head.castShadow = true;
      const stem = new THREE.Mesh(
        new THREE.CylinderGeometry(0.05, 0.05, 1.15, 12),
        new THREE.MeshStandardMaterial({ color: 0x0b6b34 })
      );
      stem.position.y = 0.575;
      g.add(stem, head);
      g.userData = { id: l.id, head };
      board.add(g);
      return g;
    });

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    let hovered = null;

    const st = {
      rotY: 0,
      rotX: -0.85,
      dist: 26,
      dragging: false,
      lastX: 0,
      lastY: 0,
      moved: false,
    };
    stateRef.current = st;

    const resize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(mount);

    const setPointer = (e) => {
      const r = renderer.domElement.getBoundingClientRect();
      pointer.x = ((e.clientX - r.left) / r.width) * 2 - 1;
      pointer.y = -((e.clientY - r.top) / r.height) * 2 + 1;
    };

    const onDown = (e) => {
      st.dragging = true;
      st.moved = false;
      st.lastX = e.clientX;
      st.lastY = e.clientY;
    };
    const onMove = (e) => {
      setPointer(e);
      if (st.dragging) {
        const dx = e.clientX - st.lastX;
        const dy = e.clientY - st.lastY;
        if (Math.abs(dx) + Math.abs(dy) > 3) st.moved = true;
        st.rotY += dx * 0.006;
        st.rotX = Math.max(-1.35, Math.min(-0.25, st.rotX - dy * 0.004));
        st.lastX = e.clientX;
        st.lastY = e.clientY;
      }
    };
    const onUp = () => { st.dragging = false; };
    const onClick = () => {
      if (st.moved) return;
      if (hovered) propsRef.current.onSelect(hovered.userData.id);
    };
    const onWheel = (e) => {
      e.preventDefault();
      st.dist = Math.max(14, Math.min(40, st.dist + e.deltaY * 0.02));
    };

    const el = renderer.domElement;
    el.style.touchAction = "none";
    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    el.addEventListener("click", onClick);
    el.addEventListener("wheel", onWheel, { passive: false });

    let raf;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      board.rotation.y += (st.rotY - board.rotation.y) * 0.12;

      camera.position.set(
        0,
        Math.sin(-st.rotX) * st.dist,
        Math.cos(-st.rotX) * st.dist
      );
      camera.lookAt(0, 0, 0);

      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(pins.map((p) => p.userData.head));
      const next = hits.length ? hits[0].object.parent : null;
      if (next !== hovered) {
        hovered = next;
        propsRef.current.setHoveredId(hovered ? hovered.userData.id : null);
        el.style.cursor = hovered ? "pointer" : "grab";
      }

      const { selectedId: sel, hoveredId: hov } = propsRef.current;
      pins.forEach((p) => {
        const active = p.userData.id === sel;
        const hot = p.userData.id === hov;
        const targetY = 0.45 + (active ? 0.6 : hot ? 0.3 : 0);
        p.position.y += (targetY - p.position.y) * 0.15;
        const s = active ? 1.35 : hot ? 1.15 : 1;
        p.userData.head.scale.setScalar(
          p.userData.head.scale.x + (s - p.userData.head.scale.x) * 0.15
        );
        p.userData.head.material.color.set(active ? 0x0b6b34 : 0xffd24a);
        p.userData.head.material.emissive = new THREE.Color(hot || active ? 0x333311 : 0x000000);
      });

      renderer.render(scene, camera);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      el.removeEventListener("click", onClick);
      el.removeEventListener("wheel", onWheel);
      renderer.dispose();
      mount.removeChild(el);
    };
  }, [landmarks]);

  return (
    <div className="relative overflow-hidden rounded-[var(--radius)] border border-border bg-muted/30">
      <div ref={mountRef} className="h-[320px] w-full sm:h-[440px] md:h-[580px]" />
      <p className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-background/80 px-3 py-1 text-[11px] text-muted-foreground">
        Drag to rotate · scroll to zoom · click a pin
      </p>
    </div>
  );
}