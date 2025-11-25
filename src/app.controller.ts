import { Controller, Get } from '@nestjs/common';
import {
	HealthCheck,
	HealthCheckService,
	MemoryHealthIndicator,
	SequelizeHealthIndicator,
} from '@nestjs/terminus';

@Controller('health')
export class AppController {
	constructor(
		private readonly health: HealthCheckService,
		private readonly memory: MemoryHealthIndicator,
		private readonly db: SequelizeHealthIndicator,
	) {}

	@Get()
	@HealthCheck()
	check() {
		return this.health.check([
			() => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024),
			() => this.db.pingCheck('ecommerce'),
		]);
	}
}
