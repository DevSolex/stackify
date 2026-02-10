import { STACKS_MAINNET } from '@stacks/network';
import { fetchCallReadOnlyFunction, cvToValue, uintCV } from '@stacks/transactions';

const network = STACKS_MAINNET;
const CONTRACT_ADDRESS = 'SP34HE2KF7SPKB8BD5GY39SG7M207FZPRXJS4NMY9';
const CONTRACT_NAME = 'bittask';

export interface Task {
    id: number;
    title: string;
    description: string;
    creator: string;
    worker: string | null;
    amount: number;
    deadline: number;
    status: string;
}

export async function fetchTaskCount(): Promise<number> {
    // Logic to fetch nonce (total tasks)
    // For now, if we don't have a direct count function exposed easily or want to rely on id sequence
    // We used 'task-nonce' in the contract which is the ID of the last created task.
    // So getting 'get-nonce' will give us the total count.
    try {
        const result = await fetchCallReadOnlyFunction({
            contractAddress: CONTRACT_ADDRESS,
            contractName: CONTRACT_NAME,
            functionName: 'get-nonce',
            functionArgs: [],
            senderAddress: CONTRACT_ADDRESS,
            network,
        });
        console.log(result);
        return Number(cvToValue(result));
    } catch (e) {
        console.error("Error fetching task count", e);
        return 0;
    }
}

export async function fetchTasks(): Promise<Task[]> {
    const count = await fetchTaskCount();
    if (count === 0) return [];

    // Limit to 200 for now to avoid overloading if many tasks
    const limit = 200;
    const idsToFetch = [];
    for (let i = 1; i <= Math.min(count, limit); i++) {
        idsToFetch.push(i);
    }

    try {
        const fetchPromises = idsToFetch.map(async (id) => {
            const result = await fetchCallReadOnlyFunction({
                contractAddress: CONTRACT_ADDRESS,
                contractName: CONTRACT_NAME,
                functionName: 'get-task',
                functionArgs: [uintCV(id)],
                senderAddress: CONTRACT_ADDRESS,
                network,
            });
            // cvToValue for optional tuple returns null (if none) or the object (if some)
            return { id, data: cvToValue(result) };
        });

        const results = await Promise.all(fetchPromises);

        const tasks: Task[] = results
            .filter(r => r.data && r.data.value) // Filter out nulls or invalid
            .map((r) => {
                const t = r.data.value;
                // Basic data extraction - Clarity values are nested
                // We assume t is the tuple value directly or wrapped
                const taskData = t.value || t;

                return {
                    id: Number(r.id), // Ensure ID is number
                    title: taskData.title?.value || taskData.title || "Untitled",
                    description: taskData.description?.value || taskData.description || "",
                    creator: taskData.creator?.value || taskData.creator || "",
                    worker: (taskData.worker?.value) ? taskData.worker.value : (taskData.worker || null),
                    amount: Number(taskData.amount?.value || taskData.amount || 0),
                    deadline: Number(taskData.deadline?.value || taskData.deadline || 0),
                    status: taskData.status?.value || taskData.status || "open"
                };
            });

        return tasks.reverse();
    } catch (e) {
        console.error("Error fetching tasks", e);
        return [];
    }
}

export async function fetchTask(id: number): Promise<Task | null> {
    try {
        const result = await fetchCallReadOnlyFunction({
            contractAddress: CONTRACT_ADDRESS,
            contractName: CONTRACT_NAME,
            functionName: 'get-task',
            functionArgs: [uintCV(id)],
            senderAddress: CONTRACT_ADDRESS,
            network,
        });

        const t = cvToValue(result);
        if (!t) return null;

        // Check if it's wrapped in 'value' (for response/optional types)
        const taskData = t.value || t;

        // Double check structure if it's a tuple inside response
        if (!taskData.title) return null;

        return {
            id: id,
            title: taskData.title.value || taskData.title,
            description: taskData.description.value || taskData.description,
            creator: taskData.creator.value || taskData.creator,
            worker: (taskData.worker && taskData.worker.value) ? taskData.worker.value : (taskData.worker || null),
            amount: Number(taskData.amount.value || taskData.amount),
            deadline: Number(taskData.deadline.value || taskData.deadline),
            status: taskData.status.value || taskData.status
        };
    } catch (e) {
        console.error(`Error fetching task ${id}`, e);
        return null;
    }
}
