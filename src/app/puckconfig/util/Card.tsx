import React from 'react'


type Props = {
    title: string;
    description: string;
    image: string;
    padding: number;
    
}
export const Card = {
      fields: {
       title: {
        type: "text",
        label: "Title",
        defaultValue: "Card Title",
        contentEditable: true,
       },
       description: {
        type: "textarea",
        label: "Description",
        defaultValue: "Card Description",
        contentEditable: true,
       },
       image: {
        type: "text",
        label: "Image",
        defaultValue: "https://images.unsplash.com/photo-1506744038136-49a8a3ef96ee?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
       },
       padding: {
        type: "number",
        label: "Padding",
        defaultValue: 16,
       },
      },
      defaultProps: {
        title: "Card Title",
        description: "Card Description",
        image: "https://images.unsplash.com/photo-1506744038136-49a8a3ef96ee?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
        padding: 16,
      },
      render: ({title, description, image, padding}: Props) => {
        return (
            <div style={{padding: `${padding}px`}}>
                    <h2>{title}</h2>
                <p>{description}</p>
                <img src={image} alt={title} />
            
            </div>
        )
      }
}

