'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { CheckCircle2, Circle, Clock, CreditCard } from 'lucide-react';

interface Milestone {
    id: number;
    description: string;
    amount: number;
    status: 'pending' | 'approved';
}

interface MilestoneTrackerProps {
    taskId: number;
    milestones: Milestone[];
    isCreator: boolean;
    onApprove: (milestoneId: number) => Promise<void>;
}

export function MilestoneTracker({ taskId, milestones, isCreator, onApprove }: MilestoneTrackerProps) {
    const [processingId, setProcessingId] = useState<number | null>(null);

    const handleApprove = async (id: number) => {
        setProcessingId(id);
        try {
            await onApprove(id);
        } catch (error) {
            console.error('Failed to approve milestone:', error);
        } finally {
            setProcessingId(null);
        }
    };

    const totalAmount = milestones.reduce((sum, m) => sum + m.amount, 0);
    const approvedAmount = milestones.filter(m => m.status === 'approved').reduce((sum, m) => sum + m.amount, 0);
    const progress = totalAmount > 0 ? (approvedAmount / totalAmount) * 100 : 0;

    return (
        <Card className="border-primary/10 overflow-hidden bg-background/50 backdrop-blur-sm">
            <CardHeader className="bg-primary/5 pb-4">
                <div className="flex justify-between items-center">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-primary" />
                        Project Milestones
                    </CardTitle>
                    <Badge variant="outline" className="font-mono text-[10px]">
                        {milestones.filter(m => m.status === 'approved').length} / {milestones.length} Done
                    </Badge>
                </div>
                <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Payment Progress</span>
                        <span>{Math.round(progress)}%</span>
                    </div>
                    <div className="w-full bg-primary/10 rounded-full h-1.5 overflow-hidden">
                        <div
                            className="bg-primary h-full transition-all duration-1000 ease-in-out"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <div className="divide-y divide-primary/5">
                    {milestones.map((m, index) => (
                        <div key={m.id} className="p-4 flex items-start gap-4 hover:bg-primary/[0.02] transition-colors">
                            <div className="mt-1">
                                {m.status === 'approved' ? (
                                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                                ) : (
                                    <Circle className="w-5 h-5 text-muted-foreground/30" />
                                )}
                            </div>
                            <div className="flex-1 space-y-1">
                                <div className="flex justify-between items-start">
                                    <p className={`text-sm font-medium ${m.status === 'approved' ? 'text-muted-foreground line-through' : ''}`}>
                                        {m.description}
                                    </p>
                                    <div className="flex items-center gap-1 text-xs font-mono text-primary bg-primary/5 px-2 py-0.5 rounded">
                                        <CreditCard className="w-3 h-3" />
                                        {m.amount / 1000000} STX
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    {m.status === 'approved' ? (
                                        <span className="text-[10px] text-green-500 flex items-center gap-1">
                                            <Clock className="w-3 h-3" /> Approved
                                        </span>
                                    ) : (
                                        <>
                                            <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                                                <Clock className="w-3 h-3" /> Pending
                                            </span>
                                            {isCreator && (
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    className="h-7 text-[10px] px-2 hover:bg-primary/10 hover:text-primary transition-all"
                                                    onClick={() => handleApprove(m.id)}
                                                    disabled={processingId === m.id}
                                                >
                                                    {processingId === m.id ? 'Processing...' : 'Approve & Pay'}
                                                </Button>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
