<script lang="ts">
  import { browser } from '$app/environment';
  import { Button } from '$lib/components/ui/button';
  import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
  import { Badge } from '$lib/components/ui/badge';
  import type { PageData } from './$types';
  
  interface Props {
    data: PageData;
    isOnline: boolean;
  }
  
  let { data, isOnline }: Props = $props();
  
  interface Receipt {
    id: string;
    orderId: string;
    amount: number;
    tip: number;
    total: number;
    imageUrl?: string;
    ocrText?: string;
    createdAt: string;
    status: 'pending' | 'verified' | 'rejected';
  }
  
  interface DailyEarnings {
    date: string;
    total: number;
    orders: number;
    tips: number;
    receipts: Receipt[];
  }
  
  let receipts = $state<Receipt[]>([]);
  let dailyEarnings = $state<DailyEarnings[]>(data.dailyEarnings || []);
  let selectedDate = $state<string>(data.dailyEarnings?.[0]?.date || '');
  let cameraStream = $state<MediaStream | null>(null);
  let capturedImage = $state<string | null>(null);
  let isCapturing = $state(false);
  let showCamera = $state(false);
  
  $effect(() => {
    if (browser) {
      // Initialize camera access
      if ('mediaDevices' in navigator) {
        navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
          .then((stream) => {
            cameraStream = stream;
          })
          .catch((error) => {
            console.error('Camera access denied:', error);
          });
      }
    }
  });
  
  function startCamera() {
    if (cameraStream) {
      showCamera = true;
    }
  }
  
  function stopCamera() {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      cameraStream = null;
    }
    showCamera = false;
    capturedImage = null;
  }
  
  function captureReceipt() {
    if (cameraStream && browser) {
      isCapturing = true;
      
      // Create video element to capture frame
      const video = document.createElement('video');
      video.srcObject = cameraStream;
      video.play();
      
      video.onloadedmetadata = () => {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(video, 0, 0);
          capturedImage = canvas.toDataURL('image/jpeg');
          
          // Process OCR
          processOCR(capturedImage);
        }
        
        isCapturing = false;
        stopCamera();
      };
    }
  }
  
  async function processOCR(imageData: string) {
    try {
      // In a real app, this would send the image to an OCR service
      // For now, we'll simulate OCR processing
      const mockOCRText = 'Total: $29.99\nTip: $5.00\nGrand Total: $34.99';
      
      // Create new receipt
      const newReceipt: Receipt = {
        id: `receipt-${Date.now()}`,
        orderId: `order-${Date.now()}`,
        amount: 29.99,
        tip: 5.00,
        total: 34.99,
        imageUrl: imageData,
        ocrText: mockOCRText,
        createdAt: new Date().toISOString(),
        status: 'pending'
      };
      
      receipts = [newReceipt, ...receipts];
      
      // Update daily earnings
      updateDailyEarnings(newReceipt);
      
    } catch (error) {
      console.error('OCR processing failed:', error);
    }
  }
  
  function updateDailyEarnings(receipt: Receipt) {
    const today = new Date().toISOString().split('T')[0];
    const existingDay = dailyEarnings.find(day => day.date === today);
    
    if (existingDay) {
      existingDay.total += receipt.total;
      existingDay.orders += 1;
      existingDay.tips += receipt.tip;
      existingDay.receipts = [receipt, ...existingDay.receipts];
    } else {
      dailyEarnings = [{
        date: today,
        total: receipt.total,
        orders: 1,
        tips: receipt.tip,
        receipts: [receipt]
      }, ...dailyEarnings];
    }
  }
  
  function verifyReceipt(receiptId: string) {
    receipts = receipts.map(receipt => {
      if (receipt.id === receiptId) {
        receipt.status = 'verified';
      }
      return receipt;
    });
  }
  
  function rejectReceipt(receiptId: string) {
    receipts = receipts.map(receipt => {
      if (receipt.id === receiptId) {
        receipt.status = 'rejected';
      }
      return receipt;
    });
  }
  
  function getStatusColor(status: Receipt['status']): string {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800';
      case 'verified': return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800';
      default: return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/30 dark:text-gray-300 dark:border-gray-800';
    }
  }
  
  function getStatusText(status: Receipt['status']): string {
    switch (status) {
      case 'pending': return 'Pending';
      case 'verified': return 'Verified';
      case 'rejected': return 'Rejected';
      default: return status;
    }
  }
  
  function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }
  
  function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
