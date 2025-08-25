import React from 'react';

const PaymentForm = ({ formData, setFormData }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === 'cardNumber') {
      formattedValue = value.replace(/\D/g, '')
        .replace(/(\d{4})/g, '$1 ')
        .trim()
        .substr(0, 19);
    }
    else if (name === 'expiry') {
      formattedValue = value
        .replace(/\D/g, '')
        .replace(/^(\d{2})/, '$1/')
        .substr(0, 5);
    }
    else if (name === 'cvv') {
      formattedValue = value.replace(/\D/g, '').substr(0, 3);
    }

    setFormData(prev => ({
      ...prev,
      [name]: formattedValue
    }));
  };

  return (
    <div className="mt-6 space-y-4">
      <div>
        <label htmlFor="cardName" className="block text-sm font-medium text-gray-700">
          Nombre en la tarjeta
        </label>
        <input
          type="text"
          id="cardName"
          name="cardName"
          value={formData.cardName}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          required
        />
      </div>
      <div>
        <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700">
          Número de tarjeta
        </label>
        <input
          type="text"
          id="cardNumber"
          name="cardNumber"
          value={formData.cardNumber}
          onChange={handleChange}
          placeholder="1234 5678 9012 3456"
          maxLength="19"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="expiry" className="block text-sm font-medium text-gray-700">
            Fecha de vencimiento
          </label>
          <input
            type="text"
            id="expiry"
            name="expiry"
            value={formData.expiry}
            onChange={handleChange}
            placeholder="MM/AA"
            maxLength="5"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            required
          />
        </div>
        <div>
          <label htmlFor="cvv" className="block text-sm font-medium text-gray-700">
            CVV
          </label>
          <input
            type="text"
            id="cvv"
            name="cvv"
            value={formData.cvv}
            onChange={handleChange}
            placeholder="123"
            maxLength="3"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            required
          />
        </div>
      </div>
    </div>
  );
};

export default PaymentForm; 