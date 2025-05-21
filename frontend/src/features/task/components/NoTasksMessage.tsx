import React from 'react';
import pageStyles from '../../../pages/TaskPage.module.css'; // Використовуємо ті ж стилі

interface NoTasksMessageProps {
    onClickToAdd?: () => void; // Опціональний обробник кліку
}

const NoTasksMessage: React.FC<NoTasksMessageProps> = ({ onClickToAdd }) => {
    return (
        <div className={pageStyles.noTasksMessageContainer} onClick={onClickToAdd} role={onClickToAdd ? "button" : undefined} tabIndex={onClickToAdd ? 0 : undefined}>
            <p className={pageStyles.noTasksMessageText}>
                No tasks yet. {onClickToAdd && "Click the logo or here to add one!"}
                {!onClickToAdd && "Add one above!"}
            </p>
        </div>
    );
};

export default NoTasksMessage;