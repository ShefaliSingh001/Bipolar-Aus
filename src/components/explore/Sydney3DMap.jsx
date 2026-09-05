import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { Compass } from "lucide-react";
import { SITES, buildFigure, FILL_BLOCKS } from "@/lib/sydneyScene";

const R = 12; // island radius

const TAG_BASE =
  "pointer-events-auto absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full px-3.5 py-1.5 text-[13px] font-semibold shadow-md transition-colors duration-200 ";

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
    const sun = new THREE.DirectionalLight(0xffffff, 1.2);
    sun.position.set(-14, 22, 12);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    Object.assign(sun.shadow.camera, { left: -24, right: 24, top: 24, bottom: -24 });
    sun.shadow.camera.updateProjectionMatrix();
    scene.add(sun);

    const board = new THREE.Group();
    scene.add(board);

    const mat = (color) =>
      new THREE.MeshStandardMaterial({ color, roughness: 0.85, flatShading: true });

    // island slab
    const island = new THREE.Mesh(new THREE.CylinderGeometry(R, R * 0.95, 2.4, 8), mat(0xf6ecc0));
    island.position.y = -1.2;
    island.receiveShadow = true;
    board.add(island);

    const grid = new THREE.GridHelper(R * 2, 24, 0xd9cd93, 0xe4dcae);
    grid.position.y = 0.02;
    grid.material.transparent = true;
    grid.material.opacity = 0.65;
    board.add(grid);

    // harbour water inlet across the north
    const water = new THREE.Mesh(new THREE.BoxGeometry(14, 0.12, 4.4), mat(0x8fcbd1));
    water.position.set(1.5, 0.05, -6.6);
    board.add(water);

    // filler city blocks
    FILL_BLOCKS.forEach(([x, z, w, h]) => {
      const b = new THREE.Mesh(new THREE.BoxGeometry(w, h, w), mat(0xefe3c6));
      b.position.set(x, h / 2, z);
      b.castShadow = true;
      b.receiveShadow = true;
      board.add(b);
    });

    // landmark figures + name tags
    const tags = landmarks
      .filter((l) => SITES[l.id])
      .map((l) => {
        const [x, z] = SITES[l.id];
        const { group, tagHeight } = buildFigure(l.id);
        group.position.set(x, 0, z);
        board.add(group);

        const anchor = new THREE.Object3D();
        anchor.position.set(x, tagHeight + 0.5, z);
        board.add(anchor);

        const el = document.createElement("button");
        el.type = "button";
        el.className = TAG_BASE + "bg-background/95 text-foreground";
        el.addEventListener("click", (e) => { e.stopPropagation(); propsRef.current.onSelect(l.id); });
        el.addEventListener("mouseenter", () => propsRef.current.setHoveredId(l.id));
        el.addEventListener("mouseleave", () => propsRef.current.setHoveredId(null));
        labelLayer.appendChild(el);
        return { l, anchor, el, group };
      });

    const st = { rotY: 0.3, rotX: -0.7, dist: 32, dragging: false, lastX: 0, lastY: 0 };

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
    const onWheel = (e) => { e.preventDefault(); st.dist = Math.max(20, Math.min(52, st.dist + e.deltaY * 0.02)); };

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
      tags.forEach(({ l, anchor, el: tag, group }) => {
        anchor.getWorldPosition(v).project(camera);
        tag.style.left = `${((v.x + 1) / 2) * w}px`;
        tag.style.top = `${((1 - v.y) / 2) * h}px`;
        const active = l.id === sel;
        const hot = l.id === hov;
        tag.style.zIndex = active ? 30 : hot ? 20 : Math.round((1 - v.z) * 100);
        tag.className =
          TAG_BASE +
          (active ? "bg-primary text-primary-foreground" : hot ? "bg-background text-primary" : "bg-background/95 text-foreground");
        const n = cts[l.id];
        tag.textContent = n ? `${l.name} · ${n}` : l.name;

        const targetY = active ? 0.45 : hot ? 0.2 : 0;
        group.position.y += (targetY - group.position.y) * 0.15;
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