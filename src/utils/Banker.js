/**
 * Banker's Algorithm — Deadlock Avoidance
 * 
 * Ported to ES6 Module for React
 */

export default class BankersAlgorithm {
    constructor(numProcesses, numResources) {
        this.n = numProcesses;
        this.m = numResources;
        this.allocation = [];
        this.max = [];
        this.available = [];
        this.need = [];
    }

    setData(allocation, max, available) {
        this.allocation = allocation.map(row => [...row]);
        this.max = max.map(row => [...row]);
        this.available = [...available];
        this.computeNeed();
    }

    computeNeed() {
        this.need = [];
        for (let i = 0; i < this.n; i++) {
            this.need[i] = [];
            for (let j = 0; j < this.m; j++) {
                this.need[i][j] = this.max[i][j] - this.allocation[i][j];
            }
        }
    }

    checkSafety() {
        const work = [...this.available];
        const finish = new Array(this.n).fill(false);
        const sequence = [];
        const steps = [];

        steps.push(`🔧 Initialize: Work = [${work.join(', ')}], Finish = [${finish.map(f => f ? 'T' : 'F').join(', ')}]`);

        let count = 0;
        while (count < this.n) {
            let found = false;

            for (let i = 0; i < this.n; i++) {
                if (finish[i]) continue;

                let canAllocate = true;
                for (let j = 0; j < this.m; j++) {
                    if (this.need[i][j] > work[j]) {
                        canAllocate = false;
                        break;
                    }
                }

                if (canAllocate) {
                    steps.push(`✅ P${i}: Need [${this.need[i].join(', ')}] ≤ Work [${work.join(', ')}] → Can execute`);
                    for (let j = 0; j < this.m; j++) {
                        work[j] += this.allocation[i][j];
                    }
                    finish[i] = true;
                    sequence.push(i);
                    count++;
                    found = true;
                    steps.push(`   → Release resources. Work = [${work.join(', ')}], Finish P${i} = T`);
                }
            }

            if (!found) {
                const stuck = [];
                for (let i = 0; i < this.n; i++) {
                    if (!finish[i]) stuck.push(`P${i}`);
                }
                steps.push(`❌ No process can proceed. Stuck: ${stuck.join(', ')}`);
                break;
            }
        }

        const safe = count === this.n;
        if (safe) {
            steps.push(`🎉 System is in a SAFE STATE. Safe sequence: < ${sequence.map(i => 'P' + i).join(' → ')} >`);
        } else {
            steps.push(`⚠️ System is in an UNSAFE STATE — potential deadlock!`);
        }

        return { safe, sequence, steps };
    }

    requestResources(pid, request) {
        const steps = [];
        steps.push(`📥 P${pid} requests: [${request.join(', ')}]`);

        for (let j = 0; j < this.m; j++) {
            if (request[j] > this.need[pid][j]) {
                steps.push(`❌ Error: Request[${j}] = ${request[j]} > Need[${j}] = ${this.need[pid][j]}. Process exceeded max claim!`);
                return { granted: false, steps, safetyResult: null };
            }
        }
        steps.push(`✅ Step 1: Request ≤ Need — OK`);

        for (let j = 0; j < this.m; j++) {
            if (request[j] > this.available[j]) {
                steps.push(`⏳ Step 2: Request[${j}] = ${request[j]} > Available[${j}] = ${this.available[j]}. P${pid} must wait.`);
                return { granted: false, steps, safetyResult: null };
            }
        }
        steps.push(`✅ Step 2: Request ≤ Available — OK`);

        steps.push(`🔄 Step 3: Pretend to allocate...`);

        const savedAvailable = [...this.available];
        const savedAllocation = this.allocation[pid].slice();
        const savedNeed = this.need[pid].slice();

        for (let j = 0; j < this.m; j++) {
            this.available[j] -= request[j];
            this.allocation[pid][j] += request[j];
            this.need[pid][j] -= request[j];
        }

        steps.push(`   Available = [${this.available.join(', ')}]`);
        steps.push(`   Allocation[P${pid}] = [${this.allocation[pid].join(', ')}]`);
        steps.push(`   Need[P${pid}] = [${this.need[pid].join(', ')}]`);

        const safetyResult = this.checkSafety();
        steps.push(`🔍 Running safety check...`);
        steps.push(...safetyResult.steps.map(s => '   ' + s));

        if (safetyResult.safe) {
            steps.push(`✅ Request GRANTED. System remains safe.`);
            return { granted: true, steps, safetyResult };
        } else {
            this.available = savedAvailable;
            this.allocation[pid] = savedAllocation;
            this.need[pid] = savedNeed;
            steps.push(`❌ Request DENIED. Would cause unsafe state. Rolled back.`);
            return { granted: false, steps, safetyResult };
        }
    }
}
