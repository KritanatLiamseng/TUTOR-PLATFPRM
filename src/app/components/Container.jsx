"use client";

const Container = ({ children }) => {
    return (
        <div className="w-full max-w-4xl mx-auto px-4 py-6 overflow-y-auto">
            {children}
        </div>
    );
};

export default Container;
