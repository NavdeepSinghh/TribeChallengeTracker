export default function CommunityEventInterestFooter({ communityEventInterestMessage }) {
  return (
    <>
      {communityEventInterestMessage && (
        <p style={{ margin: '9px 0 0', color: '#FB7185', fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }}>
          {communityEventInterestMessage}
        </p>
      )}
      <p style={{ margin: '10px 0 0', color: '#888', fontSize: 10, lineHeight: 1.45 }}>
        Saves first-party event demand only. It does not sell tickets, create orders, promise merch, book venues, create partner links, write entitlements, export private member data, add tracking pixels, or scrape DMs.
      </p>
    </>
  );
}
