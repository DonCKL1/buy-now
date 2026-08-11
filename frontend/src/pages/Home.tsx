import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import AOS from 'aos';
import 'aos/dist/aos.css';

import Hero from '../components/Hero';
import ProductShowcase from '../components/ProductShowcase';
import OrderModal from '../components/OrderModal';
import SuccessMessage from '../components/SuccessMessage';
import FailedMessage from '../components/FailedMessage';
import Footer from '../components/Footer';

import {
  getConfig,
  createOrder,
  initializePayment,
  verifyPayment,
  AppConfig,
} from '../services/api';

type PageState = 'order' | 'success' | 'failed';

interface OrderResult {
  order_reference: string;
  name: string;
  amount: number;
  size: string;
  quantity: number;
}

interface HomeProps {
  isModalOpen: boolean;
  onOpenModal: () => void;
  onCloseModal: () => void;
}

const Home: React.FC<HomeProps> = ({
  isModalOpen,
  onOpenModal,
  onCloseModal,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Config
  const [config, setConfig] = useState<AppConfig | null>(null);
  const [loading, setLoading] = useState(true);

  const [classicTshirtQty, setClassicTshirtQty] = useState(1);
  const [classicTshirtSizes, setClassicTshirtSizes] = useState<string[]>(['']);
  const [limitedTshirtQty, setLimitedTshirtQty] = useState(0);
  const [limitedTshirtSizes, setLimitedTshirtSizes] = useState<string[]>([]);
  const [mugQty, setMugQty] = useState(0);
  const [bagQty, setBagQty] = useState(0);
  const [name, setName] = useState('');
  const [indexNumber, setIndexNumber] = useState('');
  const [phone, setPhone] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const handleClassicTshirtQtyChange = (qty: number) => {
    setClassicTshirtQty(qty);
    setClassicTshirtSizes(prev => {
      const newSizes = [...prev];
      if (qty > prev.length) {
        for (let i = prev.length; i < qty; i++) newSizes.push('');
      } else if (qty < prev.length) {
        return newSizes.slice(0, qty);
      }
      return newSizes;
    });
  };

  const handleClassicTshirtSizeChange = (index: number, newSize: string) => {
    setClassicTshirtSizes(prev => {
      const newSizes = [...prev];
      newSizes[index] = newSize;
      return newSizes;
    });
  };

  const handleLimitedTshirtQtyChange = (qty: number) => {
    setLimitedTshirtQty(qty);
    setLimitedTshirtSizes(prev => {
      const newSizes = [...prev];
      if (qty > prev.length) {
        for (let i = prev.length; i < qty; i++) newSizes.push('');
      } else if (qty < prev.length) {
        return newSizes.slice(0, qty);
      }
      return newSizes;
    });
  };

  const handleLimitedTshirtSizeChange = (index: number, newSize: string) => {
    setLimitedTshirtSizes(prev => {
      const newSizes = [...prev];
      newSizes[index] = newSize;
      return newSizes;
    });
  };

  const handleProductOrderClick = (itemId?: string) => {
    // Reset all quantities to 0
    setClassicTshirtQty(0);
    setClassicTshirtSizes([]);
    setLimitedTshirtQty(0);
    setLimitedTshirtSizes([]);
    setMugQty(0);
    setBagQty(0);

    // Set the clicked item to 1
    if (itemId === 'classic_tshirt') {
      setClassicTshirtQty(1);
      setClassicTshirtSizes(['']);
    } else if (itemId === 'limited_tshirt') {
      setLimitedTshirtQty(1);
      setLimitedTshirtSizes(['']);
    } else if (itemId === 'mug') {
      setMugQty(1);
    } else if (itemId === 'bag') {
      setBagQty(1);
    } else {
      // Default fallback (e.g. from Hero section)
      setClassicTshirtQty(1);
      setClassicTshirtSizes(['']);
    }

    onOpenModal();
  };

  // Page state
  const [pageState, setPageState] = useState<PageState>('order');
  const [orderResult, setOrderResult] = useState<OrderResult | null>(null);

  // Init AOS
  useEffect(() => {
    AOS.init({
      duration: 700,
      once: true,
      easing: 'ease-out-cubic',
    });
  }, []);

  // Load config
  useEffect(() => {
    const loadConfig = async () => {
      try {
        const cfg = await getConfig();
        setConfig(cfg);
      } catch (err) {
        console.error('Failed to load config:', err);
        Swal.fire({
          icon: 'error',
          title: 'Connection Error',
          text: 'Unable to connect to the server. Please check backend connection.',
          confirmButtonColor: '#2563eb',
        });
      } finally {
        setLoading(false);
      }
    };
    loadConfig();
  }, []);

  // Handle payment verification
  const handleVerifyPayment = useCallback(
    async (reference: string) => {
      try {
        Swal.fire({
          title: 'Verifying Payment...',
          text: 'Please wait while we confirm your payment with Paystack.',
          allowOutsideClick: false,
          allowEscapeKey: false,
          didOpen: () => Swal.showLoading(),
        });

        const result = await verifyPayment(reference);
        Swal.close();

        if (result.status === 'success' && result.order) {
          setOrderResult({
            order_reference: result.order.order_reference,
            name: result.order.name || name || 'Student',
            amount: result.order.amount || 0,
            size: result.order.size || JSON.stringify({ classicTshirt: { qty: classicTshirtQty, sizes: classicTshirtSizes }, limitedTshirt: { qty: limitedTshirtQty, sizes: limitedTshirtSizes }, mug: { qty: mugQty }, bag: { qty: bagQty } }),
            quantity: result.order.quantity || (classicTshirtQty + limitedTshirtQty + mugQty + bagQty),
          });
          setPageState('success');
          onCloseModal();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          setPageState('failed');
          onCloseModal();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      } catch (err) {
        console.error('Payment verification failed:', err);
        Swal.close();
        setPageState('failed');
        onCloseModal();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      setSearchParams({});
    },
    [setSearchParams, name, classicTshirtQty, classicTshirtSizes, limitedTshirtQty, limitedTshirtSizes, mugQty, bagQty, onCloseModal]
  );

  useEffect(() => {
    const reference = searchParams.get('reference');
    if (reference) {
      handleVerifyPayment(reference);
    }
  }, [searchParams, handleVerifyPayment]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) newErrors.name = 'Please enter your full name';
    if (!indexNumber.trim()) newErrors.index_number = 'Please enter your index number';
    if (!phone.trim()) newErrors.phone = 'Please enter your phone number';
    else if (phone.trim().length < 9) newErrors.phone = 'Please enter a valid phone number';
    
    if (classicTshirtQty > 0 && classicTshirtSizes.some(s => !s)) {
      newErrors.size = 'Please select a size for all classic t-shirts';
    }
    
    if (limitedTshirtQty > 0 && limitedTshirtSizes.some(s => !s)) {
      newErrors.size = 'Please select a size for all limited edition t-shirts';
    }
    
    if (classicTshirtQty === 0 && limitedTshirtQty === 0 && mugQty === 0 && bagQty === 0) {
      newErrors.quantity = 'Please select at least one item';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate() || !config) return;

    setSubmitting(true);

    try {
      const sizePayload = JSON.stringify({
        classicTshirt: { qty: classicTshirtQty, sizes: classicTshirtSizes },
        limitedTshirt: { qty: limitedTshirtQty, sizes: limitedTshirtSizes },
        mug: { qty: mugQty },
        bag: { qty: bagQty }
      });
      const totalQty = classicTshirtQty + limitedTshirtQty + mugQty + bagQty;

      // Step 1: Create order on backend
      const orderResponse = await createOrder({
        name: name.trim(),
        index_number: indexNumber.trim(),
        phone: phone.trim(),
        size: sizePayload,
        quantity: totalQty,
      });

      // Step 2: Initialize payment on backend
      const paymentResponse = await initializePayment({
        order_reference: orderResponse.order.order_reference,
        name: name.trim(),
        index_number: indexNumber.trim(),
        phone: phone.trim(),
        size: sizePayload,
        quantity: totalQty,
      });

      // Step 3: Paystack Inline Popup
      if (window.PaystackPop) {
        const handler = window.PaystackPop.setup({
          key: config.paystackPublicKey,
          email: `${phone.trim()}@order.ckltech.com`,
          amount: Math.round(orderResponse.order.amount * 100),
          ref: paymentResponse.reference,
          currency: 'GHS',
          metadata: {
            custom_fields: [
              { display_name: 'Name', variable_name: 'name', value: name.trim() },
              { display_name: 'Index Number', variable_name: 'index_number', value: indexNumber.trim() },
              { display_name: 'Items', variable_name: 'items', value: sizePayload },
            ],
          },
          onClose: () => {
            setSubmitting(false);
          },
          callback: (response: { reference: string }) => {
            setSubmitting(false);
            handleVerifyPayment(response.reference);
          },
        });
        handler.openIframe();
      } else {
        // Fallback redirect if script not loaded
        window.location.href = paymentResponse.authorization_url;
      }
    } catch (err: any) {
      console.error('Order submission error:', err);
      const message = err?.response?.data?.error || 'Something went wrong. Please try again.';
      Swal.fire({
        icon: 'error',
        title: 'Order Failed',
        text: message,
        confirmButtonColor: '#dc2626',
      });
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setClassicTshirtQty(1);
    setClassicTshirtSizes(['']);
    setLimitedTshirtQty(0);
    setLimitedTshirtSizes([]);
    setMugQty(0);
    setBagQty(0);
    setName('');
    setIndexNumber('');
    setPhone('');
    setErrors({});
    setPageState('order');
    setOrderResult(null);
    onCloseModal();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="store-loader-wrapper">
        <div className="loader-ring"></div>
        <p>Loading Official Final-Year Collection...</p>
      </div>
    );
  }

  if (!config) {
    return (
      <div className="store-loader-wrapper">
        <p className="error-text">Unable to load store information. Please refresh the page.</p>
      </div>
    );
  }

  const price = config.tshirt.price;
  const feePct = config.paystackFeePercentage || 1.95;

  // Success state
  if (pageState === 'success' && orderResult) {
    return (
      <div className="marketing-page-wrapper">
        <div className="container-page">
          <SuccessMessage order={orderResult} onDone={resetForm} />
        </div>
        <Footer className={config.tshirt.className} classYear={config.tshirt.classYear} />
      </div>
    );
  }

  // Failed state
  if (pageState === 'failed') {
    return (
      <div className="marketing-page-wrapper">
        <div className="container-page">
          <FailedMessage onRetry={resetForm} />
        </div>
        <Footer className={config.tshirt.className} classYear={config.tshirt.classYear} />
      </div>
    );
  }

  // Main Clean Landing Page + Hero (class2.jpg bg) + T-Shirt Showcase + Popup Order Modal
  return (
    <div className="marketing-page-wrapper">
      {/* Hero Section */}
      <Hero
        tshirtName={config.tshirt.name}
        className={config.tshirt.className}
        classYear={config.tshirt.classYear}
        price={price}
        onOrderClick={() => handleProductOrderClick()}
      />

      {/* Dedicated T-Shirt Showcase Section */}
      <ProductShowcase
        tshirtName={config.tshirt.name}
        className={config.tshirt.className}
        classYear={config.tshirt.classYear}
        price={price}
        onOrderClick={handleProductOrderClick}
      />

      {/* Order Popup Modal */}
      <OrderModal
        isOpen={isModalOpen}
        onClose={onCloseModal}
        tshirtName={config.tshirt.name}
        className={config.tshirt.className}
        classYear={config.tshirt.classYear}
        price={price}
        feePercentage={feePct}
        classicTshirtQty={classicTshirtQty}
        classicTshirtSizes={classicTshirtSizes}
        limitedTshirtQty={limitedTshirtQty}
        limitedTshirtSizes={limitedTshirtSizes}
        mugQty={mugQty}
        bagQty={bagQty}
        name={name}
        indexNumber={indexNumber}
        phone={phone}
        errors={errors}
        submitting={submitting}
        onClassicTshirtSizeChange={handleClassicTshirtSizeChange}
        onClassicTshirtQtyChange={handleClassicTshirtQtyChange}
        onLimitedTshirtSizeChange={handleLimitedTshirtSizeChange}
        onLimitedTshirtQtyChange={handleLimitedTshirtQtyChange}
        onMugQtyChange={setMugQty}
        onBagQtyChange={setBagQty}
        onNameChange={setName}
        onIndexNumberChange={setIndexNumber}
        onPhoneChange={setPhone}
        onSubmit={handleSubmit}
      />

      {/* Footer (White background with credit) */}
      <Footer
        className={config.tshirt.className}
        classYear={config.tshirt.classYear}
      />
    </div>
  );
};

export default Home;
