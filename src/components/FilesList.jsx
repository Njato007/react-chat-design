import React from 'react'
import {LiaTimesCircleSolid} from 'react-icons/lia'
import {AiOutlineFile} from 'react-icons/ai'
import {BsPlusLg} from 'react-icons/bs'
import PropTypes from 'prop-types'
const FilesList = ({ files, changeFiles, onAddFile }) => {


    const handleRemoveFile = (i) => {
        changeFiles(files.filter((_, index) => index !== i));
    }

    const fileSize = (totalBytes) => {
        if(totalBytes < 1000000){
            return Math.floor(totalBytes/1000) + 'KB';
        } else {
            return Math.floor(totalBytes/1000000) + 'MB';  
        }
    }

    const isImage = (file) => {
        // List of MIME types for image files
        const imageMimeTypes = [
          'image/jpeg',
          'image/png',
          'image/gif',
          'image/bmp',
          // Add more image MIME types here if needed
        ];
      
        return imageMimeTypes.includes(file.type);
    }

    const fileURL = (file) => URL.createObjectURL(file);
    
    return (
        <div className='bg-transparent px-2 flex gap-1 items-center'>
            {
                files.map((file, index) => (
                    <div key={index}
                        className='bg-slate-100 rounded-lg border border-slate-100 relative p-2 flex flex-col w-24 h-28'
                        style={isImage(file) ? {
                            backgroundImage: `url(${fileURL(file)})`,
                            backgroundSize: 'cover',
                            backgroundRepeat: 'no-repeat'
                        } : {}}
                    >
                        <button type='button'
                            className='p-2 h-fit w-fit absolute right-1 top-1 text-slate-500 hover:text-slate-800'
                            onClick={() => handleRemoveFile(index)}
                        >
                            <LiaTimesCircleSolid className='w-5 h-5' />
                        </button>
                        {
                            !isImage(file) &&
                            <div className='mt-auto'>
                                <div className='mb-1 text-slate-700'>
                                    <AiOutlineFile className='w-5 h-5' />
                                </div>
                                <p className='text-late text-xs line-clamp-1 font-semibold'>{file.name}</p>
                                <p className='text-late text-xs'>{fileSize(file.size)}</p>
                            </div>
                        }
                    </div>
                ))
            }
            {
                files.length > 0 &&
                <button
                    onClick={onAddFile}
                    className='p-2 ml-3 text-slate-500 hover:text-slate-700 rounded-full w-fit h-fit bg-slate-100 hover:bg-slate-200'>
                    <BsPlusLg className='w-6 h-6'/>
                </button>
            }
        </div>
    )
}

FilesList.propTypes = {
    files: PropTypes.array
};

export default FilesList