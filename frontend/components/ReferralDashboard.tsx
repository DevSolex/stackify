
import React, { useEffect, useState } from 'react';
import { useStacksWallet } from '@/lib/stacks-wallet';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { fetchReferralStats, fetchReferrer, ReferralStats } from '@/lib/contracts';
import { registerReferrer, claimRewards } from '@/lib/contractActions';
import { toast } from 'sonner';
import { Users, Award, Zap, Copy, ExternalLink, RefreshCw } from 'lucide-react';
import { UserSession } from '@stacks/auth';

export function ReferralDashboard() {
    const { userSession, isConnected, address } = useStacksWallet();
    const [stats, setStats] = useState<ReferralStats | null>(null);
    const [myReferrer, setMyReferrer] = useState<string | null>(null);
    const [referrerInput, setReferrerInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false);
    const [isClaiming, setIsClaiming] = useState(false);

    const loadData = async () => {
        if (!address) return;
        setIsLoading(true);
        try {
            const [statsData, referrerData] = await Promise.all([
                fetchReferralStats(address),
                fetchReferrer(address)
            ]);
            setStats(statsData);
            setMyReferrer(referrerData);
        } catch (error) {
            console.error('Failed to load referral data', error);
            toast.error('Failed to load referral data');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (isConnected && address) {
            loadData();
        }
    }, [isConnected, address]);

    const handleCopyLink = () => {
        if (!address) return;
        const link = `${window.location.origin}/?ref=${address}`;
        navigator.clipboard.writeText(link);
        toast.success('Referral link copied to clipboard!');
    };

    const handleRegisterReferrer = async () => {
        if (!userSession || !referrerInput) return;

        // Basic validation
        if (referrerInput === address) {
            toast.error("You cannot refer yourself.");
            return;
        }

        setIsRegistering(true);
        try {
            await registerReferrer(userSession as any, referrerInput, {
                onFinish: () => {
                    toast.success('Referral registration transaction submitted!');
                    setReferrerInput('');
                    // Optimistically update or wait for tx? usually wait.
                },
                onCancel: () => {
                    setIsRegistering(false);
                }
            });
        } catch (e) {
            console.error(e);
            toast.error('Failed to register referrer');
            setIsRegistering(false);
        }
    };

    const handleClaimRewards = async () => {
        if (!userSession) return;
        setIsClaiming(true);
        try {
            await claimRewards(userSession as any, {
                onTransactionId: (txId) => {
                    toast.success(`Claim submitted! TX: ${txId.slice(0, 6)}...`);
                },
                onFinish: () => {
                    // success handled by tx id toast mostly
                },
                onCancel: () => setIsClaiming(false)
            });
        } catch (e) {
            console.error(e);
            toast.error('Failed to claim rewards');
            setIsClaiming(false);
        }
    };

    if (!isConnected) {
        return (
            <div className="text-center p-12">
                <h2 className="text-2xl font-bold mb-4">Connect Wallet</h2>
                <p className="text-zinc-500 mb-6">Please connect your wallet to view your referral stats.</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 max-w-4xl mx-auto p-4">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">Referral Program</h1>
                    <p className="text-zinc-500 dark:text-zinc-400 mt-1">Invite friends and earn rewards.</p>
                </div>
                <Button variant="outline" size="sm" onClick={loadData} disabled={isLoading}>
                    <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                    Refresh Stats
                </Button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="p-6 bg-gradient-to-br from-violet-50 to-white dark:from-violet-950/20 dark:to-zinc-900 border-violet-100 dark:border-violet-900/50">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-violet-100 dark:bg-violet-900/30 rounded-xl">
                            <Users className="w-6 h-6 text-violet-600 dark:text-violet-400" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Total Referrals</p>
                            <h3 className="text-2xl font-bold text-zinc-900 dark:text-white">{stats?.totalReferrals || 0}</h3>
                        </div>
                    </div>
                </Card>

                <Card className="p-6 bg-gradient-to-br from-amber-50 to-white dark:from-amber-950/20 dark:to-zinc-900 border-amber-100 dark:border-amber-900/50">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-xl">
                            <Award className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Total Points</p>
                            <h3 className="text-2xl font-bold text-zinc-900 dark:text-white">{stats?.totalPoints || 0}</h3>
                        </div>
                    </div>
                </Card>

                <Card className="p-6 bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-950/20 dark:to-zinc-900 border-emerald-100 dark:border-emerald-900/50">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl">
                            <Zap className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Current Multiplier</p>
                            <h3 className="text-2xl font-bold text-zinc-900 dark:text-white">
                                {stats ? (stats.multiplier / 10000).toFixed(2) : '1.00'}x
                            </h3>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Referral Link & Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* Your Link */}
                <Card className="p-6 space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                        <ExternalLink className="w-5 h-5 text-zinc-400" />
                        Your Referral Link
                    </h3>
                    <p className="text-sm text-zinc-500">Share this link to earn points for every task your referrals complete.</p>

                    <div className="flex gap-2">
                        <Input
                            readOnly
                            value={address ? `${typeof window !== 'undefined' ? window.location.origin : ''}/?ref=${address}` : 'Connect wallet...'}
                            className="font-mono text-sm bg-zinc-50 dark:bg-zinc-900"
                        />
                        <Button onClick={handleCopyLink} variant="secondary">
                            <Copy className="w-4 h-4" />
                        </Button>
                    </div>
                </Card>

                {/* Register Referrer */}
                <Card className="p-6 space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                        <Users className="w-5 h-5 text-zinc-400" />
                        Your Referrer
                    </h3>

                    {myReferrer ? (
                        <div className="p-4 bg-green-50 dark:bg-green-900/10 rounded-lg border border-green-100 dark:border-green-900/30">
                            <p className="text-sm text-green-800 dark:text-green-300 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                Registered: <span className="font-mono">{myReferrer.slice(0, 6)}...{myReferrer.slice(-4)}</span>
                            </p>
                        </div>
                    ) : (
                        <>
                            <p className="text-sm text-zinc-500">Did someone invite you? specific their address to support them.</p>
                            <div className="flex gap-2">
                                <Input
                                    placeholder="Enter referrer address (SP...)"
                                    value={referrerInput}
                                    onChange={(e) => setReferrerInput(e.target.value)}
                                />
                                <Button onClick={handleRegisterReferrer} disabled={isRegistering || !referrerInput}>
                                    {isRegistering ? 'Registering...' : 'Set Referrer'}
                                </Button>
                            </div>
                        </>
                    )}
                </Card>
            </div>

            {/* Rewards Section */}
            <Card className="p-6">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="space-y-1">
                        <h3 className="text-lg font-semibold">Claim Rewards</h3>
                        <p className="text-sm text-zinc-500">Convert your accumulated points into STX rewards.</p>
                    </div>
                    <Button
                        size="lg"
                        className="bg-violet-600 hover:bg-violet-700 text-white"
                        onClick={handleClaimRewards}
                        disabled={isClaiming || !stats || stats.totalPoints === 0}
                    >
                        {isClaiming ? 'Claiming...' : `Claim ${stats?.totalPoints || 0} Points`}
                    </Button>
                </div>
            </Card>
        </div>
    );
}