</script>

<svelte:head>
  <title>Driver App - Earnings</title>
  <meta name="description" content="Track your earnings and receipts" />
</svelte:head>

<div class="container mx-auto px-4 py-8 max-w-md">
  <!-- Header -->
  <div class="flex items-center justify-between mb-8">
    <div>
      <h1 class="text-2xl font-bold text-foreground transition-colors duration-300">Earnings</h1>
      <p class="text-muted-foreground transition-colors duration-300">Track your income</p>
    </div>
    <div class="flex items-center space-x-2">
      <div class="w-2 h-2 rounded-full {isOnline ? 'bg-green-500' : 'bg-red-500'} animate-pulse"></div>
      <Button 
        variant="secondary" 
        size="sm" 
        class="text-xs bg-blue-500 hover:bg-blue-600 dark:bg-purple-500 dark:hover:bg-purple-600"
        onclick={() => isOnline = !isOnline}
      >
        {isOnline ? 'Online' : 'Offline'}
      </Button>
      <Button
        onclick={startCamera}
        class="bg-primary hover:bg-primary/90 text-primary-foreground transition-colors duration-300"
      >
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/>
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/>
        </svg>
        Capture Receipt
      </Button>
    </div>
  </div>

  <!-- Camera Modal -->
  {#if showCamera}
    <div class="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div class="bg-background rounded-lg p-4 w-full max-w-sm">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-foreground transition-colors duration-300">Capture Receipt</h3>
          <Button
            onclick={stopCamera}
            variant="ghost"
            size="sm"
            class="text-muted-foreground hover:text-foreground transition-colors duration-300"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </Button>
        </div>
        
        {#if capturedImage}
          <div class="space-y-4">
            <img src={capturedImage} alt="Captured receipt" class="w-full rounded-lg border" />
            <div class="flex space-x-2">
              <Button
                onclick={() => capturedImage = null}
                variant="outline"
                class="flex-1"
              >
                Retake
              </Button>
              <Button
                onclick={() => processOCR(capturedImage)}
                class="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground transition-colors duration-300"
              >
                Process
              </Button>
            </div>
          </div>
        {:else}
          <div class="space-y-4">
            <div class="aspect-video bg-muted rounded-lg flex items-center justify-center">
              <div class="text-center">
                <svg class="w-12 h-12 text-muted-foreground mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                <p class="text-sm text-muted-foreground transition-colors duration-300">Position receipt in frame</p>
              </div>
            </div>
            <Button
              onclick={captureReceipt}
              disabled={isCapturing}
              class="w-full bg-primary hover:bg-primary/90 text-primary-foreground transition-colors duration-300"
            >
              {isCapturing ? 'Capturing...' : 'Capture'}
            </Button>
          </div>
        {/if}
      </div>
    </div>
  {/if}

  <!-- Today's Summary -->
  {#if dailyEarnings.length > 0}
    {@const today = dailyEarnings[0]}
    <Card class="border-0 shadow-lg dark:bg-slate-800/50 dark:shadow-purple-900/20 transition-all duration-300 backdrop-blur-sm mb-8">
      <CardHeader class="pb-4">
        <CardTitle class="text-foreground transition-colors duration-300">Today's Earnings</CardTitle>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="grid grid-cols-3 gap-4">
          <div class="text-center">
            <div class="text-2xl font-bold text-foreground transition-colors duration-300">{formatCurrency(today.total)}</div>
            <div class="text-sm text-muted-foreground transition-colors duration-300">Total</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-green-600 dark:text-cyan-400 transition-colors duration-300">{formatCurrency(today.tips)}</div>
            <div class="text-sm text-muted-foreground transition-colors duration-300">Tips</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-blue-600 dark:text-blue-400 transition-colors duration-300">{today.orders}</div>
            <div class="text-sm text-muted-foreground transition-colors duration-300">Orders</div>
          </div>
        </div>
      </CardContent>
    </Card>
  {/if}

  <!-- Total Earnings Summary -->
  <Card class="border-0 shadow-lg dark:bg-slate-800/50 dark:shadow-purple-900/20 transition-all duration-300 backdrop-blur-sm mb-8">
    <CardHeader class="pb-4">
      <CardTitle class="text-foreground transition-colors duration-300">Total Earnings</CardTitle>
    </CardHeader>
    <CardContent class="space-y-4">
      <div class="text-center">
        <div class="text-4xl font-bold text-green-600 dark:text-cyan-400 transition-colors duration-300">${data.totalEarnings}</div>
        <div class="text-sm text-muted-foreground transition-colors duration-300">All time earnings</div>
      </div>
      <div class="grid grid-cols-2 gap-4">
        <div class="text-center">
          <div class="text-xl font-bold text-foreground transition-colors duration-300">{data.orders.length}</div>
          <div class="text-sm text-muted-foreground transition-colors duration-300">Total Orders</div>
        </div>
        <div class="text-center">
          <div class="text-xl font-bold text-foreground transition-colors duration-300">{dailyEarnings.length}</div>
          <div class="text-sm text-muted-foreground transition-colors duration-300">Active Days</div>
        </div>
      </div>
    </CardContent>
  </Card>

  <!-- Recent Receipts -->
  <div class="space-y-6">
    <h2 class="text-xl font-semibold text-foreground transition-colors duration-300">Recent Receipts</h2>
    
    {#each receipts.slice(0, 5) as receipt}
      <Card class="border-0 shadow-lg hover:shadow-xl dark:bg-slate-800/50 dark:shadow-purple-900/20 dark:hover:shadow-purple-900/30 transition-all duration-300 backdrop-blur-sm">
        <CardContent class="p-6">
          <div class="flex items-center justify-between mb-4">
            <div>
              <div class="font-medium text-foreground transition-colors duration-300">Order #{receipt.orderId}</div>
              <div class="text-sm text-muted-foreground transition-colors duration-300">{formatDate(receipt.createdAt)}</div>
            </div>
            <div class="text-right">
              <div class="text-lg font-bold text-foreground transition-colors duration-300">{formatCurrency(receipt.total)}</div>
              <Badge class="border {getStatusColor(receipt.status)}">
                {getStatusText(receipt.status)}
              </Badge>
            </div>
          </div>
          
          <div class="grid grid-cols-2 gap-4 mb-4">
            <div>
              <div class="text-sm text-muted-foreground transition-colors duration-300">Subtotal</div>
              <div class="font-medium text-foreground transition-colors duration-300">{formatCurrency(receipt.amount)}</div>
            </div>
            <div>
              <div class="text-sm text-muted-foreground transition-colors duration-300">Tip</div>
              <div class="font-medium text-green-600 dark:text-cyan-400 transition-colors duration-300">{formatCurrency(receipt.tip)}</div>
            </div>
          </div>
          
          {#if receipt.ocrText}
            <div class="border-t pt-4 mb-4">
              <div class="text-sm text-muted-foreground transition-colors duration-300 mb-2">OCR Text</div>
              <div class="text-sm text-foreground transition-colors duration-300 bg-muted p-3 rounded-lg">
                {receipt.ocrText}
              </div>
            </div>
          {/if}
          
          {#if receipt.status === 'pending'}
            <div class="flex space-x-2">
              <Button
                onclick={() => verifyReceipt(receipt.id)}
                class="flex-1 bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 transition-colors duration-300"
              >
                Verify
              </Button>
              <Button
                onclick={() => rejectReceipt(receipt.id)}
                variant="outline"
                class="flex-1 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
              >
                Reject
              </Button>
            </div>
          {/if}
        </CardContent>
      </Card>
    {/each}
    
    {#if receipts.length === 0}
      <Card class="border-0 shadow-lg dark:bg-slate-800/50 dark:shadow-purple-900/20 transition-all duration-300 backdrop-blur-sm">
        <CardContent class="p-12 text-center">
          <div class="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
          </div>
          <p class="text-muted-foreground transition-colors duration-300">No receipts yet</p>
          <p class="text-sm text-muted-foreground transition-colors duration-300">Capture your first receipt to get started</p>
        </CardContent>
      </Card>
    {/if}
  </div>
</div> 