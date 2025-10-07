// import format from 'biguint-format';
// import FlakeId from 'flake-idgen';
//
// // Define un epoch propio para IDs más cortos (01-01-2024)
// const EPOCH_2024 = 1704067200000;
// // Permite configurar el worker por instancia/proceso (0–1023)
// const WORKER = Number(process.env.SNOWFLAKE_WORKER_ID ?? 1);
//
// const flake = new FlakeId({ epoch: EPOCH_2024, worker: WORKER });
//
// export function newId(): string {
// 	// Retorna string decimal para evitar pérdida de precisión en JS
// 	return format(flake.next(), 'dec');
// }
//
// // En tu capa repository/servicio, antes de persistir:
// import { newId } from '../shared/id';
//
// // ...existing code...
// if (!entity.id) {
// 	entity.id = newId(); // Asegúrate que el tipo de columna sea BIGINT UNSIGNED o VARCHAR(20)
// }
// // ...existing code...
