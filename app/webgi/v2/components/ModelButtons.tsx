import React from 'react';

import Helpers from '../../../helpers';

interface ModelButtonsProps {
  setCurrentModel: (color: string) => void;
}

const ModelButtons: React.FC<ModelButtonsProps> = ({ setCurrentModel }) => {
  return (
    <div className="flex gap-8 items-center">
      <h1 className="text-lg">Metal Colors</h1>

      <div className="flex gap-4">
        {models.map((model, i) => (
          <button
            key={i}
            className="py-2 px-4 border border-gray-800 cursor-pointer hover:bg-gray-100 duration-300"
            onClick={() => setCurrentModel(model.url)}
          >
            {model.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ModelButtons;

const models = [
  {
    name: 'Trillion Sapphire',
    url: Helpers.get3DUrl('/trillion-sapphire.glb'),
  },
  {
    name: 'Baguette Tiger',
    url: Helpers.get3DUrl('/baguette-tiger-ring.glb'),
  },
];
