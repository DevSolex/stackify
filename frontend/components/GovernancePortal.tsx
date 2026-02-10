'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from './ui/Card';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { Progress } from './ui/progress';
import { Vote, Users, FileText, CheckCircle2, XCircle, Timer, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

interface Proposal {
    id: number;
    title: string;
    description: string;
    votesFor: number;
    votesAgainst: number;
    status: 'Active' | 'Passed' | 'Failed' | 'Pending';
    endTime: string;
}

const INITIAL_PROPOSALS: Proposal[] = [
    {
        id: 1,
        title: "Increase Staking APY to 15%",
        description: "Proposed increase in the base reward rate for long-term stakers to incentivize token lockups.",
        votesFor: 1250000,
        votesAgainst: 150000,
        status: 'Active',
        endTime: '2d 4h left',
    },
    {
        id: 2,
        title: "Introduce Task Verification Oracle",
        description: "Launch of a decentralized oracle system for verifying high-value task completions.",
        votesFor: 890000,
        votesAgainst: 45000,
        status: 'Passed',
        endTime: 'Closed',
    }
];

export default function GovernancePortal() {
    const [proposals] = useState<Proposal[]>(INITIAL_PROPOSALS);

    const handleVote = (proposalId: number, support: boolean) => {
        toast.success(`Vote ${support ? 'FOR' : 'AGAINST'} recorded! Transaction broadcast initiated.`);
    };

    return (
        <div className="p-6 space-y-8 max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-4xl font-black italic tracking-tighter bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent uppercase">
                        Governance Node
                    </h1>
                    <p className="text-muted-foreground flex items-center gap-2 mt-2">
                        <Users className="w-4 h-4" /> 12,456 Connected Voters
                    </p>
                </div>
                <div className="flex gap-4">
                    <Button className="bg-purple-600 hover:bg-purple-700 shadow-xl shadow-purple-600/20">
                        <FileText className="w-4 h-4 mr-2" /> New Proposal
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="bg-black/40 border-purple-500/20 shadow-lg shadow-purple-500/5 backdrop-blur-md">
                    <CardHeader>
                        <CardDescription>Total Proposals</CardDescription>
                        <CardTitle className="text-3xl font-mono">248</CardTitle>
                    </CardHeader>
                </Card>
                <Card className="bg-black/40 border-pink-500/20 shadow-lg shadow-pink-500/5 backdrop-blur-md">
                    <CardHeader>
                        <CardDescription>Active Votes</CardDescription>
                        <CardTitle className="text-3xl font-mono text-pink-500">3</CardTitle>
                    </CardHeader>
                </Card>
                <Card className="bg-black/40 border-blue-500/20 shadow-lg shadow-blue-500/5 backdrop-blur-md">
                    <CardHeader>
                        <CardDescription>DAO Treasury</CardDescription>
                        <CardTitle className="text-3xl font-mono">1.2M <span className="text-sm font-sans">BTK</span></CardTitle>
                    </CardHeader>
                </Card>
            </div>

            <div className="space-y-6">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                    <Vote className="w-6 h-6 text-purple-400" /> Open Proposals
                </h2>

                {proposals.map((proposal) => (
                    <Card key={proposal.id} className="group overflow-hidden border-white/5 bg-gradient-to-r from-white/5 to-transparent hover:border-purple-500/30 transition-all duration-300">
                        <CardHeader className="flex flex-row items-start justify-between">
                            <div className="space-y-1">
                                <div className="flex items-center gap-3">
                                    <CardTitle className="text-xl group-hover:text-purple-400 transition-colors">
                                        #{proposal.id} {proposal.title}
                                    </CardTitle>
                                    <Badge variant={proposal.status === 'Active' ? 'default' : 'secondary'}
                                        className={proposal.status === 'Active' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : ''}>
                                        {proposal.status}
                                    </Badge>
                                </div>
                                <CardDescription className="max-w-2xl text-base">{proposal.description}</CardDescription>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-yellow-500 bg-yellow-500/10 px-3 py-1 rounded-full border border-yellow-500/20">
                                <Timer className="w-4 h-4" /> {proposal.endTime}
                            </div>
                        </CardHeader>

                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm mb-1 font-medium">
                                    <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-emerald-400" /> For: {(proposal.votesFor / 1000000).toFixed(1)}M BTK</span>
                                    <span className="flex items-center gap-1"><XCircle className="w-3 h-3 text-rose-400" /> Against: {(proposal.votesAgainst / 1000).toFixed(1)}K BTK</span>
                                </div>
                                <Progress value={(proposal.votesFor / (proposal.votesFor + proposal.votesAgainst)) * 100}
                                    className="h-3 bg-white/5" />
                            </div>
                        </CardContent>

                        <CardFooter className="bg-white/5 border-t border-white/5 py-4 flex justify-between">
                            <div className="flex gap-3">
                                <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 h-9 px-6"
                                    onClick={() => handleVote(proposal.id, true)}>
                                    Vote For
                                </Button>
                                <Button variant="outline" size="sm" className="border-rose-500/30 text-rose-400 hover:bg-rose-500/10 h-9 px-6"
                                    onClick={() => handleVote(proposal.id, false)}>
                                    Vote Against
                                </Button>
                            </div>
                            <div className="flex gap-4">
                                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-white">
                                    <ExternalLink className="w-4 h-4 mr-2" /> View Details
                                </Button>
                            </div>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}
