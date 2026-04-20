import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";

export default function CakeModel({
  layers = [],
  frostingColor = "#ffb6c1",
  sideFrosting = false,
  toppings = []
}) {

  const groupRef = useRef();

  // 🎥 subtle rotation
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.002;
    }
  });

  const getColor = (flavor) => {
    if (flavor === "chocolate") return "#4b2e1f";
    if (flavor === "vanilla") return "#f3e5ab";
    if (flavor === "strawberry") return "#ffb6c1";
    return "#4b2e1f";
  };

  const layerHeight = 1.5;
  const frostingHeight = 0.5;
  const cakeHeight = layers.length * layerHeight;
  const baseRadius = 3;

  return (
    <group ref={groupRef}>

      {/* 🍽️ Cake board */}
      <mesh position={[0, -0.2, 0]} receiveShadow>
        <cylinderGeometry args={[3.6, 3.6, 0.3, 64]} />
        <meshStandardMaterial color="#e6e6e6" roughness={0.6} />
      </mesh>

      {/* 🎂 Cake layers */}
      {layers.map((layer, index) => {
        const y = index * layerHeight + layerHeight / 2;

        return (
          <group key={index}>

            {/* cake sponge */}
            <mesh position={[0, y, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[3, 2.95, layerHeight, 64, 8]} />
              <meshStandardMaterial
                color={getColor(layer.flavor)}
                roughness={0.85}
              />
            </mesh>

            {/* 🍰 cream filling between layers */}
            {index !== layers.length - 1 && (
              <mesh position={[0, y + layerHeight / 2, 0]}>
                <cylinderGeometry args={[3.05, 3.05, 0.2, 64]} />
                <meshStandardMaterial
                  color="#fff5e1"
                  roughness={0.5}
                />
              </mesh>
            )}

          </group>
        );
      })}

      {/* 🍓 Side frosting */}
      {sideFrosting && (
        <mesh position={[0, cakeHeight / 2, 0]} castShadow>
          <cylinderGeometry args={[3.15, 3.1, cakeHeight, 64, 1, true]} />
          <meshStandardMaterial
            color={frostingColor}
            roughness={0.4}
            transparent
            opacity={0.95}
            side={2}
          />
        </mesh>
      )}

      {/* 🍥 Top frosting */}
      <mesh
        position={[0, cakeHeight + frostingHeight / 2, 0]}
        castShadow
      >
        <cylinderGeometry args={[3.2, 3.1, frostingHeight, 64, 4]} />
        <meshStandardMaterial
          color={frostingColor}
          roughness={0.35}
          metalness={0.05}
        />
      </mesh>

      {/* 🍒 TOPPINGS */}
      {toppings.map((topping, index) => {

        let x = 0;
        let z = 0;

        if (toppings.length === 1) {
          x = 0;
          z = 0;
        } else {
          const angle = (index / toppings.length) * Math.PI * 2;
          x = 1.5 * Math.cos(angle);
          z = 1.5 * Math.sin(angle);
        }

        const y = cakeHeight + frostingHeight + 0.35;

        // 🍓 Strawberry
        if (topping.type === "strawberry") {
          return (
            <group key={topping.id} position={[x, y, z]}>
              <mesh>
                <sphereGeometry args={[0.28, 32, 32]} />
                <meshStandardMaterial color="#d62828" roughness={0.6} />
              </mesh>

              <mesh position={[0, 0.2, 0]}>
                <coneGeometry args={[0.15, 0.2, 8]} />
                <meshStandardMaterial color="#2a9d8f" />
              </mesh>
            </group>
          );
        }

        // 🍫 Chocolate chunk
        if (topping.type === "chocolate") {
          return (
            <mesh key={topping.id} position={[x, y, z]}>
              <boxGeometry args={[0.4, 0.2, 0.4]} />
              <meshStandardMaterial
                color="#3b1f16"
                roughness={0.3}
                metalness={0.2}
              />
            </mesh>
          );
        }

        // 🕯️ Candle
        if (topping.type === "candle") {
          return (
            <group key={topping.id} position={[x, y, z]}>

              <mesh position={[0, 0.3, 0]}>
                <cylinderGeometry args={[0.08, 0.08, 0.7, 16]} />
                <meshStandardMaterial color="white" />
              </mesh>

              <mesh position={[0, 0.75, 0]}>
                <sphereGeometry args={[0.08, 16, 16]} />
                <meshStandardMaterial color="orange" />
              </mesh>

              {/* 🔥 glow */}
              <pointLight
                position={[0, 0.9, 0]}
                intensity={1}
                color="orange"
              />
            </group>
          );
        }

        // 🍬 Candy
        if (topping.type === "candy") {
          return (
            <mesh key={topping.id} position={[x, y, z]}>
              <sphereGeometry args={[0.25, 32, 32]} />
              <meshStandardMaterial
                color="#ff66c4"
                roughness={0.4}
              />
            </mesh>
          );
        }

        return null;
      })}

    </group>
  );
}