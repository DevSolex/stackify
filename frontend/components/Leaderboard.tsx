'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/Avatar';
import { Badge } from './ui/Badge';
import { Trophy, Medal, Target, Zap, TrendingUp, Search } from 'lucide-react';
import { Input } from './ui/Input';
import { Button } from './ui/Button';

interface LeaderboardEntry {
    rank: number;
    user: string;
    points: number;
    tasks: number;
    referrals: number;
    badge: string;
    isCurrentUser?: boolean;
}

const LEADERBOARD_DATA: LeaderboardEntry[] = [
    { rank: 1, user: "stacks_master.btc", points: 15420, tasks: 48, referrals: 15, badge: "Master" },
    { rank: 2, user: "crypto_vision.stx", points: 12850, tasks: 32, referrals: 24, badge: "Whale" },
    { rank: 3, user: "bit_builder", points: 11200, tasks: 56, referrals: 8, badge: "Architect" },
    { rank: 4, user: "SP2N...CD2D4", points: 9800, tasks: 24, referrals: 12, badge: "Pioneer", isCurrentUser: true },
    { rank: 5, user: "nodemancer", points: 8400, tasks: 12, referrals: 30, badge: "Enchanter" },
    { rank: 6, user: "satoshi_descendant", points: 7200, tasks: 18, referrals: 5, badge: "Guardian" },
];

export default function Leaderboard() {
    return (
        <div className="p-6 space-y-8 max-w-5xl mx-auto anime-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight text-white flex items-center gap-3">
                        <Trophy className="text-yellow-500 w-10 h-10" /> Global Hall of Fame
                    </h1>
                    <p className="text-muted-foreground mt-2 text-lg">Top contributors driving the BitTask ecosystem forward.</p>
                </div>
                <div className="relative w-full md:w-80">
                    <Input placeholder="Search users..." className="pl-10 h-12 bg-white/5 border-white/10" />
                    <Search className="absolute left-3 top-3.5 w-5 h-5 text-muted-foreground" />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {LEADERBOARD_DATA.slice(0, 3).map((entry, idx) => (
                    <Card key={entry.user} className={`relative overflow-hidden border-none ${idx === 0 ? 'bg-gradient-to-br from-yellow-600/20 to-yellow-950/40 shadow-xl shadow-yellow-500/10 scale-105 z-10' : 'bg-white/5'}`}>
                        <div className="absolute -top-4 -right-4 opacity-10">
                            {idx === 0 && <Trophy className="w-32 h-32 text-yellow-500" />}
                            {idx === 1 && <Medal className="w-32 h-32 text-slate-400" />}
                            {idx === 2 && <Medal className="w-32 h-32 text-amber-600" />}
                        </div>
                        <CardHeader className="text-center pb-2">
                            <div className="mx-auto relative mb-4">
                                <Avatar className="w-20 h-20 border-4 border-black/50 shadow-2xl">
                                    <AvatarImage src={`https://api.dicebear.com/7.x/identicon/svg?seed=${entry.user}`} />
                                    <AvatarFallback className="text-2xl font-bold bg-white/10">{entry.user[0].toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <div className={`absolute -bottom-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${idx === 0 ? 'bg-yellow-500 text-black' : idx === 1 ? 'bg-slate-300 text-black' : 'bg-amber-600'}`}>
                                    {entry.rank}
                                </div>
                            </div>
                            <CardTitle className="text-xl truncate px-4">{entry.user}</CardTitle>
                            <Badge variant="outline" className="mx-auto mt-2 border-white/20">{entry.badge}</Badge>
                        </CardHeader>
                        <CardContent className="text-center space-y-1">
                            <div className="text-2xl font-black text-white">{entry.points.toLocaleString()}</div>
                            <div className="text-xs uppercase tracking-widest text-muted-foreground">Impact Points</div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card className="bg-black/40 border-white/5 backdrop-blur-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-white/5 bg-white/5 text-left text-xs font-bold uppercase tracking-widest text-muted-foreground">
                                <th className="px-6 py-4">Rank</th>
                                <th className="px-6 py-4">Contributor</th>
                                <th className="px-6 py-4 text-center">Tasks</th>
                                <th className="px-6 py-4 text-center">Referrals</th>
                                <th className="px-6 py-4 text-right">Points</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {LEADERBOARD_DATA.map((entry) => (
                                <tr key={entry.user} className={`group hover:bg-white/5 transition-colors ${entry.isCurrentUser ? 'bg-indigo-500/10' : ''}`}>
                                    <td className="px-6 py-5 font-mono text-lg font-bold">
                                        {entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : entry.rank === 3 ? '🥉' : entry.rank}
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="w-9 h-9">
                                                <AvatarFallback className="bg-white/10 text-xs">{entry.user.slice(0, 2).toUpperCase()}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <div className="font-semibold text-white group-hover:text-indigo-400 transition-colors">
                                                    {entry.user} {entry.isCurrentUser && <span className="text-[10px] ml-2 bg-indigo-500 px-1.5 py-0.5 rounded uppercase">You</span>}
                                                </div>
                                                <div className="text-xs text-muted-foreground">{entry.badge} Level</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-center font-mono">
                                        <div className="flex items-center justify-center gap-1.5">
                                            <Target className="w-3.5 h-3.5 text-blue-400" /> {entry.tasks}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-center font-mono">
                                        <div className="flex items-center justify-center gap-1.5">
                                            <Zap className="w-3.5 h-3.5 text-amber-400" /> {entry.referrals}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <span className="bg-white/5 border border-white/10 px-3 py-1 rounded-md font-mono text-lg font-bold text-white shadow-inner">
                                            {entry.points.toLocaleString()}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            <div className="flex justify-center mt-4">
                <Button variant="ghost" className="text-indigo-400 hover:text-indigo-300 hover:bg-transparent flex items-center gap-2">
                    View Complete Standings <TrendingUp className="w-4 h-4" />
                </Button>
            </div>
        </div>
    );
}
