'use client';

import React, { useState } from 'react';
import { useStacksWallet } from '../../lib/stacks-wallet';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Alert } from '../../components/ui/Alert';
import { ReferralManagement } from '../../components/ReferralManagement';

export default function SettingsPage() {
    const { isConnected, address } = useStacksWallet();
    const [displayName, setDisplayName] = useState('');
    const [email, setEmail] = useState('');
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const handleSaveSettings = async () => {
        setIsSaving(true);
        setSaveStatus(null);

        // Simulate API call
        setTimeout(() => {
            setIsSaving(false);
            setSaveStatus({ type: 'success', text: 'Settings saved successfully!' });
        }, 1000);
    };

    if (!isConnected) {
        return (
            <div className="container mx-auto p-8 text-center">
                <h1 className="text-3xl font-bold mb-4">Settings</h1>
                <Alert variant="destructive">
                    Please connect your Stacks wallet to access your settings.
                </Alert>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-8 space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">User Settings</h1>
                    <p className="text-muted-foreground mt-2">Manage your BitTask profile and preferences.</p>
                </div>
                <div className="px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-xs font-mono">
                    {address}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <Card className="border-primary/10">
                        <CardHeader>
                            <CardTitle>Profile Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Display Name</label>
                                <Input
                                    placeholder="Enter your name"
                                    value={displayName}
                                    onChange={(e) => setDisplayName(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Email Address</label>
                                <Input
                                    type="email"
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-between items-center border-t border-primary/5 pt-6">
                            <div className="text-sm text-muted-foreground">
                                These settings are stored locally for now.
                            </div>
                            <Button onClick={handleSaveSettings} disabled={isSaving}>
                                {isSaving ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </CardFooter>
                    </Card>

                    <Card className="border-primary/10">
                        <CardHeader>
                            <CardTitle>Preferences</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium">Enable Notifications</p>
                                    <p className="text-sm text-muted-foreground">Receive updates on your task status.</p>
                                </div>
                                <input
                                    type="checkbox"
                                    className="toggle toggle-primary"
                                    checked={notificationsEnabled}
                                    onChange={(e) => setNotificationsEnabled(e.target.checked)}
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium">Automatic Backups</p>
                                    <p className="text-sm text-muted-foreground">Sync your history to local storage.</p>
                                </div>
                                <input type="checkbox" className="toggle" defaultChecked />
                            </div>
                        </CardContent>
                    </Card>

                    {saveStatus && (
                        <Alert variant={saveStatus.type === 'success' ? 'success' : 'destructive'}>
                            {saveStatus.text}
                        </Alert>
                    )}
                </div>

                <div className="space-y-8">
                    <ReferralManagement />

                    <Card className="bg-blue-500/5 border-blue-500/20">
                        <CardHeader>
                            <CardTitle className="text-blue-500 text-lg">Help & Support</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">
                                Need help with your account or have questions about how rewards work?
                            </p>
                            <Button variant="outline" className="w-full mt-4 border-blue-500/20 text-blue-500 hover:bg-blue-500/10">
                                View Documentation
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
