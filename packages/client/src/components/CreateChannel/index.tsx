import { useGetSubcriber, useSubcribe } from '@/hook/usePush';
import { useUploadImage } from '@/hook/useUploadNFTStorage';
import { useWriteContract } from '@/hook/useWriteContract';
import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useAccount } from 'wagmi';
import Loading from '../Loading';
import Text from '../Text';

interface ModalProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const CreateChannel: React.FC<ModalProps> = ({ isOpen, onOpen, onClose }) => {
  const subcribers = useGetSubcriber()
  const [isLoading, setIsLoading] = useState(false)
  const [name, setName] = useState('');
  const [symbol, setSymbol] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const { triggerMasterTransactions } = useWriteContract()
  const { address } = useAccount();
  const { triggerOptin } = useSubcribe()

  const handleSubmit = async (e: React.FormEvent) => {
    setIsLoading(true)
    subcribers.data.subscribers.includes(String(address).toLocaleLowerCase()) || await triggerOptin() //Update later
    if(image) {
      e.preventDefault();
      const channelImage = await useUploadImage(image)
      await triggerMasterTransactions("createChannel", [name, symbol ,`https://${channelImage}.ipfs.nftstorage.link`])
      onClose();
    }
    setIsLoading(false)
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: 'image/*' as any,
    onDrop: (acceptedFiles) => {
      setImage(acceptedFiles[0]);
    },
  });

  return (
    <div>
      <Loading isVisible={isLoading} />
      <button
        className="ml-auto bg-black text-white font-bold py-2 px-4 rounded-xl"
        onClick={onOpen}
      >
        Create Channel
      </button>

      {isOpen && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 transition-opacity">
              <div className="absolute z-60 inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <div className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full">
              <div className='px-4 pt-4'>
                <Text content="Create Channels" size="text-xl" />
              </div>
              <form onSubmit={handleSubmit} className="p-4">
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                    Name
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="name"
                    type="text"
                    placeholder="Enter name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="symbol">
                    Symbol
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="symbol"
                    type="text"
                    placeholder="Enter symbol"
                    value={symbol}
                    onChange={(e) => setSymbol(e.target.value)}
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">Image</label>
                  <div className='flex'>
                    <div
                      {...getRootProps()}
                      className={`${
                        isDragActive ? 'border-blue-500' : 'border-gray-300'
                      } border-2 border-dashed rounded-lg p-4 h-40 w-2/3 mr-2 flex justify-center items-center cursor-pointer`}
                    >
                      <input {...getInputProps()} />
                      <p className="text-gray-500">Drag 'n' drop an image here, or click to select an image</p>
                    </div>
                    {
                      image &&
                      <div className='flex w-1/3 justify-center items-center'>
                        <img
                          src={URL.createObjectURL(image)}
                          alt="Preview"
                          className="mb-4 rounded-lg max-w-full "
                        />
                      </div>
                    }
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    type="submit"
                  >
                    Create
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-2"
                    onClick={onClose}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateChannel;
