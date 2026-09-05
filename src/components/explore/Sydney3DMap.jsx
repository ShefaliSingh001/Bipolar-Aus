import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { SYDNEY_MAP_URL } from "@/lib/landmarks";
import MapLabels from "@/components/explore/MapLabels";

const W = 100;
const H = 62;
const GREEN = 0x0a7a3f;
const AMBER = 0xffd85e;

export default function Sydney3DMap({ landmarks, selectedId, hoveredId, setHoveredId, onSelect }) {
  const mountRef = useRef(null);
  const labelRefs = useRef({});
  const stateRef = useRef({ selectedId, hoveredId, onSelect, setHoveredId });
  stateRef.current = { selectedId, hoveredId, onSelect, setHoveredId };

  useEffect(() => {
    const mount = mountRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);
    renderer.domElement.style.display = "block";
    renderer.domElement.style.touchAction = "none";

    scene.add(new THREE.AmbientLight(0xffffff, 0.9));
    const dir = new THREE.DirectionalLight(0xffffff, 0.9);
    dir.position.set(-40, 80, 40);
    scene.add(dir);

    const world = new THREE.Group();
    scene.add(world);

    // The illustrated map as the 3D ground, with a slab of thickness under it.
    const texture = new THREE.TextureLoader().load(SYDNEY_MAP_URL);
    texture.crossOrigin = "anonymous";
    texture.colorSpace = THREE.SRGBColorSpace;
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(W, H, 1, 1),
      new THREE.MeshBasicMaterial({ map: texture })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = 0.01;
    world.add(ground);

    const slab = new THREE.Mesh(
      new THREE.BoxGeometry(W, 4, H),
      new THREE.MeshLambertMaterial({ color: 0xe6e9df })
    );
    slab.position.y = -2;
    world.add(slab);

    // 3D pins
    const pins = [];
    landmarks.forEach((l) => {
      const group = new THREE.Group();
      group.position.set((l.x / 100 - 0.5) * W, 0, (l.y / 100 - 0.5) * H);

      const stem = new THREE.Mesh(
        new THREE.CylinderGeometry(0.35, 0.35, 7, 12),
        new THREE.MeshLambertMaterial({ color: 0xffffff })
      );
      stem.position.y = 3.5;
      group.add(stem);

      const head = new THREE.Mesh(
        new THREE.SphereGeometry(1.8, 24, 24),
        new THREE.MeshLambertMaterial({ color: AMBER })
      );
      head.position.y = 8;
      group.add(head);

      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(2.4, 0.28, 10, 32),
        new THREE.MeshLambertMaterial({ color: GREEN })
      );
      ring.rotation.x = -Math.PI / 2;
      ring.position.y = 0.2;
      group.add(ring);

      head.userData.id = l.id;
      stem.userData.id = l.id;
      world.add(group);
      pins.push({ id: l.id, group, head, ring, hit: [head, stem] });
    });

    // Camera orbit (drag to rotate / tilt)
    const orbit = { theta: 0, phi: 0.85, radius: 128 };
    const applyCamera = () => {
      camera.position.set(
        orbit.radius * Math.sin(orbit.phi) * Math.sin(orbit.theta),
        orbit.radius * Math.cos(orbit.phi),
        orbit.radius * Math.sin(orbit.phi) * Math.cos(orbit.theta)
      );
      camera.lookAt(0, 0, 0);
    };
    applyCamera();

    let dragging = false;
    let moved = false;
    let last = { x: 0, y: 0 };
    const pointer = new THREE.Vector2(-10, -10);
    const raycaster = new THREE.Raycaster();

    const onPointerDown = (e) => {
      dragging = true;
      moved = false;
      last = { x: e.clientX, y: e.clientY };
    };
    const onPointerMove = (e) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      if (!dragging) return;
      const dx = e.clientX - last.x;
      const dy = e.clientY - last.y;
      if (Math.abs(dx) + Math.abs(dy) > 3) moved = true;
      orbit.theta -= dx * 0.005;
      orbit.phi = Math.min(1.25, Math.max(0.35, orbit.phi - dy * 0.004));
      last = { x: e.clientX, y: e.clientY };
      applyCamera();
    };
    const onPointerUp = () => {
      if (dragging && !moved) {
        raycaster.setFromCamera(pointer, camera);
        const hits = raycaster.intersectObjects(pins.flatMap((p) => p.hit), false);
        if (hits.length) stateRef.current.onSelect(hits[0].object.userData.id);
      }
      dragging = false;
    };
    const onWheel = (e) => {
      e.preventDefault();
      orbit.radius = Math.min(210, Math.max(70, orbit.radius + e.deltaY * 0.12));
      applyCamera();
    };

    renderer.domElement.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    renderer.domElement.addEventListener("wheel", onWheel, { passive: false });

    const resize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(mount);

    let raf;
    const vec = new THREE.Vector3();
    const clock = new THREE.Clock();
    const render = () => {
      const t = clock.getElapsedTime();
      const { selectedId: sel, hoveredId: hov, setHoveredId: setHov } = stateRef.current;

      // hover picking
      if (!dragging) {
        raycaster.setFromCamera(pointer, camera);
        const hits = raycaster.intersectObjects(pins.flatMap((p) => p.hit), false);
        const id = hits.length ? hits[0].object.userData.id : null;
        if (id !== hov) setHov(id);
        renderer.domElement.style.cursor = id ? "pointer" : "grab";
      }

      pins.forEach((p) => {
        const active = p.id === sel;
        const hot = p.id === hov;
        const lift = active ? 2 + Math.sin(t * 2.4) * 0.8 : hot ? 1.2 : 0;
        p.group.position.y = lift;
        const scale = active ? 1.3 : hot ? 1.12 : 1;
        p.head.scale.setScalar(scale);
        p.head.material.color.setHex(active ? GREEN : AMBER);
        p.ring.material.opacity = active || hot ? 1 : 0.55;
        p.ring.material.transparent = true;
        p.ring.rotation.z = active ? t * 0.8 : 0;

        // project the pin head to screen space for the HTML label
        const el = labelRefs.current[p.id];
        if (el) {
          vec.set(p.group.position.x, p.group.position.y + 11, p.group.position.z).project(camera);
          const x = (vec.x * 0.5 + 0.5) * mount.clientWidth;
          const y = (-vec.y * 0.5 + 0.5) * mount.clientHeight;
          el.style.transform = `translate(-50%, -100%) translate(${x}px, ${y}px)`;
        }
      });

      renderer.render(scene, camera);
      raf = requestAnimationFrame(render);
    };
    render();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      renderer.domElement.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      renderer.domElement.removeEventListener("wheel", onWheel);
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, [landmarks]);

  return (
    <div className="relative overflow-hidden rounded-[var(--radius)] border border-border bg-muted/30">
      <div ref={mountRef} className="h-[340px] w-full sm:h-[460px] md:h-[600px]" />
      <MapLabels
        landmarks={landmarks}
        selectedId={selectedId}
        hoveredId={hoveredId}
        labelRefs={labelRefs}
        onSelect={onSelect}
      />
      <p className="pointer-events-none absolute bottom-3 left-4 text-[11px] text-muted-foreground">
        Drag to rotate · scroll to zoom · click a pin
      </p>
    </div>
  );
}