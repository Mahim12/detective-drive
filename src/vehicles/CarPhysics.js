import {
  MAX_FORWARD_SPEED,
  MAX_REVERSE_SPEED,
  ACCELERATION,
  BRAKING,
  FRICTION,
  TURN_RATE,
} from "../settings/gameSettings.js";

export default class CarPhysics {
  static update(car, input, dt) {
    const { throttle, steering } = input;

    // Acceleration and braking
    if (throttle > 0) {
      if (car.speed < 0) {
        car.speed = Math.min(0, car.speed + BRAKING * dt);
      } else {
        car.speed += ACCELERATION * throttle * dt;
      }
    } else if (throttle < 0) {
      if (car.speed > 0) {
        car.speed = Math.max(0, car.speed - BRAKING * dt);
      } else {
        car.speed += ACCELERATION * throttle * dt;
      }
    } else {
      // Friction
      if (car.speed > 0) {
        car.speed = Math.max(0, car.speed - FRICTION * dt);
      } else if (car.speed < 0) {
        car.speed = Math.min(0, car.speed + FRICTION * dt);
      }
    }

    // Speed limits
    car.speed = Math.max(
      -MAX_REVERSE_SPEED,
      Math.min(MAX_FORWARD_SPEED, car.speed),
    );

    // Steering
    const speedRatio = Math.abs(car.speed) / MAX_FORWARD_SPEED;

    car.heading +=
      steering * TURN_RATE * speedRatio * Math.sign(car.speed) * dt;

    // Normalize heading
    car.heading = Math.atan2(Math.sin(car.heading), Math.cos(car.heading));

    // Movement
    car.x += Math.cos(car.heading) * car.speed * dt;
    car.y += Math.sin(car.heading) * car.speed * dt;
  }
}
