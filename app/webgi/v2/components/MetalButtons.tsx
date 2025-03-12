import React from 'react';

interface MetalButtonsProps {
  setCurrentColor: (color: string) => void;
}

const MetalButtons: React.FC<MetalButtonsProps> = ({ setCurrentColor }) => {
  return (
    <div className="flex gap-8 items-center">
      <h1 className="text-lg">Metal Colors</h1>

      <div className="flex gap-4">
        {metals.map((metal, i) => (
          <button
            key={i}
            className="py-2 px-4 cursor-pointer hover:opacity-80 duration-300"
            style={{
              backgroundColor: metal.color,
            }}
            onClick={() => setCurrentColor(metal.color)}
          >
            {metal.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MetalButtons;

const metals = [
  {
    name: 'White Gold',
    color: '#c2c2c3', // Silvery with a slightly warm tint
  },
  {
    name: 'Yellow Gold',
    color: '#e5b377', // Rich, bright yellow
  },
  {
    name: 'Rose Gold',
    color: '#f2af83', // Soft pinkish hue
  },
  {
    name: 'Platinum',
    color: '#c2c2c3', // Cool, silvery-gray
  },
];
